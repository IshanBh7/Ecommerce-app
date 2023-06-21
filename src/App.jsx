import './App.css'
import Button from "@mui/material/Button"
import { createBrowserRouter, createRoutesFromElements, Navigate, Route, RouterProvider} from 'react-router-dom'
import Layout from './Components/Layout'
import Home from "./pages/Home"
import Cart from './pages/Cart'
import Login from './pages/Login'
import Register from './pages/Register'
import {Provider} from "react-redux"
import {store} from "./store";
import Checkout from './pages/Checkout'
import AuthProvider from './firebase/Auth'
import {useAuth} from "./firebase/Auth"

function ProtectedRoute({children}){
  const {user} = useAuth();
  if(!user){
    return <Navigate to={"/login"}/>
  } else {
    return children
  }
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
    <Route path="/" element={<Layout/>}>
    <Route index element={<Home/>}></Route>
    <Route path="/cart" element={<Cart/>}></Route>
    <Route 
    path="/checkout" 
    index 
    element={
      <ProtectedRoute>
        <Checkout/>
      </ProtectedRoute>
    }></Route>
    </Route>
    <Route path="/login" element={<Login/>}></Route>
    <Route path="/register" element={<Register/>}></Route>
    </>
  )
)
function App() {
  return (
    <AuthProvider>
    <Provider store={store}>
    <RouterProvider router={router} />
    </Provider>
    </AuthProvider>
  )
}

export default App
