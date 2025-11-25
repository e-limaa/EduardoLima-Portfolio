import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'project',
    title: 'Project',
    type: 'document',
    fieldsets: [
        { name: 'header', title: 'Header & Card Info', options: { collapsible: true, collapsed: false } },
        { name: 'details', title: 'Project Details', options: { collapsible: true, collapsed: false } },
        { name: 'content', title: 'Case Study Content', options: { collapsible: true, collapsed: true } },
        { name: 'system', title: 'System / Legacy', options: { collapsible: true, collapsed: true } },
    ],
    fields: [
        // Header
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            fieldset: 'header',
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'title',
                maxLength: 96,
            },
            fieldset: 'header',
        }),
        defineField({
            name: 'categoryRef',
            title: 'Category',
            type: 'reference',
            to: [{ type: 'category' }],
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
            name: 'metric',
            title: 'Metric',
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

        // Details
        defineField({
            name: 'role',
            title: 'Role',
            type: 'string',
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
            title: 'Client',
            type: 'string',
            fieldset: 'details',
        }),
        defineField({
            name: 'stack',
            title: 'Tech Stack',
            type: 'array',
            of: [{ type: 'string' }],
            fieldset: 'details',
        }),

        // Content
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
            fieldset: 'content',
        }),
        defineField({
            name: 'challenge',
            title: 'Challenge',
            type: 'text',
            fieldset: 'content',
        }),
        defineField({
            name: 'solution',
            title: 'Solution',
            type: 'text',
            fieldset: 'content',
        }),
        defineField({
            name: 'gallery',
            title: 'Gallery',
            type: 'array',
            of: [{ type: 'image' }],
            fieldset: 'content',
        }),

        // System
        defineField({
            name: 'id',
            title: 'Legacy ID',
            type: 'number',
            fieldset: 'system',
        }),
    ],
})
