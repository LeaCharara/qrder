import {initializeApp} from 'firebase/app'
import { config } from "./db";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, deleteUser } from "firebase/auth";

const firebaseApp = initializeApp(config);
const auth = getAuth();

export const SignIn = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    .catch(function(error) {
      alert("Invalid email or password.");
      return false;
    });
    return userCredential.user;
}
  
export const CreateAccount = async (email, password, fullname) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    .catch(function(error) {
        var errorCode = error.code;
        if (errorCode == 'auth/email-already-in-use') {
        alert('This email is already in use! please Try another one.');
        } else if (errorCode == "auth/invalid-email") {
        alert('Invalid Email Address!');
        } else
        alert("Unexpected Error Occured! Please check db.js:CreateAccount");
        // alert(errorCode);
        return false;
    }); // User created, set name.

    updateProfile(auth.currentUser, {
            displayName: fullname
        }).catch((error) => { // Error occured, delete user created.
            deleteUser(userCredential.user);
            alert("Unexpected Error Occured! Please check db.js:CreateAccount");
            return false;
        });

    return userCredential.user; // Created
}

export const getUserInfo = async () => {
    const user = auth.currentUser;
    if (user !== null) {
        const photoURL = user.photoURL;
        const displayName = user.displayName;
        const email = user.email;

        return [photoURL, displayName, email];
    }
    return false;
}