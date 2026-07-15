import { customTeardowns, out, pause, play, trigger } from './core'
import { disconnectObservers, registerElement, scan, watchMutations } from './observer'
import { defineKey, defineTrigger } from './plugin'
import { installListeners, removeListeners } from './triggers'
import type { VivKeyDefinition, VivTriggerSetup, VivaceAPI } from './types'

export type {
  VivTrigger,
  VivState,
  VivRecord,
  VivaceAPI,
  VivKeyDefinition,
  VivTriggerSetup,
  VivEvent,
} from './types'
export {
  ATTR,
  ATTR_ON,
  ATTR_OUT,
  ATTR_STATE,
  ATTR_PAUSED,
  ATTR_REPEAT_SCROLL,
  ATTR_DELAY,
  ATTR_DURATION,
  ATTR_EASE,
  ATTR_REPEAT,
  TRIGGERS,
} from './types'
export { PRESETS, MODIFIERS, TRIGGER_OPTIONS } from './presets'
export type { PresetMeta, ModifierMeta } from './presets'

const canRun = typeof document !== 'undefined'

let initialized = false

/**
 * Vivace — attribute-driven animations with a real trigger system.
 *
 *   import Vivace from 'vivace'
 *   import 'vivace/vivace.css'
 *   Vivace.init()
 *
 * Everything else happens in HTML:
 *   <div data-viv="@fd @sl-y_ease-out-back" data-viv-on="appearing">
 */
export const Vivace: VivaceAPI = {
  init(root?: HTMLElement): void {
    if (!canRun) return
    const scope = root ?? document.body
    installListeners(document)
    watchMutations(scope, registerElement)
    scan(scope, registerElement)
    initialized = true
  },

  play(el: HTMLElement): void {
    if (canRun) play(el)
  },

  pause(el: HTMLElement): void {
    if (canRun) pause(el)
  },

  trigger(el: HTMLElement): void {
    if (canRun) trigger(el)
  },

  out(el: HTMLElement): Promise<void> {
    return canRun ? out(el) : Promise.resolve()
  },

  defineKey(token: string, def: VivKeyDefinition): void {
    if (canRun) defineKey(token, def)
  },

  defineTrigger(name: string, setup: VivTriggerSetup): void {
    defineTrigger(name, setup)
  },

  destroy(): void {
    if (!initialized) return
    removeListeners()
    disconnectObservers()
    for (const teardown of customTeardowns) teardown()
    customTeardowns.clear()
    initialized = false
  },
}

export default Vivace
