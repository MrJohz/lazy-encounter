import { observer } from 'mobx-react';
import React from 'react';
import { Creature } from '../../models/creatures';
import { NoArgCallback } from '../../utils/jsx-props';

type DisplayCreatureProps = { creature: Creature } & NoArgCallback<'onBack'>

@observer
export class DisplayCreature extends React.PureComponent<DisplayCreatureProps> {
    render() {
        const { creature, onBack } = this.props;
        return <div>
            <div onClick={onBack}>BACK</div>
            <pre>{JSON.stringify(creature, null, 2)}</pre>
        </div>;
    }
}
