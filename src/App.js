import logo from "./logo.svg";
import "./App.css";
import React, { useContext, useEffect, useState, useRef } from "react";
import Flexbox from "react-flexbox";
import { Elements, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Link, Switch, Route, useHistory, useLocation } from "react-router-dom";
import Amplify, {
  Analytics,
  Storage,
  API,
  graphqlOperation,
  Auth,
  Hub,
} from "aws-amplify";
import {
  // withAuthenticator,
  S3Album,
  Authenticator,
  SignIn,
  SignUp,
  ConfirmSignUp,
  Greetings,
} from "aws-amplify-react";
import { AmplifyAuthenticator } from "@aws-amplify/ui-react";

import { withAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react";
// import { awsmobile as aws_exports } from "./aws-exports.js";
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
import Sidebar from "react-sidebar";
// import SignInWithEmail from "./components/SignInWithEmail.jsx";
import OrderSuccess from "./components/OrderSuccess.jsx";
import Billing from "./components/Billing.jsx";

Amplify.configure({
  aws_project_region: "us-east-1",
  aws_dynamodb_all_tables_region: "us-east-1",
  aws_dynamodb_table_schemas: [
    {
      tableName: "Domestics-dev",
      region: "us-east-1",
    },
  ],
  aws_cognito_identity_pool_id:
    "us-east-1:8c23f1ff-7b8d-4966-979b-2700e702aa81",
  aws_cognito_region: "us-east-1",
  aws_user_pools_id: "us-east-1_kuI04tCRC",
  aws_user_pools_web_client_id: "2fs5ojl0no2rlf7ihraqiic091",
  oauth: {
    domain: "jcollection656e5dfb-656e5dfb-dev.auth.us-east-1.amazoncognito.com",
    scope: [
      "phone",
      "email",
      "openid",
      "profile",
      "aws.cognito.signin.user.admin",
    ],
    redirectSignIn: "https://jcollection/sign-in/",
    redirectSignOut: "https://jcollection/sign-out/",
    responseType: "code",
  },
  federationTarget: "COGNITO_USER_POOLS",
  aws_appsync_graphqlEndpoint:
    "https://bvr7xryc2rf2bpeiuvbtknemya.appsync-api.us-east-1.amazonaws.com/graphql",
  aws_appsync_region: "us-east-1",
  aws_appsync_authenticationType: "AMAZON_COGNITO_USER_POOLS",
});
Storage.configure({ level: "private" });

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

function App() {
  // for graphQL
  const todoMutation = async () => {
    const todoDetails = {
      name: "Party tonight!",
      description: "Amplify CLI rocks!",
    };

    const newEvent = await API.graphql(graphqlOperation(addTodo, todoDetails));
    alert(JSON.stringify(newEvent));
  };

  const listQuery = async () => {
    console.log("listing todos");
    const allTodos = await API.graphql(graphqlOperation(listTodos));
    alert(JSON.stringify(allTodos));
  };

  const post = async () => {
    console.log("calling api");
    const response = await API.post("myapi", "/items", {
      body: {
        id: "1",
        name: "hello amplify!",
      },
    });
    alert(JSON.stringify(response, null, 2));
  };
  const get = async () => {
    console.log("calling api");
    const response = await API.get("myapi", "/items/object/1");
    alert(JSON.stringify(response, null, 2));
  };
  const list = async () => {
    console.log("calling api");
    const response = await API.get("myapi", "/items/1");
    alert(JSON.stringify(response, null, 2));
  };

  /*

This app contains the rudiments of an ecommerce app.

1. Routes need to point to real components
2. Stylize basic site to match mockups
3. Create database and server for artisans
4. Match booking process to Jack Kelly's expectations
5. Integrate all APIs
6. Get a basic version on github and Elastic Beanstalk
7. Polish, Perfect, Integrate, Share progress with employer

**/

  const {
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
  } = useContext(Context);

  const location = useLocation();
  const history = useHistory();

  const handleLeafNodeClick = (newPath) => {
    history.push(newPath);
  };

  const uploadFile = (evt) => {
    const file = evt.target.files[0];
    const name = file.name;

    Storage.put(name, file).then(() => {
      this.setState({ file: name });
    });
  };

  const [user, setUser] = useState({});

  useEffect(() => {
    function getUser() {
      return Auth.currentAuthenticatedUser()
        .then((userData) => userData)
        .catch(() => console.log("Not signed in"));
    }

    Analytics.record("Amplify_CLI");
    Hub.listen("auth", ({ payload: { event, data } }) => {
      switch (event) {
        case "signIn":
          setUser(data);
          break;
        case "signOut":
          setUser(null);
          break;
        case "customOAuthState":
          this.setState({ customState: data });
        case "cognitoHostedUI":
          getUser().then((userData) => setUser(userData));
          break;
        case "signIn_failure":
        case "cognitoHostedUI_failure":
          console.log("Sign in failure", data);
          break;
      }
    });

    getUser().then((userData) => setUser(userData));

    Auth.currentAuthenticatedUser()
      .then((user) => setUserInfo(user))
      .catch(() => console.log("Not signed in"));
  }, []);

  const SignInWithGoogle = () => {
    useEffect(() => {
      const ga =
        window.gapi && window.gapi.auth2
          ? window.gapi.auth2.getAuthInstance()
          : null;

      if (!ga) createScript();
    }, []);

    const signIn = () => {
      const ga = window.gapi.auth2.getAuthInstance();
      ga.signIn().then(
        (googleUser) => {
          getAWSCredentials(googleUser);
        },
        (error) => {
          console.log(error);
        }
      );
    };

    const getAWSCredentials = async (googleUser) => {
      const { id_token, expires_at } = googleUser.getAuthResponse();
      const profile = googleUser.getBasicProfile();
      let user = {
        email: profile.getEmail(),
        name: profile.getName(),
      };

      const credentials = await Auth.federatedSignIn(
        "google",
        { token: id_token, expires_at },
        user
      );
      console.log("credentials", credentials);
    };

    const createScript = () => {
      // load the Google SDK
      const script = document.createElement("script");
      script.src = "https://apis.google.com/js/platform.js";
      script.async = true;
      script.onload = initGapi;
      document.body.appendChild(script);
    };

    const initGapi = () => {
      // init the Google SDK client
      const g = window.gapi;
      g.load("auth2", function () {
        g.auth2.init({
          client_id: "your_google_client_id",
          // authorized scopes
          scope: "profile email openid",
        });
      });
    };
  };

  const SignInWithFacebook = () => {
    useEffect(() => {
      if (!window.FB) createScript();
    }, []);

    const signIn = () => {
      const fb = window.FB;
      fb.getLoginStatus((response) => {
        if (response.status === "connected") {
          getAWSCredentials(response.authResponse);
        } else {
          fb.login(
            (response) => {
              if (!response || !response.authResponse) {
                return;
              }
              getAWSCredentials(response.authResponse);
            },
            {
              // the authorized scopes
              scope: "public_profile,email",
            }
          );
        }
      });
    };

    const getAWSCredentials = (response) => {
      const { accessToken, expiresIn } = response;
      const date = new Date();
      const expires_at = expiresIn * 1000 + date.getTime();
      if (!accessToken) {
        return;
      }

      const fb = window.FB;
      fb.api("/me", { fields: "name,email" }, (response) => {
        const user = {
          name: response.name,
          email: response.email,
        };

        Auth.federatedSignIn(
          "facebook",
          { token: accessToken, expires_at },
          user
        ).then((credentials) => {
          console.log(credentials);
        });
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
  };

  async function signUp() {
    try {
      const { user } = await Auth.signUp({
        // username,
        // password,
        // attributes: {
        //     email,          // optional
        //     phone_number,   // optional - E.164 number convention
        // other custom attributes
        // }
      });
      console.log(user);
    } catch (error) {
      console.log("error signing up:", error);
    }
  }

  // async function signIn() {
  //   try {
  //       const user = await Auth.signIn(username = "username", password = "password");
  //   } catch (error) {
  //       console.log('error signing in', error);
  //   }
  // }

  async function signOut() {
    try {
      await Auth.signOut();
    } catch (error) {
      console.log("error signing out: ", error);
    }
  }

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
      document.getElementById("functionalModalButton").disabled = false;

      setTimeout(() => {
        setModalOpen(false);
      }, 4000);
    }
  }, [modalOpen]);

  useEffect(() => {
    if (modalOpen) {
      document.getElementById("functionalModal").style.display = "initial";
    } else {
      document.getElementById("functionalModal").style.display = "none";
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

  function handleSidebar() {
    // the same element cannot handle multiple keyframes. That's why it only transitions out right now.

    console.log(`handleSidebar fired while ${sidebarOpen}`);
    let sidebar = document.getElementById("sidebar");

    if (sidebar) {
      // if (!isLargeScreen) {
      if (sidebarOpen) {
        sidebar.classList.add("slideOut");
        // void sidebar.offsetWidth;
        setTimeout(() => {
          setSidebarOpen(false);
          sidebar.classList.remove("slideOut");
          document.getElementById("sidebar").style.display = "none";
          document.getElementById("sidebar").setAttribute("display", "none");
        }, 300);
      } else {
        // an atrocious js animation:
        setSidebarOpen(true);
        document.getElementById("sidebar").style.display = "initial";
        document.getElementById("sidebar").setAttribute("display", "initial");
        if (isSafari) {
          window.scroll(0, 0); // to show the buttons on safari
        }

        sidebar.style.left = "-300px";
        setTimeout(() => {
          sidebar.style.left = "-285px";
        }, 12);
        setTimeout(() => {
          sidebar.style.left = "-275px";
        }, 25);
        setTimeout(() => {
          sidebar.style.left = "-260px";
        }, 37);
        setTimeout(() => {
          sidebar.style.left = "-250px";
        }, 50);
        setTimeout(() => {
          sidebar.style.left = "-235px";
        }, 62);
        setTimeout(() => {
          sidebar.style.left = "-225px";
        }, 75);
        setTimeout(() => {
          sidebar.style.left = "-210px";
        }, 90);
        setTimeout(() => {
          sidebar.style.left = "-200px";
        }, 100);
        setTimeout(() => {
          sidebar.style.left = "-185px";
        }, 112);
        setTimeout(() => {
          sidebar.style.left = "-175px";
        }, 125);
        setTimeout(() => {
          sidebar.style.left = "-160px";
        }, 137);
        setTimeout(() => {
          sidebar.style.left = "-150px";
        }, 150);
        setTimeout(() => {
          sidebar.style.left = "-130px";
        }, 162);
        setTimeout(() => {
          sidebar.style.left = "-125px";
        }, 175);
        setTimeout(() => {
          sidebar.style.left = "-115px";
        }, 185);
        setTimeout(() => {
          sidebar.style.left = "-100px";
        }, 200);
        setTimeout(() => {
          sidebar.style.left = "-90px";
        }, 212);
        setTimeout(() => {
          sidebar.style.left = "-75px";
        }, 225);
        setTimeout(() => {
          sidebar.style.left = "-60px";
        }, 237);
        setTimeout(() => {
          sidebar.style.left = "-50px";
        }, 250);
        setTimeout(() => {
          sidebar.style.left = "-35px";
        }, 265);
        setTimeout(() => {
          sidebar.style.left = "-25px";
        }, 275);
        setTimeout(() => {
          sidebar.style.left = "-10px";
        }, 290);
        setTimeout(() => {
          sidebar.style.left = "-00px";
        }, 300);
        // sidebar.classList.add("slideIn");
        // sidebar.classList.remove("slideIn");
        // void sidebar.offsetWidth;
      }
      // }
    }
  }

  const [showMenuHome, setShowMenuHome] = useState(false);
  const [showMenuShop, setShowMenuShop] = useState(false);
  const [showMenuAccount, setShowMenuAccount] = useState(false);

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
      <header
        style={{
          "max-height": "8em",
          bottom: "7em",
          // "background-color": "black",
        }}
      >
        <div>
          <div id="headerHeight">
            <Header />
          </div>
        </div>
      </header>
      <div
        // data-toggle="example-menu"
        // onMouseOut={() => setListShow("hidden")}
        data-sticky-container
        data-stick-to="top"
        style={{
          position: "sticky",
          "overflow-x": "visible",
          top: ".01em",
          marginBottom: "30px",
          "z-index": "99",
        }}
      >
        <div
          // main sticky responsive bar
          style={{
            maxHeight: "3.5em",
            bottom: "70vh",
            position: "relative",
            zIndex: "98",
            maxWidth: "100vw",
            // boxShadow: "0px 1px 0px #42536e",
          }}
          id="example-menu"
          className="title-bar"
          data-responsive-toggle="example-menu"
          hideFor="medium"
        >
          <div
            style={{
              whiteSpace: "nowrap",
              maxWidth: "100vw",
              bottom: "-275px",
              position: "relative",
              zIndex: "98",
            }}
            className="title-bar-title show-for-large"
          >
            <img
              style={{ transform: "scale(0.7)", position: "static" }}
              className="logo"
              src="https://i.ibb.co/xzRRZyf/untitled-1.png"
              alt="j collection logo"
            ></img>

            <Link
              to="/"
              onMouseOver={() => setShowMenuHome(true)}
              style={{
                height: "100px",
                width: "200px",
                zIndex: "99",
                display: "flex",
              }}
            >
              {/* <Flexbox flexDirection="row">
                <img
                  alt="j collection logo"
                  // width="100px"
                  height="10%"
                  src=""
                  style={{
                    bottom: "10px",
                    marginRight: "10px",
                    marginBottom: "5px",
                    width: "50%",
                    transform: "scale(0.55)",
                    // paddingRight: "30px",
                  }}
                ></img>
              </Flexbox> */}
            </Link>
            {/* <HomeMenu /> */}
          </div>
          <button
            onClick={() => handleSidebar()}
            style={{
              // visibility: `${hamburgerDisplayString}`,
              "z-index": "99",
              "font-size": "larger",
              top: ".75em",
              width: "8vw",
              height: "10vw",
              position: "absolute",
              // paddingRight: "-50px",
              display: `${isPortrait ? "initial" : "none"}`,
            }}
            data-toggle="example-menu"
            className="hide-for-large menu-icon"
            type="button"
          ></button>
          {/* <Link
            style={{
              whiteSpace: "nowrap",
              margin: "0em",
              zIndex: "99",
              display: `${isPortrait || isSmallScreen ? "none" : "initial"}`,
            }}
            to="/"
          >
            <img
              alt="jiva logo rose"
              width="100vw"
              height="auto"
              src="https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/svg%2Fjiva%20rose.png?alt=media&token=d3a1a81a-6f5d-4c5b-8aa6-e0ae18e77639"
            ></img>
          </Link> */}

          <div
            // className="hide-for-large"
            style={{
              float: "left",
              display: "inline-block",
              top: "5em",
            }}
          >
            <Flexbox flexDirection="row" style={{ maxWidth: "100%" }}>
              <form
                // this is the search box for mobile
                className="hide-for-large"
                autocomplete="off"
                style={{
                  float: "left",
                  // visibility: `${listItemDisplay}`,
                  display: `${isPortrait ? "inline-block" : "none"}`,
                  "margin-left": "34vw",
                  "margin-top": "10em",
                  "margin-bottom": "1.3em",
                }}
              >
                <div
                  className="autocomplete"
                  style={{
                    float: "left",
                  }}
                >
                  {!searchString ? (
                    <Link to="/">
                      <input
                        style={{
                          left: "20em",
                          bottom: "500px",
                          width: "40vw",
                          fontSize: "small",
                        }}
                        type="text"
                        id="menuSearch"
                        // onKeyPress={() => {
                        //   handleSearchShop("menuSearch");
                        // }}
                        // onKeyUp={() => {
                        //   handleSearchShop("menuSearch");
                        //   autocomplete(
                        //     document.getElementById(`menuSearch`),
                        //     searchArray
                        //   );
                        // }}
                        placeholder={`Search ${
                          searchString ? searchString : "Domestics near you"
                        }...`}
                      ></input>
                    </Link>
                  ) : (
                    <input
                      style={{
                        bottom: "500px",
                        left: "20em",
                        width: "40vw",
                        fontSize: "small",
                      }}
                      type="text"
                      id="menuSearch"
                      // onKeyPress={() => {
                      //   handleSearchShop("menuSearch");
                      // }}
                      // onKeyUp={() => {
                      //   handleSearchShop("menuSearch");
                      //   autocomplete(
                      //     document.getElementById(`menuSearch`),
                      //     searchArray
                      //   );
                      // }}
                      placeholder={`Search ${
                        searchString ? searchString : "Domestics near you"
                      }...`}
                    ></input>
                  )}
                </div>
              </form>
              <div
                style={{
                  display: "inline-block",
                  float: "right",
                  top: "15em",
                  "margin-left": "5vw",
                  "margin-top": "6em",
                  marginBottom: "-1.7em",
                }}
              >
                {/* <Link to="/cart" className="cartIcon">
                  <img
                    alt="cart icon"
                    src={`${urlString}`}
                    style={{ minWidth: "40px" }}
                    id="headerCartIcon4"
                    // width={`${isLargeScreen ? "50px" : "40px"}`}
                    width={`60px`}
                    height="auto"
                  ></img>
                </Link> */}
              </div>
            </Flexbox>
          </div>
          <ul
            className="dropdown menu"
            hideFor="medium"
            style={{
              position: "relative",
              // "max-height": "3.5em",
              height: "260px",
              bottom: "315px",
              backgroundColor: "white",
              zIndex: "90",
            }}
            data-dropdown-menu
          >
            <li
              style={{
                right: "4em",
                justifyContent: "space-between",
                maxWidth: "100vw",
                display: "inline-block",
                textDecoration: "none",
              }}
              onMouseOver={() => setShowMenuShop(true)}
            >
              <li style={{ display: "flex", flexDirection: "column" }}>
                <Link
                  onClick={() => setOnHomeScreen(true)}
                  style={{
                    color: `${onHomeScreen ? styleColors.maroon : "black"}`,
                    // float: "left",
                    height: "100px",
                    left: "500px",
                    top: "180px",
                    bottom: "30px",
                    "overflow-x": "hidden",
                    // visibility: `${listItemDisplay}`,
                    "font-size": "xx-large",
                    position: "relative",
                    padding: "30px",
                    paddingBottom: "15px",
                    textDecoration: "none",
                    zIndex: "99",
                    pointerEvents: "all",
                  }}
                  to="/"
                >
                  Home
                </Link>
              </li>
              <li style={{ display: "flex", flexDirection: "column" }}>
                <Link
                  onClick={() => setOnBrowse(true)}
                  style={{
                    // float: "left",
                    height: "300px",
                    left: "800px",
                    top: "180px",
                    bottom: "30px",
                    "overflow-x": "hidden",
                    // visibility: `${listItemDisplay}`,
                    "font-size": "xx-large",
                    position: "relative",
                    padding: "30px",
                    paddingBottom: "15px",
                    textDecoration: "none",
                    color: `${onBrowse ? styleColors.maroon : "black"}`,
                    zIndex: "99",
                    pointerEvents: "all",
                  }}
                  to="/shop"
                  className="show-for-large"
                  id="shopId"
                >
                  Browse
                </Link>

                {/* <ShopMenu /> */}
              </li>
              <li style={{ display: "flex", flexDirection: "column" }}>
                <Link
                  onClick={() => setOnAccount(true)}
                  style={{
                    // float: "left",
                    height: "100px",
                    left: "1100px",
                    top: "180px",
                    bottom: "30px",
                    "overflow-x": "hidden",
                    // visibility: `${listItemDisplay}`,
                    "font-size": "xx-large",
                    position: "relative",
                    padding: "30px",
                    paddingBottom: "15px",
                    textDecoration: "none",
                    color: `${onAccount ? styleColors.maroon : "black"}`,
                    zIndex: "99",
                    pointerEvents: "all",
                  }}
                  to="/account"
                >
                  Account
                </Link>
              </li>
            </li>
            <li
              style={{
                float: "right",
                right: "100px",
                // bottom: "700px",
                flexDirection: "row",
                position: "relative",
                display: "flex",
                justifyContent: "space-between",
                width: "130px",
                bottom: "-90px",
                zIndex: "99",
              }}
            >
              <img
                width="20px"
                alt="pinterest"
                src="https://i.ibb.co/5Bb3gHX/pinterest-social-logo.png"
              />
              <img
                width="20px"
                src="https://i.ibb.co/MhrzBKH/twitter.png"
                alt="twitter"
                border="0"
              />
              <img
                width="20px"
                src="https://i.ibb.co/gP4RKF8/facebook.png"
                alt="facebook"
                border="0"
              />
              <img
                width="20px"
                src="https://i.ibb.co/nMcYrk9/instagram.png"
                alt="instagram"
                border="0"
              />
            </li>
            <li
              style={{
                display: "flex",
                // float: "left",
                position: "relative",
                whiteSpace: "nowrap",
                right: "300px",
                bottom: ".6em",
                pointerEvents: "none",
              }}
            >
              <span
                style={{
                  display: "flex",
                  // justifyContent: "space-between",
                  // maxWidth: "100vw",
                  float: "right",
                  position: "relative",
                  marginLeft: "60vw",
                  whiteSpace: "nowrap",
                  maxHeight: "2em",
                }}
              >
                <span style={{}}>
                  <form
                    className="show-for-large"
                    autocomplete="off"
                    style={{
                      position: "relative",
                      bottom: "-2.8em",
                      // right: "1.8em",
                      // float: "left",
                      // visibility: `${listItemDisplay}`,
                      pointerEvents: "all",
                    }}
                  >
                    <div
                      className="autocomplete"
                      style={{
                        display: "inline-block",
                        // right: "15%",
                        position: "relative",
                        bottom: "-15px",
                        outline: "none",
                        border: "none",
                        right: "700px",
                        marginTop: "12px",
                        float: "left",
                      }}
                    >
                      {!searchString ? (
                        <Link to="/shop">
                          <input
                            style={{
                              // right: "40em",

                              float: "left",
                              width: "15vw",
                              outline: "none",
                              border: "none",
                              height: "45px",
                              backgroundColor: "#ededed",
                              marginRight: "0em",
                            }}
                            type="text"
                            id="menuSearch2"
                            // onKeyPress={() => {
                            //   handleSearchShop("menuSearch2");
                            // }}
                            // onKeyUp={() => {
                            //   handleSearchShop("menuSearch2");
                            //   autocomplete(
                            //     document.getElementById(`menuSearch2`),
                            //     searchArray
                            //   );
                            // }}
                            // placeholder={`Search ${
                            //   searchString ? searchString : "Domestics near you"
                            // }...`}
                          ></input>
                        </Link>
                      ) : (
                        <input
                          style={{
                            right: "15%",
                            float: "left",
                            width: "15vw",
                            outline: "none",
                            border: "none",
                            height: "45px",
                            marginRight: "0em",
                            top: "13px",
                            position: "relative",
                          }}
                          type="text"
                          id="menuSearch2"
                          // onKeyPress={() => {
                          //   handleSearchShop("menuSearch2");
                          // }}
                          // onKeyUp={() => {
                          //   handleSearchShop("menuSearch2");
                          //   autocomplete(
                          //     document.getElementById(`menuSearch2`),
                          //     searchArray
                          //   );
                          // }}
                          // placeholder={`Search in ${searchString}...`}
                        ></input>
                      )}
                      <button
                        type="button"
                        style={{ outline: "none", border: "none" }}
                      >
                        <img
                          width="42px"
                          src="https://i.ibb.co/wpP9R9W/magnifying-glass.png"
                          alt="search button magnifying glass"
                        ></img>
                      </button>
                    </div>
                  </form>
                </span>
                <span
                  onMouseOver={() => setShowMenuAccount(true)}
                  className="show-for-large"
                  style={{
                    // visibility: `${listItemDisplay}`,
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    bottom: "13px",
                    left: "1em",
                    marginTop: "9px",
                    pointerEvents: "all",
                  }}
                >
                  <Link to="/account" className="li row hoverPink">
                    {accountTitleString}
                  </Link>
                  {/* <AccountMenu /> */}
                </span>
              </span>
            </li>
          </ul>
        </div>
      </div>
      <div
        id="sidebar"
        className="sidebar"
        style={{
          background: "black",
          opacity: "0.89",
          position: "fixed",
          zIndex: "99",
          top: "0em",
          left: "0em",
          width: "65%",
          marginTop: "1em",
          height: "250vh",
          display: `${sidebarOpen ? "initial" : "none"}`,
          whiteSpace: "nowrap",
        }}
      >
        <div
        // className="table-scroll"
        // id="sidebar"
        >
          <table>
            <Flexbox
              flexDirection="row"
              style={{
                position: "fixed",
                top: "1.3em",
              }}
            >
              <Flexbox
                flexDirection="column"
                // onLoad={() => {
                //   setSidebarOpen(false);
                // }}
                style={{
                  top: "0.4em",
                  position: "relative",
                  left: "2em",
                  textAlign: "left",
                }}
              >
                <Link
                  className="largeText smushed"
                  to="/"
                  onClick={() => handleSidebar()}
                >
                  <button
                    type="button"
                    className="button small"
                    style={{
                      width: "100px",
                      backgroundColor: styleColors.hotPink,
                      fontSize: "medium",
                    }}
                  >
                    Home
                  </button>
                </Link>
                <Link className="largeText smushed" to="/contact">
                  <button
                    style={{
                      width: "100px",
                      backgroundColor: styleColors.maroon,
                      fontSize: "medium",
                    }}
                    type="button"
                    className="button small"
                    onClick={() => {
                      handleSidebar();
                    }}
                  >
                    <span style={{ right: "10px", position: "relative" }}>
                      Contact Us
                    </span>
                  </button>
                </Link>
                <br></br>
                {!mobileBottomsMenu && !mobileTopsMenu && (
                  <div
                    style={{
                      display: `flex`,
                      flexDirection: "column",
                    }}
                  >
                    <Link
                      className="largeText smushed"
                      to="/shop"
                      onClick={() => {
                        handleSidebar();
                      }}
                    >
                      <button
                        type="button"
                        className="button small"
                        style={{
                          width: "100px",
                          fontSize: "medium",
                          backgroundColor: styleColors.hotPink,
                        }}
                      >
                        Shop All
                      </button>
                    </Link>
                    <Link
                      className="largeText smushed"
                      to="/shop/full-sets"
                      onClick={() => {
                        handleSidebar();
                      }}
                    >
                      <button
                        type="button"
                        className="button small"
                        style={{
                          width: "100px",
                          fontSize: "medium",

                          backgroundColor: styleColors.maroon,
                        }}
                        onClick={() => {
                          handleSidebar();
                        }}
                      >
                        Sets
                      </button>
                    </Link>

                    <button
                      type="button"
                      className="button small largeText smushed"
                      onClick={() => {
                        setMobileTopsMenu(true);
                      }}
                      style={{
                        marginTop: "-5px",
                        marginBottom: "3px",
                        width: "100px",
                        fontSize: "medium",
                        backgroundColor: styleColors.maroon,
                      }}
                    >
                      {"Tops >"}
                    </button>

                    <button
                      type="button"
                      className="button small largeText smushed"
                      onClick={() => setMobileBottomsMenu(true)}
                      style={{
                        width: "100px",
                        fontSize: "medium",
                        backgroundColor: styleColors.maroon,
                      }}
                    >
                      <span style={{ right: "5px", position: "relative" }}>
                        {"Bottoms >"}
                      </span>
                    </button>
                  </div>
                )}
                {mobileTopsMenu && (
                  <div>
                    <button
                      style={{
                        bottom: "10px",
                        right: "10px",
                        position: "relative",
                        display: "flex",
                        flexDirection: "row",
                      }}
                      type="button"
                      onClick={() => setMobileTopsMenu(false)}
                    >
                      <img
                        alt="sidebar arrow"
                        width="10em"
                        style={{ top: "4px", position: "relative" }}
                        height="auto"
                        src="https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/left%20arrow%20white.svg?alt=media&token=9f166f00-6ab3-4c6f-b889-64178ab8472a"
                      />
                      <p style={{ color: "white", fontSize: "small" }}>Back</p>
                    </button>
                    <div
                      style={{ display: "flex", flexDirection: "column" }}
                    ></div>
                  </div>
                )}
                {mobileBottomsMenu && (
                  <div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <button
                        style={{
                          bottom: "10px",
                          right: "10px",
                          position: "relative",
                          display: "flex",
                          flexDirection: "row",
                        }}
                        type="button"
                        onClick={() => setMobileBottomsMenu(false)}
                      >
                        <img
                          alt="sidebar arrow"
                          width="10em"
                          style={{ top: "4px", position: "relative" }}
                          height="auto"
                          src="https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/left%20arrow%20white.svg?alt=media&token=9f166f00-6ab3-4c6f-b889-64178ab8472a"
                        />
                        <p style={{ color: "white", fontSize: "small" }}>
                          Back
                        </p>
                      </button>
                      <Link
                        className="largeText smushed"
                        to="/shop/skirts"
                        onClick={() => {
                          handleSidebar();
                          setMobileBottomsMenu(false);
                        }}
                      >
                        <button
                          type="button"
                          className="button primary small"
                          style={{
                            width: "100px",
                            backgroundColor: styleColors.maroon,
                            fontSize: "medium",
                          }}
                        >
                          {"Skirts"}
                        </button>
                      </Link>
                      <Link
                        className="largeText smushed"
                        to="/shop/pants"
                        onClick={() => {
                          handleSidebar();
                          setMobileBottomsMenu(false);
                        }}
                      >
                        <button
                          type="button"
                          className="button primary small"
                          style={{
                            width: "100px",
                            backgroundColor: styleColors.maroon,
                            fontSize: "medium",
                          }}
                        >
                          {"Pants"}
                        </button>
                      </Link>
                      <Link
                        className="largeText smushed"
                        to="/shop/belts"
                        onClick={() => {
                          handleSidebar();
                          setMobileBottomsMenu(false);
                        }}
                      >
                        <button
                          type="button"
                          className="button primary small"
                          style={{
                            width: "100px",
                            backgroundColor: styleColors.maroon,
                            fontSize: "medium",
                          }}
                          onClick={() => {
                            handleSidebar();
                            setMobileBottomsMenu(false);
                          }}
                        >
                          Belts
                        </button>
                      </Link>
                    </div>
                  </div>
                )}
                <br></br>
                {accountTitleString === "Your Account" ? (
                  <Link
                    className="largeText smushed"
                    to="/account"
                    onClick={() => {
                      handleSidebar();
                    }}
                  >
                    <button
                      type="button"
                      style={{
                        width: "100px",
                        backgroundColor: styleColors.maroon,
                        fontSize: "medium",
                      }}
                      className="button small pink"
                    >
                      Sign In
                    </button>
                  </Link>
                ) : (
                  <Flexbox flexDirection="column">
                    <Link
                      className="largeText smushed"
                      to="/account"
                      onClick={() => {
                        handleSidebar();
                      }}
                    >
                      <button
                        type="button"
                        className="buttonsmall"
                        style={{
                          minWidth: "100px",
                          backgroundColor: styleColors.hotPink,
                          fontSize: "medium",
                          color: "white",
                          height: "45px",
                          marginBottom: "17px",
                        }}
                      >
                        {accountTitleString}
                      </button>
                    </Link>
                    <Link
                      className="largeText smushed"
                      to="/favorites"
                      onClick={() => {
                        handleSidebar();
                      }}
                    >
                      <button
                        type="button"
                        className="button small"
                        style={{
                          width: "100px",
                          backgroundColor: styleColors.maroon,
                          fontSize: "medium",
                        }}
                      >
                        Favorites
                      </button>
                    </Link>

                    <Link
                      className="largeText smushed"
                      to="/cart"
                      onClick={() => {
                        handleSidebar();
                      }}
                    >
                      <button
                        type="button"
                        className="button  small"
                        style={{
                          width: "100px",
                          backgroundColor: styleColors.maroon,
                          fontSize: "medium",
                        }}
                      >
                        Cart
                      </button>
                    </Link>
                    <Link
                      className="largeText smushed"
                      to="/my-orders"
                      onClick={() => {
                        handleSidebar();
                      }}
                    >
                      <button
                        type="button"
                        className="button small"
                        style={{
                          width: "100px",
                          backgroundColor: styleColors.maroon,
                          fontSize: "medium",
                        }}
                      >
                        Orders
                      </button>
                    </Link>
                    <Link
                      className="largeText smushed"
                      to="/account"
                      onClick={() => {
                        handleSignOut();
                        handleSidebar();
                      }}
                    >
                      <button
                        type="button"
                        className="button small"
                        style={{
                          width: "100px",
                          backgroundColor: styleColors.maroon,
                          fontSize: "medium",
                        }}
                      >
                        Sign Out
                      </button>
                    </Link>
                  </Flexbox>
                )}
              </Flexbox>
              <button
                style={{
                  position: "relative",
                  top: "24vh",
                  left: "26vw",
                }}
                onClick={() => {
                  handleSidebar();
                }}
                type="button"
              >
                <img
                  alt="sidebar arrow"
                  width="32em"
                  height="auto"
                  src="https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/left%20arrow%20white.svg?alt=media&token=9f166f00-6ab3-4c6f-b889-64178ab8472a"
                />
              </button>
            </Flexbox>
          </table>
        </div>
      </div>

      <div
        className="functionalModal"
        id="functionalModal"
        style={{
          // top: `${isLargeScreen ? "40vw" : "80vw"}`,

          left: `${isPortrait || isSmallScreen ? "10vw" : "60vw"}`,
          bottom: `${isPortrait || isSmallScreen ? "5px" : "auto"}`,
          // marginRight: `${isPortrait || isSmallScreen ? "20px" : ""}`,
          fontSize: `${isLargeScreen ? "initial" : "small"}`,
          display: "none",
          "box-shadow": "0px 0px 5px white",
        }}
      >
        <p
          style={{
            left: `${isLargeScreen ? "initial" : "-5vw"}`,
          }}
        >
          {modalText}
        </p>
        <button
          type="button"
          className="functionalModalButton button small"
          id="functionalModalButton"
          style={{
            width: "5em",
            marginRight: "1em",
            backgroundColor: styleColors.hotPink,
          }}
          onClick={() => {
            // turnOffModal();
          }}
        >
          OK
        </button>
        <button
          type="button"
          className="functionalModalButton button small"
          id="functionalModalButton"
          style={{
            width: "5em",
            color: "black",
            backgroundColor: styleColors.peachPuff,
          }}
          onClick={() => {
            modalExecute();
            // turnOffModal();
          }}
        >
          Undo
        </button>
      </div>
      <div
        className="itemOptionsModal"
        id="itemOptionsModal"
        style={{
          // top: `${isLargeScreen ? "16.5vw" : "75vw"}`,
          // left: `${isLargeScreen ? "30vw" : "5vw"}`,
          right: `${isSmallScreen || isPortrait ? "80vw" : "60vw"}`,
          fontSize: `${isLargeScreen ? "initial" : "small"}`,
          display: "none",
          "box-shadow": "0px 0px 5px white",
        }}
      >
        <p
          style={{
            left: `${isLargeScreen ? "initial" : "-5vw"}`,
          }}
        >
          {optionsModalText}
        </p>
        <button
          type="button"
          className="itemOptionsModalButton button small"
          id="itemOptionsModalButton"
          style={{ backgroundColor: styleColors.hotPink }}
          onClick={() => closeOptionsModal()}
        >
          OK
        </button>
      </div>
      <div
        className="itemOptionsModal"
        id="expressModal"
        style={{
          top: `${isLargeScreen ? "16.5vw" : "50vw"}`,
          left: `${isLargeScreen ? "30vw" : "5vw"}`,
          fontSize: `${isLargeScreen ? "initial" : "small"}`,
          display: "none",
          "box-shadow": "0px 0px 5px white",
        }}
      >
        <p
          style={{
            left: `${isLargeScreen ? "initial" : "-5vw"}`,
          }}
        >
          Sign in to use Express Checkout
        </p>
        <Link to="/account">
          <button
            type="button"
            className="itemOptionsModalButton button small"
            style={{ backgroundColor: styleColors.hotPink }}
            id="expressModalYes"
            onClick={() => closeExpressModal()}
          >
            Sign In
          </button>
        </Link>
        <button
          type="button"
          className="itemOptionsModalButton button small"
          id="expressModalNo"
          onClick={() => closeExpressModal()}
          style={{ backgroundColor: styleColors.peachPuff, color: "black" }}
        >
          No Thanks
        </button>
      </div>
      <div
        className="itemOptionsModal"
        id="checkoutModal"
        style={{
          display: "none",
          "box-shadow": "0px 0px 5px white",
        }}
      >
        {/* <h3>Leave checkout and return to {navString}?</h3> */}
        {/* <Link to={`/${navString}`}>
          <button
            type="button"
            style={{ backgroundColor: styleColors.hotPink }}
            className="itemOptionsModalButton button small"
            id="checkoutModalButtonYes"
            onClick={() => {
              // setLeaveCheckoutModal(false);
            }}
          >
            Yes
          </button>
        </Link> */}

        <button
          type="button"
          className="itemOptionsModalButton button small"
          style={{ backgroundColor: styleColors.peachPuff, color: "black" }}
          id="checkoutModalButtonNo"
          onClick={() => {
            // setLeaveCheckoutModal(false);
          }}
        >
          No
        </button>
      </div>

      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        {/* <Route path="/express-checkout">
          <Elements stripe={stripePromise}>
            <ExpressCheckout />
          </Elements>
        </Route> */}
        {/* {allArtisans.map((artisan) => {
          let artisanPageLinkString = artisan[0].split(" ").join("-");
          return (
            <Route path={`/product/${artisanPageLinkString}`}>
              <ArtisanPage artisan={artisan} />
            </Route>
          );
        })} */}
        <Route path="/about">
          <About />
        </Route>
        {/* <Route path="/cart">
          <Cart />
        </Route>
        <Route path="cart-sign-in">
          <CartSignIn />
        </Route> */}
        <Route path="/account">
          <Account />
        </Route>
        <Route path="/contact">
          <Contact />
        </Route>
        {/* <Route path="/sign-in-successful">
          <SignInSuccessful />
        </Route>
        <Route path="/privacy-policy">
          <PrivacyPolicy />
        </Route>
        <Route path="/terms-of-service">
          <TermsOfService />
        </Route>
        <Route path="/sign-in-success-email">
          <SignInSuccessEmail />
        </Route> */}
        {/* <Route path="/sign-in-with-email">
          <SignInWithEmail />
        </Route> */}
        <Route path="/order-success">
          <OrderSuccess />
        </Route>
        <Route path="/my-orders">
          <MyOrders />
        </Route>
        <Route path="/favorites">
          <Favorites />
        </Route>
        {/* <Route path="/return-policy">
          <ReturnPolicy />
        </Route> */}
      </Switch>

      <div>
        {/* {termsDisplay && (
          <div
            style={{
              marginTop: `${isPortrait || isSmallScreen ? "" : "80px"}`,
            }}
          >
            <PrivacyAndTermsAgreement />
            <RecentlyViewed />
          </div>
        )} */}
      </div>
      <br></br>
      <Footer />
      {/* <button onClick={signIn}>Sign in with Facebook</button> */}
    </div>
  );
}

// export default withAuthenticator(App, true);
export default App;
