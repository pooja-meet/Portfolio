import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import './App.css'

// Layouts
import UserLayout from './layouts/User/UserLayout'
import AdminLayout from './layouts/Admin/AdminLayout'

// Auth
import Protected from './auth/Protected'

// Lazy Loaded User Pages
const Hero = lazy(() => import('./user/pages/Hero/Hero'))
const Skill = lazy(() => import('./user/pages/Skill/Skill'))
const Service = lazy(() => import('./user/pages/Service/Service'))
const Project = lazy(() => import('./user/pages/Project/Project'))
const Contact = lazy(() => import('./user/pages/Contact/Contact'))

// Lazy Loaded Admin Pages
const Login = lazy(() => import('./admin/pages/Login/Login'))
const Register = lazy(() => import('./admin/pages/Register/Register'))
const AddSkill = lazy(() => import('./admin/pages/Addskill/AddSkill'))
const AddProject = lazy(() => import('./admin/pages/AddProject/AddProject'))
const AddService = lazy(() => import('./admin/pages/Addservice/AddService'))
const AddHero = lazy(() => import('./admin/pages/AddHero/AddHero'))
const Messages = lazy(() => import('./admin/pages/Messages/Messages'))
const ContactInfo = lazy(() => import('./admin/pages/ContactInfo/ContactInfo'))

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

    {
        path: '/admin',
        element: (
            <Protected>
                <AdminLayout />
            </Protected>
        ),
        children: [
            { index: true, element: <AddHero /> },
            { path: 'addskill', element: <AddSkill /> },
            { path: 'addproject', element: <AddProject /> },
            { path: 'addservice', element: <AddService /> },
            { path: 'messages', element: <Messages /> },
            { path: 'contactinfo', element: <ContactInfo /> }
        ]
    },

    { path: '/login', element: <Login /> },
    { path: '/register', element: <Register /> }
])

function App() {
    return (
        <Suspense
            fallback={
                <div className="loader-container">
                    <div className="spinner"></div>
                </div>
            }
        >
            <RouterProvider router={router} />
        </Suspense>
    )
}

export default App
