import React, { Fragment, useState } from "react";
import Navbar from '../common/Navbar';
import SidePanel from '../common/SidePanel';

import {
  HomeIcon,
  UserIcon,
  CogIcon,
  UserCircleIcon,
  ShieldCheckIcon,
  LockOpenIcon,
  DeviceMobileIcon,
} from '@heroicons/react/outline';

const Home = () => {
  const actionLinks = [
    {title: 'Home', href: '/'}, 
    {title: 'Profile', href: '/'},
    {title: 'Contact Us', href: '/'},
  ];

  const sideMenu = [
    {
      label: 'Home',
      Icon: HomeIcon,
      to: '/',
    },
    {
      label: 'Profile',
      Icon: UserIcon,
      to: '/profile',
    },
    {
      label: 'Settings',
      Icon: CogIcon,
      to: '/settings',
      children: [
        {
          label: 'Account',
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
              label: '2-FA',
              Icon: DeviceMobileIcon,
              to: '2fa',
            },
          ],
        },
      ],
    },
  ];

  const [isSidePanelVisible, setSidePanelVisibility] = useState(true);

  const [isLoggedIn, setLoggedIn] = useState(true);
  return (
    <Fragment>
        <Navbar title='Authenticator' actions={actionLinks}/>
        <div className='app-body'>
          {isSidePanelVisible && <SidePanel sidePanelLinks={sideMenu}/>}
          <div className='container'>
          </div>
        </div>
    </Fragment>
  )
}

export default Home
