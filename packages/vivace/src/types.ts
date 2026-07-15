/** Built-in triggers; custom ones registered via defineTrigger() are plain strings. */
export type VivTrigger = 'load' | 'appearing' | 'hover' | 'click' | 'focus'

/** Engine-managed lifecycle written to `data-viv-state`. */
export type VivState = 'idle' | 'play'

/** Per-element bookkeeping held in the registry. */
export interface VivRecord {
  trigger: VivTrigger | (string & {})
  /** `appearing` only: re-arm when the element leaves the viewport. */
  repeatOnScroll: boolean
}

/** Custom trigger: arm the element, call fire() to play; return a teardown. */
export type VivTriggerSetup = (el: HTMLElement, fire: () => void) => (() => void) | undefined

/** Runtime animation key registered via defineKey(). */
export interface VivKeyDefinition {
  /** Which shared keyframe to run through: 2 (in/out) or 10 (spring). Default 2. */
  keyframe?: 2 | 10
  /** Base duration in seconds (--AD). */
  duration?: number
  /** Custom-property slots, e.g. { '--ATY0': '-100%', '--AOP0': '0' }. */
  vars: Record<string, string>
}

/** Events dispatched on animated elements (they bubble). */
export type VivEvent = 'vivace:play' | 'vivace:end' | 'vivace:out'

export interface VivaceAPI {
  /** Scan `root` (default `document.body`) and arm every `[data-viv]` element. Idempotent. */
  init(root?: HTMLElement): void
  /** Resume a paused animation, or fire it if it never ran. */
  play(el: HTMLElement): void
  /** Freeze the animation in place without resetting it. */
  pause(el: HTMLElement): void
  /** Fire (or restart) an element's animation, regardless of its trigger. */
  trigger(el: HTMLElement): void
  /**
   * Play the exit composition (from `data-viv-out`, default '@fd-o') and
   * resolve when it finishes — remove the element after.
   */
  out(el: HTMLElement): Promise<void>
  /** Register a runtime animation key usable in data-viv. */
  defineKey(token: string, def: VivKeyDefinition): void
  /** Register a custom trigger usable as data-viv-on. */
  defineTrigger(name: string, setup: VivTriggerSetup): void
  /** Tear down all observers and listeners. Safe to `init()` again after. */
  destroy(): void
}

/** Attribute names — single source of truth, mirrored by the SCSS config. */
export const ATTR = 'data-viv'
export const ATTR_OUT = 'data-viv-out'
export const ATTR_ON = 'data-viv-on'
export const ATTR_STATE = 'data-viv-state'
export const ATTR_PAUSED = 'data-viv-paused'
export const ATTR_REPEAT_SCROLL = 'data-viv-repeat-scroll'
export const ATTR_DELAY = 'data-viv-delay'
export const ATTR_DURATION = 'data-viv-duration'
export const ATTR_EASE = 'data-viv-ease'
export const ATTR_REPEAT = 'data-viv-repeat'

export const TRIGGERS: readonly VivTrigger[] = ['load', 'appearing', 'hover', 'click', 'focus']
