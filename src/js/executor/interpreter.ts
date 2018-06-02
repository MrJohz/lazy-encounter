import { Store } from 'redux';

import { AppState } from '../stores';
import { setCounterTo, Counter, isCounterID, changeCounter } from '../stores/counters';
import { Expression, Statement, OperatorExpression } from './ast';
import { InterpreterError } from './error';

export type Context =
    { [key: string]: number }

export class ContextualInterpreter {
    constructor(private store: Store<AppState>, private context: Context) {}

    execute(script: Statement[]) {
        for (const stmt of script) {
            this.executeStatement(stmt);
        }
    }

    executeStatement(stmt: Statement): void {
        switch (stmt.action) {
            case 'set':
                this.store.dispatch(setCounterTo(stmt.counter, this.evaluateExpression(stmt.value)));
                break;
            case 'add':
                this.store.dispatch(changeCounter(stmt.counter, this.evaluateExpression(stmt.value)));
                break;
            case 'subtract':
                this.store.dispatch(changeCounter(stmt.counter, -this.evaluateExpression(stmt.value)));
                break;
        }
    }

    private evaluateOperator(operator: OperatorExpression['operator'], lhs: Expression, rhs: Expression): number {

        switch (operator) {
            case '+':
                return this.evaluateExpression(lhs) + this.evaluateExpression(rhs);
            case '-':
                return this.evaluateExpression(lhs) - this.evaluateExpression(rhs);
            case '*':
                return this.evaluateExpression(lhs) * this.evaluateExpression(rhs);
            case '//':
                return this.evaluateExpression(lhs) / this.evaluateExpression(rhs);
        }
    }

    evaluateExpression(expr: Expression): number {
        if (typeof expr === 'number') {
            return Math.floor(expr);
        } else if (isCounterID(expr)) {
            const counter = this.store.getState().counters.get(expr) as Counter;
            return Math.floor(counter.currentValue);
        } else if (expr.type === 'param') {
            const paramValue = this.context[expr.name];
            if (paramValue == null) {
                throw new InterpreterError({ error: 'PARAMETER_NOT_FOUND', param: expr.name, type: 'error' });
            }
            return Math.floor(paramValue);
        }

        return Math.floor(this.evaluateOperator(expr.operator, expr.lhs, expr.rhs));
    }
}

export class Interpreter {
    constructor(private store: Store<AppState>) {}

    execute(script: Statement[], context: Context) {
        return new ContextualInterpreter(this.store, context).execute(script);
    }
}
