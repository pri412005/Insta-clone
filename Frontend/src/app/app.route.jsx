import { createBrowserRouter } from 'react-router-dom'
import Login from '../feature/auth/pages/Login'
import Register from '../feature/auth/pages/Register'
import VerifyOTP from '../feature/auth/pages/VerifyOTP'
import Home from '../feature/post/pages/Home'
import CreatePost from '../feature/post/pages/CreatePost'
import Profile from '../feature/auth/pages/Profile'
import ProfileEdit from '../feature/auth/pages/ProfileEdit'
import PostDetails from '../feature/post/pages/PostDetails'
import Protected from '../Componenet/Protected'
import Public from '../Componenet/Public'
import UserProfilePage from '../feature/auth/pages/UserProfilePage'
import FollowNotificationPage from '../feature/notification/pages/followNoficationsPage'
import Saved from '../feature/post/components/Saved'
import Explore from '../feature/post/components/Explore'
import SearchBarPage from '../Componenet/SearchBarPage'



export const router = createBrowserRouter([

  // Public routes
  { path: "/login", element: <Public><Login /></Public> },
  { path: "/register", element: <Public><Register /></Public> },
  { path: "/verify-otp", element: <Public><VerifyOTP /></Public> },

  // Protected routes
  { path: "/", element: <Protected><Home /></Protected> },
  { path: "/create-post", element: <Protected><CreatePost /></Protected> },
  { path: "/profile", element: <Protected><Profile /></Protected> },
  { path: "/profile/edit", element: <Protected><ProfileEdit /></Protected> },
  { path: "/post/:postid", element: <Protected><PostDetails /></Protected> },
  { path: "/search", element: <Protected><SearchBarPage/></Protected> },
  { path: "/user/:id", element: <Protected><UserProfilePage /></Protected> },
  { path: "/notifications", element: <Protected><FollowNotificationPage /></Protected> },
  { path: "/saved", element: <Protected><Saved /></Protected> },
   { path: "/explore", element: <Protected><Explore/></Protected> }
])