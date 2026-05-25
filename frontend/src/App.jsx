import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
// Layouts
import UserLayout from './layouts/User/UserLayout'
import AdminLayout from './layouts/Admin/AdminLayout'

// User Pages
import Hero from './user/pages/Hero/Hero'
import Skill from './user/pages/Skill/Skill'
import Service from './user/pages/Service/Service'
import Project from './user/pages/Project/Project'
import Contact from './user/pages/Contact/Contact'

//auth 
import Protected from './auth/Protected'
// Admin Pages
import Login from './admin/pages/Login/Login'
import Register from './admin/pages/Register/Register'
import AddSkill from './admin/pages/Addskill/AddSkill'
import AddProject from './admin/pages/AddProject/AddProject'
import AddService from './admin/pages/Addservice/AddService'
import AddHero from './admin/pages/AddHero/AddHero'
import Messages from './admin/pages/Messages/Messages'
import ContactInfo from './admin/pages/ContactInfo/ContactInfo'

const router = createBrowserRouter([
    {
        path: '/',
        element: <UserLayout />,
        children: [
            { index: true, element: <Hero /> },
            { path: 'skill', element: <Skill /> },
            { path: 'service', element: <Service /> },
            { path: 'project', element: <Project /> },
            { path: 'contact', element: <Contact /> }
        ]
    },
    // Admin routes (protected)
    {
        path: '/admin',
        element: <Protected >
            <AdminLayout />
        </Protected>,
        children: [
            { index: true, element: <AddHero /> },
            { path: 'addskill', element: <AddSkill /> },
            { path: 'addproject', element: <AddProject /> },
            { path: 'addservice', element: <AddService /> },
            { path: 'messages', element: <Messages /> },
            { path: 'contactinfo', element: <ContactInfo /> }
        ]
    },
    // Auth routes
    { path: '/login', element: <Login /> },
    { path: '/register', element: <Register /> }
])

function App() {
    return (
        <>
            <RouterProvider router={router} />
        </>
    )
}
export default App
