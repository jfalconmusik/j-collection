import logo from "./logo.svg";
import "./App.css";
import React, {
  useContext,
  useEffect,
  useState,
  useRef,
  useLocation,
  useHistory,
} from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams,
} from "react-router-dom";
// import Flexbox from "react-flexbox";
import { Elements, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import About from "./components/About.jsx";
import Header from "./components/Header.jsx";
import Contact from "./components/Contact.jsx";
import Order from "./components/Order.jsx";
import Account from "./components/Account.jsx";
import Home from "./components/Home.jsx";
import { Context } from "./Context.js";
import RecentlyViewed from "./components/RecentlyViewed.jsx";
import Footer from "./components/Footer.jsx";
import Favorites from "./components/Favorites.jsx";
import MyOrders from "./components/MyOrders.jsx";
import Sidebar from "./components/Sidebar";
// import SignInWithEmail from "./components/SignInWithEmail.jsx";
import OrderSuccess from "./components/OrderSuccess.jsx";
import Billing from "./components/Billing.jsx";
import PrivacyPolicy from "./components/PrivacyPolicy.jsx";
import TermsOfService from "./components/TermsOfService.jsx";
import SignInEmailLink from "./components/SignInEmailLink.jsx";
import ModalEdge from "./components/ModalEdge.jsx";
import ModalCenter from "./components/ModalCenter.jsx";
import AgentSignUp from "./components/AgentSIgnUp.jsx";
import AgentConsole from "./components/AgentConsole.jsx";
import Browse from "./components/Browse.jsx";
import Agent from "./components/Agent.jsx";
import TicketsAgent from "./components/TicketsAgent.jsx";
import TicketsUser from "./components/TicketsUser.jsx";
import HistoryAgent from "./components/HistoryAgent";
import HistoryUser from "./components/HistoryUser";
///// User Context:
// import awsmobile from "./aws-exports";
// import {
//   AuthCredential,
//   GoogleAuthProvider,
//   // FacebookAuthProvider,
//   TwitterAuthProvider,
//   PhoneAuthProvider,
//   EmailAuthProvider,
//   GithubAuthProvider,
//   SAMLAuthProvider,
//   OAuthProvider,
//   RecaptchaVerifier,
//   Auth,
// } from "firebase/compat/auth";
// import { getAuth } from "firebase/auth";
// import firebaseui from "firebaseui";

// for graphQL
// https://bvr7xryc2rf2bpeiuvbtknemya.appsync-api.us-east-1.amazonaws.com/graphql
const listTodos = `query listTodos {
  listTodos{
    items{
      id
      name
      description
    }
  }
}`;

const addTodo = `mutation createTodo($name:String! $description: String!) {
  createTodo(input:{
    name:$name
    description:$description
  }){
    id
    name
    description
  }
}`;

// https://jqwknmsv2jcy3pscmzzru5g3vy.appsync-api.us-east-1.amazonaws.com/graphql

// Hosted UI Endpoint: https://jcollection656e5dfb-656e5dfb-jkdomestic.auth.us-east-1.amazoncognito.com/
// Test Your Hosted UI Endpoint: https://jcollection656e5dfb-656e5dfb-jkdomestic.auth.us-east-1.amazoncognito.com/login?response_type=code&client_id=4n5u4b44du9unvhjcohoblt54q&redirect_uri=https://master.d159hgjl305h8k.amplifyapp.com/

const App = () => {
  /*
This app contains the rudiments of an ecommerce website.

- Test...
- responsive...
- Create a demo video (then share with Jack)- pitch about maintaining the site, picking an admin, etc. 
- Complete hosting. Ask Jack what domain he wants. Plug in live keys.



- extra stuff:
- Recently viewed / Search History - clientside
- Stylize basic site to match mockups...
- phone app


**/

  const {
    showMenuHome,
    setShowMenuHome,
    showMenuShop,
    setShowMenuShop,
    showMenuAccount,
    setShowMenuAccount,
    user,
    setUser,
    userInfo,
    setUserInfo,
    anonUser,
    setAnonUser,

    modalExecute,
    modalOpen,
    setModalOpen,
    modalText,
    optionsModalText,
    closeOptionsModal,
    activateOptionsModal,
    accountName,
    accountTitleString,
    setAccountTitleString,

    totalCost,
    onCheckout,

    handleSignOut,
    setWishlistString,
    wishlistString,
    setWishlistDisplayed,
    isLargeScreen,
    searchString,
    setSearchString,

    isSmallScreen,
    isSafari,
    isPortrait,
    isBigScreen,
    onHomeScreen,
    setOnHomeScreen,
    onBrowse,
    setOnBrowse,
    onAccount,
    setOnAccount,
    styleColors,
    handleSidebar,
  } = useContext(Context);

  // const location = useLocation();
  // const history = useHistory();

  // const handleLeafNodeClick = (newPath) => {
  //   history.push(newPath);
  // };

  const uploadFile = (evt) => {
    const file = evt.target.files[0];
    const name = file.name;

    Storage.put(name, file).then(() => {
      this.setState({ file: name });
    });
  };

  const createScript = () => {
    // load the sdk
    window.fbAsyncInit = fbAsyncInit;
    const script = document.createElement("script");
    script.src = "https://connect.facebook.net/en_US/sdk.js";
    script.async = true;
    script.onload = initFB;
    document.body.appendChild(script);
  };

  const initFB = () => {
    const fb = window.FB;
    console.log("FB SDK initialized");
  };

  const fbAsyncInit = () => {
    // init the fb sdk client
    const fb = window.FB;
    fb.init({
      appId: "your_facebook_app_id",
      cookie: true,
      xfbml: true,
      version: "v2.11",
    });
  };

  // async function signUp() {
  //   try {
  //     const { user } = await Auth.signUp({
  //       // username,
  //       // password,
  //       // attributes: {
  //       //     email,          // optional
  //       //     phone_number,   // optional - E.164 number convention
  //       // other custom attributes
  //       // }
  //     });
  //     console.log(user);
  //   } catch (error) {
  //     console.log("error signing up:", error);
  //   }
  // }

  // async function signIn() {
  //   try {
  //       const user = await Auth.signIn(username = "username", password = "password");
  //   } catch (error) {
  //       console.log('error signing in', error);
  //   }
  // }

  // async function signOut() {
  //   try {
  //     await Auth.signOut();
  //   } catch (error) {
  //     console.log("error signing out: ", error);
  //   }
  // }

  const [selected, setSelected] = useState([]);

  const [productPageLinkString, setProductPageLinkString] = useState("");
  const [modalOpenBool, setModalOpenBool] = useState(false);
  const [mouseOverModal, setMouseOverModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  function closeExpressModal() {
    document.getElementById("expressModal").style.display = "none";
  }

  function handleDelayedCloseModal() {
    setTimeout(() => {
      if (!mouseOverModal) {
        setModalOpenBool(false);
      }
    }, 1000);
  }
  function handleDelayedOpenModal() {
    setTimeout(() => {
      if (mouseOverModal) {
        setModalOpenBool(true);
      }
    }, 1000);
  }

  useEffect(() => {
    // FB.getLoginStatus(function(response) {
    //   statusChangeCallback(response);
    // });
  }, []);

  useEffect(() => {
    if (modalOpen) {
      document.getElementById("modalEdgeButton").disabled = false;

      setTimeout(() => {
        setModalOpen(false);
      }, 4000);
    }
  }, [modalOpen]);

  useEffect(() => {
    if (modalOpen) {
      document.getElementById("modalEdge").style.display = "initial";
    } else {
      document.getElementById("modalEdge").style.display = "none";
    }
  }, [modalOpen]);

  useEffect(() => {
    if (accountName) {
      if (!accountName.includes("@")) {
        let newArr = accountName.split(" ");
        let firstName = newArr[0];
        setAccountTitleString(`${firstName}'s Account`);
      }
    }
    console.log(accountName);
  }, [accountName]);

  function autocomplete(inp, arr) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function (e) {
      var a,
        b,
        i,
        val = this.value;
      /*close any already open lists of autocompleted values*/
      closeAllLists();
      if (!val) {
        return false;
      }
      currentFocus = -1;
      /*create a DIV element that will contain the items (values):*/
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      /*append the DIV element as a child of the autocomplete container:*/
      this.parentNode.appendChild(a);
      /*for each item in the array...*/
      for (i = 0; i < arr.length; i++) {
        /*check if the item starts with the same letters as the text field value:*/
        if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
          /*create a DIV element for each matching element:*/
          b = document.createElement("DIV");
          /*make the matching letters bold:*/
          b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
          b.innerHTML += arr[i].substr(val.length);
          /*insert a input field that will hold the current array item's value:*/
          b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
          /*execute a function when someone clicks on the item value (DIV element):*/
          b.addEventListener("click", function (e) {
            /*insert the value for the autocomplete text field:*/
            inp.value = this.getElementsByTagName("input")[0].value;
            /*close the list of autocompleted values,
            (or any other open lists of autocompleted values:*/
            closeAllLists();
          });
          a.appendChild(b);
        }
      }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function (e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 38) {
        //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x) x[currentFocus].click();
        }
      }
    });
    function addActive(x) {
      /*a function to classify an item as "active":*/
      if (!x) return false;
      /*start by removing the "active" class on all items:*/
      removeActive(x);
      if (currentFocus >= x.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = x.length - 1;
      /*add class "autocomplete-active":*/
      x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
      /*a function to remove the "active" class from all autocomplete items:*/
      for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
      }
    }
    function closeAllLists(elmnt) {
      /*close all autocomplete lists in the document,
      except the one passed as an argument:*/
      var x = document.getElementsByClassName("autocomplete-items");
      for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != inp) {
          x[i].parentNode.removeChild(x[i]);
        }
      }
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
      closeAllLists(e.target);
    });
  }

  const menuHomeRef = useRef();
  const menuShopRef = useRef();
  const menuAccountRef = useRef();

  // Hook
  function useOnClickOutside(ref, handler) {
    useEffect(
      () => {
        const listener = (event) => {
          // Do nothing if clicking ref's element or descendent elements
          if (!ref.current || ref.current.contains(event.target)) {
            return;
          }

          handler(event);
        };

        document.addEventListener("mousedown", listener);
        document.addEventListener("touchstart", listener);

        return () => {
          document.removeEventListener("mousedown", listener);
          document.removeEventListener("touchstart", listener);
        };
      },
      // Add ref and handler to effect dependencies
      // It's worth noting that because passed in handler is a new ...
      // ... function on every render that will cause this effect ...
      // ... callback/cleanup to run every render. It's not a big deal ...
      // ... but to optimize you can wrap handler in useCallback before ...
      // ... passing it into this hook.
      [ref, handler]
    );
  }

  useEffect(() => {
    if (onHomeScreen) {
      setOnAccount(false);
      setOnBrowse(false);
    } else if (onAccount) {
      setOnBrowse(false);
      setOnHomeScreen(false);
    } else if (onBrowse) {
      setOnAccount(false);
      setOnHomeScreen(false);
    }
  }, [onHomeScreen, onAccount, onBrowse]);

  // useEffect(() => {
  //   var ui = new firebaseui.auth.AuthUI(getAuth());
  //   ui.start("#firebaseui-auth-container", {
  //     credentialHelper: firebaseui.auth.CredentialHelper.ACCOUNT_CHOOSER_COM,
  //     autoUpgradeAnonymousUsers: true,
  //     signInFlow: "popup",
  //     signInSuccessUrl: "https://www.j-collection.web.app/account",
  //     signInOptions: [
  //       GoogleAuthProvider.PROVIDER_ID,
  //       // FacebookAuthProvider.PROVIDER_ID,
  //       TwitterAuthProvider.PROVIDER_ID,
  //     ],
  //     callbacks: {
  //       // signInFailure callback must be provided to handle merge conflicts which
  //       // occur when an existing credential is linked to an anonymous user.
  //       signInFailure: function (error) {
  //         // For merge conflicts, the error.code will be
  //         // 'firebaseui/anonymous-upgrade-merge-conflict'.
  //         if (error.code != "firebaseui/anonymous-upgrade-merge-conflict") {
  //           return Promise.resolve();
  //         }
  //         // The credential the user tried to sign in with.
  //         var cred = error.credential;
  //         // Copy data from anonymous user to permanent user and delete anonymous
  //         // user.
  //         // ...
  //         // Finish sign-in after data is copied.
  //         return getAuth().signInWithCredential(cred);
  //       },
  //     },
  //   });
  // }, []);

  const [widescreenTopsMenu, setWidescreenTopsMenu] = useState(false);
  const [widescreenBottomsMenu, setWidescreenBottomsMenu] = useState(false);

  const [mobileTopsMenu, setMobileTopsMenu] = useState(false);
  const [mobileBottomsMenu, setMobileBottomsMenu] = useState(false);

  useOnClickOutside(menuHomeRef, () => setShowMenuHome(false));
  useOnClickOutside(menuShopRef, () => setShowMenuShop(false));
  useOnClickOutside(menuAccountRef, () => setShowMenuAccount(false));

  useEffect(() => {
    if (showMenuAccount) {
      setShowMenuHome(false);
      setShowMenuShop(false);
    }
  }, [showMenuAccount]);

  useEffect(() => {
    if (showMenuHome) {
      setShowMenuAccount(false);
      setShowMenuShop(false);
    }
  }, [showMenuHome]);

  useEffect(() => {
    if (showMenuShop) {
      setShowMenuAccount(false);
      setShowMenuHome(false);
    }
  }, [showMenuShop]);

  return (
    <div className="App">
      {/* app components that need to be accessible anywhere */}
      <Header />
      <Sidebar />
      <ModalCenter />
      <ModalEdge />
      {/* component switch */}
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/about">
          <About />
        </Route>
        <Route path="/account">
          <Account />
        </Route>
        <Route path="/browse">
          <Browse />
        </Route>
        <Route path="/contact">
          <Contact />
        </Route>
        <Route path="/sign-in-email-link">
          <SignInEmailLink />
        </Route>
        <Route path="/privacy-policy">
          <PrivacyPolicy />
        </Route>
        <Route path="/terms-of-service">
          <TermsOfService />
        </Route>
        <Route path="/order-success">
          <OrderSuccess />
        </Route>
        <Route path="/my-orders">
          <MyOrders />
        </Route>
        <Route path="/favorites">
          <Favorites />
        </Route>
        <Route path="/agent-sign-up">
          <AgentSignUp />
        </Route>
        <Route path="/agent-console">
          <AgentConsole />
        </Route>
        <Route path="/book-agent/:id">
          <Agent />
        </Route>
        <Route path="/agent-appointments/:id">
          <TicketsAgent />
        </Route>
        <Route path="/user-appointments/:id">
          <TicketsUser />
        </Route>
        <Route path="/user-history/:id">
          <HistoryUser />
        </Route>
        <Route path="/agent-history/:id">
          <HistoryAgent />
        </Route>
      </Switch>

      <Footer />
      <div id="storage-div" style={{ display: "none" }} />
    </div>
  );
};

// export default withAuthenticator(App, true);
export default App;
