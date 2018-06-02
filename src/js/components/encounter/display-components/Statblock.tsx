import React, { StatelessComponent } from 'react';
import { StatblockAttribute } from '../../../stores/creature-attributes';
import { Num } from './assorted';

type StatblockProps = { stats: StatblockAttribute['stats'] }

export const Statblock: StatelessComponent<StatblockProps> = ({ stats }: StatblockProps) => {
    return <div>
        {stats.map(stat => <div key={stat.name}>
            <span>{stat.name}</span>
            <span>{<Num num={stat.value}/>}</span>
            {stat.computed == null ? null : <span>{<Num num={stat.computed}/>}</span>}
        </div>)}
    </div>;
};
