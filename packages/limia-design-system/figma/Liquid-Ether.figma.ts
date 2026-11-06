// url=https://www.figma.com/design/3G44RO1AEAHhWV2A5qfdzd/Limia?node-id=3185-23
// source=packages/limia-design-system/src/components/liquid-ether.tsx
// component=LiquidEther
import figma from 'figma'
const instance = figma.selectedInstance

// Default = built-in colors prop default; Brand = brand token palette used in the docs
const palette = instance.getEnum('Palette', {
  'Default': 'default',
  'Brand': 'brand',
})

export default {
  example: palette === 'brand'
    ? figma.tsx`<LiquidEther colors={["var(--color-brand-500)", "var(--color-cyan-400)", "var(--color-brand-200)"]} />`
    : figma.tsx`<LiquidEther />`,
  imports: ['import { LiquidEther } from "@limia/design-system"'],
  id: 'liquid-ether',
  metadata: { nestable: false },
}
