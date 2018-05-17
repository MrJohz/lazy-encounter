import { Map, List } from 'immutable';
import { createStore, combineReducers, Reducer, AnyAction } from 'redux';
import { CounterID, Counter, countReducer } from './counters';
import { CreatureGroup, CreatureGroupID, creatureGroupReducer } from './creature-groups';
import { CreatureID, Creature, creatureReducer } from './creatures';
import { createDummyData } from './dummy';

type App = {
    counters: Map<CounterID, Counter>;
    creatures: { map: Map<CreatureID, Creature>, ids: List<CreatureID> };
    creatureGroups: { map: Map<CreatureGroupID, CreatureGroup>, ids: List<CreatureGroupID> };
}

function namespace<S>(namespace: string, reducer: Reducer<S, any>, def: S): Reducer {
    const prepend = `@${namespace}/`;
    return (state: S, action: AnyAction) => {
        action.type.startsWith(prepend) && console.log(`before (action='${action.type}:`, state);
        const end = action.type.startsWith(prepend)
            ? reducer(state, action)
            : typeof state === 'undefined' ? def : state;
        action.type.startsWith(prepend) && console.log(`after (action='${action.type}:`, state);
        return end;
    };
}

const appReducer = combineReducers({
    counters:
        namespace('COUNTER', countReducer, Map()),
    creatures:
        namespace('CREATURE', creatureReducer, { map: Map(), ids: List() } as App['creatures']),
    creatureGroups:
        namespace('CREATURE_GROUP', creatureGroupReducer, { map: Map(), ids: List() } as App['creatureGroups']),
});

export const store = createStore(appReducer);

createDummyData(store);
