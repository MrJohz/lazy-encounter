import React from 'react';

import './App.css';

export type AppState = {};
export type AppProps = {};

export class App extends React.Component<AppProps, AppState> {

    constructor(props: AppProps) {
        super(props);
    }

    render() {
        return <div>Welcome to the Project!</div>;
    }
}
