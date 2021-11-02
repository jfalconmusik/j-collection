import React, { useState } from "react";
import {
  getAuth,
  onAuthStateChanged,
  sendSignInLinkToEmail,
} from "firebase/auth";

const SignInWithEmail = () => {
  const [emailInputDisplayed, setEmailInputDisplayed] = useState(false);
  const [inputEmail, setInputEmail] = useState("");
  const [linkSent, setLinkSent] = useState(false);

  function sendEmail() {
    let actionCodeSettings = {
      // URL you want to redirect back to. The domain (www.example.com) for this
      // URL must be whitelisted in the Firebase Console.
      url: "https://j-collection.web.app/sign-in-email-link/",
      // This must be true.
      handleCodeInApp: true,
      iOS: {
        bundleId: "com.example.ios",
      },
      android: {
        packageName: "com.example.android",
        installApp: true,
        minimumVersion: "12",
      },
      dynamicLinkDomain: "https://j-collection.web.app/",
    };

    var email = document.getElementById("userEmail").value;
    setInputEmail(email);
    setLinkSent(true);
    setEmailInputDisplayed(false);
    const auth = getAuth();
    sendSignInLinkToEmail(auth, email, actionCodeSettings)
      .then(function () {
        // The link was successfully sent. Inform the user.
        // Save the email locally so you don't need to ask the user for it again
        // if they open the link on the same device.
        window.localStorage.setItem("emailForSignIn", email);
        window.alert("Sending email link!");
      })
      .catch(function (error) {
        // Some error occurred, you can inspect the code: error.code
        window.alert("An error occurred...");
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  }

  function alternateInput() {
    setEmailInputDisplayed(!emailInputDisplayed);
    setLinkSent(false);
  }

  return (
    <div>
      <button onClick={() => alternateInput()} className="signIn email">
        <img
          alt="email icon"
          style={{
            position: "relative",
            marginRight: "1em",
            bottom: ".4em",
            display: "initial",
            left: "8px",
            top: "1px",
          }}
          width="20vw"
          height="auto"
          src="https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/mail%202.svg?alt=media&token=445846fe-a33f-49fc-852a-3ff669194654"
        ></img>
        Sign in with Email Link
      </button>
      {emailInputDisplayed && (
        <div>
          <form>
            <input type="text" id="userEmail" />
            <button
              style={{ height: "50px" }}
              type="button"
              onClick={() => sendEmail()}
            >
              Send Email Link
            </button>
          </form>
        </div>
      )}
      {linkSent && (
        <div>
          <h2>
            Thank you, a confirmation email has been sent to your email address.
            Please follow the link to continue.
          </h2>
        </div>
      )}
    </div>
  );
};

// // After asking the user for their email.
// var email = window.prompt('Please provide your email');
// firebase.auth().fetchSignInMethodsForEmail(email)
//     .then(function (signInMethods) {
//         // This returns the same array as fetchProvidersForEmail but for email
//         // provider identified by 'password' string, signInMethods would contain 2
//         // different strings:
//         // 'emailLink' if the user previously signed in with an email/link
//         // 'password' if the user has a password.
//         // A user could have both.
//         if (signInMethods.indexOf(
//             firebase.auth.EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD) != -1) {
//             // User can sign in with email/password.
//         }
//         if (signInMethods.indexOf(
//             firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD) != -1) {
//             // User can sign in with email/link.
//         }
//     })
//     .catch(function (error) {
//         // Some error occurred, you can inspect the code: error.code
//     });

export default SignInWithEmail;
