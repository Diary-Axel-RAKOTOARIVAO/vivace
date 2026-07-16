<script lang="ts">
	/**
	 * GitHub username input that verifies itself: after a typing pause
	 * (debounced) it checks the public GitHub API and flips `verified`
	 * — no button. Any edit immediately un-verifies.
	 */
	let {
		value = $bindable(''),
		verified = $bindable(false),
		name = 'author',
		placeholder = 'octocat'
	}: { value?: string; verified?: boolean; name?: string; placeholder?: string } = $props();

	type Status = 'idle' | 'checking' | 'ok' | 'notfound' | 'error';
	let status = $state<Status>('idle');
	let profile = $state<{ login: string; avatar_url: string; name: string | null } | null>(null);

	let generation = 0;

	async function check(candidate: string) {
		const mine = ++generation;
		status = 'checking';
		try {
			const res = await fetch(`https://api.github.com/users/${encodeURIComponent(candidate)}`);
			if (mine !== generation) return; // stale — user kept typing
			if (res.status === 404) {
				status = 'notfound';
				return;
			}
			if (!res.ok) {
				status = 'error';
				return;
			}
			const user = (await res.json()) as { login: string; avatar_url: string; name: string | null };
			if (mine !== generation) return;
			profile = user;
			value = user.login; // canonical casing; identical string won't re-trigger
			verified = true;
			status = 'ok';
		} catch {
			if (mine === generation) status = 'error';
		}
	}

	// Debounced auto-verify: reacts to typing AND programmatic prefills.
	$effect(() => {
		const candidate = value.trim();
		if (verified && profile && candidate === profile.login) return; // converged
		verified = false;
		profile = null;
		generation++;
		if (!candidate) {
			status = 'idle';
			return;
		}
		status = 'checking';
		const timer = setTimeout(() => check(candidate), 550);
		return () => clearTimeout(timer);
	});
</script>

<div class="flex flex-col gap-1.5">
	<label class="input input-sm flex w-full items-center gap-2">
		<iconify-icon icon="simple-icons:github" width="14" class="shrink-0 text-base-content/40"
		></iconify-icon>
		<input {name} bind:value required maxlength="39" class="grow font-mono" {placeholder} />
		<span class="shrink-0">
			{#if status === 'checking'}
				<span class="loading loading-spinner loading-xs text-base-content/40"></span>
			{:else if status === 'ok'}
				<iconify-icon icon="lucide:badge-check" width="15" class="text-success"></iconify-icon>
			{:else if status === 'notfound' || status === 'error'}
				<iconify-icon icon="lucide:circle-x" width="15" class="text-error"></iconify-icon>
			{/if}
		</span>
	</label>

	{#if status === 'ok' && profile}
		<div
			class="flex items-center gap-2 rounded-field border border-success/30 bg-success/8 px-2.5 py-1.5"
		>
			<img src={profile.avatar_url} alt="" class="h-5 w-5 rounded-full" />
			<span class="font-mono text-xs font-semibold">{profile.login}</span>
			{#if profile.name}
				<span class="text-xs text-base-content/55">{profile.name}</span>
			{/if}
			<iconify-icon icon="lucide:badge-check" width="14" class="ml-auto text-success"
			></iconify-icon>
		</div>
	{:else if status === 'notfound'}
		<span class="text-xs text-error">No GitHub user named “{value.trim()}”.</span>
	{:else if status === 'error'}
		<span class="text-xs text-warning">Couldn't reach GitHub — try again in a moment.</span>
	{:else if status === 'checking'}
		<span class="text-[11px] text-base-content/50">Checking GitHub…</span>
	{:else}
		<span class="text-[11px] text-base-content/50">
			Your GitHub username — verified automatically.
		</span>
	{/if}
</div>
