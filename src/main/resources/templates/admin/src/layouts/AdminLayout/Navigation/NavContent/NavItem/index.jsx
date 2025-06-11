import React, { useContext } from 'react';
import { NavLink} from 'react-router-dom';
import { ListGroup } from 'react-bootstrap';

import NavIcon from '../NavIcon';
import NavBadge from '../NavBadge';

import { ConfigContext } from '../../../../../contexts/ConfigContext';
import * as actionType from '../../../../../store/actions';
import useWindowSize from '../../../../../hooks/useWindowSize';

const NavItem = ({ item }) => {
    const windowSize = useWindowSize();
    const { dispatch } = useContext(ConfigContext);

    const itemTitle = item.icon ? <span className="pcoded-mtext">{item.title}</span> : item.title;
    const itemTarget = item.target ? '_blank' : '';

    const subContent = item.external ? (
        <a href={item.url} target="_blank" rel="noopener noreferrer" className="nav-link">
            <NavIcon items={item} />
            {itemTitle}
            <NavBadge items={item} />
        </a>
    ) : (
        <NavLink
            to={item.url}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            target={itemTarget}
        >
            <NavIcon items={item} />
            {itemTitle}
            <NavBadge items={item} />
        </NavLink>
    );

    const listGroupItemClass = item.classes || '';

    return (
        <>
            <style>{`
        .nav-link.active {
          background-color: #e6f7ff !important;
          color: #1890ff !important;
          border-radius: 6px;
        }
        li > .nav-link.active {
          background-color: #e6f7ff !important;
          color: #1890ff !important;
        }
      `}</style>

            <ListGroup.Item
                as="li"
                bsPrefix=" "
                className={listGroupItemClass}
                onClick={windowSize.width < 992 ? () => dispatch({ type: actionType.COLLAPSE_MENU }) : undefined}
            >
                {subContent}
            </ListGroup.Item>
        </>
    );
};

export default NavItem;
