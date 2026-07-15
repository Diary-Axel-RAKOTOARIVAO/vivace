<script lang="ts" module>
	export const TOUR_KEY = 'vivace-playground-tour';
</script>

<script lang="ts">
	/**
	 * First-visit spotlight tour. Steps target [data-tour="…"] elements;
	 * the current spot stays lit while everything else darkens (one big
	 * box-shadow). Completion is remembered in localStorage.
	 */
	let { open = $bindable() }: { open: boolean } = $props();

	interface Step {
		id: string;
		title: string;
		text: string;
	}

	const STEPS: Step[] = [
		{
			id: 'subjects',
			title: 'Pick a subject',
			text: 'Real page sections to animate — stat tiles, cards, hero sections, lists, navbars, toasts.'
		},
		{
			id: 'presets',
			title: 'Start from a preset',
			text: 'Curated compositions that suit the current subject. One click loads it into the composer.'
		},
		{
			id: 'options',
			title: 'Tune the subject',
			text: 'Layout variants and child count for the section on stage.'
		},
		{
			id: 'composition',
			title: 'Compose',
			text: 'Each group is one @key plus the _modifiers attached to it. MIX stacks another animation on top.'
		},
		{
			id: 'widgets',
			title: 'Target & origin',
			text: 'Top node animates the element itself; the three below animate its children (_child). The grid sets the transform origin (_origin).'
		},
		{
			id: 'trigger',
			title: 'Choose the trigger',
			text: 'When it fires: on load, when scrolled into view, on hover, click or focus.'
		},
		{
			id: 'code',
			title: 'Copy the result',
			text: 'This attribute is everything your page needs — lift it straight into your HTML.'
		},
		{
			id: 'actions',
			title: 'Play & keep',
			text: 'Replay the animation, copy the snippet, share a link, or keep it as an experiment. Reopen this tour anytime with the ? button.'
		}
	];

	let step = $state(0);
	let spot = $state<{ top: number; left: number; width: number; height: number } | null>(null);
	let tip = $state({ top: 0, left: 0 });

	function measure() {
		// Skip steps whose target isn't currently rendered.
		let el: Element | null = null;
		let s = step;
		while (s < STEPS.length && !(el = document.querySelector(`[data-tour="${STEPS[s]!.id}"]`))) {
			s += 1;
		}
		if (!el) {
			close();
			return;
		}
		if (s !== step) {
			step = s;
			return;
		}
		el.scrollIntoView({ block: 'nearest' });
		const r = el.getBoundingClientRect();
		spot = { top: r.top - 6, left: r.left - 6, width: r.width + 12, height: r.height + 12 };

		const tipW = 320;
		const tipH = 170;
		const below = r.bottom + 14;
		tip = {
			top: below + tipH < window.innerHeight ? below : Math.max(8, r.top - tipH),
			left: Math.min(Math.max(8, r.left), window.innerWidth - tipW - 8)
		};
	}

	$effect(() => {
		if (!open) return;
		void step;
		const raf = requestAnimationFrame(measure);
		window.addEventListener('resize', measure);
		return () => {
			cancelAnimationFrame(raf);
			window.removeEventListener('resize', measure);
		};
	});

	function close() {
		open = false;
		step = 0;
		spot = null;
		localStorage.setItem(TOUR_KEY, 'done');
	}

	function next() {
		if (step < STEPS.length - 1) step += 1;
		else close();
	}

	function back() {
		if (step > 0) step -= 1;
	}
</script>

{#if open && spot}
	<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
	<div class="fixed inset-0 z-[70]" onclick={next}>
		<!-- the spotlight: everything around it darkens -->
		<div
			class="pointer-events-none absolute rounded-box transition-all duration-200"
			style="top: {spot.top}px; left: {spot.left}px; width: {spot.width}px; height: {spot.height}px;
				box-shadow: 0 0 0 9999px rgb(0 0 0 / 0.55);"
		></div>

		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="absolute w-80 rounded-box border border-base-300 bg-base-100 p-4 shadow-xl transition-all duration-200"
			style="top: {tip.top}px; left: {tip.left}px;"
			role="dialog"
			aria-label="Playground tour"
			tabindex="-1"
			onclick={(e) => e.stopPropagation()}
		>
			<div class="mb-1 flex items-baseline justify-between">
				<h3 class="text-sm font-bold">{STEPS[step]!.title}</h3>
				<span class="font-mono text-[11px] text-base-content/45">{step + 1}/{STEPS.length}</span>
			</div>
			<p class="text-[13px] leading-relaxed text-base-content/70">{STEPS[step]!.text}</p>
			<div class="mt-3 flex items-center justify-between">
				<button class="btn btn-ghost btn-xs text-base-content/50" onclick={close}>Skip</button>
				<div class="flex gap-1.5">
					{#if step > 0}
						<button class="btn btn-xs border-base-300" onclick={back}>Back</button>
					{/if}
					<button class="btn btn-primary btn-xs" onclick={next}>
						{step === STEPS.length - 1 ? 'Done' : 'Next'}
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}
