import React from 'react';
import { NavLink } from 'react-router-dom';
import './SidebarPanel.css';
import SubMenu from './SubMenu';
import Tooltip from '@mui/material/Tooltip';

const SidePanelItem = props => {
  const { label, Icon, to, children } = props.item;

  if (children) {
    return <SubMenu item={props.item} depth={0} />;
  }

  return (
    <Tooltip title={label} enterDelay={200} leaveDelay={200} arrow>
      <NavLink
        exact="true"
        to={to}
        className="navItem"
      >
        <div className="emptyBox" style={{width:'20px', minWidth:'20px'}}></div>
        <Icon className="navIcon" />
        <span className="navLabel">{label}</span>
      </NavLink>
    </Tooltip>
  );
};

export default SidePanelItem;
