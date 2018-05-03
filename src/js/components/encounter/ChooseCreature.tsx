import bind from 'bind-decorator';
import { observable, action } from 'mobx';
import React from 'react';
import { observer } from 'mobx-react';
import { Creature, CreatureGroup } from '../../models/creatures';
import { Callback, noBubble } from '../../utils/jsx-props';
import { Popup, PopupItem } from '../stylish/Popup';
import { Square } from '../stylish/Square';

type DisplayTypeProps = { kind: CreatureGroup } & Callback<'onSelect', Creature>;

@observer
export class DisplayType extends React.Component<DisplayTypeProps> {
    render() {
        const { kind } = this.props;
        switch (kind.creatures.length) {
            case 1:
                return this.renderSingle(this.props);
            default:
                return this.renderMany(this.props);
        }
    }

    @observable
    isSelectorOpen = false;

    @bind
    @action
    invertSelector(): void {
        this.isSelectorOpen = !this.isSelectorOpen;
    }

    renderSingle({ kind, onSelect }: DisplayTypeProps) {
        return <Square onClick={() => onSelect(kind.creatures[0])}>
            {kind.name} - {kind.creatures[0].attributes}
        </Square>;
    }

    renderMany({ kind, onSelect }: DisplayTypeProps) {
        return <Square onClick={this.invertSelector}>
            {kind.name} - {kind.creatures.length} entries
            <Popup isOpen={this.isSelectorOpen}>{
                kind.creatures.map(creature =>
                    <PopupItem key={creature.name} onClick={noBubble(() => onSelect(creature))}>
                        {creature.name} - {creature.attributes}
                    </PopupItem>)
            }</Popup>
        </Square>;
    }
}

type SelectInstanceProps
    = { creatures: CreatureGroup[] }
    & Callback<'onSelect', Creature>;

@observer
export class ChooseCreature extends React.Component<SelectInstanceProps> {
    render() {
        const { creatures, onSelect } = this.props;
        return creatures.map(creatureGroup =>
            <DisplayType key={creatureGroup.name} kind={creatureGroup} onSelect={onSelect}/>);
    }
}
