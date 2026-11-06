// url=https://www.figma.com/design/3G44RO1AEAHhWV2A5qfdzd/Limia?node-id=3183-3639
// source=packages/limia-design-system/src/components/ui/sonner.tsx
// component=toast
import figma from 'figma'
const instance = figma.selectedInstance

const title = instance.getString('Title')
const description = instance.getString('Description')
const actionLabel = instance.getString('Action Label')
const showDescription = instance.getBoolean('Show Description')
const showAction = instance.getBoolean('Show Action')
const call = instance.getEnum('Type', {
  'Default': 'toast',
  'Success': 'toast.success',
  'Info': 'toast.info',
  'Warning': 'toast.warning',
  'Error': 'toast.error',
  'Loading': 'toast.loading',
})

let options = ''
if (showDescription && showAction) {
  options = figma.tsx`, {
  description: "${description}",
  action: { label: "${actionLabel}", onClick: () => {} },
}`
} else if (showDescription) {
  options = figma.tsx`, {
  description: "${description}",
}`
} else if (showAction) {
  options = figma.tsx`, {
  action: { label: "${actionLabel}", onClick: () => {} },
}`
}

export default {
  example: figma.tsx`${call}("${title}"${options})`,
  imports: ['import { toast } from "@limia/design-system"'],
  id: 'toast',
  metadata: { nestable: false },
}
