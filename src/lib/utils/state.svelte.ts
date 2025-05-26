import { untrack } from 'svelte';


function noop() {};

export type MutableReader<T> = () => T;

type MutableUpdater<T> = (prev: T) => T;

export type MutableSetter<T> = (value: T | MutableUpdater<T>) => T;

export type Mutable<T> = {
    read: MutableReader<T>,
    set: MutableSetter<T>;
};

export type  MutableOptions<T> = {
    onset?: (value: T) => void;
}

export function mutable<T>(initial: T, opts?: MutableOptions<T>): Mutable<T> {
    let _value = $state(initial);
    const {onset = noop} = opts ?? {};

    function read(): T {
        return _value;
    }

    function set(value: T | MutableUpdater<T>): T {
        const prev = _value;
        const next = typeof value === 'function' ? (value as MutableUpdater<T>)(_value) : value
        _value = next;
        onset(next);
        return _value;
    }

    return { read, set };
}

export function effect_once(fn: () => (void | (() => void))): void {
    $effect(() => {
        const cleanup = untrack(fn);
        return cleanup;
    });
}
