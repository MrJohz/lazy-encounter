import React, { StatelessComponent } from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../stores';
import { Creature, CreatureID } from '../../stores/creatures';
import { Callback } from '../../utils/jsx-props';

type ImplProps
    = { creature: Creature } & Callback<'onBack'>;

const DisplayCreatureImpl: StatelessComponent<ImplProps> = ({ creature, onBack }: ImplProps) => {
    return <span onClick={onBack}>{creature.name}</span>;
};

const mapStateToProps = (state: AppState, { creatureId }: DisplayCreatureProps) =>
    ({
        creature: state.creatures.map.get(creatureId) as Creature,
    });

type DisplayCreatureProps
    = { creatureId: CreatureID } & Callback<'onBack'>;

export const DisplayCreature = connect(mapStateToProps)(DisplayCreatureImpl);
