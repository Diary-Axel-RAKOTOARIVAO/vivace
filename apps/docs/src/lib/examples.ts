import type { VivTrigger } from 'vivace';

/**
 * Named example compositions, adapted from the A.css reference tool
 * (Swoosh/Jelly/Wind/Gather) plus Vivace-key showcases. Loading one
 * seeds the playground chain.
 */
export interface Example {
	name: string;
	tokens: string[];
	on: VivTrigger;
}

export const EXAMPLES: Example[] = [
	{
		name: 'Swoosh',
		on: 'load',
		tokens: ['@sl-x', '@fd', '@sc-x-i!', '_speed-up++', '_lv-up+', '_ease-out-back']
	},
	{
		name: 'Jelly',
		on: 'load',
		tokens: ['@bn-x', '@bn-y!', '@sl-y', '@fl-y', '_origin-b']
	},
	{
		name: 'Wind',
		on: 'load',
		tokens: ['@rt-y', '@pr-i', '@fd', '_child-ascend']
	},
	{
		name: 'Gather',
		on: 'load',
		tokens: ['@pr-i', '@fd', '@sc-i!', '_child-ascend', '_ease-out-back']
	},
	{
		name: 'Soft focus',
		on: 'load',
		tokens: ['@bl', '@sl-y', '_speed-down', '_ease-out-expo']
	},
	{
		name: 'Bounce drop',
		on: 'load',
		tokens: ['@dr', '@sw', '_lv-up']
	}
];
