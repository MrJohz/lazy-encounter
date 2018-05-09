import { Shorty, ShortcutHandle } from '../../../src/js/shorty';

import expect from 'must';
import { spy, assert } from 'sinon';
import { TestAdaptor } from '../../../src/js/shorty/adaptors';

describe('Shorty', () => {

    let adaptor: TestAdaptor;
    let shorty: Shorty;

    beforeEach(() => {
        adaptor = new TestAdaptor();
        shorty = new Shorty(adaptor);
    });

    describe('addShortcut', () => {

        it('should return a new shortcut', () => {
            const helloShortcut = shorty.addShortcut('hello');
            expect(helloShortcut).to.be.instanceOf(ShortcutHandle);
            expect(helloShortcut.keys).to.eql(['h']);
        });

        it('shortcuts always made from lc letters', () => {
            const helloShortcut = shorty.addShortcut('HELLO');
            expect(helloShortcut['name']).to.eql('HELLO');
            expect(helloShortcut.keys).to.eql(['h']);
        });

        it('shortcuts automatically disambiguate equivalent keys', () => {
            const sc1 = shorty.addShortcut('hello');
            const sc2 = shorty.addShortcut('hello');
            const sc3 = shorty.addShortcut('HELLO');

            expect(sc1['name']).to.eql('hello');
            expect(sc1.keys).to.eql(['h', '1']);

            expect(sc2['name']).to.eql('hello');
            expect(sc2.keys).to.eql(['h', '2']);

            expect(sc3['name']).to.eql('HELLO');
            expect(sc3.keys).to.eql(['h', '3']);
        });

        it('should handle the case of substrings by inserting extra period characters', () => {
            const sc1 = shorty.addShortcut('hello');
            const sc2 = shorty.addShortcut('hello1');

            expect(sc1.keys).to.eql(['h', '.']);
            expect(sc2.keys).to.eql(['h', '1']);
        });

        it('should strip periods from a shortcut', () => {
            const sc1 = shorty.addShortcut('h.ello');
            const sc2 = shorty.addShortcut('hallo');

            expect(sc1.keys).to.eql(['h', 'e']);
            expect(sc2.keys).to.eql(['h', 'a']);
        });

    });

    describe('onKeypress', () => {

        it('should trigger all shortcuts when a valid key is pressed', () => {
            const sc1 = shorty.addShortcut('hello');
            const sc2 = shorty.addShortcut('hadron');
            const sc3 = shorty.addShortcut('goodbye');

            const sc1Spy = spy();
            sc1.on('keys:start', sc1Spy);

            const sc2Spy = spy();
            sc2.on('keys:start', sc2Spy);

            const sc3Spy = spy();
            sc3.on('keys:start', sc3Spy);

            adaptor.send('h');

            expect(sc1Spy).to.have.property('callCount', 1);
            expect(sc2Spy).to.have.property('callCount', 1);
            expect(sc3Spy).to.have.property('callCount', 0);
        });

        it('should trigger start and end listeners when a single-key full shortcut is pressed', () => {
            const sc = shorty.addShortcut('hello');

            const scStartSpy = spy();
            sc.on('keys:start', scStartSpy);

            const scEndSpy = spy();
            sc.on('keys:end', scEndSpy);

            adaptor.send('h');

            expect(scStartSpy).to.have.property('callCount', 1);
            expect(scEndSpy).to.have.property('callCount', 1);
        });

        it('should trigger start and end listeners when a single-key full shortcut is pressed', () => {
            const sc = shorty.addShortcut('hello');

            const scStartSpy = spy();
            sc.on('keys:start', scStartSpy);

            const scEndSpy = spy();
            sc.on('keys:end', scEndSpy);

            adaptor.send('h');

            expect(scStartSpy).to.have.property('callCount', 1);
            expect(scEndSpy).to.have.property('callCount', 1);
        });

        it('should trigger start, continue, and end listeners when multi-key full shortcut is pressed', () => {
            const sc = shorty.addShortcut('hello');
            shorty.addShortcut('henry');
            shorty.addShortcut('hellbent');

            const scStartSpy = spy();
            const scContinueSpy = spy();
            const scEndSpy = spy();

            sc.on('keys:start', scStartSpy);
            sc.on('keys:continue', scContinueSpy);
            sc.on('keys:end', scEndSpy);

            adaptor.send('h', 'l', 'o');

            expect(scStartSpy.callCount).to.equal(1);
            expect(scContinueSpy.callCount).to.equal(2);
            expect(scEndSpy.callCount).to.equal(1);
        });

        it('should trigger discontinue listeners if multi-key shortcut fails', () => {
            const sc = shorty.addShortcut('hello');
            shorty.addShortcut('henry');
            shorty.addShortcut('hellbent');

            const scStartSpy = spy();
            const scContinueSpy = spy();
            const scDiscontinueSpy = spy();
            const scEndSpy = spy();

            sc.on('keys:start', scStartSpy);
            sc.on('keys:continue', scContinueSpy);
            sc.on('keys:discontinue', scDiscontinueSpy);
            sc.on('keys:end', scEndSpy);

            adaptor.send('h', 'q');

            expect(scStartSpy.callCount).to.equal(1);
            expect(scContinueSpy.callCount).to.equal(0);
            expect(scDiscontinueSpy.callCount).to.equal(1);
            expect(scEndSpy.callCount).to.equal(0);
        });

        it('should reset the triggers when a full match is found', () => {
            const sc1 = shorty.addShortcut('hello');
            const sc2 = shorty.addShortcut('goodbye');
            shorty.addShortcut('henry');

            const sc1StartSpy = spy();
            const sc1EndSpy = spy();
            const sc2StartSpy = spy();

            sc1.on('keys:start', sc1StartSpy);
            sc1.on('keys:end', sc1EndSpy);
            sc2.on('keys:start', sc2StartSpy);

            adaptor.send('h', 'l', 'g');

            expect(sc1StartSpy.callCount).to.equal(1);
            expect(sc1EndSpy.callCount).to.equal(1);
            expect(sc2StartSpy.callCount).to.equal(1);
            expect(sc2StartSpy.getCall(0).calledAfter(sc1EndSpy.getCall(0))).to.be.true();
        });

        it('should reset the triggers when no match is found', () => {
            const sc1 = shorty.addShortcut('hello');
            const sc2 = shorty.addShortcut('goodbye');
            shorty.addShortcut('henry');

            const sc1StartSpy = spy();
            const sc1EndSpy = spy();
            const sc2StartSpy = spy();

            sc1.on('keys:start', sc1StartSpy);
            sc1.on('keys:end', sc1EndSpy);
            sc2.on('keys:start', sc2StartSpy);

            adaptor.send('h', 'q', 'g');

            expect(sc1StartSpy.callCount).to.equal(1);
            expect(sc1EndSpy.callCount).to.equal(0);
            expect(sc2StartSpy.callCount).to.equal(1);
        });

        it('should reset the triggers when no match is found', () => {
            const sc1 = shorty.addShortcut('hello');
            const sc2 = shorty.addShortcut('goodbye');
            shorty.addShortcut('henry');

            const sc1StartSpy = spy();
            const sc1DiscontinueSpy = spy();
            const sc2StartSpy = spy();

            sc1.on('keys:start', sc1StartSpy);
            sc1.on('keys:discontinue', sc1DiscontinueSpy);
            sc2.on('keys:start', sc2StartSpy);

            adaptor.send('h');
            adaptor.sendEsc();
            adaptor.send('g');

            expect(sc1StartSpy.callCount).to.equal(1);
            expect(sc1DiscontinueSpy.callCount).to.equal(1);
            expect(sc2StartSpy.callCount).to.equal(1);
        });

        it('should handle the case of substrings by inserting extra period characters', () => {
            const sc1 = shorty.addShortcut('hello');
            const sc2 = shorty.addShortcut('hello1');

            const sc1EndSpy = spy();
            const sc2EndSpy = spy();

            sc1.on('keys:end', sc1EndSpy);
            sc2.on('keys:end', sc2EndSpy);

            adaptor.send('h', '.');

            assert.callCount(sc1EndSpy, 1);
            assert.callCount(sc2EndSpy, 0);
        });

        it('should strip periods from a shortcut', () => {
            const sc1 = shorty.addShortcut('h.ello');
            const sc2 = shorty.addShortcut('hallo');

            const sc1DiscontinueSpy = spy();
            const sc1EndSpy = spy();
            const sc2EndSpy = spy();

            sc1.on('keys:discontinue', sc1DiscontinueSpy);
            sc1.on('keys:end', sc1EndSpy);
            sc2.on('keys:end', sc2EndSpy);

            adaptor.send('h', '.');

            assert.callCount(sc1DiscontinueSpy, 1);
            assert.callCount(sc1EndSpy, 0);
            assert.callCount(sc2EndSpy, 0);

            sc1DiscontinueSpy.resetHistory();
            sc1EndSpy.resetHistory();
            sc2EndSpy.resetHistory();

            adaptor.send('h', 'e');

            assert.callCount(sc1DiscontinueSpy, 0);
            assert.callCount(sc1EndSpy, 1);
            assert.callCount(sc2EndSpy, 0);
        });

    });

    describe('removeShortcut', () => {

        it('should prevent a shortcut from being called', () => {
            const shortcut = shorty.addShortcut('hello');

            const beginSpy = spy();
            shortcut.on('keys:start', beginSpy);

            shorty.removeShortcut(shortcut);
            adaptor.send('h');

            expect(beginSpy.callCount).to.equal(0);
        });

    });

});
