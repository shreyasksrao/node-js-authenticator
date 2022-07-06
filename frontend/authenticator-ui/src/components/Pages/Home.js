import React, { Fragment, useState, useEffect } from "react";
import NavBar from '../common/Navbar';
import SidePanel from '../common/SidePanel';
import { Routes, Route} from 'react-router-dom';
import RequireAuth from '../common/RequireAuth';

import {
  UserIcon,
  UserCircleIcon,
  ShieldCheckIcon,
  LockOpenIcon,
  DeviceMobileIcon,
} from '@heroicons/react/outline';

import {
  FaUserCog
} from 'react-icons/fa';

import {
  MdSettings, 
  MdHome
} from 'react-icons/md';

import {
  AiFillApi
} from 'react-icons/ai';

import UserActionsPage from "../Users/UserActionsPage";
import EndpointsActionsPage from "../Endpoints/EndpointsActionsPage";

const Home = () => {
  const actionLinks = [
    {title: 'Home', href: '/'}, 
    {title: 'Profile', href: '/'},
    {title: 'Contact Us', href: '/'},
  ];

  const sideMenu = [
    {
      label: 'Home',
      Icon: MdHome,
      to: '/',
    },
    {
      label: 'Profile',
      Icon: UserIcon,
      to: '/profile',
    },
    {
      label: 'User Actions',
      Icon: FaUserCog,
      to: '/userActions'
    },
    {
      label: 'Endpoint Actions',
      Icon: AiFillApi,
      to: '/endpointActions'
    },
    {
      label: 'Settings',
      Icon: MdSettings,
      to: '/settings',
      children: [
        {
          label: 'Account',
          Icon: UserCircleIcon,
          to: 'account',
        },
        {
          label: 'Account2',
          Icon: UserCircleIcon,
          to: 'account',
        },
        {
          label: 'Security',
          Icon: ShieldCheckIcon,
          to: 'security',
          children: [
            {
              label: 'Credentials',
              Icon: LockOpenIcon,
              to: 'credentials',
            },
            {
              label: '2-FA-abvcaioqdqkcnakhuqdamnakjhdquhdqlksnaklquihdqmnakiuq',
              Icon: DeviceMobileIcon,
              to: '2fa',
            },
          ],
        },
      ],
    },
  ];

  const [isOpen, setOpen] = useState(true);
  const [isMobile, setMobile] = useState(false);
  const [isLoggedIn, setLoggedIn] = useState(true);
  const [previousWidth, setPreviousWidth] = useState(-1);

  const updateWidth = () => {
    const width = window.innerWidth;
    const widthLimit = 576;
    const isMobile = width <= widthLimit;
    const wasMobile = previousWidth <= widthLimit;
    if (isMobile !== wasMobile) setOpen(!isMobile);
    setPreviousWidth(width);
  };

  //componentDidMount
  useEffect(() => {
    updateWidth();
    window.addEventListener("resize", updateWidth);
  }, []);

  //componentWillUnMount
  useEffect(() => {
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const toggle = () => {
    setOpen(!isOpen);
  };

  return (
      // <Fragment>
      //     {isOpen && <SidePanel sidePanelLinks={sideMenu} toggle={toggle} isOpen={isOpen}/>}
      //     <div className={isOpen ? 'main content is-open': 'main content'}>
      //       <div className="navbar-container">
      //           <NavBar title='Authenticator' actions={actionLinks} toggle={toggle}/>
      //       </div>
      //       <div className="main-content">
      //         <Routes>
      //           <Route path="/" element={
      //             <RequireAuth redirectTo="/login" redirectState={{redirectTo: "/"}}>
      //               <p>Hello From Shreyas</p>
      //             </RequireAuth>
                  
      //           }/>
      //           <Route path="/userActions" element={
      //             <RequireAuth redirectTo="/login" redirectState={{redirectTo: "/userActions"}}>
      //               <UserActionsPage />
      //             </RequireAuth>}
      //           />
      //           <Route path="/endpointActions" element={
      //             <RequireAuth redirectTo="/login" redirectState={{redirectTo: "/endpointActions"}}>
      //               <EndpointsActionsPage />
      //             </RequireAuth>}
      //           />
      //           <Route path="/profile" element={<p>This is Profile Page</p>}/>
      //           <Route path="/settings/account" element={<p>This is Accounts Page</p>}/>
      //           <Route path="/settings/security/credentials" element={<p>This is Credentials Page</p>}/>
      //           <Route path="*" element={
      //             <main style={{ padding: "1rem" }}>
      //               <p>There's nothing here!</p>
      //             </main>
      //           }/>
      //         </Routes>
      //       </div>
      //     </div> 
      // </Fragment>


      <Fragment>
        <div className="navbar-container">
          <NavBar title='Authenticator' actions={actionLinks} toggle={toggle}/>
        </div>
        <div className="contentWrapper">
        {isOpen && <SidePanel sidePanelLinks={sideMenu} toggle={toggle} isOpen={isOpen}/>}
          <div className={isOpen ? 'main content is-open': 'main content'}>
            <div className="main-content">
              <Routes>
                <Route path="/" element={
                  <RequireAuth redirectTo="/login" redirectState={{redirectTo: "/"}}>
                    <p>Hello From Shreyas</p>
                  </RequireAuth>
                  
                }/>
                <Route path="/userActions" element={
                  <RequireAuth redirectTo="/login" redirectState={{redirectTo: "/userActions"}}>
                    <UserActionsPage />
                  </RequireAuth>}
                />
                <Route path="/endpointActions" element={
                  <RequireAuth redirectTo="/login" redirectState={{redirectTo: "/endpointActions"}}>
                    <EndpointsActionsPage />
                  </RequireAuth>}
                />
                <Route path="/profile" element={<p>This is Profile Page</p>}/>
                <Route path="/settings/account" element={<p>This is Accounts Page</p>}/>
                <Route path="/settings/security/credentials" element={<p>This is Credentials Page</p>}/>
                <Route path="*" element={
                  <main style={{ padding: "1rem" }}>
                    <p>There's nothing here!</p>
                  </main>
                }/>
              </Routes>
            </div>
          </div> 
        </div>
          
      </Fragment>
  )
}

export default Home;