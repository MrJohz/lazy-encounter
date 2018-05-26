import React, { MouseEvent } from 'react';

import { Children, childrenise, Callback, Optional } from '../../utils/jsx-props';
import { Popup } from './Popup';

import styles from './Square.scss';

type Props = Children
    & Optional<Children<'popups'> & { popupOpen: boolean }>
    & Optional<Callback<'onClick', MouseEvent<HTMLDivElement>>>;

export function Square({ children, popups, popupOpen, ...rest }: Props) {

    return <div className={styles.square} {...rest}>
        {childrenise(children)}
        <Popup isOpen={popupOpen || false} children={popups}/>
    </div>;
}
