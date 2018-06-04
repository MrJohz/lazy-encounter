import { Record, List, Map } from 'immutable';
import { Statement } from '../executor/ast';
import { Attribute } from './creature-attributes';

let currentId = 1;

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

    features: ReadonlyArray<string>;
    attributes: ReadonlyArray<Attribute>;
    actions: ReadonlyArray<Action>;
    conditions: List<Condition>;
}

export class Creature extends Record<CreatureProps>({
    id: '!!NOT INITIALISED!!' as CreatureID,
    name: '',
    features: [],
    attributes: [],
    actions: [],
    conditions: List(),
}) {
    constructor(name: string, features: Iterable<string>, attributes: Iterable<Attribute>, actions: Iterable<Action>) {
        const id = '' + currentId as CreatureID;
        currentId += 1;

        super({
            id,
            name,
            features: Array.from(features),
            attributes: Array.from(attributes),
            actions: Array.from(actions),
        });
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
