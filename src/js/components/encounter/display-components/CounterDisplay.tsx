import React, { StatelessComponent } from 'react';
import { Counter } from '../../../stores/counters';
import { CounterDisplayType } from '../../../stores/creature-attributes';

import styles from './CounterDisplay.scss';

type CounterProps =
    & { name: string, counter: Counter };

const HealthCounter: StatelessComponent<CounterProps> = ({ name, counter }: CounterProps) => {
    const width = (counter.currentValue / counter.maxValue * 100) + '%';

    return <div className={styles.counterBox}>
        <span className={styles.healthTitle}>{name}:</span>
        <span className={styles.counterValue}>{counter.currentValue} / {counter.maxValue}</span>
        <span className={styles.healthBarEmpty}><span style={{ width }} className={styles.healthBarFull}/></span>
    </div>;
};

const PipCounter: StatelessComponent<CounterProps> = ({ name, counter }: CounterProps) => {
    const used: string[] = Array(counter.currentValue).fill('️⚫');
    const spare: string[] = Array(counter.maxValue - counter.currentValue).fill('⚪️');
    const spans = used
        .concat(spare)
        .map((char, idx) =>
            <span key={idx} className={styles.pipItem}>{char}</span>);

    return <div className={styles.counterBox}>
        <span className={styles.pipTitle}>{name}</span>
        <span className={styles.pipValue}>{spans}</span>
    </div>;
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
