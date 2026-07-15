import type { VivKeyDefinition, VivTriggerSetup } from './types'

/**
 * Runtime plugin surface. Two extension points:
 *
 * - defineKey(token, def)     — register a new animation key without
 *   touching SCSS: injects a rule that fills the shared keyframe slots.
 * - defineTrigger(name, setup) — register a custom trigger usable as
 *   data-viv-on="name"; setup receives the element and a fire()
 *   callback and may return a teardown.
 */

const customTriggers = new Map<string, VivTriggerSetup>()

export function defineTrigger(name: string, setup: VivTriggerSetup): void {
  customTriggers.set(name, setup)
}

export function getCustomTrigger(name: string): VivTriggerSetup | undefined {
  return customTriggers.get(name)
}

export function hasCustomTrigger(name: string): boolean {
  return customTriggers.has(name)
}

let styleEl: HTMLStyleElement | null = null

function inject(css: string): void {
  if (!styleEl || !styleEl.isConnected) {
    styleEl = document.createElement('style')
    styleEl.setAttribute('data-vivace-plugins', '')
    document.head.appendChild(styleEl)
  }
  styleEl.textContent += css
}

/**
 * Register a runtime animation key. The definition fills the same
 * custom-property slots the shipped keys use (--ATX0..10, --ASX*,
 * --ARX/Y/Z*, --AOP0/1, --AF0/1, plus --AD/--AL defaults):
 *
 *   Vivace.defineKey('@wb', {
 *     keyframe: 10,
 *     vars: { '--ARZ1': '8deg', '--ARZ3': '-6deg', '--ARZ5': '3deg' },
 *   })
 */
export function defineKey(token: string, def: VivKeyDefinition): void {
  const name = def.keyframe === 10 ? 'viv-10' : 'viv-2'
  let body = `--AN:${name};`
  if (def.duration !== undefined) body += `--AD:${def.duration};`
  for (const [prop, value] of Object.entries(def.vars)) {
    body += `${prop}:${value};`
  }
  inject(`[data-viv*="${token}"]{${body}}`)
}

/** Test/teardown hook: drop the injected plugin styles. */
export function resetKeys(): void {
  styleEl?.remove()
  styleEl = null
}
