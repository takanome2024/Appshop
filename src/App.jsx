import './App.css'
import {createBrowserRouter,RouterProvider} from "react-router";
import HomePage from './Pages/home';
import RegisterPage from './Pages/register';
import AdminLayouts from './layouts/adminLayouts'
import MainLayouts from './layouts/mainLayouts';
import LoginPage from './Pages/login';
import CartList from './Pages/carts';
import { CartProvider } from './components/cartContext';

// import AddPage from './pages/addProduct';
// import DataProducts from './pages/dataProduct';
// import EditPage from './pages/editProduct';
// import ViewPage from './pages/viewPages';



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
      // {
      //   path:"ProductData",
      //   element:<DataProducts />
      // },
      //      {
      //   path:"add",
      //   element:<AddPage />
      // },
      // {
      //   path:"edit",
      //   element:<EditPage />
      // },
      // {
      //   path:"view",
      //   element:<ViewPage />
      // },
      ]
    },
]);

function App() {
  return(
    <CartProvider>
      <RouterProvider router={router} />;
    </CartProvider>
  )
}

export default App
