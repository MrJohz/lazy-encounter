import bind from 'bind-decorator';
import { observer } from 'mobx-react';
import React from 'react';
import { Creature, CreatureGroup } from '../../models/creatures';
import { Shortcut } from '../../shorty/react';
import { Callback, noBubble } from '../../utils/jsx-props';
import { OneItem, OneItemInstance } from '../../utils/one-at-a-time';
import { Popup, PopupItem } from '../stylish/Popup';
import { Square } from '../stylish/Square';

type DisplayTypeProps = { kind: CreatureGroup, oneItemChild: OneItemInstance<string> } & Callback<'onSelect', Creature>;

@observer
export class DisplayType extends React.Component<DisplayTypeProps> {

    @bind
    invertSelector(): void {
        this.props.oneItemChild.invert();
    }

    render() {
        const { kind } = this.props;
        switch (kind.creatures.length) {
            case 1:
                return this.renderSingle(this.props);
            default:
                return this.renderMany(this.props);
        }
    }

    renderSingle({ kind, onSelect }: DisplayTypeProps) {
        return <Square onClick={() => onSelect(kind.creatures[0])}>
            <Shortcut shortcut={kind.name} onTrigger={() => onSelect(kind.creatures[0])}>
                {kind.name} - {kind.creatures[0].attributes}
            </Shortcut>
        </Square>;
    }

    renderMany({ kind, onSelect, oneItemChild }: DisplayTypeProps) {
        return <Square onClick={this.invertSelector}>
            <Shortcut shortcut={kind.name} onTrigger={this.invertSelector}>
                {kind.name} - {kind.creatures.length} entries
                <Popup isOpen={oneItemChild.state()}>{
                    kind.creatures.map(creature =>
                        <PopupItem key={creature.name} onClick={noBubble(() => onSelect(creature))}>
                            <Shortcut shortcut={creature.name} onTrigger={() => onSelect(creature)}>
                                {creature.name} - {creature.attributes}
                            </Shortcut>
                        </PopupItem>)
                }</Popup>
            </Shortcut>
        </Square>;
    }
}

type SelectInstanceProps
    = { creatures: CreatureGroup[] }
    & Callback<'onSelect', Creature>;

// TODO: move 'open'/click functionality into this parent class
// this way we can ensure that only one child menu is open at a time

@observer
export class ChooseCreature extends React.Component<SelectInstanceProps> {

    oneItemParent = new OneItem<string>();

    render() {
        const { creatures, onSelect } = this.props;
        return creatures.map(creatureGroup =>
            <DisplayType key={creatureGroup.name}
                         kind={creatureGroup}
                         onSelect={onSelect}
                         oneItemChild={this.oneItemParent.instance(creatureGroup.name)}/>);
    }
}
