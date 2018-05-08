import React from 'react';
import { Children, childrenise } from '../../utils/jsx-props';

import styles from './Popup.css';

export type PopupProps
    = { isOpen: boolean }
    & Children;

export function Popup({ isOpen, children }: PopupProps) {
    const childList = childrenise(children);

    // TODO: warn or error if invalid child passed

    return <ul className={styles.popup}>{
        isOpen
            ? childList
            : []
    }</ul>;
}

export type PopupItemProps
    = React.DetailedHTMLProps<React.LiHTMLAttributes<HTMLLIElement>, HTMLLIElement>;

export class PopupItem extends React.PureComponent<PopupItemProps> {
    render() {
        return <li {...this.props}/>;
    }
}
