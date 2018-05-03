import { ReactNode, SyntheticEvent } from 'react';

export type Children<T = ReactNode> = Child<T> | ManyChildren<T>;
export type Child<T = ReactNode> = { children: T };
export type ManyChildren<T = ReactNode> = { children: T[] };

export function childrenise<T = ReactNode>(children: T | T[]): T[] {
    if (!Array.isArray(children)) {
        return [children];
    } else {
        return children;
    }
}

export type ClassName = { className: string };
export type Optional<Prop> = { [key in keyof Prop]?: Prop[key] };

type EventCallback<T> = (ev: SyntheticEvent<T>) => void

export function noBubble<T>(cb: EventCallback<T>): EventCallback<T> {
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

