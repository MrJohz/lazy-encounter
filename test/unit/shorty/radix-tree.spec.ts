import { RadixTree, BLANK } from '../../../src/js/shorty/radix-tree';
import expect from 'must';

describe('RadixTree', () => {

    describe('add/get', () => {

        it('can add/fetch one piece of stored data', () => {
            const tree = new RadixTree();
            tree.add('test', 'value');

            expect(tree.get('test')).to.equal('value');
        });

        it('can add/fetch two strings w/ different first letters', () => {
            const tree = new RadixTree();
            tree.add('map', 'value 1');
            tree.add('cap', 'value 2');

            expect(tree.get('map')).to.equal('value 1');
            expect(tree.get('cap')).to.equal('value 2');
        });

        it('can add/fetch two strings w/ same first letter', () => {
            const tree = new RadixTree();
            tree.add('map', 'value 1');
            tree.add('meal', 'value 2');

            expect(tree.get('map')).to.equal('value 1');
            expect(tree.get('meal')).to.equal('value 2');
        });

        it('fails to find longer string when substring exists', () => {
            const tree = new RadixTree();
            tree.add('map', 'value 1');

            expect(tree.get('map')).to.equal('value 1');
            expect(tree.get('maps')).to.equal(null);
        });

        it('can add/fetch longer string when whole substring exists', () => {
            const tree = new RadixTree();
            tree.add('map', 'value 1');
            tree.add('maps', 'value 2');

            expect(tree.get('map')).to.equal('value 1');
            expect(tree.get('maps')).to.equal('value 2');
        });

        it('fails to substring when longer string exists', () => {
            const tree = new RadixTree();
            tree.add('maps', 'value 1');

            expect(tree.get('maps')).to.equal('value 1');
            expect(tree.get('map')).to.equal(null);
        });

        it('can add/fetch substring when longer string exists', () => {
            const tree = new RadixTree();
            tree.add('maps', 'value 1');
            tree.add('map', 'value 2');

            expect(tree.get('maps')).to.equal('value 1');
            expect(tree.get('map')).to.equal('value 2');
        });

        it('can split a branch node if necessary', () => {
            const tree = new RadixTree();
            tree.add('meal', 'value 1');
            tree.add('mean', 'value 2');

            expect(tree.get('meal')).to.equal('value 1');
            expect(tree.get('mean')).to.equal('value 2');

            tree.add('man', 'value 3');
            expect(tree.get('man')).to.equal('value 3');
        });

        it('adding two equal strings throws an error', () => {
            const tree = new RadixTree();
            tree.add('meal', 'value 1');

            expect(() => tree.add('meal', 'value 2')).to.throw();
        });

        it('can have three child nodes from a single node', () => {
            const tree = new RadixTree();
            tree.add('meal1', 'test 1');
            tree.add('meal2', 'test 2');
            tree.add('meal3', 'test 3');

            expect(tree.get('meal1')).to.equal('test 1');
            expect(tree.get('meal2')).to.equal('test 2');
            expect(tree.get('meal3')).to.equal('test 3');
        });

    });

    describe('remove', () => {

        it('can delete strings', () => {
            const tree = new RadixTree();
            tree.add('meal', 'value 1');
            expect(tree.get('meal')).to.equal('value 1');

            expect(tree.remove('meal')).to.equal(true);
            expect(tree.get('meal')).to.equal(null);
        });

        it('can delete top-level strings when root already has content', () => {
            const tree = new RadixTree();
            tree.add('meal', 'value 1');
            tree.add('deal', 'value 2');

            expect(tree.remove('meal')).to.equal(true);
            expect(tree.get('meal')).to.equal(null);
            expect(tree.get('deal')).to.equal('value 2');
        });

        it('returns false when string is not present', () => {
            const tree = new RadixTree();

            expect(tree.remove('test')).to.equal(false);
        });

        it('deletes substring but leaves longer string intact', () => {
            const tree = new RadixTree();
            tree.add('meal', 'test 1');
            tree.add('meals', 'test 2');

            expect(tree.remove('meal')).to.equal(true);
            expect(tree.get('meal')).to.equal(null);
            expect(tree.get('meals')).to.equal('test 2');
        });

        it('deletes longer string but leaves substring intact', () => {
            const tree = new RadixTree();
            tree.add('meals', 'test 1');
            tree.add('meal', 'test 2');

            expect(tree.remove('meals')).to.equal(true);
            expect(tree.get('meals')).to.equal(null);
            expect(tree.get('meal')).to.equal('test 2');
        });

    });

    describe('uniqueChars', () => {

        it('unique chars returns one char if one key in tree', () => {
            const tree = new RadixTree();
            tree.add('meals', 'test 1');

            expect(tree.uniqueChars('meals')).to.eql(['m']);
        });

        it('unique chars returns null if key cannot be found', () => {
            const tree = new RadixTree();

            expect(tree.uniqueChars('meals')).to.eql(null);
        });

        it('unique chars returns one char if two wholly different keys in tree', () => {
            const tree = new RadixTree();
            tree.add('meals', 'test 1');
            tree.add('deals', 'test 2');

            expect(tree.uniqueChars('meals')).to.eql(['m']);
            expect(tree.uniqueChars('deals')).to.eql(['d']);
        });

        it('unique chars returns uniquely identifying chars to get to key location', () => {
            const tree = new RadixTree();
            tree.add('meals', 'test 1');
            tree.add('mental', 'test 2');
            tree.add('menial', 'test 3');
            tree.add('deals', 'test 4');

            expect(tree.uniqueChars('meals')).to.eql(['m', 'a']);
            expect(tree.uniqueChars('mental')).to.eql(['m', 'n', 't']);
            expect(tree.uniqueChars('menial')).to.eql(['m', 'n', 'i']);
            expect(tree.uniqueChars('deals')).to.eql(['d']);
        });

        it('unique chars returns uniquely identifying chars in substring case', () => {
            const tree = new RadixTree();
            tree.add('meal', 'test 1');
            tree.add('meals', 'test 2');

            expect(tree.uniqueChars('meal')).to.eql(['m', BLANK]);
            expect(tree.uniqueChars('meals')).to.eql(['m', 's']);
        });

        it('unique chars returns uniquely identifying chars in other substring case', () => {
            const tree = new RadixTree();
            tree.add('meals', 'test 2');
            tree.add('meal', 'test 1');

            expect(tree.uniqueChars('meal')).to.eql(['m', BLANK]);
            expect(tree.uniqueChars('meals')).to.eql(['m', 's']);
        });

        it('tree shrinks when an unnecessary branch can be removed', () => {
            const tree = new RadixTree();
            tree.add('meals', 'test 1');
            tree.add('menial', 'test 2');

            expect(tree.uniqueChars('meals')).to.eql(['m', 'a']);
            expect(tree.uniqueChars('menial')).to.eql(['m', 'n']);

            tree.remove('meals');

            expect(tree.uniqueChars('meals')).to.eql(null);
            expect(tree.uniqueChars('menial')).to.eql(['m']);
        });

    });

    describe('findByUnique', () => {

        it('can find a node from the unique chars', () => {
            const tree = new RadixTree();
            tree.add('meals', 'test 1');
            tree.add('menial', 'test 2');
            tree.add('denial', 'test 3');
            tree.add('meningitis', 'test 4');

            expect(tree.findByUnique(['d'])).to.equal('test 3');
            expect(tree.findByUnique(['m', 'a'])).to.equal('test 1');
            expect(tree.findByUnique(['m', 'n', 'a'])).to.equal('test 2');
            expect(tree.findByUnique(['m', 'n', 'n'])).to.equal('test 4');
        });

        it('can find a node from unique chars with substrings', () => {
            const tree = new RadixTree();
            tree.add('meals', 'test 1');
            tree.add('meal', 'test 2');

            expect(tree.findByUnique(['m', 's'])).to.equal('test 1');
            expect(tree.findByUnique(['m', BLANK])).to.equal('test 2');
        });

        it('can find a node from unique chars with inverted substrings', () => {
            const tree = new RadixTree();
            tree.add('meal', 'test 2');
            tree.add('meals', 'test 1');

            expect(tree.findByUnique(['m', 's'])).to.equal('test 1');
            expect(tree.findByUnique(['m', BLANK])).to.equal('test 2');
        });

    });

});
