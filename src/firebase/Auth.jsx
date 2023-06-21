// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { createContext, useContext, useState, useEffect } from "react";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import {getAuth,onAuthStateChanged,signInWithEmailAndPassword,createUserWithEmailAndPassword,signOut,updateProfile} from "firebase/auth";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDDnsIz4Mpvsa5bnGf3v9Tdw9W3Zjd03KI",
  authDomain: "e-commerce-app-2e34c.firebaseapp.com",
  projectId: "e-commerce-app-2e34c",
  storageBucket: "e-commerce-app-2e34c.appspot.com",
  messagingSenderId: "64750279294",
  appId: "1:64750279294:web:87d934b139e0da22b8962f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const AuthContext = createContext(null);

const AuthProvider =  ({children}) =>{
    const auth = useProvideAuth();
    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

export const useAuth = ()=> useContext(AuthContext);  

function useProvideAuth(){
    const [user, setUser] = useState();
    
    const signUp= (email,password, displayname) => createUserWithEmailAndPassword(auth,email, password).then(({user})=>{
        updateProfile(user, {displayname});
        setUser(user);
        return user;
    });

    const signIn = (email, password) =>signInWithEmailAndPassword(auth,email,password).then(({user})=>{
        setUser(user);
        return user;
    });

    const signOutUser =  () => signOut(auth).then(()=> setUser(null));

    useEffect(() => {
      
        const unsubscribe = onAuthStateChanged(auth, (user)=>{
            user? setUser(user): setUser(null)
        });
     
      return () => unsubscribe();
      
    });

    return {
        signIn, signUp, signOut:signOutUser,user,
    }
    

}

 export default AuthProvider;
