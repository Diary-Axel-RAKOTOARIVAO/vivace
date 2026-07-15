import type { VivTrigger } from './types'

/**
 * Metadata registry for the animation keys and modifiers shipped in
 * vivace.css. The animations themselves live entirely in CSS — this
 * table exists so tooling (docs, the playground) can enumerate them.
 */

export interface PresetMeta {
  /** Base token, e.g. '@fd' */
  key: string
  name: string
  description: string
  /** Every composable token for this key, base first. */
  variants: string[]
  /** True for keys added by Vivace on top of the A.css port. */
  vivace?: boolean
}

export const PRESETS: PresetMeta[] = [
  {
    key: '@fd',
    name: 'Fade',
    description: 'Opacity in (default) or out.',
    variants: ['@fd', '@fd-o'],
  },
  {
    key: '@sl',
    name: 'Slide',
    description: 'Translate in/out along one axis; ! flips the direction.',
    variants: ['@sl-x', '@sl-x!', '@sl-y', '@sl-y!', '@sl-x-o', '@sl-x-o!', '@sl-y-o', '@sl-y-o!'],
  },
  {
    key: '@rt',
    name: 'Rotate',
    description: 'Full 360° spin per axis, or 90° fold in/out.',
    variants: [
      '@rt-x',
      '@rt-y',
      '@rt-z',
      '@rt-x-i',
      '@rt-y-i',
      '@rt-z-i',
      '@rt-x-o',
      '@rt-y-o',
      '@rt-z-o',
      '@rt-z!',
    ],
  },
  {
    key: '@sc',
    name: 'Scale',
    description: 'Grow from zero or shrink away; ! scales from 2x instead.',
    variants: ['@sc-i', '@sc-i!', '@sc-o', '@sc-o!', '@sc-x-i', '@sc-y-i', '@sc-x-o', '@sc-y-o'],
  },
  {
    key: '@sp',
    name: 'Spiral',
    description: 'Slide in/out while orbiting a full turn.',
    variants: ['@sp-i', '@sp-i!', '@sp-o', '@sp-o!'],
  },
  {
    key: '@vb',
    name: 'Vibrate',
    description: 'Rapid multi-turn buzz around the center.',
    variants: ['@vb'],
  },
  {
    key: '@pr',
    name: 'Perspective',
    description: 'Fly in from deep Z space toward the viewer.',
    variants: ['@pr-i', '@pr-i!', '@pr-o', '@pr-o!', '@pr-up', '@pr-down'],
  },
  {
    key: '@bn',
    name: 'Bounce',
    description: 'Elastic scale spring; bare token bounces both axes.',
    variants: ['@bn', '@bn!', '@bn-x', '@bn-y'],
  },
  {
    key: '@sh',
    name: 'Shake',
    description: 'Decaying positional shake along one axis.',
    variants: ['@sh-x', '@sh-x!', '@sh-y', '@sh-y!'],
  },
  {
    key: '@fl',
    name: 'Flick',
    description: 'Rotational spring settle, like a flicked card.',
    variants: ['@fl-x', '@fl-y', '@fl-z', '@fl-x-o', '@fl-y-o', '@fl-z-o'],
  },
  {
    key: '@bl',
    name: 'Blur',
    description: 'Soft-focus fade: blurred and transparent to sharp.',
    variants: ['@bl', '@bl-o'],
    vivace: true,
  },
  {
    key: '@sw',
    name: 'Swing',
    description: 'Pendulum sway hinged on the top edge.',
    variants: ['@sw', '@sw!'],
    vivace: true,
  },
  {
    key: '@pop',
    name: 'Pop',
    description: 'Scale-in with an elastic overshoot punch.',
    variants: ['@pop'],
    vivace: true,
  },
  {
    key: '@dr',
    name: 'Drop',
    description: 'Fall in from above and bounce on landing; ! rises from below.',
    variants: ['@dr', '@dr!'],
    vivace: true,
  },
]

export interface ModifierMeta {
  key: string
  name: string
  description: string
  variants: string[]
}

export const MODIFIERS: ModifierMeta[] = [
  {
    key: '_ease',
    name: 'Easing',
    description: 'Timing curve for the whole composition.',
    variants: [
      '_ease-lin',
      '_ease-in',
      '_ease-out',
      '_ease-in-out',
      '_ease-circ',
      '_ease-in-circ',
      '_ease-out-circ',
      '_ease-back',
      '_ease-in-back',
      '_ease-out-back',
      '_ease-expo',
      '_ease-in-expo',
      '_ease-out-expo',
    ],
  },
  {
    key: '_delay',
    name: 'Delay',
    description: 'Start delay in 0.1s steps.',
    variants: [
      '_delay-1',
      '_delay-2',
      '_delay-3',
      '_delay-4',
      '_delay-5',
      '_delay-6',
      '_delay-7',
      '_delay-8',
    ],
  },
  {
    key: '_speed',
    name: 'Speed',
    description: 'Duration multiplier: up is faster, down is slower.',
    variants: [
      '_speed-up',
      '_speed-up+',
      '_speed-up++',
      '_speed-up+++',
      '_speed-down',
      '_speed-down+',
      '_speed-down++',
      '_speed-down+++',
    ],
  },
  {
    key: '_lv',
    name: 'Level',
    description: 'Intensity: scales distances, angles and spring amplitude.',
    variants: [
      '_lv-up',
      '_lv-up+',
      '_lv-up++',
      '_lv-up+++',
      '_lv-down',
      '_lv-down+',
      '_lv-down++',
      '_lv-down+++',
    ],
  },
  {
    key: '_origin',
    name: 'Origin',
    description: 'Transform origin: t/r/b/l and corners (lt, rt, rb, lb).',
    variants: [
      '_origin-t',
      '_origin-rt',
      '_origin-r',
      '_origin-rb',
      '_origin-b',
      '_origin-lb',
      '_origin-l',
      '_origin-lt',
    ],
  },
  {
    key: '_repeat',
    name: 'Repeat',
    description: 'Iteration count; bare token loops forever.',
    variants: ['_repeat', '_repeat-2', '_repeat-3', '_repeat-4', '_repeat-5'],
  },
  {
    key: '_alt',
    name: 'Direction',
    description: 'Alternate (there-and-back) or reversed playback.',
    variants: ['_alt', '_alt-rev', '_rev'],
  },
  {
    key: '_child',
    name: 'Children',
    description: 'Animate direct children instead, staggered in sequence.',
    variants: [
      '_child-ascend',
      '_child-descend',
      '_child-odd',
      '_child-even',
      '_child-ascend-up',
      '_child-ascend-down',
    ],
  },
]

export const TRIGGER_OPTIONS: { value: VivTrigger; description: string }[] = [
  { value: 'load', description: 'Fires as soon as the element mounts.' },
  { value: 'appearing', description: 'Fires when the element scrolls into view.' },
  { value: 'hover', description: 'Fires on pointer enter.' },
  { value: 'click', description: 'Fires on click or tap.' },
  { value: 'focus', description: 'Fires when the element receives focus.' },
]
