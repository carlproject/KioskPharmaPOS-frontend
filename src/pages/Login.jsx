import React, { useState } from 'react';
import { app, analytics, db } from '../config/firebase';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { collection, query, where, getDocs, setDoc, doc } from 'firebase/firestore';
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

      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL
      }, { merge: true });

      localStorage.setItem('user', JSON.stringify({
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL
      }));

      navigate('/', { state: { user: {uid: user.uid, displayName: user.displayName, email: user.email, photoURL: user.photoURL } } });
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
        localStorage.setItem('user', JSON.stringify(userData));
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


