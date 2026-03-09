import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title (legacy fallback)',
      type: 'string',
      hidden: true,
    }),
    defineField({
      name: 'titleI18n',
      title: 'Localized Title',
      type: 'localizedString',
      description: 'Fill English and Portuguese (Brazil). Portuguese is the editorial fallback when a translation is missing.',
    }),
    defineField({
      name: 'kind',
      title: 'Kind',
      type: 'string',
      initialValue: 'ui',
      options: {
        layout: 'radio',
        list: [
          {title: 'UI / Product Design', value: 'ui'},
          {title: 'UX Research / Study', value: 'study'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
})
