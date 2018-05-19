import React, { MouseEvent } from 'react';
import classNames from 'classnames';

import { Children, childrenise, Callback, Optional, ClassName } from '../../utils/jsx-props';
import { Popup } from './Popup';

import styles from './Square.scss';

type Props = Children
    & Optional<{ isOpen: boolean }>
    & Optional<Children<'popup'>>
    & Optional<Callback<'onClick', MouseEvent<HTMLDivElement>>>;

export function Square(props: Props) {
    const { children, popup, isOpen, ...rest } = props;

    const popupItems = childrenise(popup);

    return <div className={styles.squareBase}>
        <div className={styles.square} {...rest}>
            {childrenise(children)}
            <div className={styles.topShadow}/>
            <div className={styles.bottomShadow}/>
        </div>
        {popupItems && popupItems.length
            ? <Popup isOpen={isOpen || false}>{popupItems}</Popup>
            : null }
    </div>;
}
