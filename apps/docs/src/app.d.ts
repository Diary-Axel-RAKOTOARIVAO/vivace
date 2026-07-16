// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { D1Database } from '@cloudflare/workers-types';

declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		interface Platform {
			env?: {
				DB: D1Database;
				/** Turnstile secret; unset locally = official test secret (always passes). */
				TURNSTILE_SECRET_KEY?: string;
			};
		}
	}
}

export {};
