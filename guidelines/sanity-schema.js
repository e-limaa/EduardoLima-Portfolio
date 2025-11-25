export default {
    name: 'project',
    title: 'Project',
    type: 'document',
    fields: [
        {
            name: 'title',
            title: 'Title',
            type: 'string',
        },
        {
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'title',
                maxLength: 96,
            },
        },
        {
            name: 'category',
            title: 'Category',
            type: 'string',
        },
        {
            name: 'role',
            title: 'Role',
            type: 'string',
        },
        {
            name: 'year',
            title: 'Year',
            type: 'string',
        },
        {
            name: 'client',
            title: 'Client',
            type: 'string',
        },
        {
            name: 'description',
            title: 'Description',
            type: 'text',
        },
        {
            name: 'challenge',
            title: 'Challenge',
            type: 'text',
        },
        {
            name: 'solution',
            title: 'Solution',
            type: 'text',
        },
        {
            name: 'mainImage',
            title: 'Main image',
            type: 'image',
            options: {
                hotspot: true,
            },
        },
        {
            name: 'gallery',
            title: 'Gallery',
            type: 'array',
            of: [{ type: 'image' }],
        },
        {
            name: 'metric',
            title: 'Metric',
            type: 'string',
        },
        {
            name: 'color',
            title: 'Color Gradient Classes',
            type: 'string',
            description: 'e.g., "from-blue-600 to-blue-400"',
        },
        {
            name: 'stack',
            title: 'Tech Stack',
            type: 'array',
            of: [{ type: 'string' }],
        },
    ],
}
