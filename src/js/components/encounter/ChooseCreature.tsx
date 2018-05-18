import bind from 'bind-decorator';
import { List, Map } from 'immutable';
import React, { Component, PureComponent, StatelessComponent } from 'react';
import { connect } from 'react-redux';

import { Shortcut } from '../../shorty/react';
import { AppState } from '../../stores';
import { CreatureGroup } from '../../stores/creature-groups';
import { Creature, CreatureID } from '../../stores/creatures';
import { Callback, noBubble } from '../../utils/jsx-props';
import { OneItemHandle, OneItemInstance, OneItem } from '../../utils/one-at-a-time';
import { StylishShortcutKeys as ShortcutKeys, Square, Popup, PopupItem } from '../stylish';

type DisplayTypeProps
    = { kind: { name: string, creatures: List<Creature> }, oneItemChild: OneItemInstance<string> }
    & Callback<'onSelect', CreatureID>;

export class DisplayType extends Component<DisplayTypeProps> {

    state: { listener: OneItemHandle | null, open: boolean } = { listener: null, open: false };

    componentDidMount() {
        const handle = this.props.oneItemChild.listen(state => {
            return this.setState({ open: state, listener: handle });
        });
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
        switch (kind.creatures.size) {
            case 1:
                return this.renderSingle(this.props);
            default:
                return this.renderMany(this.props);
        }
    }

    renderSingle({ kind, onSelect }: DisplayTypeProps) {
        const creature = kind.creatures.get(0) as Creature;
        return <Square onClick={() => onSelect(creature.id)}>
            <Shortcut shortcut={kind.name} onTrigger={() => onSelect(creature.id)}>
                {kind.name} - {creature.attributes
                .filter(attr => attr.type === 'string')
                .map((attr: any) => attr['value'])}
                <ShortcutKeys/>
            </Shortcut>
        </Square>;
    }

    renderMany({ kind, onSelect, oneItemChild }: DisplayTypeProps) {
        return <Square onClick={this.invertSelector}>
            <Shortcut shortcut={kind.name} onTrigger={this.invertSelector}>
                {kind.name} - {kind.creatures.size} entries
                <Popup isOpen={oneItemChild.state()}>{
                    kind.creatures.map(creature =>
                        <PopupItem key={creature.name} onClick={noBubble(() => onSelect(creature.id))}>
                            <Shortcut shortcut={creature.name} onTrigger={() => onSelect(creature.id)}>
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

type ImplProps
    = { groups: List<CreatureGroup>, creatures: Map<CreatureID, Creature> }
    & ChooseCreatureProps;

const ChooseCreatureImpl: StatelessComponent<ImplProps> = ({groups, creatures, onSelect}: ImplProps) => {

    const oneItemParent = new OneItem<string>();
    return <>
        {groups.map(group => {
            const name = group.name;
            const creatureList = group.creatures.map(cr => creatures.get(cr) as Creature);
            return <DisplayType key={group.id}
                                onSelect={onSelect}
                                kind={{ name, creatures: creatureList }}
                                oneItemChild={oneItemParent.instance(group.id)}/>;
        })}
    </>;

};

const mapStateToProps = (state: AppState, existing: ChooseCreatureProps): ImplProps => {
    return ({
        groups: state.creatureGroups.ids.map(id => state.creatureGroups.map.get(id) as CreatureGroup),
        creatures: state.creatures.map,
        ...existing
    });
};

type ChooseCreatureProps
    = Callback<'onSelect', CreatureID>;

export const ChooseCreature = connect(mapStateToProps)(ChooseCreatureImpl);
