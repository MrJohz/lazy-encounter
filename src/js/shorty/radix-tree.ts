type LeafNode<T> = {
    __TYPE_BRAND__: 'leaf_node';
    parent: BranchNode<T> | RootNode<T>;
    name: string;
    value: T;
}

type BranchNode<T> = {
    __TYPE_BRAND__: 'branch_node';
    parent: BranchNode<T> | RootNode<T>;
    value: Map<string, LeafNode<T> | BranchNode<T>>;
}

type RootNode<T> = {
    __TYPE_BRAND__: 'root_node';
    value: Map<string, LeafNode<T> | BranchNode<T>>;
}

type Node<T> = RootNode<T> | BranchNode<T> | LeafNode<T>;

export const BLANK = '';

/**
 * A lot of this class is a reimplementation of https://gist.github.com/samuelclay/4674630 in TypeScript,
 * although with a handful of changes where it made sense given my particular needs
 */

export class RadixTree<T> {
    private root: RootNode<T> = { value: new Map() } as RootNode<T>;

    add(key: string, value: T) {
        this._add(this.root, key, key, value);
    }

    get(key: string): T | null {
        return this._get(this.root, key, key);
    }

    remove(key: string): boolean {
        return this._remove(this.root, key);
    }

    uniqueChars(key: string): string[] | null {
        return this._uniqueChars(this.root, key, key, []);
    }

    findByUnique(chars: string[]): T | null {
        return this._findByUnique(this.root, chars);
    }

    startsWithUnique(chars: string[]): T[] {
        return this._startsWithUnique(this.root, chars);
    }

    private _add(node: BranchNode<T> | RootNode<T>, originalKey: string, key: string, value: T): void {

        // see if we can find a deeper node to match
        for (let len = key.length; len >= 0; len--) {
            const prefix = key.substr(0, len);
            const subnode = node.value.get(prefix);
            if (subnode) {
                if (this._isLeaf(subnode)) {
                    // adding a suffix to an existing word
                    // e.g. when "map" exists, adding "maps"
                    // or adding an already existing word
                    // e.g. when "map" exists, adding "map"

                    if (subnode.name === originalKey) {
                        throw new Error(`key ${originalKey} already exists in this tree`);
                    }

                    const newChild = { parent: node, value: new Map() } as BranchNode<T>;
                    subnode.parent = newChild;
                    newChild.value.set('', subnode);
                    newChild.value.set(key.substr(len), {
                        parent: newChild,
                        name: originalKey,
                        value: value,
                    } as LeafNode<T>);

                    node.value.set(prefix, newChild);
                    return;
                }
                return this._add(subnode, originalKey, key.substr(len), value);
            }
        }

        for (const [prefix, child] of node.value) {
            let idx;  // hoist outside of following loop so we can access it later
            for (idx = 0; idx < key.length; idx++) {
                if (prefix[idx] !== key[idx]) break;
            }

            // if the prefix and the key are wholly different
            if (idx === 0) continue;

            // now we need to split a node
            const newPrefix = prefix.substr(0, idx);
            const newChild = { parent: node, value: new Map() } as BranchNode<T>;
            child.parent = newChild;
            newChild.value.set(prefix.substr(idx), child);
            newChild.value.set(key.substr(idx), { parent: newChild, name: originalKey, value: value } as LeafNode<T>);

            node.value.delete(prefix);
            node.value.set(newPrefix, newChild);
            return;
        }

        node.value.set(key, { parent: node, name: originalKey, value: value } as LeafNode<T>);
    }

    private _get(node: Node<T>, originalKey: string, key: string): T | null {
        if (this._isLeaf(node)) {
            return node.name === originalKey ? node.value : null;
        }

        for (const [prefix, child] of node.value) {
            // the empty string is an odd case - it matches as a prefix
            // but it can't be split out (because it has no characters)
            // ignore it for now, and we'll handle it later.
            if (prefix === '') continue;

            if (key.substr(0, prefix.length) === prefix) {
                return this._get(child, originalKey, key.substr(prefix.length));
            }
        }

        // we skipped the case of the empty string earlier
        // handle it here
        const maybeNode = node.value.get('');
        if (maybeNode) {
            return this._get(maybeNode, originalKey, '');
        }

        return null;
    }

