import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';

import './Encounter.css';
import { Creature, CreatureGroup, CreatureStore } from '../../models/creatures';
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

    transition<T>(cb: (arg: T) => Page): (arg: T) => void {
        console.log('created transition with', cb);
        return action((arg: T) => {
            console.log('transition called with', arg);
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
                                       onSelect={this.transition(displayCreature)}/>;
            case 'DisplayCreature':
                return <div onClick={this.transition(selectKind)}>
                    <div>{this.currentPage.creature.name} - {this.currentPage.creature.attributes}</div>
                    <pre>{JSON.stringify(this.currentPage.creature, null, 2)}</pre>
                </div>;
        }
    }
}

