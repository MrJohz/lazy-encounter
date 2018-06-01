import React from 'react';

import { ShortyProvider } from '../shorty/react';
import { Encounter } from './encounter/Encounter';

import styles from './App.css';

export function App() {
    return <div className={styles.app}>
        <header className={styles.header}>
            <h1>S2T2 - Super Simple Turn&nbsp;Tracker</h1>
        </header>
        <Encounter/>
    </div>
}
