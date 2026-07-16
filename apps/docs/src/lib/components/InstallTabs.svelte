<script lang="ts">
	const MANAGERS = [
		{ id: 'bun', icon: 'simple-icons:bun', command: 'bun add vivace' },
		{ id: 'npm', icon: 'simple-icons:npm', command: 'npm install vivace' },
		{ id: 'pnpm', icon: 'simple-icons:pnpm', command: 'pnpm add vivace' },
		{ id: 'yarn', icon: 'simple-icons:yarn', command: 'yarn add vivace' }
	] as const;

	const STORAGE_KEY = 'vivace-pm';

	let active = $state<string>('bun');
	let copied = $state(false);

	$effect(() => {
		const saved = localStorage.getItem(STORAGE_KEY);
		if (saved && MANAGERS.some((m) => m.id === saved)) active = saved;
	});

	function pick(id: string) {
		active = id;
		localStorage.setItem(STORAGE_KEY, id);
	}

	const current = $derived(MANAGERS.find((m) => m.id === active) ?? MANAGERS[0]);

	async function copy() {
		await navigator.clipboard.writeText(current.command);
		copied = true;
		setTimeout(() => (copied = false), 1500);
	}
</script>

<div class="overflow-hidden rounded-box border border-base-300 bg-base-100">
	<div class="flex items-center border-b border-base-300 bg-base-200/60">
		{#each MANAGERS as manager (manager.id)}
			<button
				class="flex items-center gap-1.5 border-b-2 px-3.5 py-2 text-[13px] font-medium transition-colors {active ===
				manager.id
					? 'border-accent bg-base-100 text-base-content'
					: 'border-transparent text-base-content/50 hover:text-base-content'}"
				aria-pressed={active === manager.id}
				onclick={() => pick(manager.id)}
			>
				<iconify-icon icon={manager.icon} width="14"></iconify-icon>
				{manager.id}
			</button>
		{/each}
	</div>
	<div class="flex items-center justify-between gap-3 px-4 py-3">
		<code class="bg-transparent p-0 font-mono text-[13.5px]">
			<span class="text-base-content/40">$</span>
			{current.command}
		</code>
		<button
			class="btn btn-ghost btn-xs gap-1 text-base-content/50"
			aria-label="Copy install command"
			onclick={copy}
		>
			<iconify-icon icon={copied ? 'lucide:check' : 'lucide:copy'} width="13"></iconify-icon>
			{copied ? 'copied' : 'copy'}
		</button>
	</div>
</div>
