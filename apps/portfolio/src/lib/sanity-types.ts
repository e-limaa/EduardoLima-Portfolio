export interface SanityImage {
  asset: {
    _ref: string
    _type: 'reference'
  }
  alt?: string
}

export interface SolutionBlock {
  _type: 'solution'
  text: string
}

export type ProjectCategoryKind = 'ui' | 'study'
export type ProjectSolutionPlacement = 'afterChallenge' | 'afterGallery'

export interface Project {
  _id: string
  title: string
  slug: { current: string }
  category: string
  categoryKind?: ProjectCategoryKind | string
  role: string
  year: string
  client: string
  description: string
  challenge: string
  solution: string
  solutionPlacement?: ProjectSolutionPlacement | string
  mainImage: string | SanityImage
  thumbnail?: string | SanityImage
  gallery: Array<string | SanityImage | SolutionBlock>
  metricLabel?: string
  metric: string
  color: string
  stack: string[]
  order?: number
}
