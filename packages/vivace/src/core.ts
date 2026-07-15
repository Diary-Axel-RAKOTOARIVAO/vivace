import {
  ATTR_DELAY,
  ATTR_DURATION,
  ATTR_EASE,
  ATTR_ON,
  ATTR_PAUSED,
  ATTR_REPEAT,
  ATTR_REPEAT_SCROLL,
  ATTR_STATE,
  TRIGGERS,
  type VivRecord,
  type VivTrigger,
} from './types'

/**
 * Element registry. WeakMap so removed DOM nodes release their records
 * without any unregister ceremony.
 */
export const registry = new WeakMap<HTMLElement, VivRecord>()

const EASE_VARS = new Set([
  'circ',
  'in-circ',
  'out-circ',
  'expo',
  'in-expo',
  'out-expo',
  'back',
  'in-back',
  'out-back',
])

/** 'out-back' -> 'var(--Aout-back)'; CSS keywords and cubic-bezier() pass through. */
export function resolveEase(value: string): string {
  return EASE_VARS.has(value) ? `var(--A${value})` : value
}

/** '600ms' -> 0.6, '0.6s' -> 0.6, '0.6' -> 0.6. Returns null for garbage. */
export function parseSeconds(value: string): number | null {
  const n = Number.parseFloat(value)
  if (Number.isNaN(n)) return null
  return value.trim().endsWith('ms') ? n / 1000 : n
}

/**
 * Map the friendly data-viv-* modifier attributes onto the CSS custom
 * properties the keyframes read. Inline style wins over these if set.
 */
function applyModifiers(el: HTMLElement): void {
  const duration = el.getAttribute(ATTR_DURATION)
  if (duration !== null) {
    const s = parseSeconds(duration)
    if (s !== null) el.style.setProperty('--AD', String(s))
  }

  const delay = el.getAttribute(ATTR_DELAY)
  if (delay !== null) {
    const s = parseSeconds(delay)
    if (s !== null) el.style.setProperty('--ADL', `${s}s`)
  }

  const ease = el.getAttribute(ATTR_EASE)
  if (ease !== null) el.style.setProperty('--AE', resolveEase(ease))

  const repeat = el.getAttribute(ATTR_REPEAT)
  if (repeat !== null) el.style.setProperty('--AC', repeat)
}

export function parseTrigger(el: HTMLElement): VivTrigger {
  const raw = el.getAttribute(ATTR_ON)
  return raw !== null && (TRIGGERS as readonly string[]).includes(raw)
    ? (raw as VivTrigger)
    : 'load'
}

/**
 * Arm one element: read its trigger, apply modifiers, and put entrance
 * triggers into the hidden `idle` state so they don't flash before firing.
 * Returns the record, or null if the element was already registered.
 */
export function register(el: HTMLElement): VivRecord | null {
  if (registry.has(el)) return null

  const record: VivRecord = {
    trigger: parseTrigger(el),
    repeatOnScroll: el.hasAttribute(ATTR_REPEAT_SCROLL),
  }
  registry.set(el, record)
  applyModifiers(el)

  if (record.trigger === 'appearing') {
    setState(el, 'idle')
  } else if (record.trigger === 'load') {
    trigger(el)
  }
  return record
}

export function setState(el: HTMLElement, state: 'idle' | 'play' | null): void {
  if (state === null) el.removeAttribute(ATTR_STATE)
  else el.setAttribute(ATTR_STATE, state)
}

/** Fire the animation. If it already ran, restart it from frame zero. */
export function trigger(el: HTMLElement): void {
  el.removeAttribute(ATTR_PAUSED)
  if (el.getAttribute(ATTR_STATE) === 'play') {
    setState(el, null)
    // Force a style recalc between removing and re-adding the state,
    // otherwise the browser coalesces the two writes and never restarts.
    void el.offsetWidth
  }
  setState(el, 'play')
}

export function pause(el: HTMLElement): void {
  el.setAttribute(ATTR_PAUSED, '')
}

/** Unpause if paused; otherwise fire the animation. */
export function play(el: HTMLElement): void {
  if (el.hasAttribute(ATTR_PAUSED)) {
    el.removeAttribute(ATTR_PAUSED)
    return
  }
  trigger(el)
}
