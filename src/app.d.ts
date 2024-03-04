// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
            userPrefs: {
                fontFamily: string;
            }
        }
		interface PageData {
            userPrefs?: {
                fontFamily?: string;
                theme?: string;
            }
        }
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
