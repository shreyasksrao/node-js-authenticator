import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './SidebarPanel.css';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md';
import Tooltip from '@mui/material/Tooltip';

const resolveLinkPath = (childTo, parentTo) => `${parentTo}/${childTo}`;

const SubMenu = props => {
  const { item, depth } = props;
  const { label, Icon, to: headerToPath, children } = item;
  const location = useLocation();

  const [expanded, setExpand] = useState(
    location.pathname.includes(headerToPath)
  );

  const onExpandChange = e => {
    e.preventDefault();
    setExpand(expanded => !expanded);
  };
	
  return (
    <>
      <button
        className="navItem navItemHeaderButton"
        onClick={onExpandChange}
      >
        <div style={{width:`${depth*20}px`, minWidth: `${depth*20}px`}}></div> 
        <MdOutlineKeyboardArrowRight
          className={expanded ? "navItemHeaderChevron chevronExpanded": "navItemHeaderChevron"}
        />
        <Icon className="navIcon" />
        <span className="navLabel">{label}</span>
      </button>
   
      {expanded && (
        <div className="navChildrenBlock" >
          {children.map((item, index) => {
            const key = `${item.label}-${index}`;
            const { label, Icon, children } = item;

            if (children) {
              return (
                <div key={key}>
                  <SubMenu item={{...item, to: resolveLinkPath(item.to, props.item.to),}} depth={depth+1} />
                </div>
              );
            }

            return (
              <Tooltip title={label} enterDelay={200} leaveDelay={200} arrow>
                <NavLink
                  key={key}
                  to={resolveLinkPath(item.to, props.item.to)}
                  className="sub-menu-navitem"
                  style={{ paddingLeft: '0px'}}
                >
                  {/* Empty BOX to display space for Chevron */}
                  <div className="emptyBox" style={{width:`${((depth+1)*20)+20}px`, minWidth: `${((depth+1)*20)+20}px`}}></div> 
                  <Icon className="navIcon" />
                  <span className="navLabel">{label}</span>                
                </NavLink>
              </Tooltip>
            );
          })}
        </div>
      )}
    </>
  );
};

export default SubMenu;
