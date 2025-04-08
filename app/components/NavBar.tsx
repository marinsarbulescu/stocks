// app/components/NavBar.tsx
'use client'; // Needed for Link and potentially hooks later

import Link from 'next/link';
import React from 'react';
// Import useAuthenticator if you want user info/signout directly here
// import { useAuthenticator } from '@aws-amplify/ui-react';

// Basic CSS for styling - adjust as needed
const navStyles: React.CSSProperties = {
  backgroundColor: '#333',
  padding: '1rem',
  marginBottom: '1rem',
};

const linkStyles: React.CSSProperties = {
  color: 'white',
  margin: '0 1rem',
  textDecoration: 'none',
};

export default function NavBar() {
  // Optional: Get user/signOut if needed for displaying user info or a sign out button in the nav
  // const { user, signOut } = useAuthenticator();

  return (
    <nav style={navStyles}>
      <Link href="/" style={linkStyles}>Home</Link>
      <Link href="/add-stocks" style={linkStyles}>Add Stocks</Link>
      <Link href="/stocks-listing" style={linkStyles}>Portfolio</Link>
      <Link href="/goals" style={linkStyles}>Goals</Link>
      <Link href="/account" style={linkStyles}>Account</Link>
      {/* Optional: Add user info or sign out here */}
      {/* {user && <span style={{ color: 'grey', marginLeft: '2rem' }}>Welcome, {user.username}</span>} */}
      {/* {user && <button onClick={signOut} style={{ marginLeft: '1rem'}}>Sign Out (Nav)</button>} */}
    </nav>
  );
}