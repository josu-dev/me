type ClickTypeMap = {
    click: MouseEvent;
    pointerdown: PointerEvent;
    pointerup: PointerEvent;
};

type UseClickOutsideOptions<K extends keyof ClickTypeMap> = {
    type?: K;
    handler: (event: ClickTypeMap[K]) => void;
    exclude?: HTMLElement;
};

export function clickoutside<K extends keyof ClickTypeMap>(el: HTMLElement, options: UseClickOutsideOptions<K>) {
    const document = el.ownerDocument;
    let eventType = (options.type || "click") as K;
    let eventHandler = options.handler;

    function on_event(event: ClickTypeMap[K]) {
        if (!el.contains(event.target as Node) && !event.defaultPrevented && (!options.exclude || !options.exclude.contains(event.target as Node))) {
            eventHandler(event);
        }
    }

    const config = { passive: false, capture: true };
    document.addEventListener(eventType, on_event, config);

    return {
        destroy() {
            document.removeEventListener(eventType, on_event, config);
        },
        update(newOptions: Partial<UseClickOutsideOptions<K>>) {
            if (!newOptions.type) {
                newOptions.type = eventType;
            }
            if (newOptions.type !== eventType) {
                document.removeEventListener(eventType, on_event, config);
                eventType = newOptions.type;
                document.addEventListener(eventType, on_event, config);
            }
            if (newOptions.handler) {
                eventHandler = newOptions.handler;
            }
        }
    };
}

type UseEscapeKeyOptions = {
    handler: (event: KeyboardEvent) => void;
    preventDefault?: boolean;
};

export function escapekey(el: HTMLElement, options: UseEscapeKeyOptions) {
    function on_keydown(event: KeyboardEvent) {
        if (event.key === "Escape") {
            if (options.preventDefault) {
                event.preventDefault();
            }
            options.handler(event);
        }
    }

    el.ownerDocument.addEventListener("keydown", on_keydown);

    return {
        destroy() {
            el.ownerDocument.removeEventListener("keydown", on_keydown);
        },
        update(updated: Partial<UseEscapeKeyOptions>) {
            if (updated.handler) {
                options.handler = updated.handler;
            }
            if (updated.preventDefault !== undefined) {
                options.preventDefault = updated.preventDefault;
            }
        }
    };
}

type UseCopytoclipboardOptions = {
    text: string;
    onsuccess?: () => void;
    onerror?: (error: unknown) => void;
};

export function copytoclipboard(el: HTMLElement, options: UseCopytoclipboardOptions) {
    function on_click() {
        navigator
            .clipboard
            .writeText(options.text)
            .then(options.onsuccess, options.onerror);
    }

    const config = { passive: false, capture: true };

    el.addEventListener("click", on_click, config);

    return {
        destroy() {
            el.removeEventListener("click", on_click, config);
        },
        update(updated: Partial<UseCopytoclipboardOptions>) {
            if (updated.text !== undefined) {
                options.text = updated.text;
            }
            if (updated.onsuccess) {
                options.onsuccess = updated.onsuccess;
            }
            if (updated.onerror) {
                options.onerror = updated.onerror;
            }
        }
    };
}

type UseTouchsequenceOptions = {
    handler: (event: TouchEvent) => void;
    /**
     * Number of touches to trigger the handler.
     * 
     * Minimum value is 1.
     * 
     * @default 2
     */
    touches: number;
    /**
     * Maximum time between touches to consider them part of the same sequence
     * in milliseconds.
     * 
     * Minimum value is 0.
     * 
     * @default 300
     */
    threshold?: number;
};

export function touchsequence(el: HTMLElement, options: UseTouchsequenceOptions) {
    const DEFAULT_TOUCHES = 2;
    const DEFAULT_THRESHOLD = 300;

    if (options.touches < 1) {
        options.touches = DEFAULT_TOUCHES;
    }
    if (!options.threshold || options.threshold < 0) {
        options.threshold = DEFAULT_THRESHOLD;
    }

    let acc_touches = 0;
    let last_ts = 0;

    function on_touchstart(event: TouchEvent) {
        if (event.defaultPrevented) {
            return;
        }

        if ((event.timeStamp - last_ts) > options.threshold!) {
            acc_touches = 1;
            last_ts = event.timeStamp;
            return;
        }

        acc_touches += 1;
        last_ts = event.timeStamp;
        if (acc_touches < options.touches) {
            return;
        }

        options.handler(event);
        acc_touches = 0;
    }

    const config = { passive: false, capture: true };

    el.ownerDocument.addEventListener("touchstart", on_touchstart, config);

    return {
        destroy() {
            el.ownerDocument.removeEventListener("touchstart", on_touchstart, config);
        },
        update(updated: Partial<UseTouchsequenceOptions>) {
            if (updated.handler) {
                options.handler = updated.handler;
            }
            if (updated.touches !== undefined) {
                options.touches = updated.touches > 0 ? updated.touches : DEFAULT_TOUCHES;
            }
            if (updated.threshold !== undefined) {
                options.threshold = updated.threshold < 0 ? DEFAULT_THRESHOLD : updated.threshold;
            }
        }
    };
}
