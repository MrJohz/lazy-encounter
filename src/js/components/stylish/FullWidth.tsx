import React, { StatelessComponent } from 'react';

import { Children, Optional, ManyChildren, Callback } from '../../utils/jsx-props';
import { Back } from './Back';

import styles from './FullWidth.scss';

type Props = Children
    & Callback<'onBack'>
    & Optional<ManyChildren<'actions'>>;

export const FullWidth: StatelessComponent<Props> = ({ children, actions=[], onBack }: Props) => {
    return <>
        <div className={styles.fullWidth}>{children}</div>
        <Back onBack={onBack}/>
        {actions}
    </>;
};
