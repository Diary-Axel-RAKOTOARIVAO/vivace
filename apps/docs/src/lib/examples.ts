import type { VivTrigger } from 'vivace';

/**
 * Named example compositions in canonical notation, adapted from the
 * A.css reference tool (Swoosh/Jelly/Wind/Gather) plus Vivace-key
 * showcases. Loading one seeds the composer groups.
 */
export interface Example {
	name: string;
	viv: string;
	on: VivTrigger;
}

export const EXAMPLES: Example[] = [
	{ name: 'Swoosh', on: 'load', viv: '@sl-x_speed-up++_lv-up+_ease-out-back @fd @sc-x-i!' },
	{ name: 'Jelly', on: 'load', viv: '@bn-x_origin-b @bn-y! @sl-y @fl-y' },
	{ name: 'Wind', on: 'load', viv: '@rt-y_child-ascend @pr-i @fd' },
	{ name: 'Gather', on: 'load', viv: '@pr-i_child-ascend_ease-out-back @fd @sc-i!' },
	{ name: 'Soft focus', on: 'load', viv: '@bl_speed-down_ease-out-expo @sl-y' },
	{ name: 'Bounce drop', on: 'load', viv: '@dr_lv-up @sw' }
];
