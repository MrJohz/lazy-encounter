import bind from 'bind-decorator';
import { observer } from 'mobx-react';
import React from 'react';
import { Creature, CreatureGroup } from '../../models/creatures';
import { Shortcut } from '../../shorty/react';
import { Callback, noBubble } from '../../utils/jsx-props';
import { OneItem, OneItemInstance, OneItemHandle } from '../../utils/one-at-a-time';
import { Popup, PopupItem } from '../stylish';
import { Square, StylishShortcutKeys as ShortcutKeys } from '../stylish';

type DisplayTypeProps
    = { kind: CreatureGroup, oneItemChild: OneItemInstance<string> }
    & Callback<'onSelect', CreatureGroup, Creature>;

export class DisplayType extends React.Component<DisplayTypeProps> {

    state: { listener: OneItemHandle | null, open: boolean } = { listener: null, open: false };

    componentDidMount() {
        const handle = this.props.oneItemChild.listen(state =>
            this.setState({ open: state, listener: handle }));
    }

    componentWillUnmount() {
        this.state.listener && this.state.listener.remove();
    }

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
        return <Square onClick={() => onSelect(kind, kind.creatures[0])}>
            <Shortcut shortcut={kind.name} onTrigger={() => onSelect(kind, kind.creatures[0])}>
                {kind.name} - {kind.creatures[0].attributes
                .filter(attr => attr.type === 'string')
                .map((attr: any) => attr['value'])}
                <ShortcutKeys/>
            </Shortcut>
        </Square>;
    }

    renderMany({ kind, onSelect, oneItemChild }: DisplayTypeProps) {
        return <Square onClick={this.invertSelector}>
            <Shortcut shortcut={kind.name} onTrigger={this.invertSelector}>
                {kind.name} - {kind.creatures.length} entries
                <Popup isOpen={oneItemChild.state()}>{
                    kind.creatures.map(creature =>
                        <PopupItem key={creature.name} onClick={noBubble(() => onSelect(kind, creature))}>
                            <Shortcut shortcut={creature.name} onTrigger={() => onSelect(kind, creature)}>
                                {creature.name} - {creature.attributes
                                .filter(attr => attr.type === 'string')
                                .map((attr: any) => attr['value'])}
                                <ShortcutKeys/>
                            </Shortcut>
                        </PopupItem>)
                }</Popup>
                <ShortcutKeys/>
            </Shortcut>
        </Square>;
    }
}

type SelectInstanceProps
    = { creatures: CreatureGroup[] }
    & Callback<'onSelect', CreatureGroup, Creature>;

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
