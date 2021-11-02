import React from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams,
} from "react-router-dom";
import "./index.css";
import { ContextProvider } from "./Context";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
// import Amplify, { Auth } from "aws-amplify";
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// "@aws-amplify/analytics": "^3.3.11",
// "@aws-amplify/api": "^3.3.3",
// "@aws-amplify/auth": "^3.4.34",
// "@aws-amplify/core": "^3.8.24",
// "@aws-amplify/interactions": "^3.3.34",
// "@aws-amplify/storage": "^3.4.4",
// "@aws-amplify/ui-react": "^1.2.9",
// "@aws-amplify/xr": "^2.2.34",

// import awsconfig from './aws-exports';
// Amplify.configure({
//   Auth: {
//     // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
//     identityPoolId: "us-east-1:8c23f1ff-7b8d-4966-979b-2700e702aa81",

//     // REQUIRED - Amazon Cognito Region
//     region: "us-east-1",

//     // OPTIONAL - Amazon Cognito Federated Identity Pool Region
//     // Required only if it's different from Amazon Cognito Region
//     identityPoolRegion: "us-east-1",

//     // OPTIONAL - Amazon Cognito User Pool ID
//     userPoolId: "us-east-1_kuI04tCRC",

//     // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
//     userPoolWebClientId: "2fs5ojl0no2rlf7ihraqiic091",

//     // OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
//     mandatorySignIn: false,

//     // OPTIONAL - Configuration for cookie storage
//     // Note: if the secure flag is set to true, then the cookie transmission requires a secure protocol
//     //   cookieStorage: {
//     //     // REQUIRED - Cookie domain (only required if cookieStorage is provided)
//     //     domain: ".yourdomain.com",
//     //     // OPTIONAL - Cookie path
//     //     path: "/",
//     //     // OPTIONAL - Cookie expiration in days
//     //     expires: 365,
//     //     // OPTIONAL - See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite
//     //     sameSite: "strict" | "lax",
//     //     // OPTIONAL - Cookie secure flag
//     //     // Either true or false, indicating if the cookie transmission requires a secure protocol (https).
//     //     secure: true,
//     //   },

//     // OPTIONAL - customized storage object
//     //   storage: MyStorage,

//     // OPTIONAL - Manually set the authentication flow type. Default is 'USER_SRP_AUTH'
//     //   authenticationFlowType: "USER_PASSWORD_AUTH",

//     // OPTIONAL - Manually set key value pairs that can be passed to Cognito Lambda Triggers
//     clientMetadata: { myCustomKey: "myCustomValue" },

//     // OPTIONAL - Hosted UI configuration
//     oauth: {
//       domain: "your_cognito_domain",
//       scope: [
//         "phone",
//         "email",
//         "profile",
//         "openid",
//         "aws.cognito.signin.user.admin",
//       ],
//       redirectSignIn: "http://localhost:3000/",
//       redirectSignOut: "http://localhost:3000/",
//       responseType: "code", // or 'token', note that REFRESH token will only be generated when the responseType is code
//     },
//   },
//   aws_project_region: "us-east-1",
//   aws_dynamodb_all_tables_region: "us-east-1",
//   aws_dynamodb_table_schemas: [
//     {
//       tableName: "Domestics-dev",
//       region: "us-east-1",
//     },
//   ],
//   aws_cognito_identity_pool_id:
//     "us-east-1:8c23f1ff-7b8d-4966-979b-2700e702aa81",
//   aws_cognito_region: "us-east-1",
//   aws_user_pools_id: "us-east-1_kuI04tCRC",
//   aws_user_pools_web_client_id: "2fs5ojl0no2rlf7ihraqiic091",
//   oauth: {
//     domain: "jcollection656e5dfb-656e5dfb-dev.auth.us-east-1.amazoncognito.com",
//     scope: [
//       "phone",
//       "email",
//       "openid",
//       "profile",
//       "aws.cognito.signin.user.admin",
//     ],
//     redirectSignIn: "https://jcollection/sign-in/",
//     redirectSignOut: "https://jcollection/sign-out/",
//     responseType: "code",
//   },
//   federationTarget: "COGNITO_USER_POOLS",
//   aws_appsync_graphqlEndpoint:
//     "https://bvr7xryc2rf2bpeiuvbtknemya.appsync-api.us-east-1.amazonaws.com/graphql",
//   aws_appsync_region: "us-east-1",
//   aws_appsync_authenticationType: "AMAZON_COGNITO_USER_POOLS",
// });

// yml build commands:
// - "# Execute Amplify CLI with the helper script"
// - chmod u+x ./myamplifypush.sh
// - ./myamplifypush.sh
// Import the functions you need from the SDKs you need

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC7kQoX5Lo4Qxe0KS4ZK_ZqYMJKtz0IrVg",
  authDomain: "j-collection.firebaseapp.com",
  databaseURL: "https://j-collection-default-rtdb.firebaseio.com",
  projectId: "j-collection",
  storageBucket: "j-collection.appspot.com",
  messagingSenderId: "35357744009",
  appId: "1:35357744009:web:fc01e5560a16a936b35f58",
  measurementId: "G-2ZXZ0QBYV1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// const db = getFirestore(app);

ReactDOM.render(
  <React.StrictMode>
    <ContextProvider>
      <Router>
        <App />
      </Router>
    </ContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
