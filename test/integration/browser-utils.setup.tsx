import React from 'react';
import { JSDOM } from 'jsdom';

function copyProps(src: any, target: any) {
    const props = Object.getOwnPropertyNames(src)
        .filter(prop => typeof target[prop] === 'undefined')
        .reduce((result, prop) => ({
            ...result,
            [prop]: Object.getOwnPropertyDescriptor(src, prop),
        }), {});
    Object.defineProperties(target, props);
    return Object.keys(props);
}

export function toggler() {
    let togglerFunction = (state: 'show' | 'hide') => console.log('warning: ToggleComponent not yet initialised');

    class ToggleComponent extends React.Component<{}, { show: 'show' | 'hide' }> {
        state = { show: 'show' as 'show' };

        constructor(props: {}) {
            super(props);

            togglerFunction = (state: 'show' | 'hide') => this.setState({ show: state });
        }

        render() {
            if (this.state.show === 'show') {
                return this.props.children;
            } else {
                return null;
            }
        }
    }

    return {
        toggle(state: 'show' | 'hide') {
            togglerFunction(state);
        }, Toggle: ToggleComponent,
    };
}

export class BrowserTestBase {

    private jsdom: JSDOM = new JSDOM('<!doctype html><html><body></body></html>');
    private copiedProps: string[] = [];

    before() {
        (global as any)['window'] = this.jsdom.window;
        (global as any)['document'] = this.jsdom.window.document;
        (global as any)['navigator'] = { userAgent: 'node.js' };

        this.copiedProps = copyProps(window, global);
    }

    after() {
        delete (global as any)['window'];
        delete (global as any)['document'];
        delete (global as any)['navigator'];

        for (const prop of this.copiedProps) {
            delete (global as any)[prop];
        }
    }
}
