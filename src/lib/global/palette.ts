import { getUserPreferencesGlobal } from '$lib/global/preferences.svelte.js';
import { defineActionable, defineNavigable } from 'svelte-hypercommands';
import { log, toast } from '$lib/utils/index.js';
import { GITHUB_REPOSITORY } from '$lib/constants.js';

function noop() { }

const commandsNoCategory = defineActionable([
    {
        id: 'global:copy_current_url',
        name: 'Copiar URL actual',
        description: 'Copia la URL actual al portapapeles',
        shortcut: ['$mod+Shift+C'],
        onAction: () => {
            const currentURL = window.location.href;
            navigator.clipboard.writeText(currentURL).then(() => {
                toast.success(`URL copiada al portapapeles: ${currentURL}`);
            }, () => {
                toast.error('Error al copiar la URL al portapapeles');
            });
        }
    },
    {
        id: 'global:open_repository',
        name: 'Abrir repositorio',
        description: 'Abre el repositorio de GitHub',
        onAction: () => {
            window.open(GITHUB_REPOSITORY, '_blank', 'noopener,noreferrer');
        }
    }
]);

const commandsView = defineActionable([
    {
        id: 'global:toggle-site-menubar',
        name: 'Barra del sitio',
        category: 'Vista',
        description: 'Abre/cierra la barra de menus del sitio',
        shortcut: ['$mod+Shift+M'],
        onAction: () => {
            const p = getUserPreferencesGlobal();
            if (!p) {
                return;
            }
            p.sitebar.open = !p.sitebar.open;
        }
    },
    {
        id: 'global:fullscreen',
        name: 'Pantalla completa',
        category: 'Vista',
        description: 'Activa/desactiva el modo pantalla completa',
        shortcut: ['F11'],
        onAction: () => {
            if (document.fullscreenElement) {
                document.exitFullscreen().catch(noop);
                return;
            }

            document.body.requestFullscreen().catch((err) => {
                log.error('Error al activar el modo pantalla completa', err);
                toast.error('Error al activar el modo pantalla completa');
            });
        },
    }
]);


const commandsDev = defineActionable([
    {
        id: 'global:reload_window',
        name: 'Recargar ventana',
        category: 'Dev',
        description: 'Recargar la ventana actual',
        shortcut: ['$mod+Shift+R'],
        onAction: () => {
            window.location.reload();
        }
    },
    {
        id: 'global:admin_mode',
        name: 'Modo admin',
        category: 'Dev',
        description: 'Activa/desactiva el modo admin',
        onAction: () => {
            document.body.contentEditable =
                document.body.contentEditable === 'true' ? 'false' : 'true';
        }
    }
]);

export const globalCommands = [
    ...commandsNoCategory,
    ...commandsView,
    ...commandsDev
];

const localPages = defineNavigable([
    {
        url: '/',
        name: 'Inicio'
    },
    {
        url: '/blog',
        name: 'Blog'
    },
    {
        url: '/daily_quote',
        name: 'Cita diaria'
    },
    {
        url: '/repos',
        name: 'Proyectos publicos'
    },
    {
        url: '/about',
        name: 'Sobre mi'
    }
]);

export const globalPages = [
    ...localPages
];
