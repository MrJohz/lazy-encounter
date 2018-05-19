import React, { MouseEvent } from 'react';
import classNames from 'classnames';

import { Children, childrenise, Callback, Optional, ClassName } from '../../utils/jsx-props';

import styles from './Square.scss';

type Props = Children
    & Optional<Callback<'onClick', MouseEvent<HTMLDivElement>>>;

export function Square(props: Props) {
    const { children, ...rest } = props;

    return <div className={styles.square} {...rest}>{
        childrenise(children)
    }</div>;
}
