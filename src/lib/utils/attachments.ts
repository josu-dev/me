import type { Attachment } from 'svelte/attachments';


type DebouncedInputOptions = {
    oninput: (v: string) => void;
    delay: number;
};

export function debounced_input({ oninput, delay }: DebouncedInputOptions): Attachment<HTMLInputElement> {
    let id: ReturnType<typeof setTimeout>;
    function wrapper(ev: Event) {
        clearTimeout(id);
        id = setTimeout(oninput, delay, (ev.target as HTMLInputElement).value);
    }

    return function (el: HTMLInputElement) {
        el.addEventListener('input', wrapper);
        return () => {
            clearTimeout(id);
            el.removeEventListener('input', wrapper);
        };
    };
}
