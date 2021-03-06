import React from 'react';
import { Callback } from '../../utils/jsx-props';
import { Square } from './Square';

import styles from './Back.css';

type Props = Callback<'onBack'>;

export function Back({onBack}: Props) {
    return <Square onClick={onBack}>
        <div className={styles.icon}>
            <i className={'fas fa-arrow-left'}/>
            <div>Back</div>
        </div>
    </Square>;
}
