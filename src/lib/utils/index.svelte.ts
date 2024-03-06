import type { Writable } from 'svelte/store';

export function storeWith$state<T, S extends Writable<T>>(store: S): S & { value: T; } {
    let signal = $state<T>();
    const unsub = store.subscribe(v => { signal = v; });

    $effect(() => unsub);

    return {
        ...store,
        get value() { return signal as T; },
        set value(v: T) { store.set(v); }
    };
}
