import React from 'react'
import { Route, Redirect, withRouter } from 'react-router-dom'
import { hasUser } from '../helpers/Storage'

const PublicRoute = ({component: Component, ...props}) => {
	return <Route 
		render={() => {
			return hasUser() ? (
				<Redirect to={'/dashboard'} />
			) : Component ? (
				<Component {...props} />
			) :
			(
				<Redirect to={'/login'} />
			)
		}}
	/>
}

export default withRouter(PublicRoute)