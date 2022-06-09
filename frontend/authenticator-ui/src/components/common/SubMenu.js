import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './SidebarPanel.css';
import { ChevronRightIcon } from '@heroicons/react/outline';

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
        <ChevronRightIcon
          className={expanded ? "navItemHeaderChevron chevronExpanded": "navItemHeaderChevron"}
        />
        <Icon className="navIcon" />
        <span className="navLabel">{label}</span>
      </button>

      {expanded && (
        <div className="navChildrenBlock" style={{marginLeft: `20px`}}>
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
              <NavLink
                key={key}
                to={resolveLinkPath(item.to, props.item.to)}
                className="sub-menu-navitem"
                activeClassName="activeNavItem"
                style={{ paddingLeft: '0px'}}
              >
                {/* Empty BOX to display space for Chevron */}
                <div style={{width:'20px'}}></div> 
                <Icon className="navIcon" />
                <span className="navLabel">{label}</span>
              </NavLink>
            );
          })}
        </div>
      )}
    </>
  );
};

export default SubMenu;
