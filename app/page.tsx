"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import "./../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";

import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';
// Ensure styles are imported, though importing in layout.tsx is often sufficient
// import '@aws-amplify/ui-react/styles.css';
import styles from './page.module.css';

Amplify.configure(outputs);

const client = generateClient<Schema>();

// export default function App() {
//   const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

//   function listTodos() {
//     client.models.Todo.observeQuery().subscribe({
//       next: (data) => setTodos([...data.items]),
//     });
//   }

//   useEffect(() => {
//     listTodos();
//   }, []);

//   function createTodo() {
//     client.models.Todo.create({
//       content: window.prompt("Todo content"),
//     });
//   }

//   return (
//     <main>
//       <h1>My todos</h1>
//       <button onClick={createTodo}>+ new</button>
//       <ul>
//         {todos.map((todo) => (
//           <li key={todo.id}>{todo.content}</li>
//         ))}
//       </ul>
//       <div>
//         🥳 App successfully hosted. Try creating a new todo.
//         <br />
//         <a href="https://docs.amplify.aws/nextjs/start/quickstart/nextjs-app-router-client-components/">
//           Review next steps of this tutorial.
//         </a>
//       </div>
//     </main>
//   );
// }

// --- This is your component that shows content ONLY to logged-in users ---
function ProtectedStockDashboard() {
  // Use hooks to access authentication status, user info, and sign out function
  const { user, signOut } = useAuthenticator((context) => [context.user]);

  // You can inspect `user` object for details like username, email etc.
  // The exact attributes depend on your auth configuration in resource.ts
  console.log('User info:', user);

  return (
    <div>
      {/* Example: Display username or email */}
      <h1>Welcome, {user?.signInDetails?.loginId || user?.username || 'User'}!</h1>

      {/* --- Your Existing Stock Application Components Go Here --- */}
      <p>Render your stock tables, charts, etc. here...</p>
      {/* --- End Stock Application Components --- */}

      <button onClick={signOut} style={{ marginTop: '20px' }}>Sign Out</button>
    </div>
  );
}
// --- End of protected component ---

// --- This is the main export for your page route ---
export default function Home() {
  return (
    <main className={styles.main}>
      {/* Wrap the protected component with Authenticator */}
      <Authenticator>
        {/*
          The content inside Authenticator is only rendered after a successful sign-in.
          You can optionally receive { signOut, user } as props here too,
          but using the useAuthenticator hook inside the child component is common.
        */}
        <ProtectedStockDashboard />
      </Authenticator>
    </main>
  );
}
