/**
 * Preview subjects — mock page sections the composition is applied to.
 * Each has natural children, so _child staggers read like they would on
 * a real page. `repeat` marks subjects whose child count is adjustable.
 */
export interface Subject {
	id: string;
	name: string;
	icon: string;
	repeat?: boolean;
}

export const SUBJECTS: Subject[] = [
	{ id: 'card', name: 'Card', icon: 'lucide:square' },
	{ id: 'hero', name: 'Hero section', icon: 'lucide:layout-template' },
	{ id: 'list', name: 'List', icon: 'lucide:list', repeat: true },
	{ id: 'stats', name: 'Stat tiles', icon: 'lucide:layout-dashboard', repeat: true },
	{ id: 'nav', name: 'Navbar', icon: 'lucide:panel-top' },
	{ id: 'toast', name: 'Toast', icon: 'lucide:bell' }
];
