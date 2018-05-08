import EventEmitter from 'eventemitter3';
import { ESCAPE } from './constants';

export abstract class Adaptor {
    protected emitter: EventEmitter = new EventEmitter();

    public register(handler: (char: string) => void): void {
        this.emitter.addListener('key', handler);
    }

    protected emit(char: string) {
        this.emitter.emit('key', char);
    }
}

export class DOMElementAdaptor extends Adaptor {

    constructor(element: HTMLElement) {
        super();

        element.addEventListener('keydown', (e) => {
            console.log(e.code);
            this.emit(e.code);
        });
    }
}

export class DocumentAdaptor extends DOMElementAdaptor {
    constructor(document: Document) {
        super(document.documentElement);
    }
}

export class TestAdaptor extends Adaptor {

    public send(...chars: string[]) {
        for (const char of chars) {
            this.emit(char);
        }
    }

    public sendEsc() {
        this.emit(ESCAPE);
    }

}
