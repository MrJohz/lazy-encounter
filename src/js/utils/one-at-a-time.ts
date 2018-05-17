import { EventEmitter } from 'eventemitter3';

export type OneItemHandle = { remove: () => void };
export type OneItemInstance<T> = OneItemInstanceClass<T>;  // hide constructor (I think?)

class OneItemInstanceClass<T> {

    private ee = new EventEmitter();
    private lastState = false;

    constructor(private parent: OneItem<T>, private name: T) {}

    private emitChange() {
        if (this.state() === this.lastState) return;

        this.lastState = this.state();
        this.ee.emit('change', this.state(), this);
    }


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
        for (const instance of this.parent.instances) {
            instance.emitChange();
        }
    }

    invert() {
        this.set(!this.state());
    }

}

export class OneItem<T> {

    selected: null | T = null;

    instances: OneItemInstance<T>[] = [];

    instance(name: T): OneItemInstance<T> {
        const instance = new OneItemInstanceClass(this, name) as OneItemInstance<T>;
        this.instances.push(instance);
        return instance;
    }

}
