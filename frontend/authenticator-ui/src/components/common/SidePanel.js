import React from 'react';
import SidePanelItem from './SidePanelItem';
import PropTypes from 'prop-types';
import './SidebarPanel.css';

export default function SidePanel({ sidePanelLinks, toggle, isOpen }) {
  return (
    <div className={`${isOpen ? 'sidebar side-panel-container is-open': 'sidebar side-panel-container'}`}>
        <div className='logo-container'>
            <img className='logo-image' src="/logo.PNG" alt='App Logo'/>
        </div>
        <div className='company-title-container'>
            <p className='company-title'>AUTHENTICATOR</p>
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
