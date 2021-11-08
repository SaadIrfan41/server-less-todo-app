import fetch from 'cross-fetch'
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
import netlifyIdentity from 'netlify-identity-widget'
import { setContext } from 'apollo-link-context'

const authLink = setContext((_, { headers }) => {
  netlifyIdentity.init({})
  const user = netlifyIdentity.currentUser()

  let token = null
  if (user) {
    token = user.token.access_token
    console.log(user)
  }

  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : '',
    },
  }
})
const httpLink = new HttpLink({
  uri: '/api/todo',
  fetch,
})

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
})
