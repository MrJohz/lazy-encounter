import { action, observable, runInAction } from 'mobx';

type NoArgCB<T> = () => T;
type ArgCB<U, T> = (arg: U) => T;

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
            runInAction(() => {
                this.state = argument;
            });
        }
    }

}
