<script lang="ts">
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	const app = `<!-- App.vue -->
<script setup>
import { onMounted, onUnmounted } from 'vue'
import Vivace from 'vivace'
import 'vivace/vivace.css'

onMounted(() => Vivace.init())
onUnmounted(() => Vivace.destroy())
<\/script>

<template>
  <RouterView />
</template>`;

	const markup = `<h1 data-viv="@fd @sl-y_ease-out-expo">Hello</h1>

<ul data-viv="@fd_child-ascend" data-viv-on="appearing">
  <li v-for="item in items" :key="item.id">{{ item.label }}</li>
</ul>`;

	const nuxt = `// plugins/vivace.client.ts
import Vivace from 'vivace'
import 'vivace/vivace.css'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('app:mounted', () => Vivace.init())
})`;

	const programmatic = `<script setup>
import { useTemplateRef } from 'vue'
import Vivace from 'vivace'

const box = useTemplateRef('box')
<\/script>

<template>
  <div ref="box" data-viv="@pop">…</div>
  <button @click="box && Vivace.trigger(box)">replay</button>
</template>`;
</script>

<svelte:head>
	<title>Vue — Vivace</title>
</svelte:head>

<h1>Vue / Nuxt</h1>

<p>Initialize once in your root component's mount lifecycle:</p>

<CodeBlock lang="vue" code={app} />

<p>Annotate templates directly — plain attributes, no directive needed:</p>

<CodeBlock lang="vue" code={markup} />

<h2>Nuxt</h2>

<p>Register it as a client-only plugin so it never touches the server render:</p>

<CodeBlock lang="typescript" code={nuxt} />

<h2>v-if, v-for and route changes</h2>

<p>
	Vue mounting new DOM is picked up by the engine's MutationObserver — elements rendered by
	<code>v-if</code>, list insertions and page navigations register themselves. Nothing to call in
	individual components.
</p>

<h2>Programmatic control</h2>

<CodeBlock lang="vue" code={programmatic} />
