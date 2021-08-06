import React from "react";
import { Context } from "../Context";
import fb from "fb";
import { AmplifyAuthenticator } from "@aws-amplify/ui-react";
import Amplify, {
  Analytics,
  Storage,
  API,
  graphqlOperation,
  Auth,
  Hub,
} from "aws-amplify";
import { withAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react";

const Account = () => {
  // function checkLoginState() {
  //     FB.getLoginStatus(function(response) {
  //       statusChangeCallback(response);
  //     });
  //   }

  const federated = {
    googleClientId:
      "35357744009-tgq03nqsmakcs4s9uh9truuu8uo78r7l.apps.googleusercontent.com", // Enter your googleClientId here
    facebookAppId: "3002736326711611", // Enter your facebookAppId here
    amazonClientId:
      "amzn1.application-oa2-client.bc8dce532d1249c19cdad1d099cff313", // Enter your amazonClientId here
  };

  return (
    <div>
      {/* <fb:login-button
        scope="public_profile,email"
        onlogin="checkLoginState();"
      ></fb:login-button> */}
      {/* <div
        id="g_id_onload"
        data-client_id="35357744009-tgq"
        data-login_uri="https://jcollection/sign-in/"
        data-auto_prompt="false"
      ></div>
      <div
        class="g_id_signin"
        data-type="standard"
        data-size="large"
        data-theme="outline"
        data-text="sign_in_with"
        data-shape="rectangular"
        data-logo_alignment="left"
      ></div> */}
      <div className="spacer"></div>
      <AmplifyAuthenticator federated={federated}></AmplifyAuthenticator>
      {/* <button onClick={() => Auth.federatedSignIn({ provider: "Facebook" })}>
        Open Facebook
      </button>
      <button onClick={() => Auth.federatedSignIn({ provider: "Google" })}>
        Open Google
      </button>
      <button onClick={() => Auth.federatedSignIn()}>Open Hosted UI</button>
      <button onClick={() => Auth.signOut()}>
        Sign Out {user.getUsername()}
      </button> */}
      <AmplifySignOut />
    </div>
  );
};

export default Account;
