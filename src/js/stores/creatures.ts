import { Record, List, Map } from 'immutable';
import { Statement } from '../executor/ast';

let currentId = 1;

import { CounterID } from './counters';

export type CounterDisplayType =
    | 'health'
    | 'pips';

export type Attribute =
    | Readonly<{ type: 'statblock', stats: { name: string, value: number, computed?: null }[] }>
    | Readonly<{ type: 'string', value: string }>
    | Readonly<{ type: 'counter', name: string, value: CounterID, display: CounterDisplayType }>;

export type Action =
    Readonly<{
        name: string, text: string, actions?: Statement[],
        parameters?: { name: string, text: string }[]
    }>;

export type Condition
    = Readonly<{ name: string, color: string }>;

export type CreatureID = string & { '__ID_TYPE__': 'creature' };
type CreatureProps = {
    id: CreatureID;
    name: string;

    counters: Map<string, CounterID>;
    attributes: List<Attribute>;
    actions: List<Action>;
    conditions: List<Condition>;
}

export class Creature extends Record<CreatureProps>({
    id: '!!NOT INITIALISED!!' as CreatureID,
    name: '',
    counters: Map(),
    attributes: List(),
    actions: List(),
    conditions: List(),
}) {
    constructor(name: string, attributes: Iterable<Attribute>, actions: Iterable<Action>) {
        const id = '' + currentId as CreatureID;
        currentId += 1;
        const attrs = [];
        const counterMap: { [key: string]: CounterID } = {};
        for (const attr of attributes) {
            attrs.push(attr);
            if (attr.type === 'counter') {
                counterMap[attr.name] = attr.value;
            }
        }

        super({ id, name, counters: Map(counterMap), attributes: List(attributes), actions: List(actions) });
    }
}

type CREATURE_ACTIONS =
    | { type: '@CREATURE/CREATE', creature: Creature }
    | { type: '@CREATURE/ADD_CONDITION', creatureId: CreatureID, condition: Condition }
    | { type: '@CREATURE/REMOVE_CONDITION', creatureId: CreatureID, condition: Condition };

export function createCreature(creature: Creature): CREATURE_ACTIONS {
    return { type: '@CREATURE/CREATE', creature };
}

export function addConditionToCreature(creature: Creature | CreatureID, condition: Condition): CREATURE_ACTIONS {
    const creatureId = creature instanceof Creature ? creature.id : creature;
    return { type: '@CREATURE/ADD_CONDITION', creatureId, condition };
}

export function removeConditionFromCreature(creature: Creature | CreatureID, condition: Condition): CREATURE_ACTIONS {
    const creatureId = creature instanceof Creature ? creature.id : creature;
    return { type: '@CREATURE/ADD_CONDITION', creatureId, condition };
}

type CreatureDict = { map: Map<CreatureID, Creature>, ids: List<CreatureID> };

function mapReducer(state: CreatureDict['map'], action: CREATURE_ACTIONS): CreatureDict['map'] {
    switch (action.type) {
        case '@CREATURE/CREATE':
            return state.set(action.creature.id, action.creature);
        case '@CREATURE/ADD_CONDITION': {
            const creature = state.get(action.creatureId) as Creature;
            const conditions = creature.conditions.push(action.condition);
            return state.set(creature.id, creature.set('conditions', conditions));
        }
        case '@CREATURE/REMOVE_CONDITION': {
            const creature = state.get(action.creatureId) as Creature;
            const conditions = creature.conditions.filter(condition => condition.name !== action.condition.name);
            return state.set(creature.id, creature.set('conditions', conditions));
        }
    }
}

function idsReducer(state: CreatureDict['ids'], action: CREATURE_ACTIONS): CreatureDict['ids'] {
    switch (action.type) {
        case '@CREATURE/CREATE':
            return state.push(action.creature.id);
        case '@CREATURE/ADD_CONDITION':
        case '@CREATURE/REMOVE_CONDITION':
            return state;
    }
}

export function creatureReducer(state: CreatureDict | undefined, action: CREATURE_ACTIONS): CreatureDict {
    if (typeof state === 'undefined') return { map: Map(), ids: List() };
    return {
        map: mapReducer(state.map, action),
        ids: idsReducer(state.ids, action),
    };
}
