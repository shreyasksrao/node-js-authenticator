import React from "react";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAlignLeft } from "@fortawesome/free-solid-svg-icons";
import { Navbar, Button, Nav } from "react-bootstrap";
import PropTypes from 'prop-types'

const NavBar = ({ toggle, actions }) => {
    return (
      <Navbar
        className="navbar shadow-sm p-3 mb-5"
        expand
      >
        <div>
          <Button className="sidebar-colapse-btn" variant="outline-info" onClick={toggle}>
            <FontAwesomeIcon icon={faAlignLeft} />
          </Button>
        </div>
        <div>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="ml-auto" navbar>
              { actions.map( action => <Link className='navbar-link' to={action.href} style={{color: 'white'}}>{action.title}</Link>)}
            </Nav>
          </Navbar.Collapse>
        </div>
      </Navbar>
    );
}

NavBar.prototype = {
  toggle: PropTypes.func,
  actions: PropTypes.object,
};

export default NavBar;