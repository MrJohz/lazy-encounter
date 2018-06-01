import { Map } from 'immutable';
import React, { StatelessComponent } from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../stores';
import { CounterID, Counter } from '../../stores/counters';
import { Creature, CreatureID } from '../../stores/creatures';
import { Callback } from '../../utils/jsx-props';
import { FullWidth, Square } from '../stylish';

type ImplProps
    = { creature: Creature | undefined, counters: Map<CounterID, Counter> }
    & Callback<'onBack'>;

function pushIf<T>(cond: boolean, value: T): T[] {
    if (cond) return [value];
    return [];
}

const DisplayCreatureImpl: StatelessComponent<ImplProps> = ({ creature, counters, onBack }: ImplProps) => {
    if (!creature) {
        return <span>'ERROR!'</span>;
    }

    const actions = [];
    const attributes = [];

    for (const attr of creature.attributes) {
        if (attr.type === 'counter') {
            const counter = counters.get(attr.value) as Counter;
            // if (counter.type === 'health_counter') {
            //     actions.push({ name: `Damage`, text: `Damage` });
            //     actions.push({ name: 'Heal', text: 'Heal' });
            //     attributes.push(/*<Healthbar counter={counter} />*/);
            // }
        }
    }

    actions.push(...creature.actions);

    return <FullWidth onBack={onBack} actions={actions.map(a => <Square key={a.name}>{a.text}</Square>)}>
        {creature.name}
    </FullWidth>;
};

const mapStateToProps = (state: AppState, { creatureId, ...rest }: DisplayCreatureProps): ImplProps =>
    ({
        creature: state.creatures.map.get(creatureId),
        counters: state.counters,
        ...rest,
    });

type DisplayCreatureProps
    = { creatureId: CreatureID } & Callback<'onBack'>;

export const DisplayCreature = connect(mapStateToProps)(DisplayCreatureImpl);
