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
  // loader: () => import('../containers/user'),
  loading: Loading,
})

const PaymentAgent = Loadable({
  loader: () => import('../containers/payment-agent/payment-agent'),
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
const CardUser = Loadable({
  loader: () => import('../containers/card-user/card-user'),
  loading: Loading,
})
const TransactionHistory = Loadable({
  loader: () => import('../containers/transaction-history/transaction-history'),
  loading: Loading,
})
const UserInfo = Loadable({
  loader: () => import('../containers/user-info'),
  loading: Loading,
})
const Recharge = Loadable({
  loader: () => import('../containers/report/recharge'),
  loading: Loading,
})
const RechargeCardUser = Loadable({
  loader: () => import('../containers/card-user/recharge-card-user'),
  loading: Loading,
})
const CancelCardUser = Loadable({
  loader: () => import('../containers/card-user/cancel-card-user'),
  loading: Loading,
})
const Pay = Loadable({
  loader: () => import('../containers/report/pay'),
  loading: Loading,
})
const AdvancePayment = Loadable({
  loader: () => import('../containers/report/advance-payment'),
  loading: Loading,
})
const RefundService = Loadable({
  loader: () => import('../containers/report/refund-service'),
  loading: Loading,
})
const ForControl = Loadable({
  loader: () => import('../containers/control/control'),
  loading: Loading,
})
const SetUpControl = Loadable({
  loader: () => import('../containers/control/setting-control'),
  loading: Loading,
})
// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/admin/user', component: User },
  { path: '/admin/user-admin', component: UserAdmin },
  { path: '/admin/user-hospital', component: UserHospital },
  { path: '/admin/payment-agent', component: PaymentAgent },
  { path: '/admin/hospital', component: Hospital },
  { path: '/admin/card', component: Card },
  { path: '/admin/card-user', component: CardUser },
  { path: '/admin/transaction-history', component: TransactionHistory },
  { path: '/admin/user-info', component: UserInfo },
  { path: '/admin/recharge', component: Recharge },
  { path: '/admin/recharge-card-user/:requestparam', component: RechargeCardUser },
  { path: '/admin/cancel-card-user/:requestparam', component: CancelCardUser },
  { path: '/admin/pay', component: Pay },
  { path: '/admin/advance-payment', component: AdvancePayment },
  { path: '/admin/refund-service', component: RefundService },
  { path: '/admin/control', component: ForControl },
  { path: '/admin/setting-control', component: SetUpControl },
]

export default routes;
