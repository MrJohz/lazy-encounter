import React from 'react';
import { observer } from 'mobx-react';
import { Creature, CreatureGroup } from '../../models/creatures';
import { Callback, NoArgCallback } from '../../utils/jsx-props';
import { Back } from '../stylish/Back';
import { Square } from '../stylish/Square';

type DisplayTypeProps = { creature: Creature } & Callback<'onSelect', Creature>;

function DisplayType({ creature, onSelect }: DisplayTypeProps) {
    return <Square onClick={() => onSelect(creature)}>
        {creature.name} - {creature.attributes}
    </Square>;
}

type SelectInstanceProps
    = { creatures: CreatureGroup }
    & Callback<'onSelect', Creature>
    & NoArgCallback<'onBack'>;

@observer
export class SelectInstance extends React.PureComponent<SelectInstanceProps> {
    render() {
        const { creatures, onSelect, onBack } = this.props;
        return [
            <Back {...{ onBack }} />,
            ...creatures.creatures.map(creature =>
                <DisplayType key={creature.name} creature={creature} onSelect={onSelect}/>),
        ];
    }
}
