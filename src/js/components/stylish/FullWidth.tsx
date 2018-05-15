import classNames from 'classnames';
import React from 'react';

import { Children, childrenise, Optional, ClassName } from '../../utils/jsx-props';

import styles from './FullWidth.css';

type Props = Children
    & Optional<ClassName>;

export class FullWidth extends React.PureComponent<Props> {
    render() {
        const { children, className } = this.props;

        const header: any = (childrenise(children) || []).filter((child: any) => child.type === FullWidth.Header)[0];
        console.log(header.props.children);
        const mergedClass = classNames(styles.fullWidth, className);

        return <div className={mergedClass}>{

        }</div>;
    }

    static Header(children: Children) {
        return <>{childrenise(children)}</>;
    }

    static Actions(children: Children) {
        return <>{childrenise(children)}</>;
    }
}
