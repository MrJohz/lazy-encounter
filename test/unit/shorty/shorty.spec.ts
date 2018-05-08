import { Shorty, ShortcutHandle } from '../../../src/js/shorty';

import expect from 'must';

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
});
