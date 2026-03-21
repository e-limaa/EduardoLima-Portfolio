const {createClient} = require('@sanity/client')

const token = process.env.SANITY_TOKEN

if (!token) {
  console.error('SANITY_TOKEN is required to migrate technology stack content.')
  process.exit(1)
}

const client = createClient({
  projectId: 'mxq3x3cp',
  dataset: 'production',
  token,
  useCdn: false,
  apiVersion: '2023-05-03',
})

const slugify = (value = '') =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96)

async function ensureTechnology(name) {
  const existing = await client.fetch(
    `*[_type == "technology" && (name == $name || slug.current == $slug)][0]{_id}`,
    {name, slug: slugify(name)}
  )

  if (existing?._id) return existing._id

  const slug = slugify(name)
  const created = await client.create({
    _type: 'technology',
    name,
    slug: {
      _type: 'slug',
      current: slug,
    },
  })

  console.log(`Created technology ${name} (${created._id})`)
  return created._id
}

async function main() {
  const projects = await client.fetch(`*[_type == "project"]{
    _id,
    stack,
    technologyStack
  }`)

  for (const project of projects) {
    if (!Array.isArray(project.stack) || project.stack.length === 0) {
      console.log(`Skipped ${project._id}: no legacy stack`)
      continue
    }

    if (Array.isArray(project.technologyStack) && project.technologyStack.length > 0) {
      console.log(`Skipped ${project._id}: technologyStack already populated`)
      continue
    }

    const refs = []
    for (const entry of project.stack) {
      if (!entry || typeof entry !== 'string') continue
      const technologyId = await ensureTechnology(entry)
      refs.push({
        _type: 'reference',
        _ref: technologyId,
        _key: `${technologyId}-${refs.length}`,
      })
    }

    if (!refs.length) {
      console.log(`Skipped ${project._id}: no valid stack entries`)
      continue
    }

    await client.patch(project._id).set({technologyStack: refs}).commit()
    console.log(`Updated ${project._id}`)
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
