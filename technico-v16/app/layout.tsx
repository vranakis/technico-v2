'use client';

import './globals.css';
import { AuthProvider, useAuth } from './components/AuthContext';
import Link from 'next/link';
import LogoutButton from './components/LogOutButton';
import { URLS } from './lib/constants';


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  // const {isAuthenticated, isAdmin} = useAuth();
  
  // console.log("heheXD RootLayout, {isAuthenticated, isAdmin} =", isAuthenticated, isAdmin);

  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <header>
            <Navbar />
          </header>
          <main>{children}</main>
        </AuthProvider>
        <footer className="text-gray-400 text-center text-xs py-5">
          Currently the #1 app in the world!
        </footer>
      </body>
    </html>
  );
}


function Navbar() {
  const {isAuthenticated, isAdmin} = useAuth();

  if (!isAuthenticated){
    return <LoggedOutNavbar />;
  }

  if (isAdmin) {
    return <AdminNavbar />
  }

  return <UserNavbar />
}

function AdminNavbar(){
return(
        <div className="navbar bg-base-100">
          <div className="navbar-start">
            <div className="dropdown">
              <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h8m-8 6h16" />
                </svg>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                <li><Link href="/users">Users</Link></li>
                <li><Link href="/admin/all-properties">Properties</Link></li>
                <li><Link href="/admin/all-repairs">Repairs</Link></li>
              </ul>
            </div>
            <Link href="/" className="btn btn-ghost text-xl">Technico v16</Link>
          </div>
          <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal px-1">
              <li><Link href="/users">Users</Link></li>
              <li><Link href="/admin/all-properties">Properties</Link></li>
              <li><Link href="/admin/all-repairs">Repairs</Link></li>             
            </ul>
          </div>
          <div className="navbar-end">
            <LogoutButton></LogoutButton>
          </div>
        </div>
  )
}

function UserNavbar(){
  const {userId} = useAuth();
  return(
          <div className="navbar bg-base-100">
            <div className="navbar-start">
              <div className="dropdown">
                <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h8m-8 6h16" />
                  </svg>
                </div>
                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                  <li><Link href={URLS.view_user(userId)}>Profile</Link></li>
                  <li><Link href={URLS.properties(userId)}>Properties</Link></li>
                  <li><Link href="/user/user-repairs">Repairs</Link></li>           
                  
                </ul>
              </div>
              <Link href="/" className="btn btn-ghost text-xl">Technico v16</Link>
            </div>
            <div className="navbar-center hidden lg:flex">
              <ul className="menu menu-horizontal px-1">
                <li><Link href={URLS.view_user(userId)}>Profile</Link></li>
                <li><Link href={URLS.properties(userId)}>Properties</Link></li>
                <li><Link href="/user/user-repairs">Repairs</Link></li>           
              </ul>
            </div>
            <div className="navbar-end">
              <LogoutButton></LogoutButton>
            </div>
          </div>
    )
  }

function LoggedOutNavbar(){
  return(
          <div className="navbar bg-base-100 text-right w-full">
            Technico
          </div>
    )
  }
