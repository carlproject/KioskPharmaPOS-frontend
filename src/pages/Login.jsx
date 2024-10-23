import React, { useState } from 'react';
import { app, analytics, db } from '../config/firebase';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import bcrypt from 'bcryptjs';
import LoginComponent from '../components/authComponents/LoginComponent';
import { useNavigate  } from 'react-router-dom';

const provider = new GoogleAuthProvider();
const auth = getAuth(app);


function Login() {
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();

  const signInWithGoogle = async (e) => {
    e.preventDefault();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      navigate('/', { state: { user: {uid: user.uid, displayName: user.displayName, email: user.email } } });
    } catch (error) {
      console.log('Something went wrong', error);
    }
  };

  const signInWithUsernameAndPassword = async (username, password) => {
    try {
      const usersCollection = collection(db, 'users');
      const q = query(usersCollection, where('username', '==', username));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setLoginError('User not found');
        return;
      }

      const userData = querySnapshot.docs[0].data();
      const hashedPassword = userData.password;

      const isPasswordCorrect = await bcrypt.compare(password, hashedPassword);

      if (isPasswordCorrect) {
        alert('Login Successful');
        console.log(userData)
        navigate('/', { state: { user: userData }});
      } else {
        setLoginError('Incorrect password');
      }
    } catch (error) {
      console.error('Error logging in: ', error);
      setLoginError('Something went wrong');
    }
  };

  return (
    <LoginComponent
      signInWithGoogle={signInWithGoogle}
      signInWithUsernameAndPassword={signInWithUsernameAndPassword}
      loginError={loginError}
    />
  );
}

export default Login;
