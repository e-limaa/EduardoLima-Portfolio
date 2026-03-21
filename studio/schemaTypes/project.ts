import {defineField, defineType} from 'sanity'

const localizedStringDescription =
  'Fill English and Portuguese (Brazil). Portuguese is the editorial fallback when a translation is missing.'

const localizedTextDescription =
  'Fill English and Portuguese (Brazil). Portuguese is the editorial fallback when a translation is missing.'

const hasLocalizedValue = (value?: {en?: string; ptBr?: string}) =>
  Boolean(value?.ptBr?.trim() || value?.en?.trim())

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  groups: [
    {name: 'card', title: 'Card & URL', default: true},
    {name: 'details', title: 'Project Details'},
    {name: 'page', title: 'Project Page'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title (legacy fallback)',
      type: 'string',
      hidden: true,
      group: 'card',
    }),
    defineField({
      name: 'titleI18n',
      title: 'Project title',
      type: 'localizedString',
      description: 'This title appears on the project card and on the project page.',
      group: 'card',
      validation: (Rule) =>
        Rule.custom((value) =>
          hasLocalizedValue(value)
            ? true
            : 'Provide at least one localized title so the project page can be resolved.'
        ),
    }),
    defineField({
      name: 'slug',
      title: 'Project URL slug',
      type: 'slug',
      description: 'Used in the route `/project/<slug>`.',
      options: {
        source: (doc: {title?: string; titleI18n?: {en?: string; ptBr?: string}}) =>
          doc.titleI18n?.ptBr || doc.titleI18n?.en || doc.title || '',
        maxLength: 96,
      },
      group: 'card',
      validation: (Rule) => Rule.required().error('Slug is required to resolve the project page route.'),
    }),
    defineField({
      name: 'categoryRef',
      title: 'Category',
      type: 'reference',
      to: [{type: 'category'}],
      description: 'Controls how the project is grouped in the portfolio.',
      group: 'card',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'thumbnail',
      title: 'Card thumbnail',
      type: 'image',
      description: 'Image used on listing cards. If empty, the main image is used.',
      options: {
        hotspot: true,
      },
      group: 'card',
    }),
    defineField({
      name: 'mainImage',
      title: 'Hero image',
      type: 'image',
      description: 'Main image shown in the header of the project page.',
      options: {
        hotspot: true,
      },
      group: 'card',
      validation: (Rule) => Rule.required().assetRequired(),
    }),
    defineField({
      name: 'metricLabel',
      title: 'Metric Label (legacy fallback)',
      type: 'string',
      hidden: true,
      group: 'card',
    }),
    defineField({
      name: 'metricLabelI18n',
      title: 'Metric label',
      type: 'localizedString',
      description: 'Short label shown next to the project KPI.',
      group: 'card',
    }),
    defineField({
      name: 'metric',
      title: 'Metric value (legacy fallback)',
      type: 'string',
      hidden: true,
      group: 'card',
    }),
    defineField({
      name: 'metricI18n',
      title: 'Metric value',
      type: 'localizedString',
      description: 'Main KPI shown on cards and on the project page.',
      group: 'card',
      validation: (Rule) =>
        Rule.custom((value) =>
          hasLocalizedValue(value) ? true : 'Provide at least one localized metric value.'
        ),
    }),
    defineField({
      name: 'color',
      title: 'Accent gradient classes',
      type: 'string',
      description: 'Example: `from-blue-600 to-blue-400`.',
      group: 'card',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'List order',
      type: 'number',
      description: 'Lower numbers appear first.',
      group: 'card',
    }),
    defineField({
      name: 'role',
      title: 'Role (legacy fallback)',
      type: 'string',
      hidden: true,
      group: 'details',
    }),
    defineField({
      name: 'roleI18n',
      title: 'Role',
      type: 'localizedString',
      description: localizedStringDescription,
      group: 'details',
      validation: (Rule) =>
        Rule.custom((value) =>
          hasLocalizedValue(value) ? true : 'Provide at least one localized role.'
        ),
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'string',
      group: 'details',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'client',
      title: 'Client (legacy fallback)',
      type: 'string',
      hidden: true,
      group: 'details',
    }),
    defineField({
      name: 'clientI18n',
      title: 'Client',
      type: 'localizedString',
      description: localizedStringDescription,
      group: 'details',
      validation: (Rule) =>
        Rule.custom((value) =>
          hasLocalizedValue(value) ? true : 'Provide at least one localized client name.'
        ),
    }),
    defineField({
      name: 'stack',
      title: 'Tech stack (legacy fallback)',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Legacy fallback. Use "Technology stack" below for new content.',
      group: 'details',
      hidden: true,
    }),
    defineField({
      name: 'technologyStack',
      title: 'Technology stack',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'technology'}],
        },
      ],
      description: 'Preferred structured stack field. Reuse shared technology documents.',
      group: 'details',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const document = context.document as {stack?: string[]} | undefined
          const hasLegacyStack = Array.isArray(document?.stack) && document!.stack!.length > 0
          const hasStructuredStack = Array.isArray(value) && value.length > 0
          return hasStructuredStack || hasLegacyStack
            ? true
            : 'Provide at least one technology in the stack.'
        }),
    }),
    defineField({
      name: 'description',
      title: 'Description (legacy fallback)',
      type: 'text',
      hidden: true,
      group: 'page',
    }),
    defineField({
      name: 'descriptionI18n',
      title: 'Overview',
      type: 'localizedText',
      description: 'Introductory copy shown in the "Overview" section.',
      group: 'page',
      validation: (Rule) =>
        Rule.custom((value) =>
          hasLocalizedValue(value) ? true : 'Provide at least one localized description.'
        ),
    }),
    defineField({
      name: 'challenge',
      title: 'Challenge (legacy fallback)',
      type: 'text',
      hidden: true,
      group: 'page',
    }),
    defineField({
      name: 'challengeI18n',
      title: 'Challenge section',
      type: 'localizedText',
      description: 'Text shown in the dedicated challenge block.',
      group: 'page',
      validation: (Rule) =>
        Rule.custom((value) =>
          hasLocalizedValue(value) ? true : 'Provide at least one localized challenge.'
        ),
    }),
    defineField({
      name: 'solution',
      title: 'Solution (legacy fallback)',
      type: 'text',
      hidden: true,
      group: 'page',
    }),
    defineField({
      name: 'solutionI18n',
      title: 'Main solution section',
      type: 'localizedText',
      description:
        'This is the main solution text block. Use "Content flow blocks" below only for extra inline text/image sections.',
      group: 'page',
      validation: (Rule) =>
        Rule.custom((value) =>
          hasLocalizedValue(value) ? true : 'Provide at least one localized solution.'
        ),
    }),
    defineField({
      name: 'solutionPlacement',
      title: 'Main solution position',
      type: 'string',
      initialValue: 'afterChallenge',
      description: 'Choose where the main solution section should appear on the project page.',
      options: {
        layout: 'radio',
        list: [
          {title: 'Right after the challenge', value: 'afterChallenge'},
          {title: 'After the content flow blocks', value: 'afterGallery'},
        ],
      },
      hidden: ({document}) => !hasLocalizedValue(document?.solutionI18n) && !document?.solution,
      group: 'page',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const document = context.document as {solution?: string; solutionI18n?: {en?: string; ptBr?: string}} | undefined
          const hasSolution = hasLocalizedValue(document?.solutionI18n) || Boolean(document?.solution?.trim())
          return !hasSolution || value ? true : 'Choose where the main solution section should appear.'
        }),
    }),
    defineField({
      name: 'gallery',
      title: 'Content flow blocks',
      type: 'array',
      description:
        'Add images and optional inline text blocks in the exact order they should appear on the page.',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
        },
        {
          type: 'object',
          name: 'solution',
          title: 'Inline text block',
          fields: [
            {
              name: 'text',
              title: 'Content (legacy fallback)',
              type: 'text',
              rows: 5,
              hidden: true,
            },
            {
              name: 'textI18n',
              title: 'Inline content',
              type: 'localizedText',
              description:
                'Use this for supporting copy between images. This does not replace the main solution section above.',
              validation: (Rule) =>
                Rule.custom((value) =>
                  hasLocalizedValue(value)
                    ? true
                    : 'Provide at least one localized content value for each inline text block.'
                ),
            },
          ],
          preview: {
            select: {
              ptBr: 'textI18n.ptBr',
              en: 'textI18n.en',
            },
            prepare(selection) {
              const text = selection.ptBr || selection.en || 'Empty inline text block'
              return {
                title: 'Inline text block',
                subtitle: text.slice(0, 80),
              }
            },
          },
        },
      ],
      group: 'page',
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      titlePtBr: 'titleI18n.ptBr',
      titleEn: 'titleI18n.en',
      slug: 'slug.current',
      media: 'thumbnail',
      fallbackMedia: 'mainImage',
      categoryTitle: 'categoryRef.title',
      categoryTitlePtBr: 'categoryRef.titleI18n.ptBr',
      categoryTitleEn: 'categoryRef.titleI18n.en',
    },
    prepare(selection) {
      const title = selection.titlePtBr || selection.titleEn || 'Untitled project'
      const category =
        selection.categoryTitlePtBr || selection.categoryTitleEn || selection.categoryTitle || 'No category'
      const route = selection.slug ? `/project/${selection.slug}` : 'Missing slug'

      return {
        title,
        subtitle: `${category} • ${route}`,
        media: selection.media || selection.fallbackMedia,
      }
    },
  },
})
