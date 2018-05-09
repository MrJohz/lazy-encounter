import React, { RefObject } from 'react';

import { Children, childrenise, Optional } from '../utils/jsx-props';
import { Adaptor } from './adaptors';
import { Shorty, DOMElementAdaptor, DocumentAdaptor, ShortcutHandle } from './index';

const {
    Provider: ShortyContextProvider,
    Consumer: ShortyContextConsumer,
} = React.createContext<Shorty | null>(null);

export type ShortyProviderProps
    = { global?: boolean, adaptor?: Adaptor }
    & Optional<Children>;

export type ShortyProviderState
    = { shorty: Shorty | null };

export class ShortyProvider extends React.Component<ShortyProviderProps, ShortyProviderState> {
    private readonly elementRef: RefObject<HTMLDivElement>;
    private readonly global: boolean;
    private readonly adaptor: Adaptor | null;

    state = { shorty: null };

    constructor(props: ShortyProviderProps) {
        super(props);

        this.adaptor = (typeof props.adaptor === 'undefined') ? null : props.adaptor;
        this.global = (typeof props.global === 'undefined') ? true : props.global;
        this.elementRef = React.createRef();
    }

    shortyInstance(): Shorty | null {
        return this.state.shorty;
    }

    componentDidMount() {
        const adaptor = this.adaptor
            ? this.adaptor
            : this.global
                ? new DocumentAdaptor()
                : new DOMElementAdaptor(this.elementRef.current as HTMLDivElement);
        this.setState({ shorty: new Shorty(adaptor) });
    }

    render() {
        const contextProvider =
            <ShortyContextProvider value={this.shortyInstance()}>{
                childrenise(this.props.children)
            }</ShortyContextProvider>;

        if (this.global) {
            return contextProvider;
        } else {
            return <div ref={this.elementRef}>{contextProvider}</div>;
        }
    }
}

type ShortcutImplProps
    = { shortcutText: string, shorty: Shorty, onTrigger: () => void }
    & Optional<Children>;

class ShortcutImpl extends React.Component<ShortcutImplProps> {

    private readonly shorty: Shorty;
    private readonly shortcutText: string;
    private onTrigger: () => void;
    private shortcut!: ShortcutHandle;

    constructor(props: ShortcutImplProps) {
        super(props);

        this.onTrigger = this.props.onTrigger;
        this.shorty = this.props.shorty;
        this.shortcutText = this.props.shortcutText;
    }

    componentDidMount() {
        this.shortcut = this.shorty.addShortcut(this.shortcutText);
        this.shortcut.on('keys:end', this.onTrigger);
    }

    componentWillUnmount() {
        this.shorty.removeShortcut(this.shortcut);
    }

    render() {
        return this.props.children;
    }

}

export type ShortcutProps
    = { shortcut: string, onTrigger: () => void }
    & Optional<Children>;

export function Shortcut({ onTrigger, shortcut, children }: ShortcutProps) {
    children = childrenise(children);
    const renderWithShorty = (shorty: Shorty | null) => {
        if (!shorty) {
            return children;  // return children for now while we're still setting up the shorty instance
        }

        return <ShortcutImpl onTrigger={onTrigger} shortcutText={shortcut} shorty={shorty} children={children}/>;
    };

    return <ShortyContextConsumer children={renderWithShorty}/>;
}
