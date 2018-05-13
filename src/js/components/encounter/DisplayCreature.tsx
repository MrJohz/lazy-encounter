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

        return <FullWidth onBack={onBack}>
            <Shortcut shortcut={'back'} onTrigger={onBack}>
                <pre>{JSON.stringify(creature, null, 2)}</pre>
                <ShortcutKeys/>
            </Shortcut>
        </FullWidth>;
    }
}
