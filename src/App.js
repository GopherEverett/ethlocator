import { Authenticator } from '@aws-amplify/ui-react'
import StationFinder from './components/StationFinder'
import './App.css'

// Shown above the sign-in / sign-up form.
const components = {
  Header() {
    return (
      <div className="authHeader">
        <h1>ETHLOCATOR</h1>
        <h2>sign in to find E85 near you</h2>
      </div>
    )
  },
}

function App() {
  return (
    <Authenticator loginMechanisms={['email']} components={components}>
      {({ signOut, user }) => (
        <StationFinder
          userEmail={user?.signInDetails?.loginId}
          onSignOut={signOut}
        />
      )}
    </Authenticator>
  )
}

export default App
