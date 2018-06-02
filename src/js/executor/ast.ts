import { CounterID } from '../stores/counters';

export type Param =
    { type: 'param', name: string }

export type Statement =
    | { type: 'stmt', action: 'set', counter: CounterID, value: Expression }
    | { type: 'stmt', action: 'add', counter: CounterID, value: Expression }
    | { type: 'stmt', action: 'subtract', counter: CounterID, value: Expression }

export type OperatorExpression =
    | { type: 'expr', operator: '+', lhs: Expression, rhs: Expression }
    | { type: 'expr', operator: '-', lhs: Expression, rhs: Expression }
    | { type: 'expr', operator: '*', lhs: Expression, rhs: Expression }
    | { type: 'expr', operator: '//', lhs: Expression, rhs: Expression }

export type Expression =
    | number
    | CounterID
    | Param
    | OperatorExpression
