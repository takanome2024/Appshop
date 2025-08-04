import './App.css'
import {createBrowserRouter,RouterProvider} from "react-router";
import HomePage from './Pages/home';
import RegisterPage from './Pages/register';
import AdminLayouts from './layouts/adminLayouts'
import MainLayouts from './layouts/mainLayouts';
import LoginPage from './Pages/login';
import CartList from './Pages/carts';
import { CartProvider } from './components/cartContext';
import { AdminProductProvider } from './components/adminProduct';





const router = createBrowserRouter([ //array object yang me-representasikan object path
  {
    path: "/",
    element: <MainLayouts />,
    children:[
      {
        index: true,
        element: <HomePage />
      }
    ]
  },
  {
    path: "/auth",
    element: <AdminLayouts />,
    children:[
      {
        path: "register",
        element: <RegisterPage />
      },
      {
        path: "login",
        element: <LoginPage />
      },
      {
        path:"cart",
        element:<CartList />
      }
      ]
    },
    {
      path:"/admin",
      element:<BackofficeLayouts />,
      children:[
        {
          path:"login",
          element:<AdminLogin />
        },
        {
          path:"products",
          element:<ProductList />
        },
        {
          path:"login",
          element:<AdminLogin />
        },
      ]
    }
]);

function App() {
  return(
    <CartProvider>
      <AdminProductProvider>
      <RouterProvider router={router} />;
     </AdminProductProvider>
    </CartProvider>
  )
}

export default App
