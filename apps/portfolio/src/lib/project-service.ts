import useSWR from 'swr'
import {urlFor} from './sanity'
import type {AppLanguage} from './i18n'
import type {Project} from './sanity-types'

type ProjectNavigation = {prevId: string | null; nextId: string | null}

async function readProjectApi<T>(path: string): Promise<T> {
  const response = await fetch(path, {
    headers: {Accept: 'application/json'},
    credentials: 'omit',
  })

  if (!response.ok) {
    throw new Error(`Project API returned ${response.status}.`)
  }

  return response.json() as Promise<T>
}

export const getProjects = async (language: AppLanguage): Promise<Project[]> => {
  const params = new URLSearchParams({locale: language})
  const result = await readProjectApi<{projects: Project[]}>(`/api/projects?${params}`)
  return Array.isArray(result.projects) ? result.projects : []
}

export const useProjects = (language: AppLanguage, enabled = true) => {
  const {data, error, isLoading} = useSWR(
    enabled ? ['projects', language] : null,
    () => getProjects(language),
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      errorRetryCount: 0,
    },
  )

  return {
    projects: data || [],
    isLoading,
    isError: error,
  }
}

export const getProjectBySlug = async (
  slug: string,
  language: AppLanguage,
): Promise<Project | undefined> => {
  const params = new URLSearchParams({locale: language})
  const response = await fetch(`/api/projects/${encodeURIComponent(slug)}?${params}`, {
    headers: {Accept: 'application/json'},
    credentials: 'omit',
  })
  if (response.status === 404) return undefined
  if (!response.ok) throw new Error(`Project API returned ${response.status}.`)
  const result = await response.json() as {project?: Project}
  return result.project
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
    },
  )

  return {
    project: data,
    isLoading,
    isError: error,
  }
}

export const getImageUrl = (image: any, width?: number): string => {
  if (!image) return ''
  if (typeof image === 'string') return image
  const builder = urlFor(image)
  return (width ? builder.width(width) : builder).url()
}

// Sanity resizes on the CDN, so phones no longer download 1920 px originals.
const SRCSET_WIDTHS = [480, 768, 1080, 1440, 1920]
export const getImageSrcSet = (image: any): string | undefined => {
  if (!image || typeof image === 'string') return undefined
  return SRCSET_WIDTHS.map((width) => `${urlFor(image).width(width).url()} ${width}w`).join(', ')
}

export const getAdjacentProjects = async (currentId: string): Promise<ProjectNavigation> => {
  const params = new URLSearchParams({currentId})
  return readProjectApi<ProjectNavigation>(`/api/projects/navigation?${params}`)
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
    },
  )

  return {
    navigation: data || {prevId: null, nextId: null},
    isLoading,
    isError: error,
  }
}
