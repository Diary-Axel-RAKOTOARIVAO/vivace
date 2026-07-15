import { emit, registry, trigger } from './core'
import { ATTR, type VivTrigger } from './types'

/**
 * Interaction triggers via event delegation — a single set of listeners
 * on the document, never per-element handlers.
 *
 * pointerenter doesn't bubble, but it IS dispatched to every element
 * along the entry chain, so a capture listener at the document sees each
 * one with `target` already set to the entered element.
 */

type Teardown = () => void

function hoverHandler(event: Event): void {
  const el = event.target
  if (!(el instanceof HTMLElement)) return
  if (registry.get(el)?.trigger === 'hover') trigger(el)
}

/** click/focusin bubble, so walk up to the nearest registered ancestor. */
function delegatedHandler(kind: VivTrigger): (event: Event) => void {
  return (event) => {
    const target = event.target
    if (!(target instanceof Element)) return
    const el = target.closest<HTMLElement>(`[${ATTR}]`)
    if (el && registry.get(el)?.trigger === kind) trigger(el)
  }
}

/** Surface animation completion as a bubbling vivace:end event. */
function endHandler(event: Event): void {
  const target = event.target
  if (!(target instanceof Element)) return
  const el = target.closest<HTMLElement>(`[${ATTR}]`)
  if (el && registry.has(el)) emit(el, 'vivace:end')
}

let teardown: Teardown | null = null

export function installListeners(doc: Document): void {
  if (teardown) return

  const onClick = delegatedHandler('click')
  const onFocus = delegatedHandler('focus')

  doc.addEventListener('pointerenter', hoverHandler, true)
  doc.addEventListener('click', onClick)
  doc.addEventListener('focusin', onFocus)
  doc.addEventListener('animationend', endHandler)

  teardown = () => {
    doc.removeEventListener('pointerenter', hoverHandler, true)
    doc.removeEventListener('click', onClick)
    doc.removeEventListener('focusin', onFocus)
    doc.removeEventListener('animationend', endHandler)
  }
}

export function removeListeners(): void {
  teardown?.()
  teardown = null
}
