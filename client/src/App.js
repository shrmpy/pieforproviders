import React, { useEffect } from 'react'
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch
} from 'react-router-dom'
import AuthenticatedRoute from '_utils/_routes/AuthenticatedRoute.js'
import ReactGA from 'react-ga'
import Dashboard from './Dashboard'
import GettingStarted from './GettingStarted'
import Confirmation from './Confirmation'
import NewPassword from './PasswordReset'
import Login from './Login'
import Signup from './Signup'
import NotFound from './NotFound'
import ErrorBoundary from './ErrorBoundary'
import CasesImport from './CasesImport'
import { AuthLayout } from '_shared'
import { AuthProvider } from '_contexts/AuthContext'
import { useTranslation } from 'react-i18next'
import { IsAuthenticated } from '_utils/authenticationHandler'

const App = () => {
  const { t } = useTranslation()

  const authenticated = IsAuthenticated

  useEffect(() => {
    /* skip production code for coverage */
    /* istanbul ignore next */
    if (process.env.NODE_ENV === 'production') {
      ReactGA.initialize('UA-117297491-1')
    }
  }, [])

  return (
    <div className="text-primaryBlue font-proxima text-sm h-screen">
      <ErrorBoundary>
        <Router>
          <AuthProvider>
            <Switch>
              <Route path="/signup">
                <AuthLayout
                  backgroundImageClass="auth-image"
                  contentComponent={Signup}
                />
              </Route>
              <Route path="/login">
                <AuthLayout
                  backgroundImageClass="auth-image"
                  contentComponent={Login}
                />
              </Route>
              <Route path="/password/update">
                <AuthLayout
                  backgroundImageClass="auth-image"
                  contentComponent={NewPassword}
                />
              </Route>
              <Route
                path="/confirm"
                title={t('confirmYourAccount')}
                component={Confirmation}
              />
              <AuthenticatedRoute
                exact
                path="/getting-started"
                title={t('setup')}
                contentComponent={GettingStarted}
              />
              <AuthenticatedRoute
                exact
                path="/dashboard"
                contentComponent={Dashboard}
              />
              <AuthenticatedRoute
                exact
                path="/cases/import"
                contentComponent={CasesImport}
              />
              <Route exact path="/">
                <Redirect to={authenticated() ? '/dashboard' : '/login'} />
              </Route>
              <Route contentComponent={NotFound} />
            </Switch>
          </AuthProvider>
        </Router>
      </ErrorBoundary>
    </div>
  )
}

export default App
