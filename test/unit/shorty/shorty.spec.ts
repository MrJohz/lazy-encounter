import { Shorty, ShortcutHandle } from '../../../src/js/shorty';

import expect from 'must';
import { spy } from 'sinon';

describe('Shorty', () => {

    describe('addShortcut', () => {

        it('should return a new shortcut', () => {
            const shorty = new Shorty();
            const helloShortcut = shorty.addShortcut('hello');
            expect(helloShortcut).to.be.instanceOf(ShortcutHandle);
            expect(helloShortcut.keys).to.eql(['h']);
        });

        it('shortcuts always made from lc letters', () => {
            const shorty = new Shorty();
            const helloShortcut = shorty.addShortcut('HELLO');
            expect(helloShortcut['name']).to.eql('HELLO');
            expect(helloShortcut.keys).to.eql(['h']);
        });

        it('shortcuts automatically disambiguate equivalent keys', () => {
            const shorty = new Shorty();
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

    });

    describe('onKeypress', () => {

        it('should trigger all shortcuts when a valid key is pressed', () => {
            const shorty = new Shorty();
            const sc1 = shorty.addShortcut('hello');
            const sc2 = shorty.addShortcut('hadron');
            const sc3 = shorty.addShortcut('goodbye');

            const sc1Spy = spy();
            sc1.on('keys:start', sc1Spy);

            const sc2Spy = spy();
            sc2.on('keys:start', sc2Spy);

            const sc3Spy = spy();
            sc3.on('keys:start', sc3Spy);

            shorty.onKeypress('h');

            expect(sc1Spy).to.have.property('callCount', 1);
            expect(sc2Spy).to.have.property('callCount', 1);
            expect(sc3Spy).to.have.property('callCount', 0);
        });

        it('should trigger start and end listeners when a single-key full shortcut is pressed', () => {
            const shorty = new Shorty();
            const sc = shorty.addShortcut('hello');

            const scStartSpy = spy();
            sc.on('keys:start', scStartSpy);

            const scEndSpy = spy();
            sc.on('keys:end', scEndSpy);

            shorty.onKeypress('h');

            expect(scStartSpy).to.have.property('callCount', 1);
            expect(scEndSpy).to.have.property('callCount', 1);
        });

        it('should trigger start and end listeners when a single-key full shortcut is pressed', () => {
            const shorty = new Shorty();
            const sc = shorty.addShortcut('hello');

            const scStartSpy = spy();
            sc.on('keys:start', scStartSpy);

            const scEndSpy = spy();
            sc.on('keys:end', scEndSpy);

            shorty.onKeypress('h');

            expect(scStartSpy).to.have.property('callCount', 1);
            expect(scEndSpy).to.have.property('callCount', 1);
        });

        it('should trigger start, continue, and end listeners when multi-key full shortcut is pressed', () => {
            const shorty = new Shorty();
            const sc = shorty.addShortcut('hello');
            shorty.addShortcut('henry');
            shorty.addShortcut('hellbent');

            const scStartSpy = spy();
            const scContinueSpy = spy();
            const scEndSpy = spy();

            sc.on('keys:start', scStartSpy);
            sc.on('keys:continue', scContinueSpy);
            sc.on('keys:end', scEndSpy);

            shorty.onKeypress('h');
            shorty.onKeypress('l');
            shorty.onKeypress('o');

            expect(scStartSpy.callCount).to.equal(1);
            expect(scContinueSpy.callCount).to.equal(2);
            expect(scEndSpy.callCount).to.equal(1);
        });

        it('should trigger discontinue listeners if multi-key shortcut fails', () => {
            const shorty = new Shorty();
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

            shorty.onKeypress('h');
            shorty.onKeypress('q');

            expect(scStartSpy.callCount).to.equal(1);
            expect(scContinueSpy.callCount).to.equal(0);
            expect(scDiscontinueSpy.callCount).to.equal(1);
            expect(scEndSpy.callCount).to.equal(0);
        });

        it('should reset the triggers when a full match is found', () => {
            const shorty = new Shorty();
            const sc1 = shorty.addShortcut('hello');
            const sc2 = shorty.addShortcut('goodbye');
            shorty.addShortcut('henry');

            const sc1StartSpy = spy();
            const sc1EndSpy = spy();
            const sc2StartSpy = spy();

            sc1.on('keys:start', sc1StartSpy);
            sc1.on('keys:end', sc1EndSpy);
            sc2.on('keys:start', sc2StartSpy);

            shorty.onKeypress('h');
            shorty.onKeypress('l');
            shorty.onKeypress('g');

            expect(sc1StartSpy.callCount).to.equal(1);
            expect(sc1EndSpy.callCount).to.equal(1);
            expect(sc2StartSpy.callCount).to.equal(1);
            expect(sc2StartSpy.getCall(0).calledAfter(sc1EndSpy.getCall(0))).to.be.true();
        });

        it('should reset the triggers when no match is found', () => {
            const shorty = new Shorty();
            const sc1 = shorty.addShortcut('hello');
            const sc2 = shorty.addShortcut('goodbye');
            shorty.addShortcut('henry');

            const sc1StartSpy = spy();
            const sc1EndSpy = spy();
            const sc2StartSpy = spy();

            sc1.on('keys:start', sc1StartSpy);
            sc1.on('keys:end', sc1EndSpy);
            sc2.on('keys:start', sc2StartSpy);

            shorty.onKeypress('h');
            shorty.onKeypress('q');
            shorty.onKeypress('g');

            expect(sc1StartSpy.callCount).to.equal(1);
            expect(sc1EndSpy.callCount).to.equal(0);
            expect(sc2StartSpy.callCount).to.equal(1);
        });

        it('should reset the triggers when no match is found', () => {
            const shorty = new Shorty();
            const sc1 = shorty.addShortcut('hello');
            const sc2 = shorty.addShortcut('goodbye');
            shorty.addShortcut('henry');

            const sc1StartSpy = spy();
            const sc1DiscontinueSpy = spy();
            const sc2StartSpy = spy();

            sc1.on('keys:start', sc1StartSpy);
            sc1.on('keys:discontinue', sc1DiscontinueSpy);
            sc2.on('keys:start', sc2StartSpy);

            shorty.onKeypress('h');
            shorty.onKeypress('<esc>');
            shorty.onKeypress('g');

            expect(sc1StartSpy.callCount).to.equal(1);
            expect(sc1DiscontinueSpy.callCount).to.equal(1);
            expect(sc2StartSpy.callCount).to.equal(1);
        });

    });
});
