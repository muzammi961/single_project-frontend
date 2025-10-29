import './App.css'
import { useEffect } from "react";
import LoginPage from './components/authentication/login.jsx'
import HomeSide from './components/homeside/home.jsx'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProfilePage from './components/profile/profilesection.jsx'
import GoogleLoginButton from './components/authentication/googlelogin.jsx'
import RegistrationForm  from "./components/authentication/registration.jsx"
import ForgotPassword from './components/authentication/forget_password/password_reset_request.jsx'
// import ResetPassword from './components/authentication/forget_password/resetpassword.jsx'
import CreateProfile from './components/profile/createprofile.jsx'
import ProfileUpdate from './components/profile/updateprofile.jsx'
import DirectMessagesUI from './components/socialmedia/privatemessage.jsx'
import GetLocation from './components/socialmedia/livelocation.jsx'
import WeatherCard from './components/socialmedia/wetherside.jsx'
import ProfileOnly from './components/profile/showprofile.jsx'
import FollowersandFoollowingpage from './components/socialmedia/followersandfollwowing.jsx'
import EmojiPicker from './components/socialmedia/emojecompon.jsx'


import ExperienceSide from './components/experiance/experianceside.jsx'
import AddExperience from './components/experiance/createexperiances.jsx'
import Viewphotoorvideofromprofile  from './components/profile/viewphotoorvideofromprofile.jsx'
import FollowingMembers from './components/socialmedia/FollowingMembers .jsx'
import FollowersMembers from './components/socialmedia/FollowersMembers.jsx'








// ExpenseTracker 




// import Dashboard from './components/Customizetravelplanning/Dashboard.jsx';
import TripPlannerofCustome from './components/Customizetravelplanning/TripPlannerofCustome.jsx';
import ExpenseTracker from './components/Customizetravelplanning/ExpenseTracker .jsx';
import GroupExpenses from './components/Customizetravelplanning/GroupExpenses .jsx';
import Payments from './components/Customizetravelplanning/GroupExpenses .jsx';
import InviteView from './components/Customizetravelplanning/InviteView.jsx';
import PublicTripView from './components/Customizetravelplanning/PublicTripView.jsx';





import Calendar from './components/experiance/CalendarComponent.jsx';
import PlacesTest from './components/plasesarch.jsx';




// Customize_travelplanning


import TravelPlannerofBadget from './components/BudgetFriendlyTravel/TravelPlannerofBadget.jsx';
import DashboardLayout from './components/BudgetFriendlyTravel/TravelDashboard/dashboard_layout.jsx'
import TripSummary from './components/BudgetFriendlyTravel/TravelDashboard/TripSummary.jsx'
import Accommodations from './components/BudgetFriendlyTravel/TravelDashboard/Accommodations.jsx'
import TravelPlannerRestaurants from './components/BudgetFriendlyTravel/TravelDashboard/TravelPlannerRestaurants.jsx'
import Attractions from './components/BudgetFriendlyTravel/TravelDashboard/Attractions .jsx'
import DailyItinerary from './components/BudgetFriendlyTravel/TravelDashboard/DailyItinerary.jsx'
import TravelMap from './components/BudgetFriendlyTravel/TravelDashboard/TravelMap.jsx'
import Navbar from './components/BudgetFriendlyTravel/TravelDashboard/Navbar.jsx'
import TravelPlannerItinerary from './components/BudgetFriendlyTravel/TravelDashboard/TravelPlannerItinerary.jsx'
import GoogleMapComponent from './components/live journy/googleapicall.jsx';
function App() {
const isAuthenticated =localStorage.getItem("access_token");
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
            <Route path='/DirectMessagesUI' element={<DirectMessagesUI/>}/>


            <Route path='/FollowersandFollowingpage' element={<FollowersandFoollowingpage/>}/>

            <Route path='/FollowingMembers' element={<FollowingMembers/>}/>
            <Route path='/FollowersMembers' element={<FollowersMembers/>}/>     



      
            <Route path='/ProfileOnly' element={<ProfileOnly/>}/>
            <Route path='/GetLocation' element={<GetLocation/>}/>
            <Route path='/WeatherCard' element={<WeatherCard/>}/>
            <Route path='/EmojiPicker' element={<EmojiPicker/>}/>
            
       

            <Route path='Viewphotoorvideofromprofile/' element={<Viewphotoorvideofromprofile/>}/>
            <Route path='/AddExperience' element={<AddExperience/>}/>







            {/* <Route path='/Dashboard' element={<Dashboard/>}/> */}
            <Route path='/ExpenseTracker' element={<ExpenseTracker/>}/>
            <Route path='/GroupExpenses' element={<GroupExpenses/>}/>
            <Route path='/Payments' element={<Payments/>}/>


            <Route path='/TripPlannerofCustome' element={<TripPlannerofCustome/>}/>
            <Route path="/invite/:inviteCode" element={<InviteView />} />
            <Route path="/trips/:tripId" element={<PublicTripView />} />
           

            <Route path='/Calendar' element={<Calendar/>}/>

            <Route path='/GoogleMapComponent' element={<GoogleMapComponent/>}/>











            <Route path='/PlacesTest' element={<PlacesTest/>}/>







            <Route path='/TravelPlannerofBadget' element={<TravelPlannerofBadget/>}/>


            <Route path='/Navbar' element={<Navbar/>}/>
            <Route path='/TripSummary' element={<TripSummary/>}/>

            <Route path='/DashboardLayout' element={<DashboardLayout/>}/>
    



            <Route path='/Accommodations' element={<Accommodations/>}/>
            <Route path='/TravelPlannerRestaurants' element={<TravelPlannerRestaurants/>}/>
            <Route path='/Attractions' element={<Attractions/>}/>
            <Route path='/DailyItinerary' element={<DailyItinerary/>}/>
            <Route path='/TravelMap' element={<TravelMap/>}/>


            <Route path='/TravelPlannerItinerary' element={<TravelPlannerItinerary/>}/>
          </Routes>
      </BrowserRouter>
  )
}

export default App
