import { register, registry, setState, trigger } from './core'
import { ATTR } from './types'

/**
 * Shared observers — exactly one IntersectionObserver and one
 * MutationObserver per root for the whole page, never per element.
 */

let io: IntersectionObserver | null = null

function ensureIO(): IntersectionObserver {
  if (io) return io
  io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const el = entry.target as HTMLElement
        const record = registry.get(el)
        if (!record) {
          io?.unobserve(el)
          continue
        }
        if (entry.isIntersecting) {
          trigger(el)
          if (!record.repeatOnScroll) io?.unobserve(el)
        } else if (record.repeatOnScroll && el.getAttribute('data-viv-state') === 'play') {
          // Re-arm off-screen so the next scroll-in replays it.
          setState(el, 'idle')
        }
      }
    },
    { threshold: 0.15 },
  )
  return io
}

export function watchAppearing(el: HTMLElement): void {
  ensureIO().observe(el)
}

/** Register `el` and every [data-viv] descendant. */
export function scan(root: ParentNode & Node, onRegister: (el: HTMLElement) => void): void {
  if (root instanceof HTMLElement && root.hasAttribute(ATTR)) onRegister(root)
  for (const el of root.querySelectorAll<HTMLElement>(`[${ATTR}]`)) {
    onRegister(el)
  }
}

const mutationObservers = new Map<HTMLElement, MutationObserver>()

/**
 * Auto-register elements mounted after init — this is what makes Vivace
 * drop-in for SPA frameworks without lifecycle glue.
 */
export function watchMutations(root: HTMLElement, onRegister: (el: HTMLElement) => void): void {
  if (mutationObservers.has(root)) return
  const mo = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType === Node.ELEMENT_NODE) scan(node as HTMLElement, onRegister)
      }
      for (const node of mutation.removedNodes) {
        if (node.nodeType !== Node.ELEMENT_NODE) continue
        // Release IO targets for unmounted subtrees; the WeakMap registry
        // cleans itself up.
        scan(node as HTMLElement, (el) => io?.unobserve(el))
      }
    }
  })
  mo.observe(root, { childList: true, subtree: true })
  mutationObservers.set(root, mo)
}

export function registerElement(el: HTMLElement): void {
  const record = register(el)
  if (record?.trigger === 'appearing') watchAppearing(el)
}

export function disconnectObservers(): void {
  io?.disconnect()
  io = null
  for (const mo of mutationObservers.values()) mo.disconnect()
  mutationObservers.clear()
}
