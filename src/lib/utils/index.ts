import { browser, dev } from '$app/environment';
import { env } from '$env/dynamic/public';
import { DEFAULT_LOG_FORMATTER, DEFAULT_LOG_LEVEL_CLIENT, TOAST } from '$lib/constants.js';
import * as sftoast from 'svelte-french-toast';
import type { ValidationErrors } from 'sveltekit-superforms';

export function safeInt(str: string | undefined, defaultValue: number): number {
    if (!str) {
        return defaultValue;
    }
    const value = parseInt(str);
    if (isNaN(value)) {
        return defaultValue;
    }
    return value;
}

const logLevel = safeInt(env.PUBLIC_LOG_LEVEL_SK_CLIENT, DEFAULT_LOG_LEVEL_CLIENT);

export function createLogger(level: number, dev: boolean = false, formatter: Intl.DateTimeFormat = DEFAULT_LOG_FORMATTER) {
    function setFormatter(value: Intl.DateTimeFormat) {
        formatter = value;
    }

    function setDev(value: boolean) {
        dev = value;
    }

    function setLevel(value: number) {
        level = value;
    }

    function currentDate(): string {
        return formatter.format(Date.now());
    }

    const logger = {
        /**
         * Logs only in development mode
         */
        dev(...args: any[]) {
            if (dev || level >= 5) {
                console['debug'](`${currentDate()} [DEBUG]`, ...args);
            }
        },
        /**
         * Logs in development mode or when log level is 4 or higher
         */
        debug(...args: any[]) {
            if (dev || level >= 4) {
                console['debug'](`${currentDate()} [DEBUG]`, ...args);
            }
        },
        /**
         * Logs in development mode or when log level is 3 or higher
         */
        info(...args: any[]) {
            if (level >= 3) {
                console['info'](`${currentDate()} [INFO]`, ...args);
            }
        },
        /**
         * Logs when log level is 2 or higher
         */
        warn(...args: any[]) {
            if (level >= 2) {
                console['warn'](`${currentDate()} [WARN]`, ...args);
            }
        },
        /**
         * Logs when log level is 1 or higher
         */
        error(...args: any[]) {
            if (level >= 1) {
                console['error'](`${currentDate()} [ERROR]`, ...args);
            }
        },
        /**
         * Logs always
         */
        fatal(...args: any[]) {
            console['error'](`${currentDate()} [FATAL]`, ...args);
        },
        /**
         * Logs always
         */
        core(...args: any[]) {
            console['log'](`${currentDate()} [CORE]`, ...args);
        }
    };

    return {
        logger,
        setFormatter,
        setDev,
        setLevel
    };
}

export const { logger: log } = createLogger(logLevel, dev);

export function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).catch(log.error);
}

type AnyTuple = [] | [any, ...any[]];

export function debounced<A extends AnyTuple, EA extends AnyTuple>(
    fn: (...args: [...A, ...EA]) => void, delay: number, ...extraArgs: EA
) {
    let timeoutId: ReturnType<typeof setTimeout> | undefined = undefined;

    function _debounced(...args: A) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args, ...extraArgs), delay);
    }

    _debounced.cancel = () => clearTimeout(timeoutId);

    return _debounced;
}

/**
 * Register a callback to be called when the user first interacts with the page.
 * If the user has already interacted, the callback is called immediately.
 *
 * Safe to call in server side code, it does nothing and returns a noop.
 */
export const onFirstUserInteraction = (() => {
    if (!browser) {
        return () => () => { };
    }
    let interacted = false;

    const userInteractionCallbacks = new Set<() => void>();

    const userInteractionEvents = [
        'keydown',
        'pointerdown',
    ];

    function handler() {
        interacted = true;
        for (const cb of userInteractionCallbacks) {
            cb();
        }
        userInteractionCallbacks.clear();
        for (const event of userInteractionEvents) {
            document.removeEventListener(event, handler);
        }
    }

    for (const event of userInteractionEvents) {
        document.addEventListener(event, handler);
    }

    function noop() { }

    function addListener(cb: () => void) {
        if (interacted) {
            cb();
            return noop;
        }

        userInteractionCallbacks.add(cb);
        return () => userInteractionCallbacks.delete(cb);
    }

    return addListener;
})();

export function slugify(text: string, space: '' | '-' | '_' = '-'): string {
    return text
        .toLowerCase()
        .replace(/ /g, space)
        .replace(/[^\w-]+/g, '');
}

export function toastFormLevelErrors<T extends Record<string, unknown>>(errors: ValidationErrors<T>) {
    if (!errors._errors || errors._errors.length === 0) {
        return false;
    }

    sftoast.toast.error(String(errors._errors), { duration: TOAST.DURATION_ERROR });
    return true;
}

export const toast = {
    error: (message: sftoast.Renderable) => sftoast.toast.error(message, { duration: TOAST.DURATION_ERROR }),
    info: (message: sftoast.Renderable) => sftoast.toast.success(message, { duration: TOAST.DURATION_INFO, icon: '📨' }),
    success: (message: sftoast.Renderable) => sftoast.toast.success(message, { duration: TOAST.DURATION_SUCCESS }),
    warn: (message: sftoast.Renderable) => sftoast.toast.success(message, { duration: TOAST.DURATION_WARNING, icon: '🚧' }),
    formLevelErrors: toastFormLevelErrors,
};
