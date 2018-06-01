import { Store } from 'redux';

import { AppState } from '../stores';
import { setCounterTo, Counter, isCounterID, changeCounter } from '../stores/counters';
import { Expression, Statement } from './ast';

export class Interpreter {
    constructor(private store: Store<AppState>) {}

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

    evaluateExpression(expr: Expression): number {
        if (typeof expr === 'number') {
            return expr;
        } else if (isCounterID(expr)) {
            const counter = this.store.getState().counters.get(expr) as Counter;
            return counter.currentValue;
        }

        switch (expr.operator) {
            case '+':
                return this.evaluateExpression(expr.lhs) + this.evaluateExpression(expr.rhs);
            case '-':
                return this.evaluateExpression(expr.lhs) - this.evaluateExpression(expr.rhs);
            case '*':
                return this.evaluateExpression(expr.lhs) * this.evaluateExpression(expr.rhs);
            case '/':
                return this.evaluateExpression(expr.lhs) / this.evaluateExpression(expr.rhs);
        }
    }
}
