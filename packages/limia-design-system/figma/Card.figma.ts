// url=https://www.figma.com/design/3G44RO1AEAHhWV2A5qfdzd/Limia?node-id=3181-767
// source=packages/limia-design-system/src/components/card.tsx
// component=Card
import figma from 'figma'
const instance = figma.selectedInstance

const title = instance.getString('Title')
const description = instance.getString('Description')
const content = instance.getString('Content')
const showDescription = instance.getBoolean('Show Description')
const showContent = instance.getBoolean('Show Content')
const showFooter = instance.getBoolean('Show Footer')
const hasAction = instance.getEnum('Action', {
  'False': false,
  'True': true,
})

const cardAction = hasAction ? instance.findInstance('CardAction') : null
let cardActionCode
if (cardAction && cardAction.type === 'INSTANCE') {
  cardActionCode = cardAction.executeTemplate().example
}
const secondary = showFooter ? instance.findInstance('Secondary Action') : null
let secondaryCode
if (secondary && secondary.type === 'INSTANCE') {
  secondaryCode = secondary.executeTemplate().example
}
const primary = showFooter ? instance.findInstance('Primary Action') : null
let primaryCode
if (primary && primary.type === 'INSTANCE') {
  primaryCode = primary.executeTemplate().example
}

export default {
  example: figma.tsx`<Card>
  <CardHeader>
    <CardTitle>${title}</CardTitle>
    ${showDescription ? figma.tsx`<CardDescription>${description}</CardDescription>` : ''}
    ${cardActionCode ? figma.tsx`<CardAction>${cardActionCode}</CardAction>` : ''}
  </CardHeader>
  ${showContent ? figma.tsx`<CardContent>${content}</CardContent>` : ''}
  ${showFooter ? figma.tsx`<CardFooter>
    ${secondaryCode ? secondaryCode : ''}
    ${primaryCode ? primaryCode : ''}
  </CardFooter>` : ''}
</Card>`,
  imports: ['import { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter } from "@limia/design-system"'],
  id: 'card',
  metadata: { nestable: false },
}
