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

const UserHospital = Loadable({
  loader: () => import('../containers/user/user-hospital'),
  loading: Loading,
})

const PaymentAgent = Loadable({
  loader: () => import('../containers/payment-agent/payment-agent'),
  loading: Loading,
})
const PaymentMethod = Loadable({
  loader: () => import('../containers/payment-method/payment-method'),
  loading: Loading,
})
const Hospital = Loadable({
  loader: () => import('../containers/hospital/hospital'),
  loading: Loading,
})
const Card = Loadable({
  loader: () => import('../containers/card/card'),
  loading: Loading,
})
const CardHospital = Loadable({
  loader: () => import('../containers/card-hospital/card'),
  loading: Loading,
})
const CardUser = Loadable({
  loader: () => import('../containers/card-user/card-user'),
  loading: Loading,
})
const TransactionHistory = Loadable({
  loader: () => import('../containers/transaction-history/transaction-history'),
  loading: Loading,
})
const TransactionHistoryHospital = Loadable({
  loader: () => import('../containers/transaction-history-hospital/transaction-history'),
  loading: Loading,
})
const HospitalBank = Loadable({
  loader: () => import('../containers/hospital-bank/hospital-bank'),
  loading: Loading,
})
const UserInfo = Loadable({
  loader: () => import('../containers/user-info'),
  loading: Loading,
})
// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/admin/user', component: User },
  { path: '/admin/user-admin', component: UserAdmin },
  { path: '/admin/user-hospital', component: UserHospital },
  { path: '/admin/payment-agent', component: PaymentAgent },
  { path: '/admin/payment-method', component: PaymentMethod },
  { path: '/admin/hospital', component: Hospital },
  { path: '/admin/card', component: Card },
  { path: '/admin/card-hospital', component: CardHospital },
  { path: '/admin/card-user', component: CardUser },
  { path: '/admin/transaction-history', component: TransactionHistory },
  { path: '/admin/transaction-history-hospital', component: TransactionHistoryHospital },
  { path: '/admin/hospital-bank', component: HospitalBank },
  { path: '/admin/user-info', component: UserInfo },
]

export default routes;
