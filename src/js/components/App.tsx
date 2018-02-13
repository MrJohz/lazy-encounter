import React from 'react';

import './App.css';
import { _initCreatures, CreatureStore } from '../models/creatures';
import { Encounter } from './encounter/Encounter';

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
        return <Encounter store={this.state.creatureStore}/>;
    }
}
