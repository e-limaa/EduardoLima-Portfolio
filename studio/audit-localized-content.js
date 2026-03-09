const {createClient} = require('@sanity/client')

const checkLocale = process.env.SANITY_CHECK_LOCALE || 'en'

if (!['en', 'ptBr'].includes(checkLocale)) {
  console.error(`Unsupported SANITY_CHECK_LOCALE: ${checkLocale}`)
  process.exit(1)
}

const client = createClient({
  projectId: 'mxq3x3cp',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
})

const projectFields = [
  'titleI18n',
  'metricLabelI18n',
  'roleI18n',
  'clientI18n',
  'descriptionI18n',
  'challengeI18n',
  'solutionI18n',
]

async function main() {
  const projects = await client.fetch(`*[_type == "project"]{
    _id,
    title,
    titleI18n,
    metricLabelI18n,
    roleI18n,
    clientI18n,
    descriptionI18n,
    challengeI18n,
    solutionI18n,
    gallery[]{_key, _type, text, textI18n},
    categoryRef->{_id, title, titleI18n, kind}
  }`)

  const missingProjectTranslations = projects
    .map((project) => {
      const missingFields = projectFields.filter((fieldName) => !project[fieldName]?.[checkLocale])
      const missingGalleryKeys = (project.gallery || [])
        .filter((item) => item?._type === 'solution' && !item?.textI18n?.[checkLocale])
        .map((item) => item._key)

      return {
        id: project._id,
        title: project.title,
        missingFields,
        missingGalleryKeys,
        categoryId: project.categoryRef?._id || null,
      }
    })
    .filter((project) => project.missingFields.length || project.missingGalleryKeys.length)

  const categoryMap = new Map()
  for (const project of projects) {
    const category = project.categoryRef
    if (!category?._id) continue
    if (categoryMap.has(category._id)) continue

    categoryMap.set(category._id, {
      id: category._id,
      title: category.title,
      missingTitle: !category.titleI18n?.[checkLocale],
      missingKind: !category.kind,
    })
  }

  const missingCategories = [...categoryMap.values()].filter(
    (category) => category.missingTitle || category.missingKind
  )

  console.log(
    JSON.stringify(
      {
        locale: checkLocale,
        missingProjectTranslations,
        missingCategories,
      },
      null,
      2
    )
  )
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
