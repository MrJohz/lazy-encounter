import EventEmitter from 'eventemitter3';

import { Adaptor, DocumentAdaptor } from './adaptors';
import { ESCAPE } from './constants';
import { RadixTree } from './radix-tree';

export { DocumentAdaptor, DOMElementAdaptor } from './adaptors';

export class ShortcutHandle {
    private ee: EventEmitter = new EventEmitter();
    public keys: string[] = [];

    constructor(private name: string) {
    }

    on(event: 'keys:start', callback: (keys: string[]) => void): void;
    on(event: 'keys:continue', callback: (keys: string[]) => void): void;
    on(event: 'keys:discontinue', callback: () => void): void;
    on(event: 'keys:end', callback: () => void): void;
    on(event: 'shortcut:change', callback: (keys: string[]) => void): void;
    on(event: string, callback: any): void {
        this.ee.addListener(event, callback);
    }

    private emit(event: 'keys:start', keys: string[]): void;
    private emit(event: 'keys:continue', keys: string[]): void;
    private emit(event: 'keys:discontinue'): void;
    private emit(event: 'keys:end'): void;
    private emit(event: 'shortcut:change', keys: string[]): void;
    private emit(event: string, ...arg: any[]): void {
        switch (event) {
            case 'shortcut:change':
                this.keys = arg[0];
                break;
        }

        this.ee.emit(event, ...arg);
    }
}

function createId(name: string, id?: number): string {
    return name
            .toLowerCase()
            .replace(/\./, '')
        + (typeof id === 'undefined' ? '' : '' + id);
}

export class Shorty {
    private shortcuts: RadixTree<ShortcutHandle> = new RadixTree();
    private handles: Map<string, ShortcutHandle[]> = new Map();
    private activeKeypresses: string[] = [];
    private activeShortcuts: ShortcutHandle[] = [];
    private adaptor: Adaptor;

    constructor(adaptor?: Adaptor) {
        this.adaptor = adaptor || new DocumentAdaptor(document);
        this.adaptor.register((key: string) => this.onKeypress(key));
    }

    addShortcut(name: string): ShortcutHandle {
        const handle = new ShortcutHandle(name);
        const shortcutId = createId(name);
        const handleList = this._getHandleList(shortcutId);
        handleList.push(handle);
        this.shortcuts.add(shortcutId + handleList.length, handle);

        this._updateHandles();
        return handle;
    }

    removeShortcut(handle: ShortcutHandle): void {
        const shortcutId = createId(handle['name']);
        const handleList = this._getHandleList(shortcutId);
        const handleId = handleList.indexOf(handle);

        handleList.splice(handleId, 1);
        this.shortcuts.remove(shortcutId + (handleId + 1));
    }

    private onKeypress(key: string): void {
        if (key === ESCAPE) {
            for (const shortcut of this.activeShortcuts) {
                shortcut['emit']('keys:discontinue');
            }
            this.activeShortcuts = [];
            this.activeKeypresses = [];
        }

        if (key === '.') {
            key = '';  // use period as end key
        }

        this.activeKeypresses.push(key);
        const newShortcuts = this.shortcuts.startsWithUnique(this.activeKeypresses);
        if (this.activeKeypresses.length === 1) {  // first key press
            for (const shortcut of newShortcuts) {
                shortcut['emit']('keys:start', this.activeKeypresses);
            }
        } else {
            for (const shortcut of this.activeShortcuts) {
                if (newShortcuts.indexOf(shortcut) > -1) {
                    shortcut['emit']('keys:continue', this.activeKeypresses);
                } else {
                    shortcut['emit']('keys:discontinue');
                }
            }
        }

        if (newShortcuts.length === 1) {
            newShortcuts[0]['emit']('keys:end');
            this.activeKeypresses = [];
            this.activeShortcuts = [];
        } else if (newShortcuts.length === 0) {
            this.activeKeypresses = [];
            this.activeShortcuts = [];
        } else {
            this.activeShortcuts = newShortcuts;
        }
    }

    private _getHandleList(name: string): ShortcutHandle[] {
        const handleList = this.handles.get(name);
        if (!handleList) {
            const newHandleList: ShortcutHandle[] = [];
            this.handles.set(name, newHandleList);
            return newHandleList;
        }

        return handleList;
    }

    private _updateHandles() {
        for (const [key, handleList] of this.handles) {
            for (const [idx, handle] of handleList.entries()) {
                const shortcutId = createId(key, idx + 1);
                const chars = this.shortcuts.uniqueChars(shortcutId);
                if (!chars) throw new Error(`invalid state - cannot find handle for '${handle['name']}' (as '${shortcutId}')`);
                handle['emit']('shortcut:change', chars.map(x => x || '.'));  // replace empty character with period
            }
        }
    }
}
