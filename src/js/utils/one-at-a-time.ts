import { observable, action } from 'mobx';

export type OneItemInstance<T> = OneItemInstanceClass<T> & { '__TYPE_BRAND__': 'instance' };

export class OneItemInstanceClass<T> {

    constructor(private parent: OneItem<T>, private name: T) {}

    state() {
        return this.parent.selected === this.name;
    }

    @action
    set(state: boolean) {
        if (state === this.state()) return;  // no need to change the current state

        this.parent.selected = state === true ? this.name : null;
    }

    invert() {
        this.set(!this.state());
    }

}

export class OneItem<T> {

    @observable
    selected: null | T = null;

    instance(name: T): OneItemInstance<T> {
        return new OneItemInstanceClass(this, name) as OneItemInstance<T>;
    }

}
