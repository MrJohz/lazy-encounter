import React from 'react';
import { observer } from 'mobx-react';
import { Creature, CreatureGroup } from '../../models/creatures';
import { Callback } from '../../utils/jsx-props';

type DisplayTypeProps = { creature: Creature } & Callback<'onSelect', Creature>;

function DisplayType({ creature, onSelect }: DisplayTypeProps) {
    return <div onClick={() => onSelect(creature)}>
        {creature.name} - {creature.attributes}
    </div>;
}

type SelectInstanceProps = { creatures: CreatureGroup } & Callback<'onSelect', Creature>

@observer
export class SelectInstance extends React.PureComponent<SelectInstanceProps> {
    render() {
        const {creatures, onSelect} = this.props;
        return <div>{
            creatures.creatures.map(creature =>
                <DisplayType key={creature.name} creature={creature} onSelect={onSelect}/>,
            )}</div>
    }
}
