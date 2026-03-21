import {defineField, defineType} from 'sanity'

const hasLocalizedValue = (value?: {en?: string; ptBr?: string}) =>
  Boolean(value?.ptBr?.trim() || value?.en?.trim())

export default defineType({
  name: 'technology',
  title: 'Technology',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Canonical name',
      type: 'string',
      description: 'Internal canonical name. For most technologies this is also the public label.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'labelI18n',
      title: 'Localized label',
      type: 'localizedString',
      description:
        'Optional. Use only when the displayed label should differ by language. Otherwise the canonical name is used.',
      validation: (Rule) =>
        Rule.custom((value) =>
          !value || hasLocalizedValue(value) ? true : 'Provide at least one localized label or leave this field empty.'
        ),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'name',
      ptBr: 'labelI18n.ptBr',
      en: 'labelI18n.en',
    },
    prepare(selection) {
      return {
        title: selection.title || 'Untitled technology',
        subtitle: selection.ptBr || selection.en || 'Uses canonical name as display label',
      }
    },
  },
})
