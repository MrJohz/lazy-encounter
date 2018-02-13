import React from 'react';
import { observer } from 'mobx-react';
import { CreatureGroup } from '../../models/creatures';
import { Callback } from '../../utils/jsx-props';

type DisplayTypeProps = { creatureGroup: CreatureGroup } & Callback<'onSelect', CreatureGroup>;

function DisplayType({ creatureGroup, onSelect }: DisplayTypeProps) {
    return <div onClick={() => onSelect(creatureGroup)}>
        {creatureGroup.name} - {creatureGroup.creatures.length}
    </div>;
}

type SelectKindProps = { creatures: CreatureGroup[] } & Callback<'onSelect', CreatureGroup>

@observer
export class SelectKind extends React.PureComponent<SelectKindProps> {
    render() {
        const { creatures, onSelect } = this.props;
        return <div>{
            creatures.map(creatureGroup =>
                <DisplayType key={creatureGroup.name} creatureGroup={creatureGroup} onSelect={onSelect}/>)
        }</div>;
    }
}
