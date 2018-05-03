import { RadixTree, BLANK } from '../../../src/js/shorty/radix-tree';

test('Can add/remove one piece of stored data', () => {
    const tree = new RadixTree();
    tree.add('test', 'value');

    expect(tree.get('test')).toBe('value');
});

test('can add/remove two strings w/ different first letters', () => {
    const tree = new RadixTree();
    tree.add('map', 'value 1');
    tree.add('cap', 'value 2');

    expect(tree.get('map')).toBe('value 1');
    expect(tree.get('cap')).toBe('value 2');
});

test('can add/remove two strings w/ same first letter', () => {
    const tree = new RadixTree();
    tree.add('map', 'value 1');
    tree.add('meal', 'value 2');

    expect(tree.get('map')).toBe('value 1');
    expect(tree.get('meal')).toBe('value 2');
});

test('fails to find longer string when substring exists', () => {
    const tree = new RadixTree();
    tree.add('map', 'value 1');

    expect(tree.get('map')).toBe('value 1');
    expect(tree.get('maps')).toBe(null);
});

test('can add/remove longer string when whole substring exists', () => {
    const tree = new RadixTree();
    tree.add('map', 'value 1');
    tree.add('maps', 'value 2');

    expect(tree.get('map')).toBe('value 1');
    expect(tree.get('maps')).toBe('value 2');
});

test('fails to substring when longer string exists', () => {
    const tree = new RadixTree();
    tree.add('maps', 'value 1');

    expect(tree.get('maps')).toBe('value 1');
    expect(tree.get('map')).toBe(null);
});

test('can add/remove substring when longer string exists', () => {
    const tree = new RadixTree();
    tree.add('maps', 'value 1');
    tree.add('map', 'value 2');

    expect(tree.get('maps')).toBe('value 1');
    expect(tree.get('map')).toBe('value 2');
});

test('can split a branch node if necessary', () => {
    const tree = new RadixTree();
    tree.add('meal', 'value 1');
    tree.add('mean', 'value 2');

    expect(tree.get('meal')).toBe('value 1');
    expect(tree.get('mean')).toBe('value 2');

    tree.add('man', 'value 3');
    expect(tree.get('man')).toBe('value 3');
});

test('adding two equal strings throws an error', () => {
    const tree = new RadixTree();
    tree.add('meal', 'value 1');

    expect(() => tree.add('meal', 'value 2')).toThrow();
});

test('can delete strings', () => {
    const tree = new RadixTree();
    tree.add('meal', 'value 1');
    expect(tree.get('meal')).toBe('value 1');

    expect(tree.remove('meal')).toBe(true);
    expect(tree.get('meal')).toBe(null);
});

test('can delete top-level strings when root already has content', () => {
    const tree = new RadixTree();
    tree.add('meal', 'value 1');
    tree.add('deal', 'value 2');

    expect(tree.remove('meal')).toBe(true);
    expect(tree.get('meal')).toBe(null);
    expect(tree.get('deal')).toBe('value 2');
});

test('returns false when string is not present', () => {
    const tree = new RadixTree();

    expect(tree.remove('test')).toBe(false);
});

test('deletes substring but leaves longer string intact', () => {
    const tree = new RadixTree();
    tree.add('meal', 'test 1');
    tree.add('meals', 'test 2');

    expect(tree.remove('meal')).toBe(true);
    expect(tree.get('meal')).toBe(null);
    expect(tree.get('meals')).toBe('test 2');
});

test('deletes longer string but leaves substring intact', () => {
    const tree = new RadixTree();
    tree.add('meals', 'test 1');
    tree.add('meal', 'test 2');

    expect(tree.remove('meals')).toBe(true);
    expect(tree.get('meals')).toBe(null);
    expect(tree.get('meal')).toBe('test 2');
});

test('unique chars returns one char if one key in tree', () => {
    const tree = new RadixTree();
    tree.add('meals', 'test 1');

    expect(tree.uniqueChars('meals')).toEqual(['m']);
});

test('unique chars returns null if key cannot be found', () => {
    const tree = new RadixTree();

    expect(tree.uniqueChars('meals')).toEqual(null);
});

test('unique chars returns one char if two wholly different keys in tree', () => {
    const tree = new RadixTree();
    tree.add('meals', 'test 1');
    tree.add('deals', 'test 2');

    expect(tree.uniqueChars('meals')).toEqual(['m']);
    expect(tree.uniqueChars('deals')).toEqual(['d']);
});

test('unique chars returns uniquely identifying chars to get to key location', () => {
    const tree = new RadixTree();
    tree.add('meals', 'test 1');
    tree.add('mental', 'test 2');
    tree.add('menial', 'test 3');
    tree.add('deals', 'test 4');

    expect(tree.uniqueChars('meals')).toEqual(['m', 'a']);
    expect(tree.uniqueChars('mental')).toEqual(['m', 'n', 't']);
    expect(tree.uniqueChars('menial')).toEqual(['m', 'n', 'i']);
    expect(tree.uniqueChars('deals')).toEqual(['d']);
});

test('unique chars returns uniquely identifying chars in substring case', () => {
    const tree = new RadixTree();
    tree.add('meal', 'test 1');
    tree.add('meals', 'test 2');

    expect(tree.uniqueChars('meal')).toEqual(['m', BLANK]);
    expect(tree.uniqueChars('meals')).toEqual(['m', 's']);
});

test('unique chars returns uniquely identifying chars in other substring case', () => {
    const tree = new RadixTree();
    tree.add('meals', 'test 2');
    tree.add('meal', 'test 1');

    expect(tree.uniqueChars('meal')).toEqual(['m', BLANK]);
    expect(tree.uniqueChars('meals')).toEqual(['m', 's']);
});

test('tree shrinks when an unnecessary branch can be removed', () => {
    const tree = new RadixTree();
    tree.add('meals', 'test 1');
    tree.add('menial', 'test 2');

    expect(tree.uniqueChars('meals')).toEqual(['m', 'a']);
    expect(tree.uniqueChars('menial')).toEqual(['m', 'n']);

    tree.remove('meals');

    expect(tree.uniqueChars('meals')).toEqual(null);
    expect(tree.uniqueChars('menial')).toEqual(['m']);
});

test('can find a node from the unique chars', () => {
    const tree = new RadixTree();
    tree.add('meals', 'test 1');
    tree.add('menial', 'test 2');
    tree.add('denial', 'test 3');
    tree.add('meningitis', 'test 4');

    expect(tree.findByUnique(['d'])).toBe('test 3');
    expect(tree.findByUnique(['m', 'a'])).toBe('test 1');
    expect(tree.findByUnique(['m', 'n', 'a'])).toBe('test 2');
    expect(tree.findByUnique(['m', 'n', 'n'])).toBe('test 4');
});

test('can find a node from unique chars with substrings', () => {
    const tree = new RadixTree();
    tree.add('meals', 'test 1');
    tree.add('meal', 'test 2');

    expect(tree.findByUnique(['m', 's'])).toBe('test 1');
    expect(tree.findByUnique(['m', BLANK])).toBe('test 2');
});

test('can find a node from unique chars with inverted substrings', () => {
    const tree = new RadixTree();
    tree.add('meal', 'test 2');
    tree.add('meals', 'test 1');

    expect(tree.findByUnique(['m', 's'])).toBe('test 1');
    expect(tree.findByUnique(['m', BLANK])).toBe('test 2');
});
