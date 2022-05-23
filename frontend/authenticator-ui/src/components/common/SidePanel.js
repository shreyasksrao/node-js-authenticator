import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types'

export default function SidePanel(props) {

  const title = props.title;
  const actions = props.actions;
  return (
    <nav className='navbar'>
        <div className='navbar-container'>
            <div className='company-name'>
                {title}
            </div>
            <div className='navbar-items'>
                {actions.map(action => <div className='navbar-item'><Link className='navbar-link' to={action.href}>{action.title}</Link></div>)}
            </div>
        </div>
    </nav>
  )
}

SidePanel.prototype = {
    title: PropTypes.string,
    actions: PropTypes.object,
};