import { CounterID } from './counters';

export type CounterDisplayType =
    | 'health'
    | 'pips'

export type DisplayNumber =
    | number
    | { value: number, withSign: boolean }

export function withSign(n: number): DisplayNumber {
    return { value: n, withSign: true };
}

export type StatblockAttribute =
    Readonly<{ type: 'statblock', stats: { name: string, value: DisplayNumber, subValue?: DisplayNumber }[] }>

export type Attribute =
    | StatblockAttribute
    | Readonly<{ type: 'free-text', value: string }>
    | Readonly<{ type: 'counter', name: string, value: CounterID, display: CounterDisplayType }>
    | Readonly<{ type: 'filler' }>
