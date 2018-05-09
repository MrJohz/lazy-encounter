import { suite, test } from 'mocha-typescript';
import expect from 'must';

import { FiniteStateMachine } from '../../../src/js/utils/finite-state-machine';

@suite('FiniteStateMachine')
class FiniteStateMachineTest {

    @test 'it should begin in the initialised state'() {
        type State
            = { kind: 'test-state-one' }
            | { kind: 'test-state-two' };

        const fsm = new FiniteStateMachine<State>({ kind: 'test-state-one' });

        expect(fsm.state).to.eql({ kind: 'test-state-one' });
    }

    @test 'it should transition to a new state if a valid state is passed in'() {
        type State
            = { kind: 'test-state-one' }
            | { kind: 'test-state-two' };

        const fsm = new FiniteStateMachine<State>({ kind: 'test-state-one' });

        fsm.transition({ kind: 'test-state-two' });

        expect(fsm.state).to.eql({ kind: 'test-state-two' });
    }

    @test 'it should return a callback if a transition function is passed'() {
        type State
            = { kind: 'test-state-one' }
            | { kind: 'test-state-two' };

        const fsm = new FiniteStateMachine<State>({ kind: 'test-state-one' });
        const callback = fsm.transition(() => ({ kind: 'test-state-two' }));

        expect(fsm.state).to.eql({ kind: 'test-state-one' });
        callback();
        expect(fsm.state).to.eql({ kind: 'test-state-two' });
    }

}
