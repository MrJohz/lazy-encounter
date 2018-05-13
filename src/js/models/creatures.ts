import { action, computed, observable } from 'mobx';

import { Condition } from './conditions';

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
    maxHitpoints: number;
    attributes: string;
    customActions: ReadonlyArray<Action>;
}

export class Creature {
    readonly name: string;
    readonly maxHitpoints: number;
    readonly attributes: string;
    readonly customActions: ReadonlyArray<Action>;

    @observable currentHitpoints: number;
    @observable conditions: Condition[];

    constructor({ name, maxHitpoints, attributes, customActions }: CreatureConstructor) {
        this.name = name;
        this.maxHitpoints = maxHitpoints;
        this.attributes = attributes;
        this.customActions = customActions;

        this.currentHitpoints = maxHitpoints;
        this.conditions = [];
    }
}

export interface Action {
    readonly name: string;
    readonly text: string;
}

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
            name, maxHitpoints,
            attributes: attributes[Math.floor(Math.random() * attributes.length)],
            customActions: [{ name: 'Sword', text: '[1d6] damage' }],
        });
    }

    store.addCreatureGroup({
        name: 'Goblins', creatures: [
            creature('Goblin 1', 15),
            creature('Goblin 2', 16),
            creature('Goblin 4', 12),
            creature('Goblin 5', 12),
            creature('Goblin 6', 12),
            creature('Goblin 7', 12),
            creature('Goblin 8', 12),
            creature('Goblin 9', 12),
            creature('Goblin 10', 12),
            creature('Goblin 11', 12),
        ],
    });

    for (let i = 0; i < 3; i++) {
        store.addCreatureGroup({
            name: `Owlbear ${i + 1}`, creatures: [creature('Owlbear', 45)],
        })
    }

    store.addCreatureGroup({
        name: 'Dragons', creatures: [
            creature('Archetrix', 200),
            creature('Deriyny', 352),
        ]
    })
}
