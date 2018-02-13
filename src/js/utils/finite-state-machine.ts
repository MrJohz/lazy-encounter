import { action, observable } from 'mobx';

type NoArgCB<T> = () => T;
type ArgCB<U, T> = (arg: U) => T;

function iife<T>(func: () => T): T {
    return func();
}

export class FiniteStateMachine<T> {
    @observable
    public state: T;

    constructor(initial: T) {
        this.state = initial;
    }

    transition(callback: NoArgCB<T>): NoArgCB<void>;
    transition<U>(callback: ArgCB<U, T>): ArgCB<U, void>;
    transition(to: T): void;
    transition<U>(argument: ArgCB<U, T> | T): void | ArgCB<U, void> {
        if (typeof argument === 'function') {
            return action((arg: U) => {
                this.state = argument(arg);
            });
        } else {
            iife(action(() => {
                // need to wrap state change in an action
                // but we don't want to wrap entire transition function
                // in an action, because a transition doesn't always
                // happen (i.e. if callback passed)
                this.state = argument;
            }));
        }
    }

}
