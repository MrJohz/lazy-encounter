import { useStrict } from 'mobx';
useStrict(true);

import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './components/App';

ReactDOM.render(
    <App/>,
    document.getElementById('hub'));
