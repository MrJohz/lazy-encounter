import bind from 'bind-decorator';
import { observable, action } from 'mobx';
import React from 'react';
import { observer } from 'mobx-react';
import { Creature, CreatureGroup } from '../../models/creatures';
import { Callback, noBubble } from '../../utils/jsx-props';
import { Square } from '../stylish/Square';

import styles from './ChooseCreature.css';

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
    invertSelector() {
        this.isSelectorOpen = !this.isSelectorOpen;
    }

    renderSingle({ kind, onSelect }: DisplayTypeProps) {
        return <Square onClick={() => onSelect(kind.creatures[0])}>
            {kind.name} - {kind.creatures[0].attributes}
        </Square>;
    }

    renderMany({ kind }: DisplayTypeProps) {
        return <Square onClick={this.invertSelector}>
            {kind.name} - {kind.creatures.length} entries
            {this.renderExtendedSelector(this.props)}
        </Square>;
    }

    renderExtendedSelector({ kind, onSelect }: DisplayTypeProps) {
        return <ul className={styles.creatureList}>{
            this.isSelectorOpen
                ? [
                    <li className={styles.backButton} key={'__BACK__'}>🗙</li>,
                    ...kind.creatures.map((creature) =>
                        <li key={creature.name} onClick={noBubble(() => onSelect(creature))}>
                            {creature.name} - {creature.attributes}
                        </li>)]
                : []  // empty list
        }</ul>;
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
