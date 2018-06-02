import { Record, Map } from 'immutable';
import uuid from 'uuid/v4';

export type CounterID = string & { '__ID_TYPE__': 'counter' };

export function isCounterID(counterID: any): counterID is CounterID {
    return typeof counterID === 'string';
}

type CounterProps = {
    id: CounterID;
    currentValue: number;
    maxValue: number;
    minValue: number;
}

type CounterInitialiser = Partial<Pick<CounterProps, 'currentValue' | 'maxValue' | 'minValue'>>;

export class Counter extends Record<CounterProps>({
    id: '!!NOT INITIALISED!!' as CounterID,
    currentValue: 0,
    maxValue: Infinity,
    minValue: -Infinity,
}) {
    constructor(init?: CounterInitialiser | number) {
        const id = uuid() as CounterID;

        if (init == null) {
            super({ id });
        } else if (typeof init === 'number') {
            super({ id, maxValue: init, minValue: 0, currentValue: init });
        } else {
            let currentValue = 0;
            if (init.currentValue != null) {
                currentValue = init.currentValue;
            } else if (init.maxValue != null) {
                currentValue = init.maxValue;
            } else if (init.minValue != null) {
                currentValue = init.minValue;
            }

            super({ id, ...init, currentValue });
        }
    }
}

type COUNT_ACTIONS
    = { type: '@COUNTER/MODIFY', counterId: CounterID, by: number }
    | { type: '@COUNTER/SET_TO', counterId: CounterID, to: number }
    | { type: '@COUNTER/CREATE', counter: Counter };

export function createCounter(counter: Counter): COUNT_ACTIONS {
    return { type: '@COUNTER/CREATE', counter };
}

export function changeCounter(counter: Counter | CounterID, change: number): COUNT_ACTIONS {
    const counterId = counter instanceof Counter ? counter.id : counter;
    return { type: '@COUNTER/MODIFY', counterId, by: change };
}

export function setCounterTo(counter: Counter | CounterID, value: number): COUNT_ACTIONS {
    const counterId = counter instanceof Counter ? counter.id : counter;
    return { type: '@COUNTER/SET_TO', counterId, to: value };
}

type CounterDict = Map<CounterID, Counter>;

export function countReducer(state: CounterDict = Map(), action: COUNT_ACTIONS): CounterDict {
    switch (action.type) {
        case '@COUNTER/CREATE':
            return state.set(action.counter.id, action.counter);
        case '@COUNTER/MODIFY': {
            const counter = state.get(action.counterId) as Counter;
            return state.set(counter.id, counter.set('currentValue', counter.currentValue + action.by));
        }
        case '@COUNTER/SET_TO': {
            const counter = state.get(action.counterId) as Counter;
            return state.set(counter.id, counter.set('currentValue', action.to));
        }
    }
}
