import { browser } from '$app/environment';

function parse_value<T>(value: string | null, fallback: T): T {
    if (value === null) {
        return fallback;
    }

    try {
        return JSON.parse(value);
    }
    catch (error) {
        console.error('Error parsing user storage', error);
        return fallback;
    }
}

function save_value<T>(key: string, value: T, storage: Storage) {
    try {
        storage.setItem(key, JSON.stringify(value));
    }
    catch (error) {
        console.error('Error saving to user storage', error);
    }
}

type LocallySyncqued<T, K extends string = string> = {
    readonly key: K;
    value: T;
    saveOnUnload: boolean;
    set: (value: T, sync?: boolean) => void;
    sync: () => void;
    beforeUnload?: () => void;
    reset: () => void;
    unregister: () => void;
    register: () => void;
    onChange?: (value: T) => void;
};

const registered_syncqueds = new Map<string, LocallySyncqued<any>>();

function save_values() {
    for (const syncqued of registered_syncqueds.values()) {
        syncqued.beforeUnload?.();

        if (!syncqued.saveOnUnload) {
            continue;
        }

        save_value(syncqued.key, syncqued.value, localStorage);
    }
}

if (browser) {
    window.addEventListener('beforeunload', save_values);
}

type LocallySyncquedOptions<T, K extends string = string> = {
    key: K;
    fallback: T;
    autoRegister?: boolean;
    beforeUnload?: () => void;
    saveOnUnload?: boolean;
    onChange?: (value: T) => void;
};

function noop() { }

export function getLocallySyncqued<T, K extends string>(options: LocallySyncquedOptions<T, K>): LocallySyncqued<T, K> {
    const { key, fallback, autoRegister = true } = options;

    if (!browser) {
        return {
            key,
            value: fallback,
            saveOnUnload: false,
            beforeUnload: noop,
            reset: noop,
            set: noop,
            sync: noop,
            register: noop,
            unregister: noop,
        };
    }

    let synqued = registered_syncqueds.get(key) as LocallySyncqued<T, K> | undefined;
    if (synqued) {
        return synqued;
    }

    let _value = parse_value(localStorage.getItem(key), fallback);

    synqued = {
        key,
        saveOnUnload: options.saveOnUnload ?? true,
        get value() {
            return _value;
        },
        set(value, sync = true) {
            _value = value;
            if (sync) {
                save_value(key, _value, localStorage);
            }
            synqued!.onChange?.(_value);
        },
        sync() {
            save_value(key, _value, localStorage);
        },
        beforeUnload: options.beforeUnload ?? noop,
        reset() {
            _value = fallback;
            save_value(key, _value, localStorage);
            synqued!.onChange?.(_value);
        },
        unregister() {
            registered_syncqueds.delete(key);
        },
        register() {
            registered_syncqueds.set(key, synqued!);
        },
        onChange: options.onChange,
    };

    if (autoRegister) {
        registered_syncqueds.set(key, synqued);
    }

    return synqued;
}
