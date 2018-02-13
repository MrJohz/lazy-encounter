import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';

import './Encounter.css';
import { Creature, CreatureGroup, CreatureStore } from '../../models/creatures';
import { DisplayCreature } from './DisplayCreature';
import { SelectInstance } from './SelectInstance';
import { SelectKind } from './SelectKind';

type Props = { store: CreatureStore };

type Page
    = { kind: 'SelectKind' }
    | { kind: 'SelectInstance', creatures: CreatureGroup }
    | { kind: 'DisplayCreature', creature: Creature };

function selectKind(): Page {
    return { kind: 'SelectKind' };
}

function selectInstance(creatures: CreatureGroup): Page {
    return { kind: 'SelectInstance', creatures };
}

function displayCreature(creature: Creature): Page {
    return { kind: 'DisplayCreature', creature };
}

@observer
export class Encounter extends React.Component<Props> {

    @observable
    private currentPage: Page = selectKind();

    transition0<T>(cb: () => Page): () => void {
        return action(() => {
            this.currentPage = cb();
        });
    }

    transition<T>(cb: (arg: T) => Page): (arg: T) => void {
        return action((arg: T) => {
            this.currentPage = cb(arg);
        });
    }

    constructor(props: Props) {
        super(props);
    }

    render() {
        switch (this.currentPage.kind) {
            case 'SelectKind':
                return <SelectKind creatures={this.props.store.creatures}
                                   onSelect={this.transition((creature: CreatureGroup) =>
                                       creature.creatures.length > 1
                                           ? selectInstance(creature)
                                           : displayCreature(creature.creatures[0]))}/>;
            case 'SelectInstance':
                return <SelectInstance creatures={this.currentPage.creatures}
                                       onSelect={this.transition(displayCreature)}
                                       onBack={this.transition0(selectKind)}/>;
            case 'DisplayCreature':
                return <DisplayCreature creature={this.currentPage.creature}
                                        onBack={this.transition0(selectKind)}/>;
        }
    }
}

