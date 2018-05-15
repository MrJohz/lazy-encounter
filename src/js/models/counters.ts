import { observable } from 'mobx';

type CounterBaseConstructor = { maxValue: number, minValue?: number, currentValue?: number, countDown?: boolean };

export abstract class Counter {
    readonly maxValue: number;
    readonly minValue: number;
    readonly countDown: boolean;

    @observable
    currentValue: number;

    protected constructor({ maxValue, currentValue, minValue = 0, countDown = true }: CounterBaseConstructor) {
        this.maxValue = maxValue;
        this.minValue = minValue;
        this.currentValue = currentValue != null
            ? currentValue
            : countDown ? maxValue : minValue;
        this.countDown = countDown;
    }
}

export class NumberCounter extends Counter {
}

export class PipCounter extends Counter {
}

type HealthCounterConstructor = CounterBaseConstructor & { autoDead?: boolean };

export class HealthCounter extends NumberCounter {
    autoDead: boolean;

    constructor({ autoDead = true, ...props }: HealthCounterConstructor) {
        super(props);
        this.autoDead = autoDead;
    }
}
