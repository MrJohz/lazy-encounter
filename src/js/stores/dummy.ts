import { Store } from 'redux';
import { createCounter, Counter, CounterID } from './counters';
import { CreatureGroup, createCreatureGroup, addCreatureToGroup } from './creature-groups';
import { Creature, createCreature, Action } from './creatures';

const STATS = [
    { name: 'STR', value: 12 }, { name: 'DEX', value: 12 }, { name: 'CON', value: 12 },
    { name: 'INT', value: 12 }, { name: 'WIS', value: 12 }, { name: 'CHA', value: 12 },
];

function heal(counter: Counter): Action {
    return {
        name: 'Heal', text: '-', actions: [
            { type: 'stmt', action: 'add', counter: counter.id, value: { type: 'param', name: 'value' } },
        ], parameters: [
            { name: 'value', text: 'How much?' },
        ],
    }
}

function harm(counter: Counter): Action {
    return {
        name: 'Damage', text: '-', actions: [
        { type: 'stmt', action: 'subtract', counter: counter.id, value: { type: 'param', name: 'value' } },
    ], parameters: [
        { name: 'value', text: 'How much?' },
    ],
    }
}

function goblins(store: Store) {
    const attributes = ['bold', 'strong', 'clever', 'weak', 'green nose', 'yellow hair', 'ugly'];

    const creatureIds = [];

    for (const idx of [1, 2, 4]) {
        const health = new Counter(14);
        store.dispatch(createCounter(health));

        const creature = new Creature(`Goblin ${idx}`, [
            { type: 'statblock', stats: { ...STATS } },
            { type: 'string', value: attributes[Math.floor(Math.random() * attributes.length)] },
            { type: 'counter', name: 'Health', value: health.id, display: 'health' },
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
            { type: 'statblock', stats: { ...STATS } },
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

    const archHealth = new Counter(191);
    const derHealth = new Counter(153);
    store.dispatch(createCounter(archHealth));
    store.dispatch(createCounter(derHealth));

    const archetrix = new Creature('Archetrix', [
        { type: 'statblock', stats: { ...STATS } },
        { type: 'string', value: attributes[Math.floor(Math.random() * attributes.length)] },
        { type: 'counter', name: 'Health', value: archHealth.id, display: 'health' },
    ], [
        harm(archHealth),
        heal(archHealth),
        { name: 'Breath', text: '[4d10] damage' },
        { name: 'Bite', text: '[3d6+7] damage' },
    ]);
    store.dispatch(createCreature(archetrix));

    const deriyny = new Creature('Deriyny', [
        { type: 'statblock', stats: { ...STATS } },
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
