import { suite, test } from 'mocha-typescript';
import expect from 'must';
import React from 'react';
import { spy, stub, assert } from 'sinon';

import { childrenise, noBubble } from '../../../src/js/utils/jsx-props';

@suite('childrenise')
class ChildreniseTest {

    @test 'it should return null if no children are passed in'() {
        expect(childrenise()).to.be.null();
    }

    @test 'it should return a list of children if a single child is passed in'() {
        expect(childrenise(<div/>)).to.eql([<div/>]);
    }

    @test 'it should return a list of children if a list is passed in'() {
        expect(childrenise([<div/>, <div/>, <div/>])).to.eql([<div/>, <div/>, <div/>]);
    }
}

@suite('noBubble')
class NoBubbleTest {

    @test 'it should call stop propagation'() {
        const bubbleSpy = spy();
        const eventMock = { stopPropagation: spy() } as any;
        const noBubbleCB = noBubble(bubbleSpy);

        noBubbleCB(eventMock);

        assert.callCount(bubbleSpy, 1);
        assert.calledWithExactly(bubbleSpy, eventMock);

        assert.callCount(eventMock.stopPropagation, 1);
        assert.calledWithExactly(eventMock.stopPropagation);
    }

    @test 'it should return if callback returns'() {
        const response = Symbol();
        const bubbleSpy = stub().returns(response);
        const eventMock = { stopPropagation: spy() } as any;
        const noBubbleCB = noBubble(bubbleSpy);

        const returnValue = noBubbleCB(eventMock);

        expect(returnValue).to.equal(response);
    }
}
