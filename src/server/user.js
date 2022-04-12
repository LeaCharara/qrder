import {initializeApp} from 'firebase/app'
import { config } from "./db";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, reauthenticateWithCredential, updateEmail, updatePassword, deleteUser } from "firebase/auth";

import * as firebaseui from 'firebaseui';

import { GoogleAuthProvider, EmailAuthProvider } from 'firebase/auth'

const firebaseApp = initializeApp(config);
const auth = getAuth();

let activeUser;

onAuthStateChanged(auth, (user) => {
    if (user) {
        activeUser = user;
    } else {
        activeUser = null;
    }
});

export let ui = new firebaseui.auth.AuthUI(auth);

export var uiConfig = {
    callbacks: {
      signInSuccessWithAuthResult: function(authResult, redirectUrl) {
        var user = authResult.user;
        // window.localStorage.setItem("token", user.accessToken);
        window.localStorage.setItem("userId", user.uid);
        return true;
      }
    },
    signInSuccessUrl: "/profile", // This redirect can be achived by route using callback.
    signInFlow: "popup",
    signInOptions: [
                  {
                    provider: GoogleAuthProvider.PROVIDER_ID,
                    customParameters: {
                      // Forces account selection even when one account
                      // is available.
                      prompt: 'select_account'
                    }
                  }
    ]
};

export const getUser = () => {
    return activeUser;
}

export const getUserInfo = async () => {
    const user = activeUser;
    if (user !== null) {
        const photoURL = user.photoURL;
        const displayName = user.displayName;
        const email = user.email;

        return [photoURL, displayName, email];
    }
    return false;
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
        alert("Unexpected Error Occured! Please check user.js:CreateAccount");
        // alert(errorCode);
        return false;
    }); // User created, set name.

    updateProfile(auth.currentUser, {
            displayName: fullname
        }).catch((error) => { // Error occured, delete user created.
            deleteUser(userCredential.user);
            alert("Unexpected Error Occured! Please check user.js:CreateAccount");
            return false;
        });

    return userCredential.user; // Created
}

export const SignIn = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    .catch(function(error) {
      alert("Invalid email or password.");
      return false;
    });
    return userCredential.user;
}

export const reAuth = async (password) => {
    const credential = EmailAuthProvider.credential(
        activeUser.email, 
        password
    );

    let reAuthed = await reauthenticateWithCredential(activeUser, credential).then(() => {
            return true;
        }).catch((error) => {
            alert('Invalid Password! Please try again.');
            return false;
    });

    return reAuthed;
}

export const editAccount = async (email, password, fullname, photoURL) => {
    let google = false;
    activeUser.providerData.forEach((profile) => {
        if(profile.providerId == "google.com")
            google = true;
    });

    await updateProfile(activeUser, {
        displayName: fullname,
        photoURL: photoURL
    }).catch((error) => { // Error occured.
        alert("Unexpected Error Occured! Please check user.js:CreateAccount");
        console.log(error);
        return false;
    });

    if (!google) {
        if (email) {
            await updateEmail(activeUser, email)
            .catch((error) => {
                alert("Unexpected Error Occured! Please check user.js:CreateAccount");
                console.log(error);
                return false;
            });
        }
        if (password) {
            await updatePassword(activeUser, password)
            .catch((error) => {
                alert("Unexpected Error Occured! Please check user.js:CreateAccount");
                console.log(error);
                return false;
            });
        }
    }

    return true;
    
}