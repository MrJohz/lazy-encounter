import { observer } from 'mobx-react';
import React from 'react';
import { Creature } from '../../models/creatures';
import { Shortcut } from '../../shorty/react';
import { Callback } from '../../utils/jsx-props';
import { FullWidth, StylishShortcutKeys as ShortcutKeys } from '../stylish';

type DisplayCreatureProps = { creature: Creature } & Callback<'onBack'>

@observer
export class DisplayCreature extends React.Component<DisplayCreatureProps> {
    render() {
        const { creature, onBack } = this.props;

        return <FullWidth>
            <FullWidth.Header>
                <h1>{creature.name} - {creature.attributes}</h1>
                <Shortcut shortcut={'back'} onTrigger={onBack} children={<ShortcutKeys/>}/>
            </FullWidth.Header>
            <FullWidth.Actions>

            </FullWidth.Actions>
        </FullWidth>;
    }
}
