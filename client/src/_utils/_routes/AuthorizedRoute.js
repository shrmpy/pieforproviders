import React, { useContext, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Route } from 'react-router-dom'
import { LoggedInLayout } from '_shared'
import { AuthContext } from '_contexts/AuthContext'
import { useHistory } from 'react-router-dom'

export default function AuthorizedRoute({
  contentComponent: ContentComponent,
  exact,
  path,
  title,
  // permissions,
  ...routeProps
}) {
  exact = !!exact
  let history = useHistory()
  const {
    authenticated,
    setAuthenticated,
    userToken,
    setUserToken,
    tokenExpiration,
    setTokenExpiration
  } = useContext(AuthContext)

  useEffect(() => {
    !authenticated && history.push('/login')
  })

  return (
    <Route exact={exact} path={path} {...routeProps}>
      <LoggedInLayout
        title={title}
        setAuthenticated={setAuthenticated}
        setUserToken={setUserToken}
        setTokenExpiration={setTokenExpiration}
      >
        <ContentComponent
          authenticated={authenticated}
          setAuthenticated={setAuthenticated}
          userToken={userToken}
          setUserToken={setUserToken}
          tokenExpiration={tokenExpiration}
          setTokenExpiration={setTokenExpiration}
        />
      </LoggedInLayout>
    </Route>
  )
}

AuthorizedRoute.propTypes = {
  contentComponent: PropTypes.func.isRequired,
  exact: PropTypes.bool,
  path: PropTypes.string.isRequired,
  title: PropTypes.string
  // permissions: PropTypes.arrayOf(PropTypes.string)
}
