import React from "react";
import { Context } from "../Context";

const Account = () => {
  // function checkLoginState() {
  //     FB.getLoginStatus(function(response) {
  //       statusChangeCallback(response);
  //     });
  //   }

  return (
    <div>
      {/* <fb:login-button 
        scope="public_profile,email"
        onlogin="checkLoginState();">
        </fb:login-button> */}
      <div
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
      ></div>
    </div>
  );
};

export default Account;
