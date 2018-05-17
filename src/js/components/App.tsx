import React from 'react';

import { _initCreatures, CreatureStore } from '../models/creatures';
import { ShortyProvider } from '../shorty/react';
// import { Encounter } from './encounter/Encounter';
import { Encounter } from './encounter2/Encounter';

import styles from './App.css';

export type AppState = {};
export type AppProps = {};

export class App extends React.Component<AppProps, AppState> {

    state = {
        creatureStore: new CreatureStore(),
    };

    constructor(props: AppProps) {
        super(props);

        _initCreatures(this.state.creatureStore);
    }

    render() {
        return <div className={styles.app}>
            <ShortyProvider global={true}>
                <header className={styles.header}>
                    <h1>S2T2 - Super Simple Turn Tracker</h1>
                </header>
                {/*<Encounter store={this.state.creatureStore}/>*/}
                <Encounter />
            </ShortyProvider>
        </div>;
    }
}
