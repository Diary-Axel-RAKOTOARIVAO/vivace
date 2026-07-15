import { afterEach, describe, expect, test } from 'bun:test'
import { parseSeconds, resolveEase } from '../src/core'
import Vivace, { ATTR_PAUSED, ATTR_STATE } from '../src/index'
import { ioInstances } from './setup'

function mount(html: string): HTMLElement {
  document.body.innerHTML = html
  return document.body.firstElementChild as HTMLElement
}

function flushMutations(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 10))
}

afterEach(() => {
  Vivace.destroy()
  document.body.innerHTML = ''
  ioInstances.length = 0
})

describe('modifier parsing', () => {
  test('parseSeconds handles s, ms and bare numbers', () => {
    expect(parseSeconds('0.6')).toBe(0.6)
    expect(parseSeconds('0.6s')).toBe(0.6)
    expect(parseSeconds('600ms')).toBe(0.6)
    expect(parseSeconds('nope')).toBeNull()
  })

  test('resolveEase maps named curves to CSS variables, passes keywords through', () => {
    expect(resolveEase('out-back')).toBe('var(--Aout-back)')
    expect(resolveEase('linear')).toBe('linear')
    expect(resolveEase('cubic-bezier(0.1, 0.2, 0.3, 0.4)')).toBe('cubic-bezier(0.1, 0.2, 0.3, 0.4)')
  })

  test('data-viv-* attributes land on the CSS custom properties', () => {
    const el = mount(
      '<div data-viv="@fd" data-viv-duration="600ms" data-viv-delay="0.2" data-viv-ease="out-expo" data-viv-repeat="3"></div>',
    )
    Vivace.init()
    expect(el.style.getPropertyValue('--AD')).toBe('0.6')
    expect(el.style.getPropertyValue('--ADL')).toBe('0.2s')
    expect(el.style.getPropertyValue('--AE')).toBe('var(--Aout-expo)')
    expect(el.style.getPropertyValue('--AC')).toBe('3')
  })
})

describe('triggers', () => {
  test('load trigger fires immediately on init', () => {
    const el = mount('<div data-viv="@fd"></div>')
    Vivace.init()
    expect(el.getAttribute(ATTR_STATE)).toBe('play')
  })

  test('appearing trigger arms idle and fires when the observer reports intersection', () => {
    const el = mount('<div data-viv="@sl-y" data-viv-on="appearing"></div>')
    Vivace.init()
    expect(el.getAttribute(ATTR_STATE)).toBe('idle')

    const io = ioInstances[0]!
    expect(io.observed.has(el)).toBe(true)
    io.emit([{ target: el, isIntersecting: true }])
    expect(el.getAttribute(ATTR_STATE)).toBe('play')
    // fires once by default: unobserved after intersecting
    expect(io.observed.has(el)).toBe(false)
  })

  test('appearing with data-viv-repeat-scroll re-arms when scrolled out', () => {
    const el = mount('<div data-viv="@fd" data-viv-on="appearing" data-viv-repeat-scroll></div>')
    Vivace.init()
    const io = ioInstances[0]!
    io.emit([{ target: el, isIntersecting: true }])
    expect(el.getAttribute(ATTR_STATE)).toBe('play')
    expect(io.observed.has(el)).toBe(true)
    io.emit([{ target: el, isIntersecting: false }])
    expect(el.getAttribute(ATTR_STATE)).toBe('idle')
  })

  test('click trigger fires via delegation, including from nested targets', () => {
    const el = mount('<button data-viv="@bn" data-viv-on="click"><span>go</span></button>')
    Vivace.init()
    expect(el.hasAttribute(ATTR_STATE)).toBe(false)
    el.querySelector('span')!.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    expect(el.getAttribute(ATTR_STATE)).toBe('play')
  })

  test('hover trigger fires from a document-level capture listener', () => {
    const el = mount('<div data-viv="@sh-x" data-viv-on="hover"></div>')
    Vivace.init()
    el.dispatchEvent(new Event('pointerenter'))
    expect(el.getAttribute(ATTR_STATE)).toBe('play')
  })

  test('focus trigger fires on focusin', () => {
    const el = mount('<input data-viv="@fd" data-viv-on="focus" />')
    Vivace.init()
    el.dispatchEvent(new FocusEvent('focusin', { bubbles: true }))
    expect(el.getAttribute(ATTR_STATE)).toBe('play')
  })

  test('elements without a matching trigger are not fired by other events', () => {
    const el = mount('<div data-viv="@fd" data-viv-on="click"></div>')
    Vivace.init()
    el.dispatchEvent(new Event('pointerenter'))
    expect(el.hasAttribute(ATTR_STATE)).toBe(false)
  })
})

describe('public API', () => {
  test('pause sets the paused attribute, play releases it', () => {
    const el = mount('<div data-viv="@fd"></div>')
    Vivace.init()
    Vivace.pause(el)
    expect(el.hasAttribute(ATTR_PAUSED)).toBe(true)
    Vivace.play(el)
    expect(el.hasAttribute(ATTR_PAUSED)).toBe(false)
    expect(el.getAttribute(ATTR_STATE)).toBe('play')
  })

  test('trigger restarts an element that already played', () => {
    const el = mount('<div data-viv="@fd"></div>')
    Vivace.init()
    expect(el.getAttribute(ATTR_STATE)).toBe('play')
    Vivace.trigger(el)
    expect(el.getAttribute(ATTR_STATE)).toBe('play')
  })

  test('init is idempotent', () => {
    mount('<div data-viv="@fd" data-viv-on="appearing"></div>')
    Vivace.init()
    Vivace.init()
    expect(ioInstances.length).toBe(1)
    expect(ioInstances[0]!.observed.size).toBe(1)
  })

  test('destroy removes listeners so triggers stop firing', () => {
    const el = mount('<div data-viv="@fd" data-viv-on="click"></div>')
    Vivace.init()
    Vivace.destroy()
    el.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    expect(el.hasAttribute(ATTR_STATE)).toBe(false)
  })
})

describe('dynamic DOM', () => {
  test('elements mounted after init are auto-registered', async () => {
    mount('<div id="host"></div>')
    Vivace.init()
    const late = document.createElement('div')
    late.setAttribute('data-viv', '@pop')
    document.getElementById('host')!.appendChild(late)
    await flushMutations()
    expect(late.getAttribute(ATTR_STATE)).toBe('play')
  })

  test('nested [data-viv] descendants of an added subtree are registered', async () => {
    mount('<div id="host"></div>')
    Vivace.init()
    const wrapper = document.createElement('section')
    wrapper.innerHTML = '<article data-viv="@bl" data-viv-on="appearing"></article>'
    document.getElementById('host')!.appendChild(wrapper)
    await flushMutations()
    const article = wrapper.firstElementChild as HTMLElement
    expect(article.getAttribute(ATTR_STATE)).toBe('idle')
    expect(ioInstances[0]!.observed.has(article)).toBe(true)
  })
})
