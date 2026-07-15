/** How an element's animation gets fired. */
export type VivTrigger = 'load' | 'appearing' | 'hover' | 'click' | 'focus'

/** Engine-managed lifecycle written to `data-viv-state`. */
export type VivState = 'idle' | 'play'

/** Per-element bookkeeping held in the registry. */
export interface VivRecord {
  trigger: VivTrigger
  /** `appearing` only: re-arm when the element leaves the viewport. */
  repeatOnScroll: boolean
}

export interface VivaceAPI {
  /** Scan `root` (default `document.body`) and arm every `[data-viv]` element. Idempotent. */
  init(root?: HTMLElement): void
  /** Resume a paused animation, or fire it if it never ran. */
  play(el: HTMLElement): void
  /** Freeze the animation in place without resetting it. */
  pause(el: HTMLElement): void
  /** Fire (or restart) an element's animation, regardless of its trigger. */
  trigger(el: HTMLElement): void
  /** Tear down all observers and listeners. Safe to `init()` again after. */
  destroy(): void
}

/** Attribute names — single source of truth, mirrored by the SCSS config. */
export const ATTR = 'data-viv'
export const ATTR_ON = 'data-viv-on'
export const ATTR_STATE = 'data-viv-state'
export const ATTR_PAUSED = 'data-viv-paused'
export const ATTR_REPEAT_SCROLL = 'data-viv-repeat-scroll'
export const ATTR_DELAY = 'data-viv-delay'
export const ATTR_DURATION = 'data-viv-duration'
export const ATTR_EASE = 'data-viv-ease'
export const ATTR_REPEAT = 'data-viv-repeat'

export const TRIGGERS: readonly VivTrigger[] = ['load', 'appearing', 'hover', 'click', 'focus']
