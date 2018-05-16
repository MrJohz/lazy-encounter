import { EventEmitter } from 'eventemitter3';

export type OneItemHandle = { remove: () => void };
export type OneItemInstance<T> = OneItemInstanceClass<T>;  // hide constructor (I think?)

class OneItemInstanceClass<T> {

    private ee = new EventEmitter();

    constructor(private parent: OneItem<T>, private name: T) {}

    listen(callback: (state: boolean, t: this) => void): OneItemHandle {
        this.ee.addListener('change', callback);
        return { remove: () => this.ee.removeListener('change', callback) };
    }

    state() {
        return this.parent.selected === this.name;
    }

    set(state: boolean) {
        if (state === this.state()) return;  // no need to change the current state

        this.parent.selected = state === true ? this.name : null;
        this.ee.emit('change', this.state(), this);
    }

    invert() {
        this.set(!this.state());
    }

}

export class OneItem<T> {

    selected: null | T = null;

    instance(name: T): OneItemInstance<T> {
        return new OneItemInstanceClass(this, name) as OneItemInstance<T>;
    }

}
