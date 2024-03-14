import { writable } from 'svelte/store';
import { getLocallySyncqued } from '$lib/utils/local_storage.js';

function createUserViewTimeStore() {
    // roughly 30fps
    const tick_rate = 33;
    const persist_rate = 60 * 1000;

    const local_viewed = getLocallySyncqued({
        key: 'user_viewed_time',
        fallback: { acc: 0, first_visit: Date.now() },
        beforeUnload: () => {
            local_viewed.value.acc = Date.now() - last_time + acc_time;
        },
    });

    const stored = local_viewed.value;
    let acc_time = stored.acc;
    let last_time = Date.now();
    let last_save = last_time;
    let update_id: ReturnType<typeof setInterval>;

    const _state = {
        days: 0,
        hours: 0,
        mins: 0,
        secs: 0,
        human: '00m 00s',
        firstVisit: new Date(stored.first_visit),
    };

    const value = writable(_state, () => {
        if (typeof window === "undefined") {
            return;
        }

        update_id = setInterval(update, tick_rate);

        return () => {
            clearInterval(update_id);
        };
    });

    function update() {
        const now = Date.now();
        acc_time = now - last_time + acc_time;
        last_time = now;

        const secs = Math.floor(acc_time / 1000) % 60;
        const mins = Math.floor(acc_time / 60_000) % 60;
        const hours = Math.floor(acc_time / 3_600_000) % 24;
        const days = Math.floor(acc_time / 86_400_000);

        _state.days = days;
        _state.hours = hours;
        _state.mins = mins;
        _state.secs = secs;
        _state.human = days
            ? `${days.toString()}d ${hours.toString().padStart(2, '0')}h`
            : hours
                ? `${hours.toString().padStart(2, '0')}h ${mins.toString().padStart(2, '0')}m`
                : `${mins.toString().padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`;

        value.set(_state);

        if ((now - last_save) > persist_rate) {
            last_save = now;
            stored.acc = now - last_time + acc_time;
            local_viewed.sync();
        }
    }

    update();

    return {
        subscribe: value.subscribe,
    };
}

export const userViewTime = createUserViewTimeStore();
