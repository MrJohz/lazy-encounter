import React from 'react';

import { Encounter } from './encounter/Encounter';

import styles from './App.scss';

export function App() {
    return <div className={styles.app}>
        <header className={styles.header}>
            <h1>S2T2 - Super Simple Turn&nbsp;Tracker</h1>
        </header>
        <Encounter/>
    </div>
}