    private _remove(node: RootNode<T> | BranchNode<T>, key: string): boolean {
        for (const [prefix, child] of node.value) {
            if (key.substr(0, prefix.length) === prefix) {
                if (this._isLeaf(child)) {

                    // this is a mess
                    // TODO: at some distant point, I should definitely try and clean this up
                    // TODO: at some even more distant point, I should rewrite this file

                    // basically, we've found a node that's a child of this one, that we believe matches the node
                    // that needs to be deleted
                    // so we delete it
                    // then we need to shrink the tree to ensure that the radix tree is still as compact as always
                    // so we look to see if this node has only one child
                    // because if that's the case we're going to need to shrink
                    // if that's the case, we convert this current node *in-place* (WTF? Why?)
                    // into the child node, and update the parent node *in-place* (again - WTF? Why?)
                    // so that it references this node with the correct name

                    node.value.delete(prefix);

                    if (node.value.size === 1 && !this._isRoot(node)) {
                        const [childKey, otherChild] = Array.from(node.value.entries())[0];  // get the other child of this node

                        let newKey = '';
                        let parentKey = '';
                        for (const [pk, child] of node.parent.value.entries()) {
                            if (child === node) {
                                parentKey = pk;
                                newKey = pk + childKey;
                            }
                        }

                        if (this._isLeaf(otherChild)) {
                            (node as any).name = otherChild.name;
                        }
                        (node as any).value = otherChild.value;
                        node.parent.value.delete(parentKey);
                        node.parent.value.set(newKey, node);
                    }

                    return true;
                }

                return this._remove(child, key.substr(prefix.length));
            }
        }

        return false;
    }

    private _uniqueChars(node: Node<T>, originalKey: string, key: string, acc: string[]): string[] | null {
        if (this._isLeaf(node)) {
            return node.name === originalKey ? acc : null;
        }

        for (const [prefix, child] of node.value) {
            // the empty string is an odd case - it matches as a prefix
            // but it can't be split out (because it has no characters)
            // ignore it for now, and we'll handle it later.
            if (prefix === '') continue;

            if (key.substr(0, prefix.length) === prefix) {

                return this._uniqueChars(child, originalKey, key.substr(prefix.length), [...acc, prefix[0]]);
            }
        }

        // we skipped the case of the empty string earlier
        // handle it here
        const maybeNode = node.value.get('');
        if (maybeNode) {
            return this._uniqueChars(maybeNode, originalKey, '', [...acc, BLANK]);
        }

        return null;
    }

    private _findByUnique(node: Node<T>, chars: string[]): T | null {
        if (this._isLeaf(node)) {
            return node.value;
        }

        for (const [prefix, child] of node.value) {
            if (prefix === '' && chars[0] === BLANK || chars[0] === prefix[0]) {
                return this._findByUnique(child, chars.slice(1));
            }
        }

        return null;
    }

    private _startsWithUnique(node: Node<T>, chars: string[]): T[] {
        if (chars.length === 0) {
            return this._getAllChildren(node);
        }

        /* istanbul ignore if: this should never be called */
        if (this._isLeaf(node)) {
            throw new Error(`Leaf node found in a place it should not be`);
        }

        for (const [prefix, child] of node.value) {
            if (prefix === '' && chars[0] === BLANK || chars[0] === prefix[0]) {
                return this._startsWithUnique(child, chars.slice(1));
            }
        }

        return [];
    }

    private _getAllChildren(node: Node<T>): T[] {
        if (this._isLeaf(node)) {
            return [node.value];
        } else {
            const children = [];
            for (const [_, child] of node.value.entries()) {
                children.push(...this._getAllChildren(child));
            }

            return children;
        }
    }

    private _isRoot(node: Node<T>): node is RootNode<T> {
        return !('parent' in node);
    }

    private _isLeaf(node: Node<T>): node is LeafNode<T> {
        return 'name' in node;
    }
}
