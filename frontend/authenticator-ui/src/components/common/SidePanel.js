import React from 'react';
import SidePanelItem from './SidePanelItem';
import PropTypes from 'prop-types';
import './SidebarPanel.css';

export default function SidePanel({ sidePanelLinks }) {
  return (
    <div className='side-panel-container'>
        <div className='logo-container'>
            <img className='logo-image' src={process.env.PUBLIC_URL+"logo.png"} alt='App Logo'/>
        </div>
        <div>
            
        </div>
        <nav className='side-panel-list'>
            {sidePanelLinks.map((item, index) => 
                <SidePanelItem key={`${item.label}-${index}`} item={item} />
            )}
        </nav>
    </div>
  )
}

SidePanel.propTypes = {
    sidePanelLinks: PropTypes.array,
};
