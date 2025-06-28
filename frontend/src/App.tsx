import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing/Landing'
import SignUp from './pages/SignUp/SignUp'
import CreateProfile from './pages/CreateProfile/CreateProfile'
import LogIn from './pages/LogIn/LogIn'
import UserProfile from './pages/UserProfile/UserProfile'
import MainLine from './pages/MainLine/MainLine'
import './App.css'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/create-profile" element={<CreateProfile />} />
          <Route path="/log-in" element={<LogIn />} />
          <Route path="/user-profile" element={<UserProfile />} />
          <Route path="/main-line" element={<MainLine />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
