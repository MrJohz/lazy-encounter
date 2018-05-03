import { observer } from 'mobx-react';
import React from 'react';
import { Creature } from '../../models/creatures';
import { Callback } from '../../utils/jsx-props';
import { FullWidth } from '../stylish/FullWidth';

type DisplayCreatureProps = { creature: Creature } & Callback<'onBack'>

@observer
export class DisplayCreature extends React.Component<DisplayCreatureProps> {
    render() {
        const { creature, onBack } = this.props;

        return <FullWidth onBack={onBack}>
            <pre>{JSON.stringify(creature, null, 2)}</pre>
        </FullWidth>;
    }
}
