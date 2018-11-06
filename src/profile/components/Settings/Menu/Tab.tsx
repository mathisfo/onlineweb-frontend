import classnames from 'classnames';
import React from 'react';
import { Link } from 'react-router-dom';
import style from './menu.less';

export interface IProps {
  path: string;
  active: boolean;
  text: string;
}

const Tab = ({ path, active, text }: IProps) => (
  <Link
    to={path}
    className={classnames({
      [style.tab]: true,
      [style.active]: active,
    })}
  >
    <p>{text}</p>
  </Link>
);

export default Tab;
