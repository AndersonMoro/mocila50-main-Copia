// Verifique se as rotas estão configuradas corretamente
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MochilaDetails from './pages/MochilaDetails'; // Fixed back to match actual filename
import AddItem from './pages/AddItem';
import EditItem from './pages/EditItem';
import './index.css';

// Componente para rotas protegidas
const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  console.log("PrivateRoute - user:", user);
  return user ? children : <Navigate to="/login" />;
};

// Configuração para usar as flags futuras do React Router
const router = createBrowserRouter(
  [
    {
      path: "/login",
      element: <Login />
    },
    {
      path: "/register",
      element: <Register />
    },
    {
      path: "/",
      element: <PrivateRoute><Dashboard /></PrivateRoute>
    },
    {
      path: "/dashboard",
      element: <Navigate to="/" />
    },
    {
      path: "/mochila/:id",
      element: <PrivateRoute><MochilaDetails /></PrivateRoute>
    },
    {
      path: "/mochila/:id/add-item/:categoria",
      element: <PrivateRoute><AddItem /></PrivateRoute>
    },
    {
      path: "/mochila/:id/edit-item/:itemId",
      element: <PrivateRoute><EditItem /></PrivateRoute>
    },
    {
      path: "*",
      element: <Navigate to="/" />
    }
  ],
  {
    future: {
      v7_startTransition: true
    }
  }
);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
