import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../../user/components/Navbar/Navbar'
export default function UserLayout() {
    return (
        <div>
            {/* Top Navbar */}
            <Navbar />

            {/* Page Content */}
            <main>
                <Outlet />
            </main>
        </div>
    )
}