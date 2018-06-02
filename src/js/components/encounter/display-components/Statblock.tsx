import React, { StatelessComponent } from 'react';
import { StatblockAttribute } from '../../../stores/creature-attributes';
import { Num } from './assorted';

import styles from './Statblock.scss';

type StatblockProps = { stats: StatblockAttribute['stats'] }

export const Statblock: StatelessComponent<StatblockProps> = ({ stats }: StatblockProps) => {
    return <div className={styles.statblock}>
        {stats.map(stat =>
            <div key={stat.name} className={styles.statBox}>
                <span className={styles.statName}>{stat.name}</span>
                <span className={styles.mainStat}>{<Num num={stat.value}/>}</span>
                {stat.computed == null ? null : <span className={styles.calcStat}>{<Num num={stat.computed}/>}</span>}
            </div>)}
    </div>;
};
