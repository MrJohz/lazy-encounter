import { RadixTree } from './radix-tree';
import EventEmitter from 'eventemitter3';

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

export class Shorty {
    private shortcuts: RadixTree<ShortcutHandle> = new RadixTree();
    private handles: Map<string, ShortcutHandle[]> = new Map();

    addShortcut(name: string): ShortcutHandle {
        const handle = new ShortcutHandle(name);
        const lcName = name.toLowerCase();
        const handleList = this._getHandleList(lcName);
        handleList.push(handle);
        this.shortcuts.add(lcName + handleList.length, handle);

        this._updateHandles();
        return handle;
    }

    // removeShortcut(id: ShortcutHandle): void {
    //     const x = new ShortcutHandle(new EventEmitter(), 'test', ['m']);
    //     x.on('keys:continue', (name: string[]) => {
    //     });
    // }

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
                const chars = this.shortcuts.uniqueChars(key + (idx + 1));
                if (!chars) throw new Error(`invalid state - cannot find handle for '${handle['name']}' (as '${key + (idx + 1)}')`);
                handle['emit']('shortcut:change', chars);
            }
        }
    }
}
