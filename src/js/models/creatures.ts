import { action, computed, observable, IObservableArray, observe } from 'mobx';

import { Condition } from './conditions';
import { Counter, HealthCounter } from './counters';

export class CreatureGroup {
    readonly name: string;
    readonly creatures: ReadonlyArray<Creature>;

    constructor({ name, creatures }: CreatureGroup) {
        this.name = name;
        this.creatures = creatures;
    }
}

export type CreatureConstructor = {
    name: string;
    counters: Counter[];
    attributes: Attribute[];
    actions: Action[];
    conditions: Condition[];
}

export class Creature {
    readonly name: string;

    readonly attributes: ReadonlyArray<Attribute>;
    readonly actions: ReadonlyArray<Action>;
    readonly counters: ReadonlyArray<Counter>;

    readonly conditions: IObservableArray<Condition>;

    constructor({ name, counters, attributes, conditions, actions }: CreatureConstructor) {
        this.name = name;

        this.counters = counters;
        this.attributes = attributes;
        this.conditions = observable.array([]);
        this.actions = [...actions];

        const DEAD_COUNTER = { name: 'dead' };

        const healthCounters = this.counters
            .filter((ctr: Counter) => ctr instanceof HealthCounter)
            .map((ctr) => observe(ctr, () => {
                if (ctr.currentValue <= 0) {
                    this.conditions.push(DEAD_COUNTER);
                } else {
                    this.conditions.remove(DEAD_COUNTER);
                }
            }));

        if (healthCounters.length > 1) {
            throw new Error('too many health counters');
        }
    }

}

export interface Action {
    readonly name: string;
    readonly text: string;
}

export type Attribute
    = { type: 'statblock', stats: { name: string, value: number, computed?: null }[] }
    | { type: 'string', value: string };

export class CreatureStore {
    @observable
    private _creatures: CreatureGroup[] = [];

    @computed
    get creatures() {
        return this._creatures.slice();
    }

    getCreature(group: string, name: string): Creature | null {
        for (const cg of this.creatures) {
            if (cg.name === group) {
                for (const creature of cg.creatures) {
                    if (creature.name === name) {
                        return creature;
                    }
                }
            }
        }

        return null;
    }

    @action
    addCreatureGroup(creature: CreatureGroup) {
        this._creatures.push(creature);
    }
}

export function _initCreatures(store: CreatureStore): void {
    function creature(name: string, maxHitpoints: number): Creature {
        const attributes = ['bold', 'strong', 'wise', 'weak', 'green nose', 'yellow hair', 'ugly'];

        return new Creature({
            name,
            counters: [new HealthCounter({ maxValue: maxHitpoints })],
            actions: [{ name: 'Sword', text: '[1d6] damage' }],
            attributes: [
                {
                    type: 'statblock',
                    stats: [
                        { name: 'STR', value: 12 }, { name: 'DEX', value: 12 }, { name: 'CON', value: 12 },
                        { name: 'INT', value: 12 }, { name: 'WIS', value: 12 }, { name: 'CHA', value: 12 },
                    ],
                },
                { type: 'string', value: attributes[Math.floor(Math.random() * attributes.length)] },
            ],
            conditions: [],
        });
    }

    store.addCreatureGroup({
        name: 'Goblins', creatures: [
            creature('Goblin 1', 15),
            creature('Goblin 2', 16),
            creature('Goblin 4', 12),
        ],
    });

    for (let i = 0; i < 3; i++) {
        store.addCreatureGroup({
            name: `Owlbear ${i + 1}`, creatures: [creature('Owlbear', 45)],
        });
    }

    store.addCreatureGroup({
        name: 'Dragons', creatures: [
            creature('Archetrix', 200),
            creature('Deriyny', 352),
        ],
    });
}
