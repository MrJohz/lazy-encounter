import { spy, assert } from 'sinon';
import { JSDOM } from 'jsdom';
import simulant from 'jsdom-simulant';

import { Adaptor, DOMElementAdaptor, DocumentAdaptor } from '../../../src/js/shorty/adaptors';
import { ESCAPE } from '../../../src/js/shorty/constants';

describe('Adaptor', () => {

    describe('register', () => {

        it(`registers a callback that will fire whenever 'emit' is called`, () => {
            class MyAdaptor extends Adaptor {
                public doEmit = this.emit;
            }

            const adaptor = new MyAdaptor();

            const registerSpy = spy();
            adaptor.register(registerSpy);
            adaptor.doEmit('t');

            assert.callCount(registerSpy, 1);
            assert.calledWithExactly(registerSpy, 't');
        });

        it(`can be registered to multiple places at once`, () => {
            class MyAdaptor extends Adaptor {
                public doEmit = this.emit;
            }

            const adaptor = new MyAdaptor();

            const registerSpy1 = spy();
            const registerSpy2 = spy();
            adaptor.register(registerSpy1);
            adaptor.register(registerSpy2);

            adaptor.doEmit('t');

            assert.callCount(registerSpy1, 1);
            assert.callCount(registerSpy2, 1);
            assert.calledWithExactly(registerSpy1, 't');
            assert.calledWithExactly(registerSpy2, 't');
        });

    });

});

describe('DOMElementAdaptor', () => {

    let jsdom: JSDOM, element: HTMLElement;

    beforeEach(() => {
        jsdom = new JSDOM('<div id="test" />');
        element = jsdom.window.document.getElementById('test') as HTMLElement;
    });

    afterEach(() => {
        jsdom.window.close();
    });

    it('fires when a keydown event is fired', () => {
        const registerSpy = spy();

        const adaptor = new DOMElementAdaptor(element);
        adaptor.register(registerSpy);

        simulant.fire(element, 'keydown', { key: 't' });

        assert.callCount(registerSpy, 1);
        assert.calledWithExactly(registerSpy, 't');
    });

    it('lowercases keys', () => {
        const registerSpy = spy();

        const adaptor = new DOMElementAdaptor(element);
        adaptor.register(registerSpy);

        simulant.fire(element, 'keydown', { key: 'T' });

        assert.callCount(registerSpy, 1);
        assert.calledWithExactly(registerSpy, 't');
    });

    it(`translates 'escape' properly`, () => {
        const registerSpy = spy();

        const adaptor = new DOMElementAdaptor(element);
        adaptor.register(registerSpy);

        simulant.fire(element, 'keydown', { key: 'Escape' });

        assert.callCount(registerSpy, 1);
        assert.calledWithExactly(registerSpy, ESCAPE);
    });

    it(`doesn't pass unhandled keys to callback`, () => {
        const registerSpy = spy();

        const adaptor = new DOMElementAdaptor(element);
        adaptor.register(registerSpy);

        simulant.fire(element, 'keydown', { key: 'Ctrl' });

        assert.callCount(registerSpy, 0);
    });

    it(`prevents propagation to higher elements`, () => {
        const registerSpy = spy();
        const documentSpy = spy();

        const adaptor = new DOMElementAdaptor(element);
        adaptor.register(registerSpy);

        jsdom.window.document.addEventListener('keydown', documentSpy);

        simulant.fire(element, 'keydown', { key: 'Escape' });

        assert.callCount(registerSpy, 1);
        assert.calledWithExactly(registerSpy, ESCAPE);

        assert.callCount(documentSpy, 0);
    });

    it(`allows unhandled keys to propagate to higher elements`, () => {
        const registerSpy = spy();
        const documentSpy = spy();

        const adaptor = new DOMElementAdaptor(element);
        adaptor.register(registerSpy);

        jsdom.window.document.addEventListener('keydown', documentSpy);

        simulant.fire(element, 'keydown', { key: 'Ctrl' });

        assert.callCount(registerSpy, 0);
        assert.callCount(documentSpy, 1);
    });

    it(`allows keys with modifiers to propagate to higher elements`, () => {
        const registerSpy = spy();
        const documentSpy = spy();

        const adaptor = new DOMElementAdaptor(element);
        adaptor.register(registerSpy);

        jsdom.window.document.addEventListener('keydown', documentSpy);

        simulant.fire(element, 'keydown', { key: 'A', ctrlKey: true });

        assert.callCount(registerSpy, 0);
        assert.callCount(documentSpy, 1);
    });

});

describe('DocumentAdaptor', () => {

    let jsdom: JSDOM;

    beforeEach(() => {
        jsdom = new JSDOM('');
    });

    afterEach(() => {
        jsdom.window.close();
    });

    it('fires when a keydown event is fired', () => {
        const registerSpy = spy();

        const adaptor = new DocumentAdaptor(jsdom.window.document);
        adaptor.register(registerSpy);

        simulant.fire(jsdom.window.document, 'keydown', { key: 't' });

        assert.callCount(registerSpy, 1);
        assert.calledWithExactly(registerSpy, 't');
    });

    it('lowercases keys', () => {
        const registerSpy = spy();

        const adaptor = new DocumentAdaptor(jsdom.window.document);
        adaptor.register(registerSpy);

        simulant.fire(jsdom.window.document, 'keydown', { key: 'T' });

        assert.callCount(registerSpy, 1);
        assert.calledWithExactly(registerSpy, 't');
    });

    it(`translates 'escape' properly`, () => {
        const registerSpy = spy();

        const adaptor = new DocumentAdaptor(jsdom.window.document);
        adaptor.register(registerSpy);

        simulant.fire(jsdom.window.document, 'keydown', { key: 'Escape' });

        assert.callCount(registerSpy, 1);
        assert.calledWithExactly(registerSpy, ESCAPE);
    });

    it(`doesn't pass unhandled keys to callback`, () => {
        const registerSpy = spy();

        const adaptor = new DocumentAdaptor(jsdom.window.document);
        adaptor.register(registerSpy);

        simulant.fire(jsdom.window.document, 'keydown', { key: 'Ctrl' });

        assert.callCount(registerSpy, 0);
    });

    it(`fetches document from global if not passed in`, () => {
        const registerSpy = spy();
        (global as any)['window'] = jsdom.window;

        const adaptor = new DocumentAdaptor();
        adaptor.register(registerSpy);

        simulant.fire(jsdom.window.document, 'keydown', { key: 'Ctrl' });

        assert.callCount(registerSpy, 0);

        delete (global as any)['window'];
    });

});
