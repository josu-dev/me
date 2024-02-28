type ClickTypeMap = {
    click: MouseEvent;
    pointerdown: PointerEvent;
    pointerup: PointerEvent;
};

export type UseClickOutsideOptions<K extends keyof ClickTypeMap> = {
    type?: K;
    handler: (event: ClickTypeMap[K]) => void;
    exclude?: HTMLElement;
};

export function clickoutside<K extends keyof ClickTypeMap>(el: HTMLElement, options: UseClickOutsideOptions<K>) {
    const document = el.ownerDocument;
    let eventType = (options.type || "click") as K;
    let eventHandler = options.handler;

    function onPointer(event: ClickTypeMap[K]) {
        if (!el.contains(event.target as Node) && !event.defaultPrevented && (!options.exclude || !options.exclude.contains(event.target as Node))) {
            eventHandler(event);
        }
    }

    const config = { passive: false, capture: true };
    document.addEventListener(eventType, onPointer, config);

    return {
        destroy() {
            document.removeEventListener(eventType, onPointer, config);
        },
        update(newOptions: Partial<UseClickOutsideOptions<K>>) {
            if (!newOptions.type) {
                newOptions.type = eventType;
            }
            if (newOptions.type !== eventType) {
                document.removeEventListener(eventType, onPointer, config);
                eventType = newOptions.type;
                document.addEventListener(eventType, onPointer, config);
            }
            if (newOptions.handler) {
                eventHandler = newOptions.handler;
            }
        }
    };
}
