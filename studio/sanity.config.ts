import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'Portfólio',

  projectId: 'mxq3x3cp',
  dataset: 'production',

  plugins: [structureTool(), visionTool({ defaultApiVersion: '2023-05-03' })],

  schema: {
    types: schemaTypes,
  },
})
