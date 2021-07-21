import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { getData, removeData } from './helpers/Storage'

import {
  ApolloProvider,
  ApolloClient,
  ApolloLink,
  InMemoryCache,
} from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import { createUploadLink } from 'apollo-upload-client'

const API = `${process.env.REACT_APP_API_ADDRESS}:${process.env.REACT_APP_API_PORT}/${process.env.REACT_APP_API_PATH}`

const appCache = new InMemoryCache()

const uploadLink = createUploadLink({
  uri: API
})

const authLink = new ApolloLink((operation, forward) => {
  const storage = getData()
  
  operation.setContext({
    headers: {
      "Authorization": storage && storage.token ? `Bearer ${ storage.token }` : ''
    }
  })

  return forward(operation)
})

const errorLink = onError(({ graphQLErrors, networkError, response }) => {
  if(networkError && networkError.response.status === 401 && networkError.response.statusText) {
    removeData()
    window.location.reload()
  }
})

const client = new ApolloClient({
  cache: appCache,
  link: ApolloLink.from([ errorLink, authLink, uploadLink ])
})

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
)