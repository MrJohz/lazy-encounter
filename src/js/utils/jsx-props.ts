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

export type Callback<Name extends string, Params> = { [key in Name]: (params: Params) => void };

export type Optional<Prop> = { [key in keyof Prop]?: Prop[key] };
