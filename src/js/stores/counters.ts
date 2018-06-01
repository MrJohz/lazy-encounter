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

export class Counter extends Record<CounterProps>({
    id: '!!NOT INITIALISED!!' as CounterID,
    currentValue: 0,
    maxValue: 0,
    minValue: 0,
}) {
    constructor(maxValue: number) {
        const id = uuid() as CounterID;
        super({ id, maxValue, minValue: 0, currentValue: maxValue });
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
