import { Record, List, Map } from 'immutable';
import uuid from 'uuid/v4';

import { Creature, CreatureID } from './creatures';

export type CreatureGroupID = string & { '__ID_TYPE__': 'creature_group' };
type CreatureGroupProps = {
    id: CreatureGroupID;
    name: string;
    creatures: List<CreatureID>;
}

export class CreatureGroup extends Record<CreatureGroupProps>({
    id: '!!NOT INITIALISED!!' as CreatureGroupID,
    name: '',
    creatures: List(),
}) {
    constructor(name: string, creatures?: Creature[]) {
        const id = uuid() as CreatureGroupID;
        super({ id, name, creatures: List((creatures || []).map(c => c.id)) });
    }
}

type CREATURE_GROUP_ACTIONS
    = { type: '$CREATURE_GROUP/CREATE', creatureGroup: CreatureGroup }
    | { type: '$CREATURE_GROUP/ADD_CREATURE', creatureGroupId: CreatureGroupID, creatureId: CreatureID }
    | { type: '$CREATURE_GROUP/REMOVE_CREATURE', creatureGroupId: CreatureGroupID, creatureId: CreatureID };

type GroupOrID = CreatureGroup | CreatureGroupID;

export function create(creatureGroup: CreatureGroup): CREATURE_GROUP_ACTIONS {
    return { type: '$CREATURE_GROUP/CREATE', creatureGroup };
}

export function addCreature(group: GroupOrID, creature: Creature | CreatureID): CREATURE_GROUP_ACTIONS {
    const creatureGroupId = group instanceof CreatureGroup ? group.id : group;
    const creatureId = creature instanceof Creature ? creature.id : creature;
    return { type: '$CREATURE_GROUP/ADD_CREATURE', creatureGroupId, creatureId };
}

export function removeCreature(group: GroupOrID, creature: Creature | CreatureID): CREATURE_GROUP_ACTIONS {
    const creatureGroupId = group instanceof CreatureGroup ? group.id : group;
    const creatureId = creature instanceof Creature ? creature.id : creature;
    return { type: '$CREATURE_GROUP/REMOVE_CREATURE', creatureGroupId, creatureId };
}

type CreatureDict = { map: Map<CreatureGroupID, CreatureGroup>, ids: List<CreatureGroupID> };

function mapReducer(state: CreatureDict['map'], action: CREATURE_GROUP_ACTIONS) {
    switch (action.type) {
        case '$CREATURE_GROUP/CREATE':
            return state.set(action.creatureGroup.id, action.creatureGroup);
        case '$CREATURE_GROUP/ADD_CREATURE': {
            const creatureGroup = state.get(action.creatureGroupId) as CreatureGroup;
            const creatureList = creatureGroup.creatures.push(action.creatureId);
            return state.set(creatureGroup.id, creatureGroup.set('creatures', creatureList));
        }
        case '$CREATURE_GROUP/REMOVE_CREATURE': {
            const creatureGroup = state.get(action.creatureGroupId) as CreatureGroup;
            const creatureList = creatureGroup.creatures.filter(id => id !== action.creatureId);
            return state.set(creatureGroup.id, creatureGroup.set('creatures', creatureList));
        }
    }
}

function idsReducer(state: CreatureDict['ids'], action: CREATURE_GROUP_ACTIONS) {
    switch (action.type) {
        case '$CREATURE_GROUP/CREATE':
            return state.push(action.creatureGroup.id);
        case '$CREATURE_GROUP/ADD_CREATURE':
        case '$CREATURE_GROUP/REMOVE_CREATURE':
            return state;
    }
}

export function creatureGroupReducer(state: CreatureDict, action: CREATURE_GROUP_ACTIONS) {
    if (typeof state === 'undefined') return { map: Map(), ids: List() };
    return {
        map: mapReducer(state.map, action),
        ids: idsReducer(state.ids, action),
    }
}
