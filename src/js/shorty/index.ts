import { RadixTree } from './radix-tree';

export type ShortcutID = string & { __SHORTY_TYPE_BRAND__: '__shorty_type_brand__' };

type ShortCut = { id: ShortcutID, name: string, callback: () => void };

export class Shorty {
    shortcuts: RadixTree<ShortCut> = new RadixTree();

    addShortcut(name: string, callback: () => void): ShortcutID {
        return '' as any
    }

    removeShortcut(id: ShortcutID): void {

    }
}
