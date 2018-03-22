// @flow
import * as React from 'react';
import formatAmount from 'utils/formatAmount';
import styles from './styles.scss';

type LegendItemProps = {
  color: string,
  value: number,
  label: string,
  options: Object
};

const LegendItem = ({ color, label, value, options }: LegendItemProps) => (
  <li style={{ color }}>
    <span>{label}</span>
    <span className={styles.value}> {formatAmount(value, true, options.percent || false).text} </span>
  </li>
);

export default LegendItem;
