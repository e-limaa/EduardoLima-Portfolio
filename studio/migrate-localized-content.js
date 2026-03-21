const {createClient} = require('@sanity/client')

const sourceLocale = process.env.SANITY_SOURCE_LOCALE || 'ptBr'
const token = process.env.SANITY_TOKEN

if (!token) {
  console.error('SANITY_TOKEN is required to migrate localized content.')
  process.exit(1)
}

if (!['en', 'ptBr'].includes(sourceLocale)) {
  console.error(`Unsupported SANITY_SOURCE_LOCALE: ${sourceLocale}`)
  process.exit(1)
}

const client = createClient({
  projectId: 'mxq3x3cp',
  dataset: 'production',
  token,
  useCdn: false,
  apiVersion: '2023-05-03',
})

const inferCategoryKind = (title = '') => {
  const normalized = title.toLowerCase()
  if (
    normalized.includes('pesquisa') ||
    normalized.includes('estudo') ||
    normalized.includes('research') ||
    normalized.includes('study') ||
    normalized.includes('ux')
  ) {
    return 'study'
  }

  return 'ui'
}

const setIfMissing = (patch, fieldName, nextValue) => {
  if (nextValue === undefined || nextValue === null || nextValue === '') return
  patch.setIfMissing({[fieldName]: {}})
  patch.set({[`${fieldName}.${sourceLocale}`]: nextValue})
}

async function migrateProjects() {
  const projects = await client.fetch(`*[_type == "project"]{
    _id,
    title,
    titleI18n,
    metricLabel,
    metricLabelI18n,
    metric,
    metricI18n,
    role,
    roleI18n,
    client,
    clientI18n,
    description,
    descriptionI18n,
    challenge,
    challengeI18n,
    solution,
    solutionI18n,
    gallery
  }`)

  console.log(`Projects found: ${projects.length}`)

  for (const project of projects) {
    let patch = client.patch(project._id)
    let hasChanges = false

    const localizedFields = [
      ['titleI18n', project.titleI18n, project.title],
      ['metricLabelI18n', project.metricLabelI18n, project.metricLabel],
      ['metricI18n', project.metricI18n, project.metric],
      ['roleI18n', project.roleI18n, project.role],
      ['clientI18n', project.clientI18n, project.client],
      ['descriptionI18n', project.descriptionI18n, project.description],
      ['challengeI18n', project.challengeI18n, project.challenge],
      ['solutionI18n', project.solutionI18n, project.solution],
    ]

    for (const [fieldName, localizedValue, legacyValue] of localizedFields) {
      if (!localizedValue || !localizedValue[sourceLocale]) {
        setIfMissing(patch, fieldName, legacyValue)
        if (legacyValue) hasChanges = true
      }
    }

    const updatedGallery = Array.isArray(project.gallery)
      ? project.gallery.map((item) => {
          if (item?._type !== 'solution') return item
          if (item.textI18n?.[sourceLocale] || !item.text) return item

          hasChanges = true
          return {
            ...item,
            textI18n: {
              ...(item.textI18n || {}),
              [sourceLocale]: item.text,
            },
          }
        })
      : project.gallery

    if (updatedGallery !== project.gallery) {
      patch = patch.set({gallery: updatedGallery})
    }

    if (!hasChanges) {
      console.log(`Skipped project ${project._id}`)
      continue
    }

    await patch.commit()
    console.log(`Updated project ${project._id}`)
  }
}

async function migrateCategories() {
  const categories = await client.fetch(`*[_type == "category"]{_id, title, titleI18n, kind}`)

  console.log(`Categories found: ${categories.length}`)

  for (const category of categories) {
    let patch = client.patch(category._id)
    let hasChanges = false

    if (!category.titleI18n?.[sourceLocale] && category.title) {
      patch = patch.setIfMissing({titleI18n: {}}).set({[`titleI18n.${sourceLocale}`]: category.title})
      hasChanges = true
    }

    if (!category.kind) {
      patch = patch.set({kind: inferCategoryKind(category.titleI18n?.[sourceLocale] || category.title)})
      hasChanges = true
    }

    if (!hasChanges) {
      console.log(`Skipped category ${category._id}`)
      continue
    }

    await patch.commit()
    console.log(`Updated category ${category._id}`)
  }
}

async function main() {
  console.log(`Migrating legacy content into locale ${sourceLocale}...`)
  await migrateProjects()
  await migrateCategories()
  console.log('Migration completed.')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
