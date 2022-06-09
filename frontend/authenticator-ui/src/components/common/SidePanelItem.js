import React from 'react';
import { NavLink } from 'react-router-dom';
import './SidebarPanel.css';
import SubMenu from './SubMenu';

const SidePanelItem = props => {
  const { label, Icon, to, children } = props.item;

  if (children) {
    return <SubMenu item={props.item} depth={0} />;
  }

  return (
    <NavLink
      exact
      to={to}
      className="navItem"
      activeClassName="activeNavItem"
    >
      <div style={{width:'20px'}}></div>
      <Icon className="navIcon" />
      <span className="navLabel">{label}</span>
    </NavLink>
  );
};

export default SidePanelItem;
