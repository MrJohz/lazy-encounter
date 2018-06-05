import { Map } from 'immutable';
import React, { StatelessComponent } from 'react';
import { connect } from 'react-redux';
import { withState } from 'recompose';

import { AppState } from '../../stores';
import { CounterID, Counter } from '../../stores/counters';
import { Creature, CreatureID, Action } from '../../stores/creatures';
import { Callback, noBubble } from '../../utils/jsx-props';
import { FullWidth, Square } from '../stylish';
import { Modal, Response } from '../stylish/Modal';
import { CounterDisplay } from './display-components/CounterDisplay';
import { Filler } from './display-components/Filler';
import { FreeText } from './display-components/FreeText';
import { Statblock } from './display-components/Statblock';

type ActionProps =
    & { action: Action }
    & { modalOpen: boolean, setOpen: (arg: boolean) => boolean }

const ActionButtonImpl: StatelessComponent<ActionProps> = ({ action, modalOpen, setOpen }: ActionProps) => {
    return <Square onClick={noBubble(() => setOpen(!modalOpen))}>
        <h3>{action.name}</h3>
        <p>{action.text}</p>
        <Modal open={modalOpen} onClose={(resp: Response) => console.log(resp)}>hello?</Modal>
    </Square>;
};

const ActionButton = withState('modalOpen', 'setOpen', false)(ActionButtonImpl);

type ImplProps =
    & { creature: Creature | undefined, counters: Map<CounterID, Counter> }
    & Callback<'onBack'>;

const DisplayCreatureImpl: StatelessComponent<ImplProps> = ({ creature, counters, onBack }: ImplProps) => {
    if (!creature) {
        return <span>'ERROR!'</span>;
    }

    return <FullWidth onBack={onBack} actions={creature.actions.map(a => <ActionButton key={a.name} action={a}/>)}>
        <h2>{creature.name}</h2>
        {creature.attributes.map((attr, idx) => {
            switch (attr.type) {
                case 'statblock':
                    return <Statblock key={idx} stats={attr.stats}/>;
                case 'counter':
                    const counter = counters.get(attr.value) as Counter;
                    return <CounterDisplay key={idx} name={attr.name} counter={counter} display={attr.display}/>;
                case 'filler':
                    return <Filler key={idx}/>;
                case 'free-text':
                    return <FreeText key={idx} text={attr.value}/>;
            }
        })}
    </FullWidth>;
};

const mapStateToProps = (state: AppState, { creatureId, ...rest }: DisplayCreatureProps): ImplProps =>
    ({
        creature: state.creatures.map.get(creatureId),
        counters: state.counters,
        ...rest,
    });

type DisplayCreatureProps =
    & { creatureId: CreatureID }
    & Callback<'onBack'>;

export const DisplayCreature = connect(mapStateToProps)(DisplayCreatureImpl);
