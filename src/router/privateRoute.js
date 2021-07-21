import React from 'react'
import { Route, Redirect, withRouter } from 'react-router-dom'
import { hasUser } from '../helpers/Storage'

const PrivateRoute = ({component: Component, ...props}) => {
	const { location } = props
	const logged = hasUser()

	window.privateRedirect = !logged ? location : null

	return <Route 
		render={() => {
			return logged ? (
				<Component {...props} />
			) : (
				<Redirect to={'/login'} />
			)
		}}
	/>
}

export default withRouter(PrivateRoute)