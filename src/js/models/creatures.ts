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
        ],
    });

    store.addCreatureGroup({
        name: 'Owlbear', creatures: [creature('Owlbear', 45)],
    });
}
