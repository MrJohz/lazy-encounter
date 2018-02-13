export type Children<T = JSX.Element | string> = Child<T> | ManyChildren<T>;
export type Child<T = JSX.Element | string> = { children: T };
export type ManyChildren<T = JSX.Element | string> = { children: T[] };

export function childrenise<T = JSX.Element | string>(children: T | T[]): T[] {
    if (!Array.isArray(children)) {
        return [children];
    } else {
        return children;
    }
}

export type ClassName = { className: string };

export type Callback<Name extends string, Param> =
    { [key in Name]: (param: Param) => void };

export type NoArgCallback<Name extends string> =
    { [key in Name]: () => void };

// TODO: get this to work when the next version of Typescript comes out properly
// (and is also supported in my editor - because currently it looks horrible!

// // used to determine whether a particular generic argument has been provided, or if it is
// // the default argument.
// type SENTINEL = { __varargs_hack_sentinel: '__varargs_hack_sentinel' };
//
// // a callback can have up to nine arguments.  By default, all arguments are undefined
// // (i.e. equivalent to the callback signature having no arguments)
// // The Name argument defines the key that will be passed in the Props object
// //
// // e.g. Callback<'onClick'>            =>     { onClick: () => void }
// //      Callback<'onClick', MyEvent>   =>     { onClick: (param1: MyEvent) => void }
// export type Callback<Name extends string, Param1=SENTINEL,
//     Param2=SENTINEL, Param3=SENTINEL, Param4=SENTINEL, Param5=SENTINEL,
//     Param6=SENTINEL, Param7=SENTINEL, Param8=SENTINEL, Param9=SENTINEL> =
//     { [key in Name]: (param1: Param1,
//                       param2: Param2,
//                       param3: Param3,
//                       param4: Param4,
//                       param5: Param5,
//                       param6: Param6,
//                       param7: Param7,
//                       param8: Param8,
//                       param9: Param9) => void };

export type Optional<Prop> = { [key in keyof Prop]?: Prop[key] };
