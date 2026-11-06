// url=https://www.figma.com/design/3G44RO1AEAHhWV2A5qfdzd/Limia?node-id=3181-3388
// source=packages/limia-design-system/src/components/theme-switch.tsx
// component=ThemeSwitch
import figma from 'figma'
const instance = figma.selectedInstance

// Os ícones (Icon/Sun, Icon/Moon) são renderizados internamente pelo ThemeSwitch (lucide Sun/Moon) a partir de checked
const checked = instance.getEnum('Checked', {
  'False': false,
  'True': true,
})
const state = instance.getEnum('State', {
  'Default': 'default',
  'Hover': 'hover',
  'Focus': 'focus',
  'Disabled': 'disabled',
})
const disabled = state === 'disabled'

export default {
  example: figma.tsx`<ThemeSwitch${checked ? ' checked' : ''}${disabled ? ' disabled' : ''} />`,
  imports: ['import { ThemeSwitch } from "@limia/design-system"'],
  id: 'theme-switch',
  metadata: { nestable: true },
}
