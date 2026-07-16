<script lang="ts">
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';

	const app = `// App.tsx
import { useEffect } from 'react'
import Vivace from 'vivace-css'
import 'vivace-css/vivace.css'

export default function App() {
  useEffect(() => {
    Vivace.init()
    return () => Vivace.destroy()
  }, [])

  return <Page />
}`;

	const markup = `<h1 data-viv="@fd @sl-y_ease-out-expo">Hello</h1>

<ul data-viv="@fd_child-ascend" data-viv-on="appearing">
  {items.map((item) => (
    <li key={item.id}>{item.label}</li>
  ))}
</ul>`;

	const next = `// app/vivace-provider.tsx
'use client'

import { useEffect } from 'react'
import Vivace from 'vivace-css'

export function VivaceProvider() {
  useEffect(() => {
    Vivace.init()
    return () => Vivace.destroy()
  }, [])
  return null
}

// app/layout.tsx
import 'vivace-css/vivace.css'
import { VivaceProvider } from './vivace-provider'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <VivaceProvider />
        {children}
      </body>
    </html>
  )
}`;

	const programmatic = `import { useRef } from 'react'
import Vivace from 'vivace-css'

function Card() {
  const ref = useRef<HTMLDivElement>(null)
  return (
    <>
      <div ref={ref} data-viv="@pop">…</div>
      <button onClick={() => ref.current && Vivace.trigger(ref.current)}>
        replay
      </button>
    </>
  )
}`;
</script>

<svelte:head>
	<title>React — Vivace</title>
</svelte:head>

<h1>React / Next.js</h1>

<p>Initialize once at the root in a <code>useEffect</code>:</p>

<CodeBlock lang="tsx" code={app} />

<Callout kind="note">
	<p>
		<code>init()</code> is idempotent and <code>destroy()</code> is the cleanup, so React 18/19
		StrictMode's double-invoke is harmless.
	</p>
</Callout>

<p>Annotate JSX with the same attributes — <code>data-*</code> passes straight through:</p>

<CodeBlock lang="tsx" code={markup} />

<h2>Next.js (App Router)</h2>

<p>
	Effects only run on the client, so wrap the init in a small client component and render it once
	in the root layout:
</p>

<CodeBlock lang="tsx" code={next} />

<h2>Re-renders & route changes</h2>

<p>
	React replacing DOM nodes is exactly what the MutationObserver watches for — newly mounted
	elements register themselves, and unmounted ones release automatically (the registry holds them
	weakly). Conditional rendering, suspense boundaries and client-side navigation all just work.
</p>

<h2>Programmatic control</h2>

<CodeBlock lang="tsx" code={programmatic} />
