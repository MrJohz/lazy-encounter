import { observable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';

import { Creature, CreatureStore } from '../../models/creatures';
import { FiniteStateMachine } from '../../utils/finite-state-machine';
import { ChooseCreature } from './ChooseCreature';
import { DisplayCreature } from './DisplayCreature';

type Props = { store: CreatureStore };

type Page
    = { kind: 'ChooseCreature' }
    | { kind: 'DisplayCreature', creature: Creature };

function chooseCreature(): Page {
    return { kind: 'ChooseCreature' };
}

function displayCreature(creature: Creature): Page {
    return { kind: 'DisplayCreature', creature };
}

@observer
export class Encounter extends React.Component<Props> {

    @observable
    private page = new FiniteStateMachine(chooseCreature());

    constructor(props: Props) {
        super(props);
    }

    render() {
        switch (this.page.state.kind) {
            case 'ChooseCreature':
                return <ChooseCreature creatures={this.props.store.creatures}
                                   onSelect={this.page.transition(displayCreature)}/>;
            case 'DisplayCreature':
                return <DisplayCreature creature={this.page.state.creature}
                                        onBack={this.page.transition(chooseCreature)}/>;
        }
    }
}

