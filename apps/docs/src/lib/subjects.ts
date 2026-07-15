/**
 * Preview subjects — mock page sections the composition is applied to.
 * Each has natural children, so _child staggers read like they would on
 * a real page. `repeat` marks subjects whose child count is adjustable;
 * `variants` lists alternative layouts (first is the default).
 */
export interface SubjectVariant {
	id: string;
	name: string;
	icon: string;
}

export interface Subject {
	id: string;
	name: string;
	icon: string;
	repeat?: boolean;
	variants?: SubjectVariant[];
}

export const SUBJECTS: Subject[] = [
	{
		id: 'card',
		name: 'Card',
		icon: 'lucide:square',
		variants: [
			{ id: 'vertical', name: 'Image on top', icon: 'lucide:rectangle-vertical' },
			{ id: 'horizontal', name: 'Image on the side', icon: 'lucide:rectangle-horizontal' }
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
		]
	},
	{ id: 'list', name: 'List', icon: 'lucide:list', repeat: true },
	{ id: 'stats', name: 'Stat tiles', icon: 'lucide:layout-dashboard', repeat: true },
	{ id: 'nav', name: 'Navbar', icon: 'lucide:panel-top' },
	{ id: 'toast', name: 'Toast', icon: 'lucide:bell' }
];
