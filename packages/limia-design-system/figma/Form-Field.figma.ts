// url=https://www.figma.com/design/3G44RO1AEAHhWV2A5qfdzd/Limia?node-id=3184-341
// source=packages/limia-design-system/src/components/ui/form.tsx
// component=FormField
import figma from 'figma'
const instance = figma.selectedInstance

const description = instance.getString('Description')
const message = instance.getString('Message')
const showDescription = instance.getBoolean('Show Description')
const invalid = instance.getEnum('State', {
  'Default': false,
  'Invalid': true,
})

// FormLabel wraps the DS Label; reuse the text set on the nested Label instance
const labelText = instance.findText('Label', { traverseInstances: true, path: ['FormLabel'] })
const label = labelText && labelText.type !== 'ERROR' ? labelText.textContent : ''

const control = instance.findInstance('FormControl')
let controlCode
if (control && control.type === 'INSTANCE') {
  controlCode = control.executeTemplate().example
}

export default {
  example: figma.tsx`<FormField
  control={form.control}
  name="field"
  render={({ field }) => (
    <FormItem>
      <FormLabel>${label}</FormLabel>
      <FormControl>${controlCode ? controlCode : ''}</FormControl>
      ${showDescription ? figma.tsx`<FormDescription>${description}</FormDescription>` : ''}
      ${invalid ? figma.tsx`<FormMessage>${message}</FormMessage>` : figma.tsx`<FormMessage />`}
    </FormItem>
  )}
/>`,
  imports: ['import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@limia/design-system"'],
  id: 'form-field',
  metadata: { nestable: false },
}
