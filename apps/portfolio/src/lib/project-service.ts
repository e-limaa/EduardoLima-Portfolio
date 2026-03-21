import useSWR from 'swr'
import {client, urlFor} from './sanity'
import {getSanityLocale, type AppLanguage} from './i18n'
import {Project} from './sanity-types'

const categoryTitleExpression =
  'coalesce(categoryRef->titleI18n[$locale], categoryRef->titleI18n.ptBr, categoryRef->titleI18n.en, categoryRef->title, "")'

const categoryKindExpression = `coalesce(
  categoryRef->kind,
  select(
    lower(${categoryTitleExpression}) match "*pesquisa*" => "study",
    lower(${categoryTitleExpression}) match "*estudo*" => "study",
    lower(${categoryTitleExpression}) match "*research*" => "study",
    lower(${categoryTitleExpression}) match "*study*" => "study",
    lower(${categoryTitleExpression}) match "*ux*" => "study",
    "ui"
  )
)`

const projectFields = `
  _id,
  slug,
  mainImage,
  thumbnail,
  gallery[]{
    ...,
    _type == "solution" => {
      ...,
      "text": coalesce(textI18n[$locale], textI18n.ptBr, textI18n.en, text, "")
    }
  },
  "stack": select(
    defined(technologyStack) && count(technologyStack) > 0 => technologyStack[]->{ "label": coalesce(labelI18n[$locale], labelI18n.ptBr, labelI18n.en, name, "") }.label,
    stack
  ),
  year,
  "metric": coalesce(metricI18n[$locale], metricI18n.ptBr, metricI18n.en, metric, ""),
  color,
  order,
  "solutionPlacement": coalesce(solutionPlacement, "afterChallenge"),
  "title": coalesce(titleI18n[$locale], titleI18n.ptBr, titleI18n.en, title, ""),
  "category": ${categoryTitleExpression},
  "categoryKind": ${categoryKindExpression},
  "metricLabel": coalesce(metricLabelI18n[$locale], metricLabelI18n.ptBr, metricLabelI18n.en, metricLabel),
  "role": coalesce(roleI18n[$locale], roleI18n.ptBr, roleI18n.en, role, ""),
  "client": coalesce(clientI18n[$locale], clientI18n.ptBr, clientI18n.en, client, ""),
  "description": coalesce(descriptionI18n[$locale], descriptionI18n.ptBr, descriptionI18n.en, description, ""),
  "challenge": coalesce(challengeI18n[$locale], challengeI18n.ptBr, challengeI18n.en, challenge, ""),
  "solution": coalesce(solutionI18n[$locale], solutionI18n.ptBr, solutionI18n.en, solution, "")
`

const projectsQuery = `*[_type == "project"] | order(order asc) {
  ${projectFields}
}`

const projectBySlugQuery = `*[_type == "project" && slug.current == $slug][0]{
  ${projectFields}
}`

const getAdjacentFromList = (
  list: Array<{_id: string; slug?: {current?: string}}>,
  currentId: string
): {prevId: string | null; nextId: string | null} => {
  if (!list.length) return {prevId: null, nextId: null}

  const currentIndex = list.findIndex(
    (project) => project._id === currentId || project.slug?.current === currentId
  )

  if (currentIndex === -1) return {prevId: null, nextId: null}

  const prevProject = currentIndex > 0 ? list[currentIndex - 1] : list[list.length - 1]
  const nextProject = currentIndex < list.length - 1 ? list[currentIndex + 1] : list[0]

  return {
    prevId: prevProject.slug?.current || prevProject._id,
    nextId: nextProject.slug?.current || nextProject._id,
  }
}

export const getProjects = async (language: AppLanguage): Promise<Project[]> => {
  const remoteProjects = await client.fetch<Project[]>(projectsQuery, {
    locale: getSanityLocale(language),
  })

  return Array.isArray(remoteProjects) ? remoteProjects : []
}

export const useProjects = (language: AppLanguage, enabled = true) => {
  const {data, error, isLoading} = useSWR(enabled ? ['projects', language] : null, () => getProjects(language), {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    errorRetryCount: 0,
  })

  return {
    projects: data || [],
    isLoading,
    isError: error,
  }
}

export const getProjectBySlug = async (
  slug: string,
  language: AppLanguage
): Promise<Project | undefined> => {
  const project = await client.fetch<Project | undefined>(projectBySlugQuery, {
    slug,
    locale: getSanityLocale(language),
  })

  return project
}

export const useProjectBySlug = (slug: string | undefined, language: AppLanguage) => {
  const {data, error, isLoading} = useSWR(
    slug ? ['project', slug, language] : null,
    () => (slug ? getProjectBySlug(slug, language) : null),
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      errorRetryCount: 0,
    }
  )

  return {
    project: data,
    isLoading,
    isError: error,
  }
}

export const getImageUrl = (image: any): string => {
  if (!image) return ''
  if (typeof image === 'string') return image
  return urlFor(image).url()
}

export const getAdjacentProjects = async (
  currentId: string
): Promise<{prevId: string | null; nextId: string | null}> => {
  const query = `*[_type == "project"] | order(order asc) { _id, slug }`
  const projects = await client.fetch<Array<{_id: string; slug?: {current?: string}}>>(query)
  return getAdjacentFromList(Array.isArray(projects) ? projects : [], currentId)
}

export const useAdjacentProjects = (currentId?: string) => {
  const {data, error, isLoading} = useSWR(
    currentId ? ['adjacent', currentId] : null,
    () => (currentId ? getAdjacentProjects(currentId) : null),
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      errorRetryCount: 0,
    }
  )

  return {
    navigation: data || {prevId: null, nextId: null},
    isLoading,
    isError: error,
  }
}
