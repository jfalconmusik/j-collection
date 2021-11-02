import React, { useState, useEffect } from "react";
// import Images from "./images";
// import firebase from "firebase";
// import { jQuery } from "jquery";
import { loadStripe } from "@stripe/stripe-js";
// import windowSize from "react-window-size";
import { useMediaQuery } from "react-responsive";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getFunctions, httpsCallable } from "firebase/functions";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const Context = React.createContext({});

function ContextProvider({ children }) {
  ///// User Context:
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

  const functions = getFunctions(app);
  // const storage = getStorage(app);
  const storage = getStorage();

  const [providerId, setProviderId] = useState("");
  const [uid, setUid] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [userName, setUserName] = useState([]);
  //
  const [homeAddress, setHomeAddress] = useState([]);
  const [homePhotos, setHomePhotos] = useState([]);
  const [showModalPhotosMenu, setShowModalPhotosMenu] = useState(false);
  const [showModalAgentPhotosMenu, setShowModalAgentPhotosMenu] =
    useState(false);
  const [showModalDeletePhotoMenu, setShowModalDeletePhotoMenu] =
    useState(false);

  const [showModalAgentAuth, setShowModalAgentAuth] = useState(false);
  //
  // logic for requesting user information if they're accounts are new
  const [requestInfo, setRequestInfo] = useState(false);

  const [userRating, setUserRating] = useState(0.0);

  const [agentRating, setAgentRating] = useState(0.0);

  const handleAddPhotos = () => {
    setShowModalCenter(true);
    setShowModalPhotosMenu(true);
  };

  const handleAddAgentPhotos = () => {
    setShowModalCenter(true);
    setShowModalAgentPhotosMenu(true);
  };

  const handleDeletePhoto = () => {
    setShowModalCenter(true);
    setShowModalDeletePhotoMenu(true);
  };

  const [urls, setUrls] = useState([]);
  const [files, setFiles] = useState([]);
  const [filenames, setFilenames] = useState([]);

  const savePhotos = (files) => {
    setShowLottieLoading(true);
    setIsSaveHomePhotos(true);
    // Create a child reference
    const imagesRef = ref(storage, "home-photos");
    let urlArr = [];

    // imagesRef now points to 'images'
    // Child references can also take paths delimited by '/'
    for (let i = 0; i < files.length; i++) {
      let file = files[i];
      const photoStringArr = file.name.split(".");
      const type = photoStringArr[photoStringArr.length - 1];
      const filename = photoStringArr[photoStringArr.length - 2];
      let url = `home-photos/${uid}/${filename}.${type}`;
      const storageRef = ref(storage, url);
      urlArr.push(url);
      const metadata = {
        contentType: "image/jpeg",
      };

      // const file = new File([`${filename}`], `${path}`, {
      //   type: "image/jpeg",
      // });

      // 'file' comes from the Blob or File API
      const result = uploadBytes(storageRef, file, metadata)
        .then((snapshot) => {
          console.log("Uploaded a blob or file!");
          console.log(snapshot);
          return getDownloadURL(snapshot.ref);
        })
        .then((downloadURL) => {
          console.log("File available at", downloadURL);
          return downloadURL;
        })
        .catch((error) => {
          setShowLottieLoading(false);
          setShowLottieError(true);
          console.log(error);
          return "";
        });

      console.log("url: ", url);
      console.log("result: ", result);
      // return url;
    }

    const saveHomePhotos = httpsCallable(functions, "saveHomePhotos");
    saveHomePhotos({ homePhotos: [...homePhotos, ...urlArr] })
      .then((result) => {
        // Read result of the Cloud Function.
        /** @type {any} */
        const data = result.data;
        console.log("received save home photos result", data);
        const success = data.success;
        const photos = [...data.homePhotos];

        if (success) {
          console.log(
            `user ${displayName} with ID ${uid} has saved home photos`,
            `new home photo urls: `,
            urlArr
          );

          setShowLottieLoading(false);
          setShowLottieSuccess(true);
          setIsSaveHomePhotos(false);
          setShowModalPhotosMenu(false);
          setFiles([]);
          setFilenames([]);
          setHomePhotos([...homePhotos, ...urlArr]);
        } else
          throw new Error("ERROR: Couldn't save download URLs to user file.");
      })
      .catch((error) => {
        // Getting the Error details.
        setShowLottieLoading(false);
        setShowLottieError(true);
        const code = error.code;
        const message = error.message;

        const details = error.details;
        console.log(message); // ...
      });

    // setShowLottieLoading(false);
    // setShowLottieSuccess(true);
    // setFiles([]);
    // setFilenames([]);
  };

  const [isSaveAgentPhotos, setIsSaveAgentPhotos] = useState(false);

  const saveAgentPhotos = (files) => {
    setShowLottieLoading(true);
    setIsSaveAgentPhotos(true);
    // Create a child reference
    const imagesRef = ref(storage, "agent-photos");
    let urlArr = [];

    // imagesRef now points to 'images'
    // Child references can also take paths delimited by '/'
    for (let i = 0; i < files.length; i++) {
      let file = files[i];
      const photoStringArr = file.name.split(".");
      const type = photoStringArr[photoStringArr.length - 1];
      const filename = photoStringArr[photoStringArr.length - 2];
      let url = `agent-photos/${uid}/${filename}.${type}`;
      const storageRef = ref(storage, url);
      urlArr.push(url);
      const metadata = {
        contentType: "image/jpeg",
      };

      // const file = new File([`${filename}`], `${path}`, {
      //   type: "image/jpeg",
      // });

      // 'file' comes from the Blob or File API
      const result = uploadBytes(storageRef, file, metadata)
        .then((snapshot) => {
          console.log("Uploaded a blob or file!");
          console.log(snapshot);
          return getDownloadURL(snapshot.ref);
        })
        .then((downloadURL) => {
          console.log("File available at", downloadURL);
          return downloadURL;
        })
        .catch((error) => {
          setShowLottieLoading(false);
          setShowLottieError(true);
          console.log(error);
          return "";
        });

      console.log("url: ", url);
      console.log("result: ", result);
      // return url;
    }

    const saveAgentPictures = httpsCallable(functions, "saveAgentPictures");
    saveAgentPictures({ agentPhotos: [...agentPhotos, ...urlArr] })
      .then((result) => {
        // Read result of the Cloud Function.
        /** @type {any} */
        const data = result.data;
        console.log("received save agent photos result", data);
        const success = data.success;

        if (success) {
          console.log(
            `agent ${displayName} with ID ${uid} has saved agent photos`,
            `new agent photo urls: `,
            urlArr
          );

          setShowLottieLoading(false);
          setShowLottieSuccess(true);
          setIsSaveAgentPhotos(false);
          setFiles([]);
          setFilenames([]);
          setAgentPhotos([...agentPhotos, ...urlArr]);
        } else
          throw new Error("ERROR: Couldn't save download URLs to agent file.");
      })
      .catch((error) => {
        // Getting the Error details.
        setShowLottieLoading(false);
        setShowLottieError(true);
        const code = error.code;
        const message = error.message;

        const details = error.details;
        console.log(message); // ...
      });

    // setShowLottieLoading(false);
    // setShowLottieSuccess(true);
    // setFiles([]);
    // setFilenames([]);
  };

  // spaceRef now points to "images/space.jpg"
  // imagesRef still points to "images"

  const [authToggle, setAuthToggle] = useState(false);
  const toggleAuth = () => {
    setAuthToggle(!authToggle);
  };
  const auth = getAuth();

  const [isPendingVerification, setIsPendingVerification] = useState(false);
  const [isAgent, setIsAgent] = useState(false);
  const [isOnAgentSite, setIsOnAgentSite] = useState(false);
  const [agentObj, setAgentObj] = useState({}); // THIS is the agent document as viewed by the agent

  const [requestRejected, setRequestRejected] = useState(false);
  const [showRejected, setShowRejected] = useState(false);
  const [agentPhotos, setAgentPhotos] = useState([]);
  const [userBookings, setUserBookings] = useState([]);

  const [userSchedule, setUserSchedule] = useState([]);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        setUid(user.uid);
        setDisplayName(user.displayName);
        setUserEmail(user.email);
        setPhotoURL(user.photoURL);
        setProviderId(user.providerId);
        console.log("user signed in");

        //  this callable also gets the home photos and some other personal information
        const getAddressAndName = httpsCallable(functions, "getAddressAndName");
        getAddressAndName({})
          .then((result) => {
            // Read result of the Cloud Function.
            /** @type {any} */
            const data = result.data;
            const address = [...data.homeAddress];
            const photos = [...data.homePhotos];
            const profileImg = data.profilePhoto;
            const reqRejected = data.requestRejected;
            const bookings = data.bookings;
            const rating = data.currentRating;
            const schedule = data.schedule;
            const history = data.history;
            setUserHistory(history);
            setUserSchedule(schedule);
            setUserRating(rating);

            setUserName({
              firstName: address[0],
              lastName: address[1],
            });

            setUserBookings(bookings);
            setIsAgent(data.isAgent);
            setIsPendingVerification(data.isPendingVerification);
            setRequestRejected(reqRejected);

            if (data.isAgent) {
              console.log("is agent");
              const getAgentInfo = httpsCallable(functions, "getAgentInfo");
              getAgentInfo({})
                .then((result) => {
                  console.log("agent info response received from server.");
                  console.log(result.data);
                  if (result.data.success) {
                    console.log("retrieved agent info", result.data.agentObj);
                    setAgentObj(result.data.agentObj);
                    setAgentHistory(result.data.agentObj.history);
                    setAgentPhotos(result.data.agentObj.agentPhotos);
                    setIsOnAgentSite(true);
                  } else {
                    setIsOnAgentSite(false);
                    console.log("error to retrieve agent object");
                  }
                })
                .catch((error) => {
                  setIsOnAgentSite(false);
                  console.log(error);
                });
            } else {
              console.log("is not agent");
              setIsOnAgentSite(false);
              setAgentObj({});
              setAgentPhotos([]);
            }

            console.log("get address and name executed");
            console.log(
              `user ${displayName} with ID ${uid} has signed in.`,
              `home address: ${address}`
            );

            console.log(
              `typeof address: ${typeof address}, length of address: ${
                address.length
              }`
            );
            // request more info from the user if their name and address aren't on file.
            if (address.length > 0) {
              setHomeAddress([...address]);
              setRequestInfo(false);
              console.log("user has address, request info is false");
            } else {
              setRequestInfo(true);
              console.log("user without address, request info is true");
            }

            if (photos.length > 0) {
              setHomePhotos([...photos]);
              console.log("user has photos");
            } else {
              console.log("user doesn't have photos");
            }

            if (profileImg) {
              setProfilePhoto(profileImg);
              console.log("user has profile photo", profileImg);
            } else {
              console.log("user doesn't have a profile photo");
            }

            console.log(
              `isPendingVerification: ${data.isPendingVerification}`,
              `isAgent: ${data.isAgent}`
            );
            // if (name.firstName && name.lastName) {
            //   setUserName(name);
            // }
          })
          .catch((error) => {
            // Getting the Error details.
            const code = error.code;
            const message = error.message;
            const details = error.details;
            // ...
          });

        setInfoLoaded(true);
        // ...
      } else {
        setInfoLoaded(true);
        // User is signed out
        // ...
        setUid("");
        setDisplayName("");
        setUserEmail("");
        setPhotoURL("");
        setProviderId("");
      }
    });
  }, [authToggle]);

  // sign out:
  function handleSignOut() {
    getAuth()
      .signOut()
      .then(function () {
        setUid("");
        setDisplayName("");
        setUserEmail("");
        setPhotoURL("");
        setProviderId("");
        authToggle();
        window.location.reload();
        // Sign-out successful.
      })
      .catch(function (error) {
        // An error happened.
      });
  }

  useEffect(() => {
    if (requestInfo) {
      // redirect to request info page
    }
  }, [requestInfo]);

  useEffect(() => {
    if (homeAddress) {
      console.log("home address: ", homeAddress);
      // redirect to request info page
    }
  }, [homeAddress]);

  const [signInDisplayed, setSignInDisplayed] = useState(false);
  const [addressSaved, setAddressSaved] = useState(false);

  const [prevAddressBilling, setPrevAddressBilling] = useState([]);
  const [prevAddressShipping, setPrevAddressShipping] = useState([]);

  const [tempShipAddress, setTempShipAddress] = useState([]);
  const [tempBillAddress, setTempBillAddress] = useState([]);

  const [allowNotify, setAllowNotify] = useState(true);
  const [notifyUpdated, setNotifyUpdated] = useState(false);

  const [categorySearch, setCategorySearch] = useState("");

  const [addressHandled, setAddressHandled] = useState(true);

  const [searchString, setSearchString] = useState("");

  ////////////////////////////////////////////////
  // useEffect(() => {
  //   if (userInfo) {
  //     console.log(userInfo);
  //   }
  // }, [userInfo]);

  // useEffect(() => {
  //   if (authStage) {
  //     console.log(authStage);
  //   }
  // }, [authStage]);

  //// Account:
  // const [providerId, setProviderId] = useState("");
  // const [uid, setUid] = useState("");
  // const [displayName, setDisplayName] = useState("");
  // const [userEmail, setUserEmail] = useState("");
  // const [photoURL, setPhotoURL] = useState("");
  // const [anonUser, setAnonUser] = useState(true);

  const [receiptEmail, setReceiptEmail] = useState("");

  const [accountName, setAccountName] = useState("");

  const [twitterUser, setTwitterUser] = useState(false);

  const [staySignedIn, setStaySignedIn] = useState(true);

  const [totalCost, setTotalCost] = useState(0);

  const [taxAmount, setTaxAmount] = useState(0);
  // changes made to cart are saved to context, cost and count are changed at that time.

  // when remove from cart is clicked, subtract 1 from count and price from price

  // use proper english plurals for itemCount

  // ///////////////
  //////////////////
  const stripePromise = loadStripe(
    "pk_live_jEO9oUQ2IJ2pZ2NiOsloU4ag00KAuGAjPB"
  );
  ///////////////////////////

  //// Screen size hook:

  const isClient = typeof window === "object";

  function getSize() {
    return {
      width: isClient ? window.innerWidth : undefined,
      height: isClient ? window.innerHeight : undefined,
    };
  }

  const [windowSize, setWindowSize] = useState(getSize);

  function useWindowSize() {
    useEffect(() => {
      if (!isClient) {
        return false;
      }
      function handleResize() {
        setWindowSize(getSize());
      }

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []); // Empty array ensures that effect is only run on mount and unmount

    return windowSize;
  }

  // const screenSize = useWindowSize();

  const [isLargeScreen, setIsLargeScreen] = useState(true);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [canResize, setCanResize] = useState(true);

  const [homeLoaded, setHomeLoaded] = useState(0);

  useEffect(() => {
    if (canResize) {
      // 16:9 is the common aspect ratio
      let largeAspectRatio = Number(16 / 9);
      let smallAspectRatio = Number(10.16 / 16);
      if (Number(windowSize.width / windowSize.height) >= largeAspectRatio) {
        setIsLargeScreen(true);
        setIsSmallScreen(false);
      } else if (
        Number(windowSize.width / windowSize.height) <= smallAspectRatio
      ) {
        setIsLargeScreen(false);
        setIsSmallScreen(true);
      } else {
        setIsLargeScreen(false);
        setIsSmallScreen(false);
      }
    }
  }, [windowSize, homeLoaded]);

  const isPortrait = useMediaQuery({ query: "(orientation: portrait)" });
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-device-width: 1224px)",
  });
  const isBigScreen = useMediaQuery({ query: "(min-device-width: 1824px)" });

  useEffect(() => {
    // locOrientation = window.screen.lockOrientation || window.screen.mozLockOrientation || window.screen.msLockOrientation || window.screen.orientation.lock;

    if (isLargeScreen) {
      if (window.screen.lockOrientation) {
        window.screen.lockOrientation("landscape");
      } else if (window.screen.mozLockOrientation) {
        window.screen.mozLockOrientation("landscape");
      } else if (window.screen.msLockOrientation) {
        window.screen.msLockOrientation("landscape");
      } else if (window.screen.orientation.lock) {
        window.screen.orientation.lock("landscape");
      }
      // locOrientation("landscape")
    } else {
      // locOrientation("portrait")
      if (window.screen.lockOrientation) {
        window.screen.lockOrientation("portrait");
      } else if (window.screen.mozLockOrientation) {
        window.screen.mozLockOrientation("portrait");
      } else if (window.screen.msLockOrientation) {
        window.screen.msLockOrientation("portrait");
      } else if (window.screen.orientation.lock) {
        window.screen.orientation.lock("portrait");
      }
    }
  }, [isLargeScreen]);

  const [displayPayPal, setDisplayPayPal] = useState(false);
  const [payPalHeightArr, setPayPalHeightArr] = useState([]);

  const [stripeDisplayed, setStripeDisplayed] = useState(false);

  function displayStripe() {
    setStripeDisplayed(true);
  }

  const [previouslyViewed, setPreviouslyViewed] = useState([]);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [navString, setNavString] = useState("");
  const [leaveCheckoutModal, setLeaveCheckoutModal] = useState(false);

  const [toggleMenu, setToggleMenu] = useState(false);
  const [toggleString, setToggleString] = useState("none");
  // false here means not opened.

  function handleToggleMenu() {
    if (!toggleMenu) {
      setToggleMenu(true);
      setToggleString("initial");
    } else {
      setToggleMenu(false);
      setToggleString("none");
    }
  }
  ////////

  const [enterPaymentAllowed, setEnterPaymentAllowed] = useState(true);

  ///

  const [responsiveEmail, setResponsiveEmail] = useState("");

  useEffect(() => {
    window.mobileCheck = function () {
      let check = false;
      (function (a) {
        if (
          /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
            a
          ) ||
          /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
            a.substr(0, 4)
          )
        )
          check = true;
      })(navigator.userAgent || navigator.vendor || window.opera);
      if (check == true) {
        setIsLargeScreen(false);
      }
      return check;
    };
  }, []);

  const [onHomeScreen, setOnHomeScreen] = useState(false);

  const [onBrowse, setOnBrowse] = useState(false);

  const [onAccount, setOnAccount] = useState(false);

  const styleColors = {
    peachPuff: "#F9DBBD",
    lightPink: "#FFA5AB",
    blush: "#DA627D",
    maroon: "#A53860",
    sienna: "#450920",
    hotPink: "#f72585",
    altPink: "#ff5c8a",
    piggyPink: "#ffe0e9",
    red: "#d00000",
    impRed: `#e63946`,
    honeyDew: "#f1faee",
    powderBlue: "#a8dadc",
    celadonBlue: "#457b9d",
    prussianBlue: "#1d3557",
    yellow: "#ffd60a",
    aqua: "#00e09d",
    purple: "#8865FF",
  };
  ////

  const handleSidebar = () => {
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
        // if (isSafari) {
        //   window.scroll(0, 0); // to show the buttons on safari
        // }

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
  };

  const [showMenuHome, setShowMenuHome] = useState(false);
  const [showMenuShop, setShowMenuShop] = useState(false);
  const [showMenuAccount, setShowMenuAccount] = useState(false);

  // TREAT AS ENUM. 0 = not attempted, 1 = success, 2 = failure
  const [saveAddressState, setSaveAddressState] = useState(0);

  const [showLottieLoading, setShowLottieLoading] = useState(false);
  const [showLottieSuccess, setShowLottieSuccess] = useState(false);
  const [showLottieError, setShowLottieError] = useState(false);
  const [showModalCenter, setShowModalCenter] = useState(false);
  const [showModalEdge, setShowModalEdge] = useState(false);

  const [savePhotoError, setSavePhotoError] = useState(false);
  const [savePhotoSuccess, setSavePhotoSuccess] = useState(false);
  const [isSavePhoto, setIsSavePhoto] = useState(false);

  const [isReplacePhoto, setIsReplacePhoto] = useState(false);
  const [replacePhotoError, setReplacePhotoError] = useState(false);
  const [replacePhotoSuccess, setReplacePhotoSuccess] = useState(false);

  const hideLotties = () => {
    setShowLottieError(false);
    setShowLottieSuccess(false);
    setShowLottieLoading(false);
  };

  const handleReplacePhoto = () => {
    console.log("replace photo fired.");
    setShowModalCenter(true);
    setShowLottieLoading(true);
    if (profilePhotoName) {
      const photoStringArr = profilePhotoName.split(".");
      const type = photoStringArr[photoStringArr.length - 1];
      const filename = photoStringArr[photoStringArr.length - 2];
      let url = `profile-photos/${uid}/${filename}.${type}`;
      const storageRef = ref(storage, url);
      const metadata = {
        contentType: "image/jpeg",
      };

      // const file = new File([`${filename}`], `${path}`, {
      //   type: "image/jpeg",
      // });

      // 'file' comes from the Blob or File API
      const result = uploadBytes(storageRef, profilePhotoCache, metadata)
        .then((snapshot) => {
          console.log("Uploaded a blob or file!");
          console.log(snapshot);
          return getDownloadURL(snapshot.ref);
        })
        .then((downloadURL) => {
          console.log("File available at", downloadURL);
          const saveProfilePhoto = httpsCallable(functions, "saveProfilePhoto");
          return saveProfilePhoto({ profilePhoto: url });
        })
        .then((result) => {
          let data = result.data;
          if (data.success) {
            setIsReplacePhoto(false);
            setReplacePhotoError(false);
            setReplacePhotoSuccess(true);
            setShowLottieSuccess(true);
            setShowLottieLoading(false);
            setProfilePhoto(url);
          } else {
            console.log("server reported data save failure: ", data.success);
            setShowLottieLoading(false);
            setShowLottieError(true);
            setReplacePhotoError(true);
            setReplacePhotoSuccess(false);
          }
        })
        .catch((error) => {
          setIsReplacePhoto(false);
          console.log("unable to call function", error);
          setShowLottieLoading(false);
          setShowLottieError(true);
          setReplacePhotoError(true);
          setReplacePhotoSuccess(false);
        });

      console.log("url: ", url);
      console.log("result: ", result);
    }
  };

  const savePhotoAndAddress = () => {
    setIsSavePhoto(true);
    setSavePhotoError(false);
    console.log("save photo address fired");
    setShowModalCenter(true);
    setShowLottieLoading(true);
    if (profilePhotoName) {
      const photoStringArr = profilePhotoName.split(".");
      const type = photoStringArr[photoStringArr.length - 1];
      const filename = photoStringArr[photoStringArr.length - 2];
      let url = `profile-photos/${uid}/${filename}.${type}`;
      const storageRef = ref(storage, url);
      const metadata = {
        contentType: "image/jpeg",
      };

      // const file = new File([`${filename}`], `${path}`, {
      //   type: "image/jpeg",
      // });

      // 'file' comes from the Blob or File API
      const result = uploadBytes(storageRef, profilePhotoCache, metadata)
        .then((snapshot) => {
          console.log("Uploaded a blob or file!");
          console.log(snapshot);
          return getDownloadURL(snapshot.ref);
        })
        .then((downloadURL) => {
          console.log("File available at", downloadURL);
          const saveProfilePhoto = httpsCallable(functions, "saveProfilePhoto");
          return saveProfilePhoto({ profilePhoto: url });
        })
        .then((result) => {
          setIsSavePhoto(false);
          let data = result.data;
          if (data.success) {
            setSavePhotoError(false);
            setSavePhotoSuccess(true);

            // setShowLottieLoading(false);
            // setShowLottieSuccess(true);
            saveAddress();
          } else {
            console.log("server reported data save failure: ", data.success);
            setShowLottieLoading(false);
            setShowLottieError(true);
            setSavePhotoError(true);
            setSavePhotoSuccess(false);
          }
        })
        .catch((error) => {
          setIsSavePhoto(false);
          console.log("unable to call function", error);
          setShowLottieLoading(false);
          setShowLottieError(true);
          setSavePhotoError(true);
          setSavePhotoSuccess(false);
        });

      console.log("url: ", url);
      console.log("result: ", result);
    } else {
      setIsSavePhoto(false);
    }
  };

  const saveAddress = () => {
    console.log("save address fired");
    setShowModalCenter(true);
    setIsSaveAddressModal(true);
    setShowLottieLoading(true);
    const addressDiv = document.getElementById(`address1`);
    if (addressDiv) {
      let addressInfo = [
        document.getElementById(`firstName`).value,
        document.getElementById(`lastName`).value,
        document.getElementById(`address1`).value,
        document.getElementById(`address2`)
          ? document.getElementById(`address2`).value
          : "none",
        document.getElementById(`city`).value,
        document.getElementById(`state`).value,
        document.getElementById(`zipCode`).value,
        document.getElementById(`country`).value,
        document.getElementById(`phone`).value,
        document.getElementById("emailInputText").value,
      ];

      const saveAddressAndName = httpsCallable(functions, "saveAddressAndName");
      saveAddressAndName({ address: addressInfo })
        .then((result) => {
          // Read result of the Cloud Function.
          /** @type {any} */
          const data = result.data;

          setShowLottieLoading(false);

          if (data.success) {
            setShowLottieSuccess(true);
            setSaveAddressState(1);
            setHomeAddress([...addressInfo]);
            setUserName({
              firstName: addressInfo[0],
              lastName: addressInfo[1],
            });
            setRequestInfo(false);
          } else {
            setShowLottieError(true);
            setSaveAddressState(2);
          }
        })
        .catch((error) => {
          // Getting the Error details.
          const code = error.code;
          const message = error.message;
          const details = error.details;
          console.log("save address error: ", code, message, details);

          // ...
        });
    }
  };

  const [modalTextCenter, setModalTextCenter] = useState("");

  const [signOutDisplay, setSignOutDisplay] = useState(false);

  const [isSaveAddressModal, setIsSaveAddressModal] = useState(false);
  const [isSaveHomePhotos, setIsSaveHomePhotos] = useState(false);

  const [modalText, setModalText] = useState("");

  const deletePhoto = () => {
    setShowLottieLoading(true);

    const newArr = [...homePhotos];
    newArr.splice(homePhotos.indexOf(willDelete), 1);
    const saveHomePhotos = httpsCallable(functions, "saveHomePhotos");
    saveHomePhotos({ homePhotos: [...newArr] })
      .then((result) => {
        // Read result of the Cloud Function.
        /** @type {any} */
        const data = result.data;
        console.log("received save home photos result", data);
        const success = data.success;
        const photos = [...data.homePhotos];

        if (success) {
          console.log(`user ${displayName} with ID ${uid} has delete photos`);

          setShowLottieLoading(false);
          setShowLottieSuccess(true);
          setFiles([]);
          setFilenames([]);
          setHomePhotos(newArr);
        } else
          throw new Error("ERROR: Couldn't save download URLs to user file.");
      })
      .catch((error) => {
        // Getting the Error details.
        setShowLottieLoading(false);
        setShowLottieError(true);
        const code = error.code;
        const message = error.message;

        const details = error.details;
        console.log(message); // ...
      });
    setWillDelete("");
  };

  const [willDelete, setWillDelete] = useState("");

  const [profilePhoto, setProfilePhoto] = useState("");
  const [profilePhotoName, setProfilePhotoName] = useState("");
  const [profilePhotoCache, setProfilePhotoCache] = useState({});

  const [searchList, setSearchList] = useState([]);

  useEffect(() => {
    console.log("search list: ", searchList);
  }, [searchList]);

  const handleSearchDomestics = (origin, skills, payRange, distLimit) => {
    setShowModalCenter(true);
    setShowLottieLoading(true);
    setIsSearchModal(true);
    console.log("begin search...");
    const searchDomestics = httpsCallable(functions, "searchDomestics");
    searchDomestics({ origin, skills, payRange, distLimit })
      .then((result) => {
        // Read result of the Cloud Function.
        /** @type {any} */
        const data = result.data;

        setShowLottieLoading(false);

        if (data && data.success) {
          console.log("agent list retrieved!");
          console.log(data);
          console.log(data.agentList);
          // if (data.unfiltered) {
          //   console.log("unfiltered: ", data.unfiltered);
          // }
          setSearchList(data.agentList);
          setShowModalCenter(false);
          setShowLottieLoading(false);
          setIsSearchModal(false);
          // setShowLottieSuccess(true);
          // setSaveAddressState(1);
          // setHomeAddress([...addressInfo]);
          // setUserName({
          //   firstName: addressInfo[0],
          //   lastName: addressInfo[1],
          // });
          // setRequestInfo(false);
        } else {
          console.log("unable to retrieve agent list");
          setShowLottieLoading(false);
          setShowLottieError(true);
          // setShowLottieError(true);
          // setSaveAddressState(2);
        }
      })
      .catch((error) => {
        // Getting the Error details.
        const code = error.code;
        const message = error.message;
        const details = error.details;
        console.log("search domestics error: ", message);

        setShowLottieLoading(false);
        setShowLottieError(true);

        // ...
      });
  };

  const [agentDoc, setAgentDoc] = useState({}); // THIS is the document of the agent as viewed by a user

  const [isSearchModal, setIsSearchModal] = useState(false);

  const [isCheckAvailability, setIsCheckAvailability] = useState(false);

  const retrieveAgentDoc = (agentId) => {
    const retrieveAgent = httpsCallable(functions, "retrieveAgent");
    retrieveAgent({ agentId })
      .then((result) => {
        // Read result of the Cloud Function.
        /** @type {any} */
        const data = result.data;
        console.log("received agent doc result", data);
        const success = data.success;

        if (success) {
          console.log(`retrieved agent`);
          setAgentDoc(data.agentDoc);
        } else throw new Error("ERROR: Couldn't retrieve agent doc");
      })
      .catch((error) => {
        // Getting the Error details.
        // setShowLottieLoading(false);
        // setShowLottieError(true);
        const code = error.code;
        const message = error.message;

        const details = error.details;
        console.log(message); // ...
        // setAgentDoc({});
      });
  };

  const [timeFrame, setTimeFrame] = useState({});
  const [isBookingPayment, setIsBookingPayment] = useState(false);

  const [priceObj, setPriceObj] = useState({});

  const [photosRequired, setPhotosRequired] = useState(false);

  const bookAgent = (timeframe) => {
    if (homePhotos.length <= 0) {
      setShowModalCenter(true);
      setPhotosRequired(true);
      return;
    }

    let now = Date.now();

    if (timeframe == "today") {
      setTimeFrame(now);
    } else if (timeframe == "tomorrow") {
      const dayToMilli = 86400000;
      let tomorrow = now + dayToMilli;
      setTimeFrame(tomorrow);
    } else if (typeof timeframe == "number") {
      // the functions has received millisecond input from the weekly avaibility modal
      setTimeFrame(timeframe);
    } else {
      throw new Error(
        "Incorrect timeframe format. Timeframe can either be today, tomorrow, or a millisecond value."
      );
    }
    setShowModalCenter(true);
    setIsBookingPayment(true);
  };

  const [payMethod, setPayMethod] = useState([]);

  const getPayMethod = () => {
    const getPayMethod = httpsCallable(functions, "getPayMethod");
    getPayMethod({}).then((result) => {
      console.log(result);
      console.log(result.data);
      let newArr = [];
      let paymentMethod = result.data.payMethod.values;
      paymentMethod.forEach((item) => {
        newArr.push(item.stringValue);
      });
      console.log(newArr);
      console.log(`paymentMethod: ${paymentMethod}, newArr: ${newArr}`);
      setPayMethod(newArr);
    });
  };

  const [note, setNote] = useState("");

  const [ticketRating, setTicketRating] = useState(1);
  const moveToHistory = httpsCallable(functions, "moveToHistory");
  //   moves the ticket to history and informs all parties that the ticket is cancelled, leaves a note that says "cancelled" on the ticket.
  const cancelTicket = async () => {
    let ticket = selectedTicket.ticket;
    console.log("ticket: ", ticket);
    ticket.clientNote = "cancelled";
    ticket.cancellationReason = note;

    await moveToHistory({ ticket })
      .then((result) => {
        console.log(result);
        // remove the ticket from the schedule
        console.log("userSchedule: ", userSchedule);
        console.log("ticket.ticketId: ", ticket.ticketId);
        let newSchedule = userSchedule.filter(
          (item) => item.ticketId !== ticket.ticketId
        );

        console.log("newSchedule: ", newSchedule);

        console.log("agentList: ", agentList);
        let newList = agentList.filter(
          (item) => item.ticket.ticketId !== ticket.ticketId
        );
        console.log("newList ", newList);
        setAgentList(newList);

        setUserSchedule(newSchedule);

        console.log(result.data);
      })
      .catch((error) => console.log(error));
  };

  // moves the ticket to history and leaves a custom note (only works if it past time but hasn't been a week)
  const reviewTicket = async () => {
    let ticket = selectedTicket.ticket;
    console.log("ticket: ", ticket);
    ticket.clientNote = note;
    ticket.rating = ticketRating;
    await moveToHistory({ ticket })
      .then((result) => {
        // remove the ticket from the schedule
        console.log("ticket.ticketId: ", ticket.ticketId);
        console.log("userSchedule: ", userSchedule);
        //

        let newSchedule = userSchedule.filter(
          (item) => item.ticketId !== ticket.ticketId
        );

        console.log("newSchedule: ", newSchedule);

        console.log("agentList: ", agentList);
        let newList = agentList.filter(
          (item) => item.ticket.ticketId !== ticket.ticketId
        );
        console.log("newList ", newList);
        setAgentList(newList);

        setUserSchedule(newSchedule);
        console.log(result.data);
      })
      .catch((error) => console.log(error));
  };

  // moves the ticket to history (only works if it is past time but has not been a week - otherwise it would be deleted automatically)
  const deleteTicket = async () => {
    let ticket = selectedTicket.ticket;
    console.log("ticket: ", ticket);
    await moveToHistory({ ticket })
      .then((result) => {
        // remove the ticket from the schedule
        console.log("ticket.ticketId: ", ticket.ticketId);
        console.log("userSchedule: ", userSchedule);
        let newSchedule = userSchedule.filter(
          (item) => item.ticketId !== ticket.ticketId
        );
        console.log("newSchedule: ", newSchedule);

        setUserSchedule(newSchedule);

        console.log("agentList: ", agentList);
        let newList = agentList.filter(
          (item) => item.ticket.ticketId !== ticket.ticketId
        );
        console.log("newList ", newList);
        setAgentList(newList);

        console.log(result.data);
      })
      .catch((error) => console.log(error));
  };

  const [selectedTicket, setSelectedTicket] = useState(null);

  const [isUpdateTicket, setIsUpdateTicket] = useState(false);

  const [isComplete, setIsComplete] = useState(false);

  const [agentTicketPhotos, setAgentTicketPhotos] = useState([]);

  const [agentTicketPhotoCache, setAgentTicketPhotoCache] = useState(null);
  const [agentTicketPhotoName, setAgentTicketPhotoName] = useState(null);

  const [agentHistory, setAgentHistory] = useState([]);

  const [userHistory, setUserHistory] = useState([]);

  const [recentlyViewed, setRecentlyViewed] = useState([]);

  const agentUpdate = async (ticket, complete, paid) => {
    console.log("ticket: ", ticket, "paid: ", paid, "complete: ", complete);
    let url = ``;

    ticket.status = complete ? "complete" : "unable";

    if (complete) {
      ticket.status = "complete";

      let fileNameFull = agentTicketPhotoName;
      let file = agentTicketPhotoCache;

      const photoStringArr = fileNameFull.split(".");
      const type = photoStringArr[photoStringArr.length - 1];
      const filename = photoStringArr[photoStringArr.length - 2];
      url = `completed-photos/${uid}/${filename}.${type}`;
      const storageRef = ref(storage, url);

      const metadata = {
        contentType: "image/jpeg",
      };
      // 'file' comes from the Blob or File API
      const result = await uploadBytes(storageRef, file, metadata)
        .then((snapshot) => {
          console.log("Uploaded a blob or file!");
          console.log(snapshot);
          return getDownloadURL(snapshot.ref);
        })
        .then((downloadURL) => {
          console.log("File available at", downloadURL);
          return downloadURL;
        })
        .catch((error) => {
          setShowLottieLoading(false);
          setShowLottieError(true);
          console.log(error);
          return "";
        });

      ticket.paidInFull = paid;
      ticket.agentPhotos = [url];

      console.log("ticket: ", ticket);

      const agentUpdateComplete = httpsCallable(
        functions,
        "agentUpdateComplete"
      );
      await agentUpdateComplete({ ticket })
        .then((result) => {
          let data = result.data;
          console.log(data);
          return result;
        })
        .catch((error) => {
          console.log(error);
        });

      let schedule = agentObj.schedule.filter(
        (item) => item.ticket.ticketId !== ticket.ticketId
      );

      let temp = agentObj;
      temp.schedule = [...schedule, ticket];

      setAgentObj(temp);
    } else {
      ticket.status = "unable";
      ticket.incompleteReason = note;

      const agentUpdateComplete = httpsCallable(
        functions,
        "agentUpdateComplete"
      );
      await agentUpdateComplete({ ticket })
        .then((result) => {
          let data = result.data;
          console.log(data);
          return result;
        })
        .catch((error) => {
          console.log(error);
        });

      let schedule = agentObj.schedule.filter(
        (item) => item.ticket.ticketId !== ticket.ticketId
      );

      let temp = agentObj;
      temp.schedule = [...schedule, ticket];

      setAgentObj(temp);
    }

    setAgentTicketPhotoCache(null);
    setAgentTicketPhotoName("");
  };

  const [selectedHistory, setSelectedHistory] = useState({});

  const [isEditClientReview, setIsEditClientReview] = useState(false);
  const editClientReview = async (ticket) => {
    setIsEditClientReview(true);
    setIsEditAgentReview(false);
    setSelectedHistory(ticket);
    setShowModalCenter(true);
    setReviewSuccess(false);
  };

  const [isEditAgentReview, setIsEditAgentReview] = useState(false);
  const editAgentReview = async (ticket) => {
    setIsEditAgentReview(true);
    setIsEditClientReview(false);
    setSelectedHistory(ticket);
    setShowModalCenter(true);
    setReviewSuccess(false);
  };

  const [isDeleteTicket, setIsDeleteTicket] = useState(false);
  const [isCancelTicket, setIsCancelTicket] = useState(false);
  const [isReviewTicket, setIsReviewTicket] = useState(false);

  const [agentList, setAgentList] = useState([]);

  const [historyAgents, setHistoryAgents] = useState([]);
  const [historyUsers, setHistoryUsers] = useState([]);

  const [review, setReview] = useState("");
  const [localRating, setLocalRating] = useState(5);

  const handleEditRating = () => {};

  const handleEditReview = () => {};

  const handleEditClientRating = () => {};

  const handleEditAgentRating = () => {};

  const handleEditAgentReview = async () => {
    const agentReview = httpsCallable(functions, "agentReview");

    await agentReview({ history: selectedHistory, review, rating: localRating })
      .then((result) => {
        let data = result.data;
        console.log(data);
        setReviewSuccess(true);
        setShowLottieSuccess(true);
        setShowLottieLoading(false);
        setIsEditClientReview(false);
        setIsEditAgentReview(false);
      })
      .catch((error) => {
        setShowLottieError(true);
        setShowLottieLoading(false);
        setIsEditClientReview(false);
        setIsEditAgentReview(false);
      });
  };

  const handleEditClientReview = async () => {
    setShowLottieLoading(true);
    const clientReview = httpsCallable(functions, "clientReview");

    await clientReview({
      history: selectedHistory,
      review,
      rating: localRating,
    })
      .then((result) => {
        let data = result.data;
        console.log(data);
        setReviewSuccess(true);
        setShowLottieSuccess(true);
        setShowLottieLoading(false);
        setIsEditClientReview(false);
        setIsEditAgentReview(false);
      })
      .catch((error) => {
        setShowLottieError(true);
        setShowLottieLoading(false);
        setIsEditClientReview(false);
        setIsEditAgentReview(false);
      });
  };

  const [reviewSuccess, setReviewSuccess] = useState(false);

  const [infoLoaded, setInfoLoaded] = useState(false);

  return (
    <Context.Provider
      value={{
        infoLoaded,
        reviewSuccess,
        setReviewSuccess,

        isEditAgentReview,
        isEditClientReview,

        selectedHistory,
        setSelectedHistory,

        handleEditAgentRating,
        handleEditAgentReview,
        review,
        setReview,
        localRating,
        setLocalRating,

        handleEditClientRating,
        handleEditClientReview,
        handleEditRating,
        handleEditReview,

        historyAgents,
        setHistoryAgents,
        historyUsers,
        setHistoryUsers,
        agentList,
        setAgentList,

        isDeleteTicket,
        setIsDeleteTicket,
        isCancelTicket,
        setIsCancelTicket,
        isReviewTicket,
        setIsReviewTicket,
        isEditClientReview,
        setIsEditClientReview,
        isEditAgentReview,
        setIsEditAgentReview,
        editAgentReview,

        editClientReview,

        agentHistory,
        setAgentHistory,
        userHistory,
        setUserHistory,
        recentlyViewed,
        setRecentlyViewed,
        setAgentTicketPhotoCache,
        setAgentTicketPhotoName,
        agentTicketPhotoCache,
        agentTicketPhotoName,
        agentTicketPhotos,
        setAgentTicketPhotos,
        agentUpdate,

        isUpdateTicket,
        setIsUpdateTicket,
        isComplete,
        setIsComplete,
        selectedTicket,
        setSelectedTicket,
        note,
        setNote,
        ticketRating,
        setTicketRating,
        cancelTicket,
        reviewTicket,
        deleteTicket,
        userSchedule,
        setUserSchedule,

        photosRequired,
        setPhotosRequired,

        uid,
        getPayMethod,
        payMethod,
        setPayMethod,
        timeFrame,

        isCheckAvailability,
        setIsCheckAvailability,
        isBookingPayment,
        setIsBookingPayment,
        timeFrame,
        bookAgent,
        retrieveAgentDoc,

        isSearchModal,
        setIsSearchModal,

        searchList,
        agentDoc,
        setAgentDoc,
        handleSearchDomestics,

        userBookings,

        agentPhotos,
        setAgentPhotos,

        agentObj,

        requestRejected,
        setRequestRejected,

        showModalAgentAuth,
        setShowModalAgentAuth,

        isAgent,
        isOnAgentSite,
        setIsOnAgentSite,

        profilePhotoCache,
        setProfilePhotoCache,

        profilePhotoName,
        setProfilePhotoName,

        isSaveHomePhotos,
        setIsSaveHomePhotos,

        isSavePhoto,
        setIsSavePhoto,

        savePhotoAndAddress,

        savePhotoError,
        savePhotoSuccess,
        setSavePhotoError,

        profilePhoto,
        setProfilePhoto,

        modalText,
        setModalText,
        isSaveAddressModal,
        setIsSaveAddressModal,

        savePhotos,
        handleAddPhotos,

        handleAddAgentPhotos,

        homePhotos,
        setHomePhotos,

        signOutDisplay,
        setSignOutDisplay,

        isDesktopOrLaptop,

        toggleAuth,
        requestInfo,
        handleSignOut,

        hideLotties,
        showLottieLoading,
        showLottieSuccess,
        showLottieError,
        setShowLottieLoading,
        setShowLottieSuccess,
        setShowLottieError,

        showModalPhotosMenu,
        setShowModalPhotosMenu,

        showModalAgentPhotosMenu,
        setShowModalAgentPhotosMenu,

        modalTextCenter,
        showModalCenter,
        setShowModalCenter,
        showModalEdge,
        setShowModalEdge,

        saveAddressState,
        saveAddress,

        showMenuHome,
        setShowMenuHome,
        showMenuShop,
        setShowMenuShop,
        showMenuAccount,
        setShowMenuAccount,

        uid,
        displayName,
        userEmail,
        photoURL,
        providerId,

        userName,
        homeAddress,

        addressSaved,

        setAddressSaved,

        totalCost,

        taxAmount,
        setTaxAmount,

        receiptEmail,
        setReceiptEmail,

        prevAddressBilling,
        prevAddressShipping,
        accountName,
        allowNotify,
        setAllowNotify,
        notifyUpdated,
        setNotifyUpdated,

        categorySearch,
        setCategorySearch,
        setStaySignedIn,
        staySignedIn,

        addressHandled,

        tempShipAddress,
        setTempShipAddress,

        tempBillAddress,
        setTempBillAddress,

        stripePromise,

        isLargeScreen,
        isSmallScreen,

        displayPayPal,
        payPalHeightArr,

        setDisplayPayPal,
        setPayPalHeightArr,

        searchString,
        setSearchString,

        stripeDisplayed,
        setStripeDisplayed,
        displayStripe,

        previouslyViewed,
        setPreviouslyViewed,

        sidebarOpen,
        setSidebarOpen,

        toggleMenu,
        setToggleMenu,
        toggleString,
        setToggleString,
        handleToggleMenu,

        enterPaymentAllowed,
        setEnterPaymentAllowed,

        responsiveEmail,
        setResponsiveEmail,

        homeLoaded,
        setHomeLoaded,
        canResize,
        setCanResize,

        isPortrait,
        // isDesktopOrLaptop,
        isBigScreen,
        setIsLargeScreen,
        setIsSmallScreen,
        onHomeScreen,
        setOnHomeScreen,

        styleColors,

        onBrowse,
        setOnBrowse,
        onAccount,
        setOnAccount,

        handleSidebar,

        files,
        setFiles,

        filenames,
        setFilenames,

        deletePhoto,

        showModalDeletePhotoMenu,
        setShowModalDeletePhotoMenu,

        handleDeletePhoto,

        willDelete,
        setWillDelete,

        handleReplacePhoto,

        setIsReplacePhoto,
        isReplacePhoto,
        replacePhotoError,
        replacePhotoSuccess,
        setReplacePhotoError,
        setReplacePhotoSuccess,

        isPendingVerification,
        showRejected,
        setShowRejected,

        saveAgentPhotos,
        isSaveAgentPhotos,
        setIsSaveAgentPhotos,
        userRating,
        agentRating,

        functions,
        storage,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export { ContextProvider, Context };
