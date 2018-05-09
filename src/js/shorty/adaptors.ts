import bind from 'bind-decorator';
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

class AddEventListenerAdaptor extends Adaptor {
    constructor(element: EventTarget) {
        super();

        element.addEventListener('keydown', this.listener as any);
    }

    @bind
    private listener(e: KeyboardEvent) {
        if (e.altKey || e.ctrlKey) {
            return;  // don't handle special key combinations like Ctrl+W
        } else if (e.key.length === 1) {  // single character letter
            e.preventDefault();
            e.stopPropagation();
            return this.emit(e.key.toLowerCase());
        } else if (e.key === 'Escape') {
            e.preventDefault();
            e.stopPropagation();
            return this.emit(ESCAPE);
        } else {
            return;
        }
    }
}

export class DOMElementAdaptor extends AddEventListenerAdaptor {
    constructor(element: HTMLElement) {
        super(element);
    }
}

export class DocumentAdaptor extends AddEventListenerAdaptor {
    constructor(document?: Document) {
        super(document || window.document);
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
