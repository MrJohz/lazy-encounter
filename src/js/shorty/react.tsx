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

const {
    Provider: ShortcutKeyProvider,
    Consumer: ShortcutKeyConsumer,
} = React.createContext<null | ShortcutHandle>(null);

type ShortcutImplProps
    = { shortcutText: string, shorty: Shorty, onTrigger: () => void }
    & Optional<Children>;

class ShortcutImpl extends React.Component<ShortcutImplProps> {

    private readonly shorty: Shorty;
    private readonly shortcutText: string;
    private readonly onTrigger: () => void;

    state: { shortcut: ShortcutHandle | null } = { shortcut: null };

    constructor(props: ShortcutImplProps) {
        super(props);

        this.onTrigger = this.props.onTrigger;
        this.shorty = this.props.shorty;
        this.shortcutText = this.props.shortcutText;
    }

    componentDidMount() {
        const shortcut = this.shorty.addShortcut(this.shortcutText);
        shortcut.on('keys:end', this.onTrigger);

        this.setState({ shortcut });
    }

    componentWillUnmount() {
        if (this.state.shortcut) {
            this.shorty.removeShortcut(this.state.shortcut);
        }
    }

    render() {
        return <ShortcutKeyProvider value={this.state.shortcut} children={this.props.children}/>;
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

type ShortcutKeyImplProps = { shortcutHandle: ShortcutHandle } & ShortcutKeyProps;

class ShortcutKeyImpl extends React.Component<ShortcutKeyImplProps> {

    state: { keys: string[] };

    constructor(props: ShortcutKeyImplProps) {
        super(props);
        this.state = { keys: this.props.shortcutHandle.keys };
        this.props.shortcutHandle.on('shortcut:change', (keys) => this.setState({ keys }));
    }

    render() {
        const { style, className } = this.props;
        // TODO: should highlight currently selected keys
        return <span {...{ style, className }}>{this.state.keys.join('-')}</span>;
    }
}


// TODO: more options, e.g. highlightedClassName/highlightedStyle, replace '-' with ' ' etc
export type ShortcutKeyProps = { style?: any, className?: string };

export function ShortcutKeys(props: ShortcutKeyProps) {
    const renderWithShortcut = (shortcut: ShortcutHandle | null) => {
        if (!shortcut) return null;

        return <ShortcutKeyImpl {...props} shortcutHandle={shortcut}/>;
    };

    return <ShortcutKeyConsumer children={renderWithShortcut}/>;
}
