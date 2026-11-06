// url=https://www.figma.com/design/3G44RO1AEAHhWV2A5qfdzd/Limia?node-id=3183-676
// source=packages/limia-design-system/src/components/ui/dropdown-menu.tsx
// component=DropdownMenuItem
import figma from 'figma'
const instance = figma.selectedInstance

const label = instance.getString('Label')
const shortcut = instance.getString('Shortcut Text')
const showShortcut = instance.getBoolean('Show Shortcut')
const hasIcon = instance.getBoolean('Icon Start')
const checked = instance.getBoolean('Checked')
const type = instance.getEnum('Type', {
  'Default': 'default',
  'Destructive': 'destructive',
  'Checkbox': 'checkbox',
  'Radio': 'radio',
  'Sub Trigger': 'sub-trigger',
})
const disabled = instance.getEnum('State', {
  'Default': false,
  'Hover': false,
  'Disabled': true,
})

const icon = hasIcon && (type === 'default' || type === 'destructive') ? instance.findInstance('Icon') : null
let iconCode
if (icon && icon.type === 'INSTANCE') {
  iconCode = icon.executeTemplate().example
}

const disabledAttr = disabled ? ' disabled' : ''
const shortcutCode = showShortcut && type !== 'sub-trigger'
  ? figma.tsx`<DropdownMenuShortcut>${shortcut}</DropdownMenuShortcut>`
  : ''

let example
let component
if (type === 'checkbox') {
  component = 'DropdownMenuCheckboxItem'
  example = figma.tsx`<DropdownMenuCheckboxItem${checked ? ' checked' : ''}${disabledAttr}>${label}${shortcutCode}</DropdownMenuCheckboxItem>`
} else if (type === 'radio') {
  component = 'DropdownMenuRadioItem'
  example = figma.tsx`<DropdownMenuRadioItem value="${label}"${disabledAttr}>${label}${shortcutCode}</DropdownMenuRadioItem>`
} else if (type === 'sub-trigger') {
  component = 'DropdownMenuSubTrigger'
  example = figma.tsx`<DropdownMenuSubTrigger${disabledAttr}>${label}</DropdownMenuSubTrigger>`
} else {
  component = 'DropdownMenuItem'
  example = figma.tsx`<DropdownMenuItem${type === 'destructive' ? ' variant="destructive"' : ''}${disabledAttr}>${iconCode ? figma.tsx`${iconCode} ` : ''}${label}${shortcutCode}</DropdownMenuItem>`
}

export default {
  example,
  imports: [`import { ${component}${shortcutCode ? ', DropdownMenuShortcut' : ''} } from "@limia/design-system"`],
  id: 'dropdown-menu-item',
  metadata: { nestable: true },
}
