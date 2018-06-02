import { Map } from 'immutable';
import React, { StatelessComponent } from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../stores';
import { CounterID, Counter } from '../../stores/counters';
import { Creature, CreatureID } from '../../stores/creatures';
import { enumerate } from '../../utils/iterator';
import { Callback } from '../../utils/jsx-props';
import { FullWidth, Square } from '../stylish';
import { Statblock } from './display-components/Statblock';

type ImplProps =
    & { creature: Creature | undefined, counters: Map<CounterID, Counter> }
    & Callback<'onBack'>;

const DisplayCreatureImpl: StatelessComponent<ImplProps> = ({ creature, counters, onBack }: ImplProps) => {
    if (!creature) {
        return <span>'ERROR!'</span>;
    }

    const actions = [];
    const attributes = [];

    for (const [idx, attr] of enumerate(creature.attributes)) {
        switch (attr.type) {
            case 'statblock':
                attributes.push(<Statblock key={idx} stats={attr.stats}/>);
                break;
        }
    }

    actions.push(...creature.actions);

    return <FullWidth onBack={onBack} actions={actions.map(a => <Square key={a.name}>{a.name}</Square>)}>
        <h2>{creature.name}</h2>
        {attributes}
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
