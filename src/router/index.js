import React from 'react'
import { BrowserRouter, Switch } from 'react-router-dom'

import Login from '../containers/Login'
import Dashboard from '../containers/Dashboard'
import Areas from '../containers/Areas'
import Banners from '../containers/Banners'
import Clients from '../containers/Clients'
import Contacts from '../containers/Contacts'
import News from '../containers/News'
import Products from '../containers/Products'
import Proposals from '../containers/Proposals'
import Segments from '../containers/Segments'
import Subjects from '../containers/Subjects'
import Users from '../containers/Users'
import WorkWithUs from '../containers/WorkWithUs'

import PrivateRoute from './privateRoute'
import PublicRoute from './publicRoute'

const Router = () => (
	<BrowserRouter>
		<Switch>
			<PublicRoute component={false} path={'/'} exact />
			<PublicRoute component={Login} path={'/login'} />
			<PrivateRoute component={Dashboard} path={'/dashboard'} />
      		<PrivateRoute component={Areas} path={'/areas'} />
			<PrivateRoute component={Banners} path={'/banners'} />
			<PrivateRoute component={Clients} path={'/clients'} />
			<PrivateRoute component={Contacts} path={'/contacts'} />
			<PrivateRoute component={News} path={'/news'} />
			<PrivateRoute component={Products} path={'/products'} />
			<PrivateRoute component={Proposals} path={'/proposals'} />
			<PrivateRoute component={Segments} path={'/segments'} />
			<PrivateRoute component={Subjects} path={'/subjects'} />
			<PrivateRoute component={Users} path={'/users'} />
			<PrivateRoute component={WorkWithUs} path={'/work-with-us'} />
		</Switch>
	</BrowserRouter>
)

export default Router