import { Map } from 'immutable';
import React, { StatelessComponent } from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../stores';
import { CounterID, Counter } from '../../stores/counters';
import { Creature, CreatureID } from '../../stores/creatures';
import { Callback } from '../../utils/jsx-props';
import { FullWidth, Square } from '../stylish';
import { CounterDisplay } from './display-components/CounterDisplay';
import { Filler } from './display-components/Filler';
import { Statblock } from './display-components/Statblock';

type ImplProps =
    & { creature: Creature | undefined, counters: Map<CounterID, Counter> }
    & Callback<'onBack'>;

const DisplayCreatureImpl: StatelessComponent<ImplProps> = ({ creature, counters, onBack }: ImplProps) => {
    if (!creature) {
        return <span>'ERROR!'</span>;
    }

    return <FullWidth onBack={onBack} actions={creature.actions.map(a => <Square key={a.name}>{a.name}</Square>)}>
        <h2>{creature.name}</h2>
        {creature.attributes.map((attr, idx) => {
            switch (attr.type) {
                case 'statblock':
                    return <Statblock key={idx} stats={attr.stats}/>;
                case 'counter':
                    const counter = counters.get(attr.value) as Counter;
                    return <CounterDisplay key={idx} name={attr.name} counter={counter} display={attr.display}/>;
                case 'filler':
                    return <Filler key={idx} />
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
