import './App.css'
import LoginPage from './components/authentication/login.jsx'
import HomeSide from './components/homeside/home.jsx'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ExperienceSide from './components/experiance/experianceside.jsx'
import ProfilePage from './components/profile/profilesection.jsx'
import GoogleLoginButton from './components/authentication/googlelogin.jsx'
import RegistrationForm  from "./components/authentication/registration.jsx"
import ForgotPassword from './components/authentication/forget_password/password_reset_request.jsx'
// import ResetPassword from './components/authentication/forget_password/resetpassword.jsx'
import CreateProfile from './components/profile/createprofile.jsx'
import ProfileUpdate from './components/profile/updateprofile.jsx'
function App() {
const isAuthenticated = !!localStorage.getItem("access_token");
const baseURL = import.meta.env.VITE_API_BASE_URL;
  return (
     <BrowserRouter>
        <Routes>

           {/* <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />}/> */}
            <Route path="/LoginPage" element={<LoginPage />}/>
            <Route path="/" element={<HomeSide/>}/>
            <Route path='/ExperienceSide' element={<ExperienceSide/>}/>
            <Route path='/ProfilePage' element={<ProfilePage/>}/>

            <Route path="/GoogleLoginButton" element={<GoogleLoginButton/>}/>

            <Route path='/RegistrationForm' element={<RegistrationForm/>}/>
            <Route path='/ForgotPassword' element={<ForgotPassword/>}/>
            {/* <Route path='/ResetPassword' element={<ResetPassword/>}/> */}
            <Route path='/CreateProfile' element={<CreateProfile/>}/>
            <Route path='/ProfileUpdate' element={<ProfileUpdate/>}/>




           
          </Routes>
      </BrowserRouter>
  )
}

export default App
