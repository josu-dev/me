// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		
        interface Locals {
            userPrefs: {
                fontFamily?: string;
                sitebar?: boolean;
                theme?: string;
            }
        }

		interface PageData {
            userPrefs?: {
                fontFamily?: string;
                theme?: string;
                sitebar?: boolean;
            }
        }
		
        // interface PageState {}
		// interface Platform {}
	}
}

export {};
