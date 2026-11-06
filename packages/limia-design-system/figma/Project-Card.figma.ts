// url=https://www.figma.com/design/3G44RO1AEAHhWV2A5qfdzd/Limia?node-id=3186-68
// source=packages/limia-design-system/src/components/project-card.tsx
// component=ProjectCard
import figma from 'figma'
const instance = figma.selectedInstance

// State (Default/Hover/Focus) is interaction-only; image and color have no Figma property (placeholder values, both required).
const title = instance.getString('Title')
const category = instance.getString('Category')
const metric = instance.getString('Metric')
const ctaLabel = instance.getString('CTA Label')
const showMetric = instance.getBoolean('Show Metric')

export default {
  example: figma.tsx`<ProjectCard
  title="${title}"
  category="${category}"
  image="/images/project.jpg"
  color="from-violet-500 to-purple-500"${showMetric ? figma.tsx`
  metric="${metric}"` : ''}${ctaLabel === 'View case' ? '' : figma.tsx`
  ctaLabel="${ctaLabel}"`}
/>`,
  imports: ['import { ProjectCard } from "@limia/design-system"'],
  id: 'project-card',
  metadata: { nestable: false },
}
