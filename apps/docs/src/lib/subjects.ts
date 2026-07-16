import type { VivTrigger } from 'vivace-css';

/**
 * Preview subjects — mock page sections the composition is applied to.
 * Each has natural children, so _child staggers read like they would on
 * a real page. `repeat` marks subjects whose child count is adjustable;
 * `variants` lists alternative layouts (first is the default); `presets`
 * are curated compositions that suit this subject.
 */
export interface SubjectVariant {
	id: string;
	name: string;
	icon: string;
}

export interface SubjectPreset {
	name: string;
	viv: string;
	on: VivTrigger;
}

export interface Subject {
	id: string;
	name: string;
	icon: string;
	repeat?: boolean;
	variants?: SubjectVariant[];
	presets: SubjectPreset[];
}

export const SUBJECTS: Subject[] = [
	{
		id: 'stats',
		name: 'Stat tiles',
		icon: 'lucide:layout-dashboard',
		repeat: true,
		presets: [
			{ name: 'Rise', on: 'load', viv: '@sl-y!_child-ascend_ease-out-back @fd' },
			{ name: 'Pop in', on: 'load', viv: '@pop_child-ascend' },
			{ name: 'Gather', on: 'load', viv: '@pr-i_child-ascend_ease-out-back @fd @sc-i!' },
			{ name: 'Flip up', on: 'load', viv: '@rt-x-i_child-ascend_origin-b @fd' }
		]
	},
	{
		id: 'card',
		name: 'Card',
		icon: 'lucide:square',
		variants: [
			{ id: 'vertical', name: 'Image on top', icon: 'lucide:rectangle-vertical' },
			{ id: 'horizontal', name: 'Image on the side', icon: 'lucide:rectangle-horizontal' }
		],
		presets: [
			{ name: 'Pop', on: 'load', viv: '@pop_ease-out-back' },
			{ name: 'Soft focus', on: 'load', viv: '@bl_speed-down_ease-out-expo @sl-y' },
			{ name: 'Swoosh', on: 'load', viv: '@sl-x_speed-up++_lv-up+_ease-out-back @fd @sc-x-i!' },
			{ name: 'Flick', on: 'load', viv: '@fl-y @fd' },
			{ name: 'Hover jelly', on: 'hover', viv: '@bn' }
		]
	},
	{
		id: 'hero',
		name: 'Hero section',
		icon: 'lucide:layout-template',
		variants: [
			{ id: 'center', name: 'Centered, top to bottom', icon: 'lucide:align-center' },
			{ id: 'split-l', name: 'Text left, media right', icon: 'lucide:align-left' },
			{ id: 'split-r', name: 'Media left, text right', icon: 'lucide:align-right' }
		],
		presets: [
			{ name: 'Gather', on: 'load', viv: '@pr-i_child-ascend_ease-out-back @fd @sc-i!' },
			{ name: 'Cascade', on: 'load', viv: '@fd_child-ascend @sl-y_ease-out-expo' },
			{ name: 'Wind', on: 'load', viv: '@rt-y_child-ascend @pr-i @fd' },
			{ name: 'Soft focus', on: 'load', viv: '@bl_speed-down @sl-y_ease-out-expo' }
		]
	},
	{
		id: 'list',
		name: 'List',
		icon: 'lucide:list',
		repeat: true,
		presets: [
			{ name: 'Slide in', on: 'load', viv: '@sl-x_child-ascend_ease-out-expo @fd' },
			{ name: 'Cascade', on: 'load', viv: '@fd_child-ascend @sl-y' },
			{ name: 'From right', on: 'load', viv: '@sl-x!_child-descend_ease-out-back @fd' },
			{ name: 'Drop in', on: 'load', viv: '@dr_child-ascend' }
		]
	},
	{
		id: 'nav',
		name: 'Navbar',
		icon: 'lucide:panel-top',
		presets: [
			{ name: 'From top', on: 'load', viv: '@sl-y_child-ascend @fd' },
			{ name: 'Fade in', on: 'load', viv: '@fd_child-ascend_speed-down' },
			{ name: 'Drop bar', on: 'load', viv: '@dr_lv-down' }
		]
	},
	{
		id: 'toast',
		name: 'Toast',
		icon: 'lucide:bell',
		presets: [
			{ name: 'Drop', on: 'load', viv: '@dr' },
			{ name: 'Slide in', on: 'load', viv: '@sl-x!_ease-out-back @fd' },
			{ name: 'Pop', on: 'load', viv: '@pop' },
			{ name: 'Attention', on: 'click', viv: '@sh-x_lv-down' }
		]
	}
];
