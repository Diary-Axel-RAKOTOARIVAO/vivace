import { GlobalRegistrator } from '@happy-dom/global-registrator'

GlobalRegistrator.register()

/**
 * Controllable IntersectionObserver stub — happy-dom's implementation
 * never fires, so tests drive entries by hand via `ioInstances`.
 */
export interface MockIO {
  observed: Set<Element>
  emit(entries: Array<Partial<IntersectionObserverEntry> & { target: Element }>): void
}

export const ioInstances: MockIO[] = []

class IntersectionObserverMock {
  observed = new Set<Element>()
  #callback: IntersectionObserverCallback

  constructor(callback: IntersectionObserverCallback) {
    this.#callback = callback
    ioInstances.push(this as unknown as MockIO)
  }

  observe(el: Element): void {
    this.observed.add(el)
  }

  unobserve(el: Element): void {
    this.observed.delete(el)
  }

  disconnect(): void {
    this.observed.clear()
  }

  takeRecords(): IntersectionObserverEntry[] {
    return []
  }

  emit(entries: Array<Partial<IntersectionObserverEntry> & { target: Element }>): void {
    this.#callback(entries as IntersectionObserverEntry[], this as unknown as IntersectionObserver)
  }
}

globalThis.IntersectionObserver = IntersectionObserverMock as unknown as typeof IntersectionObserver
