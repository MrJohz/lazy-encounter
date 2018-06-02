import React, { StatelessComponent } from 'react';
import { DisplayNumber } from '../../../stores/creature-attributes';

type NumProps = { num: DisplayNumber }

export const Num: StatelessComponent<NumProps> = ({ num }: NumProps) => {
    if (typeof num === 'number') {
        return <>{num}</>;
    } else if (num.withSign) {
        if (num.value >= 0) return <>{'+' + num.value}</>;
        else return <>{num.value}</>;
    } else {
        return <>{num.value}</>;
    }
};
