import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'localizedText',
  title: 'Localized Text',
  type: 'object',
  fields: [
    defineField({
      name: 'en',
      title: 'English',
      type: 'text',
      rows: 5,
    }),
    defineField({
      name: 'ptBr',
      title: 'Portuguese (Brazil)',
      type: 'text',
      rows: 5,
    }),
  ],
})
