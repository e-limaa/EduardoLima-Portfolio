// url=https://www.figma.com/design/3G44RO1AEAHhWV2A5qfdzd/Limia?node-id=3182-305
// source=packages/limia-design-system/src/components/section.tsx
// component=Section
import figma from 'figma'
const instance = figma.selectedInstance

// The nested Interactive Grid is rendered internally by Section (grid prop), so it is not resolved here.
const title = instance.getString('Title')
const description = instance.getString('Description')
const grid = instance.getBoolean('Show Grid')
const noise = instance.getBoolean('Show Noise')
const variant = instance.getEnum('Variant', {
  'Subtle': 'subtle',
  'Default': 'default',
})
const container = instance.getEnum('Container', {
  'True': true,
  'False': false,
})

export default {
  example: figma.tsx`<Section${variant === 'subtle' ? '' : figma.tsx` variant="${variant}"`}${grid ? '' : ' grid={false}'}${noise ? '' : ' noise={false}'}${container ? '' : ' container={false}'}>
  <h2>${title}</h2>
  <p>${description}</p>
</Section>`,
  imports: ['import { Section } from "@limia/design-system"'],
  id: 'section',
  metadata: { nestable: false },
}
