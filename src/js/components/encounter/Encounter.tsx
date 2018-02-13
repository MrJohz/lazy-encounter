import { observable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';

import { Creature, CreatureGroup, CreatureStore } from '../../models/creatures';
import { FiniteStateMachine } from '../../utils/finite-state-machine';
import { DisplayCreature } from './DisplayCreature';
import './Encounter.css';
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
    private page = new FiniteStateMachine(selectKind());

    constructor(props: Props) {
        super(props);
    }

    render() {
        switch (this.page.state.kind) {
            case 'SelectKind':
                return <SelectKind creatures={this.props.store.creatures}
                                   onSelect={this.page.transition((creature: CreatureGroup) =>
                                       creature.creatures.length > 1
                                           ? selectInstance(creature)
                                           : displayCreature(creature.creatures[0]))}/>;
            case 'SelectInstance':
                return <SelectInstance creatures={this.page.state.creatures}
                                       onSelect={this.page.transition(displayCreature)}
                                       onBack={this.page.transition(selectKind)}/>;
            case 'DisplayCreature':
                return <DisplayCreature creature={this.page.state.creature}
                                        onBack={this.page.transition(selectKind)}/>;
        }
    }
}

