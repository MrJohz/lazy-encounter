import { ReactNode, SyntheticEvent } from 'react';
import { match } from 'react-router';

export type Children<K extends string = 'children', T = ReactNode> = Child<K, T | Iterable<T>>;
export type Child<K extends string = 'children', T = ReactNode> = { [key in K]: T };
export type ManyChildren<K extends string = 'children', T = ReactNode> = { [key in K]: Iterable<T> };

export function childrenise<T = ReactNode>(children?: T | T[]): T[] | null {
    if (typeof children === 'undefined' || children === null) {
        return null;
    } else if (!Array.isArray(children)) {
        return [children];
    } else {
        return children;
    }
}

export type ClassName = { className: string };
export type Optional<Prop> = { [key in keyof Prop]?: Prop[key] };

type EventCallback<T, U> = (ev: SyntheticEvent<T>) => U

export function noBubble<T, U>(cb: EventCallback<T, U>): EventCallback<T, U> {
    return (ev: SyntheticEvent<T>) => {
        ev.stopPropagation();
        return cb(ev);
    };
}

// used to determine whether a particular generic argument has been provided, or if it is
// the default argument.
type SENTINEL = { __varargs_hack_sentinel: '__varargs_hack_sentinel' };

// a callback can have up to three arguments.  By default, all arguments are undefined
// (i.e. equivalent to the callback signature having no arguments)
// The Name argument defines the key that will be passed in the Props object
//
// e.g. Callback<'onClick'>            =>     { onClick: () => void }
//      Callback<'onClick', MyEvent>   =>     { onClick: (param1: MyEvent) => void }
export type Callback<Name extends string, Param1=SENTINEL, Param2=SENTINEL, Param3=SENTINEL> =
    Param1 extends SENTINEL ? { [key in Name]: () => void }
        : Param2 extends SENTINEL ? { [key in Name]: (param1: Param1) => void}
        : Param3 extends SENTINEL ? { [key in Name]: (param1: Param1, param2: Param2) => void}
        : { [key in Name]: (param1: Param1, param2: Param2, param3: Param3) => void};

export type Match<T> = { match: match<T> };
