import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../Context";
import {
  getAuth,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from "firebase/auth";

// Confirm the link is a sign-in with email link.

function SignInEmailLink() {
  const [success, setSuccess] = useState(false);
  const auth = getAuth();
  const { setUserEmail } = useContext(Context);

  useEffect(() => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      // Additional state parameters can also be passed via URL.
      // This can be used to continue the user's intended action before triggering
      // the sign-in operation.
      // Get the email if available. This should be available if the user completes
      // the flow on the same device where they started it.
      let email = window.localStorage.getItem("emailForSignIn");
      if (!email) {
        // User opened the link on a different device. To prevent session fixation
        // attacks, ask the user to provide the associated email again. For example:
        email = window.prompt("Please provide your email for confirmation");
      }
      // The client SDK will parse the code from the link for you.
      signInWithEmailLink(auth, email, window.location.href)
        .then((result) => {
          // Clear email from storage.
          window.localStorage.removeItem("emailForSignIn");
          setSuccess(true);
          setUserEmail(email);
          // You can access the new user via result.user
          // Additional user info profile not available via:
          // result.additionalUserInfo.profile == null
          // You can check if the user is new or existing:
          // result.additionalUserInfo.isNewUser
        })
        .catch((error) => {
          // Some error occurred, you can inspect the code: error.code
          // Common errors could be invalid email and invalid or expired OTPs.
        });
    }
  }, []);

  return (
    <div>
      <h1>{success ? "Sign-in Successful" : "Sign in failed"}</h1>
      <Link to="/">
        <div>
          <button>
            <h2>home</h2>
          </button>
        </div>
      </Link>
      {/* <h2>Please confirm your email address:</h2>
            <input type="text" id="emailVal"></input>
            <br></br>
            <h2>Please choose a password</h2> */}
    </div>
  );
}

export default SignInEmailLink;
