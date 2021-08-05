import React, { useState, useEffect } from "react";
// import Images from "./images";
// import firebase from "firebase";
// import { jQuery } from "jquery";
import { loadStripe } from "@stripe/stripe-js";
import windowSize from "react-window-size";
import { useMediaQuery } from "react-responsive";

const Context = React.createContext({});

function ContextProvider({ children }) {
  ///// User Context:

  const [userInfo, setUserInfo] = useState({});
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
  useEffect(() => {
    console.log(userInfo);
  }, [userInfo]);

  //// Account:
  const [providerId, setProviderId] = useState("");
  const [uid, setUid] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [anonUser, setAnonUser] = useState(true);

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

  const screenSize = useWindowSize();

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
  return (
    <Context.Provider
      value={{
        userInfo,

        setUserInfo,

        addressSaved,

        setAddressSaved,

        totalCost,

        providerId,
        uid,
        displayName,
        userEmail,
        photoURL,
        anonUser,
        setAnonUser,

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
      }}
    >
      {children}
    </Context.Provider>
  );
}

export { ContextProvider, Context };
