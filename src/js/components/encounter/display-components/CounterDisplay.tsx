import React, { StatelessComponent } from 'react';
import { Counter } from '../../../stores/counters';
import { CounterDisplayType } from '../../../stores/creature-attributes';

import styles from './CounterDisplay.scss';

type CounterProps =
    & { name: string, counter: Counter };

const HealthCounter: StatelessComponent<CounterProps> = ({ name, counter }: CounterProps) => {
    const width = (counter.currentValue / counter.maxValue * 100) + '%';

    return <div className={styles.healthBox}>
        <span className={styles.healthTitle}>{name}:</span>
        <span className={styles.healthValue}>{counter.currentValue} / {counter.maxValue}</span>
        <span className={styles.healthBarEmpty}><span style={{ width }} className={styles.healthBarFull} /></span>
    </div>;
};

const PipCounter: StatelessComponent<CounterProps> = ({ counter }: CounterProps) => {
    const list: string[] = Array(counter.currentValue).fill('*');
    return <div>{list}</div>;
};

type CounterDispProps = { name: string, counter: Counter, display: CounterDisplayType }

export const CounterDisplay: StatelessComponent<CounterDispProps> = ({ name, counter, display }: CounterDispProps) => {
    switch (display) {
        case 'health':
            return <HealthCounter name={name} counter={counter}/>;
        case 'pips':
            return <PipCounter name={name} counter={counter}/>;
    }
};
