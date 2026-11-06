// url=https://www.figma.com/design/3G44RO1AEAHhWV2A5qfdzd/Limia?node-id=3183-729
// source=packages/limia-design-system/src/components/ui/dropdown-menu.tsx
// component=DropdownMenu
import figma from 'figma'
const instance = figma.selectedInstance

const open = instance.getEnum('Open', {
  'False': false,
  'True': true,
})

const trigger = instance.findInstance('Trigger')
let triggerCode
if (trigger && trigger.type === 'INSTANCE') {
  triggerCode = trigger.executeTemplate().example
}

// Menu children (label, items, separators) in layer order, each resolved by its own template
const menuIds = ['dropdown-menu-label', 'dropdown-menu-item', 'dropdown-menu-separator']
const children = open
  ? instance.findConnectedInstances((node) => menuIds.includes(node.codeConnectId()))
  : []
let childrenCode = figma.tsx``
for (const child of children) {
  childrenCode = figma.tsx`${childrenCode}
    ${child.executeTemplate().example}`
}

export default {
  example: figma.tsx`<DropdownMenu${open ? ' open' : ''}>
  <DropdownMenuTrigger asChild>${triggerCode ? triggerCode : ''}</DropdownMenuTrigger>
  ${open ? figma.tsx`<DropdownMenuContent>${childrenCode}
  </DropdownMenuContent>` : ''}
</DropdownMenu>`,
  imports: ['import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from "@limia/design-system"'],
  id: 'dropdown-menu',
  metadata: { nestable: false },
}
