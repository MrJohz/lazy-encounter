import { Adaptor } from '../../../src/js/shorty/adaptors';
import { spy, assert } from 'sinon';

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
