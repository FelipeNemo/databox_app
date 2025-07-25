import React from 'react';
import { Outlet } from 'react-router-dom';
import UserHeader from './UserHeader';

const UserLayout = () => (
  <>
    <UserHeader />
    <main>
      <Outlet />
    </main>
  </>
);

export default UserLayout;
