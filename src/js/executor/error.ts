import { CounterID } from '../stores/counters';

export type Error =
    | { type: 'error', error: 'PARAMETER_NOT_FOUND', param: string }
    | { type: 'error', error: 'COUNTER_NOT_FOUND', counterID: CounterID }

export class InterpreterError extends Error {

    name = 'InterpreterError';

    constructor(public error: Error) {
        super(`Interpreter has failed due to error: ${error.error}`);
    }

}
