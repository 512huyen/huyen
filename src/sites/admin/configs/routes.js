import React from 'react';
import Loadable from 'react-loadable';

function Loading() {
  return <div></div>;
}
const UserAdmin = Loadable({
  loader: () => import('../containers/user/user-admin'),
  loading: Loading,
})

const User = Loadable({
  loader: () => import('../containers/user/user'),
  loading: Loading,
})

const UserInfo = Loadable({
  loader: () => import('../containers/user-info'),
  loading: Loading,
})

const ChangeAvatar = Loadable({
  loader: () => import('../containers/user-info/change-avatar'),
  loading: Loading,
})

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/admin/user', component: User },
  { path: '/admin/user-admin', component: UserAdmin },
  { path: '/admin/user-info', component: UserInfo },
  { path: '/admin/change-avatar', component: ChangeAvatar },
]

export default routes;
