import {defineField, defineType} from 'sanity'

const localizedStringDescription =
  'Fill English and Portuguese (Brazil). Portuguese is the editorial fallback when a translation is missing.'

const localizedTextDescription =
  'Fill English and Portuguese (Brazil). Portuguese is the editorial fallback when a translation is missing.'

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fieldsets: [
    {name: 'header', title: 'Header & Card Info', options: {collapsible: true, collapsed: false}},
    {name: 'details', title: 'Project Details', options: {collapsible: true, collapsed: false}},
    {name: 'content', title: 'Case Study Content', options: {collapsible: true, collapsed: true}},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title (legacy fallback)',
      type: 'string',
      hidden: true,
      fieldset: 'header',
    }),
    defineField({
      name: 'titleI18n',
      title: 'Localized Title',
      type: 'localizedString',
      description: localizedStringDescription,
      fieldset: 'header',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: (doc: {title?: string; titleI18n?: {en?: string; ptBr?: string}}) =>
          doc.titleI18n?.ptBr || doc.titleI18n?.en || doc.title || '',
        maxLength: 96,
      },
      fieldset: 'header',
    }),
    defineField({
      name: 'categoryRef',
      title: 'Category',
      type: 'reference',
      to: [{type: 'category'}],
      fieldset: 'header',
    }),
    defineField({
      name: 'thumbnail',
      title: 'Thumbnail',
      type: 'image',
      description: 'Image used for the project card in the list view. If not set, Main Image will be used.',
      options: {
        hotspot: true,
      },
      fieldset: 'header',
    }),
    defineField({
      name: 'mainImage',
      title: 'Main image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fieldset: 'header',
    }),
    defineField({
      name: 'metricLabel',
      title: 'Metric Label (legacy fallback)',
      type: 'string',
      hidden: true,
      fieldset: 'header',
    }),
    defineField({
      name: 'metricLabelI18n',
      title: 'Localized Metric Label',
      type: 'localizedString',
      description: localizedStringDescription,
      fieldset: 'header',
    }),
    defineField({
      name: 'metric',
      title: 'Metric Value',
      type: 'string',
      fieldset: 'header',
    }),
    defineField({
      name: 'color',
      title: 'Color Gradient Classes',
      type: 'string',
      description: 'e.g., "from-blue-600 to-blue-400"',
      fieldset: 'header',
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Used to sort projects. Lower numbers appear first.',
      fieldset: 'header',
    }),
    defineField({
      name: 'role',
      title: 'Role (legacy fallback)',
      type: 'string',
      hidden: true,
      fieldset: 'details',
    }),
    defineField({
      name: 'roleI18n',
      title: 'Localized Role',
      type: 'localizedString',
      description: localizedStringDescription,
      fieldset: 'details',
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'string',
      fieldset: 'details',
    }),
    defineField({
      name: 'client',
      title: 'Client (legacy fallback)',
      type: 'string',
      hidden: true,
      fieldset: 'details',
    }),
    defineField({
      name: 'clientI18n',
      title: 'Localized Client',
      type: 'localizedString',
      description: localizedStringDescription,
      fieldset: 'details',
    }),
    defineField({
      name: 'stack',
      title: 'Tech Stack',
      type: 'array',
      of: [{type: 'string'}],
      fieldset: 'details',
    }),
    defineField({
      name: 'description',
      title: 'Description (legacy fallback)',
      type: 'text',
      hidden: true,
      fieldset: 'content',
    }),
    defineField({
      name: 'descriptionI18n',
      title: 'Localized Description',
      type: 'localizedText',
      description: localizedTextDescription,
      fieldset: 'content',
    }),
    defineField({
      name: 'challenge',
      title: 'Challenge (legacy fallback)',
      type: 'text',
      hidden: true,
      fieldset: 'content',
    }),
    defineField({
      name: 'challengeI18n',
      title: 'Localized Challenge',
      type: 'localizedText',
      description: localizedTextDescription,
      fieldset: 'content',
    }),
    defineField({
      name: 'solution',
      title: 'Solution (legacy fallback)',
      type: 'text',
      hidden: true,
      fieldset: 'content',
    }),
    defineField({
      name: 'solutionI18n',
      title: 'Localized Solution',
      type: 'localizedText',
      description: localizedTextDescription,
      fieldset: 'content',
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      of: [
        {type: 'image'},
        {
          type: 'object',
          name: 'solution',
          title: 'Solution Block',
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
              title: 'Localized Content',
              type: 'localizedText',
              description: localizedTextDescription,
            },
          ],
        },
      ],
      fieldset: 'content',
    }),
  ],
})
