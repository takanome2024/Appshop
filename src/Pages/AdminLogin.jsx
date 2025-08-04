import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Auth } from "../configs/firebase";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

export default function AdminLogin(){
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const navigate=useNavigate();

    const handleLogin=async(e)=>{
        e.preventDefault();
        try {
            const result=await signInWithEmailAndPassword(Auth,email,password);
            
            navigate("/auth/ProductData")
        } catch (error) {
            
        }
    }
}