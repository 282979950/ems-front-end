export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' }
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    authority: 'visit',
    routes: [
      { path: '/', redirect: '/system/dist' },
      // 系统管理
      {
        path: '/system',
        icon: 'home',
        name: 'system',
        authority: 'sys:visit',
        routes: [
          {
            path: '/system/dist',
            name: 'dist',
            component: './System/Dist',
            authority: 'sys:dist:visit'
          },
          {
            path: '/system/org',
            name: 'org',
            component: './System/Org',
            authority: 'sys:org:visit',
          },
          {
            path: '/system/emp',
            name: 'emp',
            component: './System/Emp',
            authority: 'sys:emp:visit',
          },
          {
            path: '/system/role',
            name: 'role',
            component: './System/Role',
            authority: 'sys:role:visit',
          },
          {
            path: '/system/perm',
            name: 'perm',
            component: './System/Perm',
            authority: 'sys:perm:visit',
          },
          {
            path: '/system/dic',
            name: 'dic',
            component: './System/Dic',
            authority: 'sys:dic:visit',
          },
          {
            path: '/system/gasPrice',
            name: 'gasPrice',
            component: './System/GasPrice',
            authority: 'sys:gasPrice:visit',
          },
        ],
      },
      // 账户管理
      {
        path: '/account',
        icon: 'user',
        name: 'account',
        authority: 'account:visit',
        routes: [
          {
            path: '/account/entryMeter',
            name: 'entryMeter',
            component: './Account/EntryMeter',
            authority: 'account:entryMeter:visit'
          },
          {
            path: '/account/createArchive',
            name: 'createArchive',
            component: './Account/CreateArchive',
            authority: 'account:createArchive:visit'
          },
          {
            path: '/account/installMeter',
            name: 'installMeter',
            component: './Account/InstallMeter',
            authority: 'account:installMeter:visit'
          },
          {
            path: '/account/createAccount',
            name: 'createAccount',
            component: './Account/CreateAccount',
            authority: 'account:createAccount:visit'
          },
          {
            path: '/account/lockAccount',
            name: 'lockAccount',
            component: './Account/LockAccount',
            authority: 'account:lockAccount:visit'
          },
          {
            path: '/account/alter',
            name: 'alter',
            component: './Account/UserChange',
            authority: 'account:alter:visit'
          },
        ],
      },
      // 充值缴费管理
      {
        path: '/recharge',
        icon: 'pay-circle',
        name: 'recharge',
        authority: 'recharge:visit',
        routes: [
          {
            path: '/recharge/prePayment',
            name: 'prePayment',
            component: './Recharge/PrePayment',
            authority: 'recharge:prePayment:visit'
          },
          {
            path: '/recharge/replaceCard',
            name: 'replaceCard',
            component: './Recharge/ReplaceCard',
            authority: 'recharge:replaceCard:visit'
          },
          {
            path: '/recharge/postPayment',
            name: 'postPayment',
            component: './System/Dist',
            authority: 'recharge:postPayment:visit'
          },
          {
            path: '/recharge/order',
            name: 'order',
            component: './Recharge/OrderManagement',
            authority: 'recharge:order:visit'
          },
        ],
      },
      // 发票管理
      {
        path: '/invoice',
        icon: 'audit',
        name: 'invoice',
        authority: 'invoice:visit',
        routes: [
          {
            path: '/invoice/assign',
            name: 'assign',
            component: './Invoice/Assign',
            authority: 'invoice:assign:visit'
          },
          {
            path: '/invoice/query',
            name: 'query',
            component: './Invoice/Search',
            authority: 'invoice:query:visit'
          },
          {
            path: '/invoice/eInvoice',
            name: 'eInvoice',
            component: './System/Dist',
            authority: 'invoice:eInvoice:visit'
          },
        ],
      },
      // 维修补气管理
      {
        path: '/repairOrder',
        icon: 'fire',
        name: 'repairOrder',
        authority: 'repairOrder:visit',
        routes: [
          {
            path: '/repairOrder/input',
            name: 'input',
            component: './RepairOrder/Input',
            authority: 'repairOrder:entry:visit'
          },
          {
            path: '/repairOrder/fillGas',
            name: 'fillGas',
            component: './RepairOrder/FillGas',
            authority: 'repairOrder:fillGas:visit'
          },
          {
            path: '/repairOrder/initCard',
            name: 'initCard',
            component: './RepairOrder/InitCard',
            authority: 'repairOrder:initCard:visit'
          },
        ],
      },
      // 账务处理
      {
        path: '/financial',
        icon: 'project',
        name: 'financial',
        authority: 'financial:visit',
        routes: [
          {
            path: '/financial/preStrike',
            name: 'preStrike',
            component: './Financial/PreStrike',
            authority: 'financial:preStrike:visit'
          },
          {
            path: '/financial/strike',
            name: 'strike',
            component: './Financial/StrikeNucleus',
            authority: 'financial:strike:visit'
          },
        ],
      },
      // 表具运行管理
      {
        path: '/meter',
        icon: 'dashboard',
        name: 'meter',
        authority: 'meter:visit',
        routes: [
          {
            path: '/meter/record',
            name: 'record',
            component: './System/Dist',
            authority: 'meter:record:visit'
          },
          {
            path: '/meter/control',
            name: 'control',
            component: './System/Dist',
            authority: 'meter:control:visit'
          },
          {
            path: '/meter/exception',
            name: 'exception',
            component: './System/Dist',
            authority: 'meter:exception:visit'
          },
        ],
      },
      // 查询统计
      {
        path: '/queryStats',
        icon: 'bar-chart',
        name: 'queryStats',
        authority: 'queryStats:visit',
        routes: [
          {
            path: '/queryStats/cardQuery',
            name: 'cardQuery',
            component: './QueryStats/CardQuery',
            authority: 'queryStats:cardQuery:visit'
          },
          {
            path: '/queryStats/accountQuery',
            name: 'accountQuery',
            component: './QueryStats/AccountQuery',
            authority: 'queryStats:accountQuery:visit'
          },
          {
            path: '/queryStats/userQuery',
            name: 'userQuery',
            component: './QueryStats/User',
            authority: 'queryStats:userQuery:visit'
          },
          {
            path: '/queryStats/exceptionQuery',
            name: 'exceptionQuery',
            component: './QueryStats/ExceptionQuery',
            authority: 'queryStats:exceptionQuery:visit'
          },
          {
            path: '/queryStats/businessDataQuery',
            name: 'businessDataQuery',
            component: './System/Dist',
            authority: 'queryStats:businessDataQuery:visit'
          },
          {
            path: '/queryStats/businessReportQuery',
            name: 'businessReportQuery',
            component: './System/Dist',
            authority: 'queryStats:businessReportQuery:visit'
          },
        ],
      },
      {
        component: '404',
      },
    ],
  },
];
