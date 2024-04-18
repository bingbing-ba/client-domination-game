import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import Home from './pages/Home';
import DominationFailed from './pages/DominationFailed';
import DominationSuccessed from './pages/DominationSuccessed';

const router = createBrowserRouter([
  {
    id: 'domination-successed',
    path: '/domination-successed',
    element: <DominationSuccessed />,
  },
  {
    id: 'domination-failed',
    path: '/domination-failed',
    element: <DominationFailed />,
  },
  {
    id: 'root',
    path: '/',
    element: <Home />,
    errorElement: <div>404 Not Found</div>,
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

