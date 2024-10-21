import React from 'react'
import { app, analytics }from '../config/firebase'
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import LoginComponent from '../components/authComponents/LoginComponent';

const provider =  new GoogleAuthProvider();
const auth = getAuth(app);

function Login() {

  const signInWithGoogle = async(e) => {
    e.preventDefault();
    try {
      const result = await signInWithPopup(auth, provider);

      console.log(result.user);
    }
    catch(error) {
      console.log('Something went wrong', error);
    }
  }

    return (
      <LoginComponent signInWithGoogle={signInWithGoogle} />
    );
  }

export default Login

