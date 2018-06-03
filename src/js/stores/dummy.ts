import { Store } from 'redux';
import { createCounter, Counter } from './counters';
import { withSign, StatblockAttribute } from './creature-attributes';
import { CreatureGroup, createCreatureGroup, addCreatureToGroup } from './creature-groups';
import { Creature, createCreature, Action } from './creatures';

const STATS: StatblockAttribute['stats'] = [
    { name: 'Str', subValue: 12, value: withSign(+3) }, { name: 'Dex', subValue: 12, value: withSign(+2) },
    { name: 'Con', subValue: 12, value: withSign(-3) }, { name: 'Int', subValue: 12, value: withSign(+0) },
    { name: 'Wis', subValue: 12, value: withSign(-2) }, { name: 'Cha', subValue: 12, value: withSign(+1) },
];

function heal(counter: Counter): Action {
    return {
        name: 'Heal', text: '-', actions: [
            { type: 'stmt', action: 'add', counter: counter.id, value: { type: 'param', name: 'value' } },
        ], parameters: [
            { name: 'value', text: 'How much?' },
        ],
    };
}

function harm(counter: Counter): Action {
    return {
        name: 'Damage', text: '-', actions: [
            { type: 'stmt', action: 'subtract', counter: counter.id, value: { type: 'param', name: 'value' } },
        ], parameters: [
            { name: 'value', text: 'How much?' },
        ],
    };
}

function goblins(store: Store) {
    const attributes = ['bold', 'strong', 'clever', 'weak', 'green nose', 'yellow hair', 'ugly'];

    const creatureIds = [];

    for (const idx of [1, 2, 4]) {
        const health = new Counter(14);
        store.dispatch(createCounter(health));

        const creature = new Creature(`Goblin ${idx}`, [
            { type: 'statblock', stats: [...STATS] },
            { type: 'string', value: attributes[Math.floor(Math.random() * attributes.length)] },
            { type: 'filler' },
            { type: 'counter', name: 'Health', value: health.id, display: 'health' },
            { type: 'filler' },
        ], [
            harm(health),
            heal(health),
            { name: 'Sword', text: '[1d6] damage' },
            { name: 'Claws', text: '[1d4 + 2] damage' },
        ]);
        store.dispatch(createCreature(creature));

        creatureIds.push(creature.id);
    }

    const creatureGroup = new CreatureGroup('Goblins');
    store.dispatch(createCreatureGroup(creatureGroup));
    for (const id of creatureIds) {
        store.dispatch(addCreatureToGroup(creatureGroup, id));
    }
}

function owlbears(store: Store) {
    const attributes = ['huge', 'small', 'medium sized', 'scary', 'covered in moss'];
    for (const idx of [1, 2, 3]) {
        const health = new Counter(52);
        store.dispatch(createCounter(health));

        const creature = new Creature('Owlbear', [
            { type: 'statblock', stats: [...STATS] },
            { type: 'string', value: attributes[Math.floor(Math.random() * attributes.length)] },
            { type: 'counter', name: 'Health', value: health.id, display: 'health' },
        ], [
            harm(health),
            heal(health),
            { name: 'Bite', text: '[1d6] damage' },
            { name: 'Claws', text: '[1d4 + 2] damage' },
        ]);
        store.dispatch(createCreature(creature));

        const creatureGroup = new CreatureGroup(`Owlbear ${idx}`);
        store.dispatch(createCreatureGroup(creatureGroup));
        store.dispatch(addCreatureToGroup(creatureGroup, creature));
    }
}

function dragons(store: Store) {
    const attributes = ['red', 'white', 'green', 'blue', 'silver'];

    const archHealth = new Counter({ maxValue: 191, currentValue: 173 });
    const derHealth = new Counter(153);
    store.dispatch(createCounter(archHealth));
    store.dispatch(createCounter(derHealth));

    const archSpells = new Counter({maxValue: 5, currentValue: 3});
    store.dispatch(createCounter(archSpells));

    const archetrix = new Creature('Archetrix', [
        { type: 'statblock', stats: [...STATS] },
        { type: 'string', value: attributes[Math.floor(Math.random() * attributes.length)] },
        { type: 'filler' },
        { type: 'counter', name: 'Health', value: archHealth.id, display: 'health' },
        { type: 'counter', name: 'Spell Slots', value: archSpells.id, display: 'pips' },
    ], [
        harm(archHealth),
        heal(archHealth),
        { name: 'Breath', text: '[4d10] damage' },
        { name: 'Bite', text: '[3d6+7] damage' },
    ]);
    store.dispatch(createCreature(archetrix));

    const deriyny = new Creature('Deriyny', [
        { type: 'statblock', stats: [...STATS] },
        { type: 'string', value: attributes[Math.floor(Math.random() * attributes.length)] },
        { type: 'counter', name: 'Health', value: derHealth.id, display: 'health' },
    ], [
        harm(derHealth),
        heal(derHealth),
        { name: 'Bite', text: '[1d6] damage' },
        { name: 'Claws', text: '[1d4 + 2] damage' },
    ]);
    store.dispatch(createCreature(deriyny));

    const creatureGroup = new CreatureGroup(`Dragons`);
    store.dispatch(createCreatureGroup(creatureGroup));
    store.dispatch(addCreatureToGroup(creatureGroup, archetrix));
    store.dispatch(addCreatureToGroup(creatureGroup, deriyny));
}

export function createDummyData(store: Store) {
    goblins(store);
    owlbears(store);
    dragons(store);
    console.log(store.getState());
}
