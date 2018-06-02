import { InterpreterError } from '../../../src/js/executor/error';
import { Interpreter, ContextualInterpreter } from '../../../src/js/executor/interpreter';
import expect from 'must';
import { store } from '../../../src/js/stores';
import { createCounter, Counter, setCounterTo } from '../../../src/js/stores/counters';

describe('Interpreter', () => {

    describe('evaluateExpression', () => {

        it('evaluates a number to that number', () => {
            const interpreter = new ContextualInterpreter(store, {});

            expect(interpreter.evaluateExpression(4)).to.equal(4);
        });

        it(`evaluates a counter to that counter's value`, () => {
            const interpreter = new ContextualInterpreter(store, {});
            const counter = new Counter();

            store.dispatch(createCounter(counter));

            expect(interpreter.evaluateExpression(counter.id)).to.equal(0);

            store.dispatch(setCounterTo(counter, 100));

            expect(interpreter.evaluateExpression(counter.id)).to.equal(100);
        });

        it(`evaluates basic addition of numbers`, () => {
            const interpreter = new ContextualInterpreter(store, {});

            expect(interpreter.evaluateExpression({ type: 'expr', operator: '+', lhs: 1, rhs: 2 }))
                .to.equal(3);
        });

        it(`evaluates addition to counters`, () => {
            const interpreter = new ContextualInterpreter(store, {});
            const counter = new Counter();

            store.dispatch(createCounter(counter));

            expect(interpreter.evaluateExpression({ type: 'expr', operator: '+', lhs: 1, rhs: counter.id }))
                .to.equal(1);

            store.dispatch(setCounterTo(counter, 100));

            expect(interpreter.evaluateExpression({ type: 'expr', operator: '+', lhs: 1, rhs: counter.id }))
                .to.equal(101);
        });

        it(`evaluates nested expressions`, () => {
            const interpreter = new ContextualInterpreter(store, {});
            const counter = new Counter({ currentValue: 15 });

            store.dispatch(createCounter(counter));

            expect(interpreter.evaluateExpression(
                {
                    type: 'expr', operator: '+', lhs: 25,
                    rhs: {
                        type: 'expr', operator: '*', lhs: counter.id,
                        rhs: { type: 'expr', operator: '-', lhs: 6, rhs: 4 },
                    },
                }))
                .to.equal(55);
        });

        it(`always returns an integer`, () => {
            const interpreter = new ContextualInterpreter(store, {});
            const counter = new Counter({ currentValue: 15 });

            store.dispatch(createCounter(counter));

            expect(interpreter.evaluateExpression({ type: 'expr', operator: '//', lhs: 15, rhs: 4 }))
                .to.equal(3);
        });

        it(`evaluates the context object and returns variables from that`, () => {
            const interpreter = new ContextualInterpreter(store, { myVar: 42 });

            expect(interpreter.evaluateExpression({ type: 'param', name: 'myVar' })).to.equal(42);
        });

        it(`throws an error if the variable is not in the context object`, () => {
            const interpreter = new ContextualInterpreter(store, {});

            const evaluator = () => interpreter.evaluateExpression({ type: 'param', name: 'myVar' });
            expect(evaluator).to.throw(InterpreterError, /PARAMETER_NOT_FOUND/);
        });

    });

    describe('executeStatement', () => {

        it('should allow setting of counter values', () => {
            const interpreter = new ContextualInterpreter(store, {});
            const counter = new Counter({ currentValue: 15 });

            store.dispatch(createCounter(counter));

            interpreter.executeStatement({ type: 'stmt', action: 'set', counter: counter.id, value: 31 });

            expect(store.getState().counters.get(counter.id).currentValue).to.equal(31);
        });

        it('should allow adding to counter values', () => {
            const interpreter = new ContextualInterpreter(store, {});
            const counter = new Counter({ currentValue: 15 });
            store.dispatch(createCounter(counter));

            interpreter.executeStatement({ type: 'stmt', action: 'add', counter: counter.id, value: 12 });

            expect(store.getState().counters.get(counter.id).currentValue).to.equal(27);
        });

        it('should allow subtracting from counter values', () => {
            const interpreter = new ContextualInterpreter(store, {});
            const counter = new Counter({ currentValue: 15 });
            store.dispatch(createCounter(counter));

            interpreter.executeStatement({ type: 'stmt', action: 'subtract', counter: counter.id, value: 12 });

            expect(store.getState().counters.get(counter.id).currentValue).to.equal(3);
        });

        it('should evaluate arbitrary expressions', () => {
            const interpreter = new ContextualInterpreter(store, { test: 10 });
            const counter = new Counter({ currentValue: 15 });
            store.dispatch(createCounter(counter));

            interpreter.executeStatement({
                type: 'stmt', action: 'add', counter: counter.id, value:
                    {
                        type: 'expr', operator: '+', lhs: 1, rhs:
                            {
                                type: 'expr', operator: '+', lhs: counter.id, rhs: { type: 'param', name: 'test' },
                            },
                    },
            });

            expect(store.getState().counters.get(counter.id).currentValue).to.equal(41);
        });

    });

});
