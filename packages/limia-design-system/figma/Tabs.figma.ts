// url=https://www.figma.com/design/3G44RO1AEAHhWV2A5qfdzd/Limia?node-id=3181-2938
// source=packages/limia-design-system/src/components/ui/tabs.tsx
// component=Tabs
import figma from 'figma'
const instance = figma.selectedInstance

const content = instance.getString('Content')
const activeTab = instance.getEnum('Active Tab', {
  '1': 'Trigger 1',
  '2': 'Trigger 2',
  '3': 'Trigger 3',
})

let trigger1Code
let trigger2Code
let trigger3Code
let activeValue
const trigger1 = instance.findInstance('Trigger 1')
if (trigger1 && trigger1.type === 'INSTANCE') {
  const { example, metadata } = trigger1.executeTemplate()
  trigger1Code = example
  if (activeTab === 'Trigger 1' && metadata && metadata.props) activeValue = metadata.props.value
}
const trigger2 = instance.findInstance('Trigger 2')
if (trigger2 && trigger2.type === 'INSTANCE') {
  const { example, metadata } = trigger2.executeTemplate()
  trigger2Code = example
  if (activeTab === 'Trigger 2' && metadata && metadata.props) activeValue = metadata.props.value
}
const trigger3 = instance.findInstance('Trigger 3')
if (trigger3 && trigger3.type === 'INSTANCE') {
  const { example, metadata } = trigger3.executeTemplate()
  trigger3Code = example
  if (activeTab === 'Trigger 3' && metadata && metadata.props) activeValue = metadata.props.value
}

export default {
  example: figma.tsx`<Tabs defaultValue="${activeValue}">
  <TabsList>
    ${trigger1Code}
    ${trigger2Code}
    ${trigger3Code}
  </TabsList>
  <TabsContent value="${activeValue}">${content}</TabsContent>
</Tabs>`,
  imports: ['import { Tabs, TabsList, TabsContent } from "@limia/design-system"'],
  id: 'tabs',
  metadata: { nestable: false },
}
