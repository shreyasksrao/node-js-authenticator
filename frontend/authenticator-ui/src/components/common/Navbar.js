import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types'

export default function Navbar(props) {

  const title = props.title;
  const actions = props.actions;
  return (
    <nav>
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

Navbar.prototype = {
    title: PropTypes.string,
    actions: PropTypes.array,
};