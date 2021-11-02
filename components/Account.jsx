import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  FacebookAuthProvider,
} from "firebase/auth";
// import firebase from "firebase";
// import firebaseui from "firebaseui";
import { Context } from "../Context";
import SignInWithEmail from "./SignInWithEmail";
import RecentlyViewed from "./RecentlyViewed";
import AddressForm from "./AddressForm";
import Locator from "./Locator";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import Lottie from "react-lottie-player";
import loadingData from "../8682-loading.json";
// import { saveHomePhotos } from "../../functions";
// import { updateStaySignedIn } from "../functions"

function Account() {
  const {
    toggleAuth,
    displayName,
    setDisplayName,
    userEmail,
    setUserEmail,
    providerId,
    setProviderId,
    photoURL,
    setPhotoURL,
    setUid,

    handleSignOut,

    accountTitleString,
    storeCredit,

    termsDisplay,
    allowNotify,
    notifyUpdated,
    setNotifyUpdated,
    updatesChoice,
    setUpdatesChoice,
    setStaySignedIn,
    staySignedIn,
    itemList,
    isLargeScreen,
    setOnProductPage,
    isPortrait,
    isSmallScreen,
    setOnHomeScreen,
    uid,
    homeAddress,
    requestInfo,
    userName,

    setShowModalCenter,
    signOutDisplay,
    setSignOutDisplay,

    setShowModalPhotosMenu,
    showModalPhotosMenu,

    homePhotos,
    setHomePhotos,

    handleAddPhotos,

    deletePhoto,
    handleDeletePhoto,
    willDelete,
    setWillDelete,

    profilePhoto,
    setProfilePhoto,

    handleReplacePhoto,

    setIsReplacePhoto,

    userRating,

    userHistory,

    isAgent,

    infoLoaded,
    isDesktopOrLaptop,
    isBigScreen,
  } = useContext(Context);

  // useEffect(() => {
  // setOnCheckout(false);
  // setUseExpressMode(false);
  // setOnProductPage(false);
  // setOnHomeScreen(false);
  // }, []);

  const [showAddress, setShowAddress] = useState(false);

  const storage = getStorage();

  function toggleStaySignedIn() {
    let staySignedBool = document.getElementById("keepMeSignedIn").checked;
    console.log(staySignedBool);

    if (staySignedIn == true) {
      setStaySignedIn(false);
      updateSignedIn(false);
    } else {
      setStaySignedIn(true);
      updateSignedIn(true);
    }

    if (staySignedBool == true) {
      document.getElementById("keepMeSignedIn").checked = false;
      document.getElementById("keepMeSignedIn").setAttribute("checked", "true");
    } else {
      document.getElementById("keepMeSignedIn").checked = false;
      document
        .getElementById("keepMeSignedIn")
        .setAttribute("checked", "false");
    }
  }

  const [userSignedIn, setUserSignedIn] = useState(false);
  const [haveEmail, setHaveEmail] = useState(false);

  function toggleUpdatesBool() {
    let update = document.getElementById("keepMeUpdated2").checked;

    if (update == true) {
      // document.getElementById("keepMeUpdated2").checked = false;
      // document
      //   .getElementById("keepMeUpdated2")
      //   .setAttribute("checked", "false");
      // let bool = true;
      // firebase.functions().httpsCallable("allowNotifications")({ bool });
    } else {
      // document.getElementById("keepMeUpdated2").checked = true;
      // document.getElementById("keepMeUpdated2").setAttribute("checked", "true");
      // let bool = false;
      // firebase.functions().httpsCallable("allowNotifications")({ bool });
    }

    if (updatesBool == false) {
      setUpdatesBool(true);
    } else {
      setUpdatesBool(false);
    }
  }

  // useEffect(() => {
  //   setRouterString("account");
  // }, []);

  // useEffect(() => {
  //   if (userEmail) {
  //     setTermsDisplay(false);

  //     document.getElementById("firebaseui-auth-container").style.display =
  //       "none";

  //     setUserSignedInCount(Number(userSignedInCount + 1));
  //     setUserSignedIn(true);
  //     setAnonUser(false);
  //     // document.getElementById('smallSearch').style.display = "none"
  //     // document.getElementById('largeSearch').style.display = "none"
  //   }
  // }, []);

  // useEffect(() => {
  //   if (!userEmail) {
  //     document.getElementById("firebaseui-auth-container").style.display =
  //       "initial";
  //     // setTermsDisplay(true);
  //   } else if (userEmail) {
  //     document.getElementById("firebaseui-auth-container").style.display =
  //       "none";
  //     // setTermsDisplay(false);
  //   }

  // let user = firebase.auth().currentUser;

  // if (user) {
  //   let email = firebase.auth().currentUser.email;
  //   if (email) {
  //     setHaveEmail(true);
  //   }
  // }
  // }, [userEmail]);

  // useEffect(() => {
  //   if (!userEmail) {
  //     // setTermsDisplay(true);
  //     document.getElementById("firebaseui-auth-container").style.display =
  //       "initial";
  //   }
  // }, [anonUser, userInfo]);

  // function toggleWishList() {
  //   // !wishListDisplayed
  //   //   ? setWishlistString("Hide Favorites")
  //   //   : setWishlistString("Favorites");
  //   // wishlist, even when set, will give the previous value if called within the same function
  //   setWishlistDisplayed(!wishListDisplayed);
  // }

  function handleReload() {
    window.location.reload();
  }

  const [updatesBool, setUpdatesBool] = useState(true);

  useEffect(() => {
    setUpdatesBool(updatesChoice);
  }, []);

  const [deleteModal, setDeleteModal] = useState(false);

  function handleDeleteAccount() {
    // firebase.functions().httpsCallable('saveDeletedUser')()

    // let user = firebase.auth().currentUser;

    // user
    //   .delete()
    //   .then(function () {
    //     // User deleted.
    //   })
    //   .catch(function (error) {
    //     // An error happened.
    //   });

    handleSignOut();
  }

  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    if (!notifyUpdated) {
      setUpdatesBool(allowNotify);
      setNotifyUpdated(true);
      setUpdatesBool(updatesChoice);
    } else {
      setUpdatesBool(updatesChoice);
    }
  }, []);

  function setDefaults() {
    // let dark = document.getElementById("dMode")
    let sign = document.getElementById("keepMeSignedIn");
    let up = document.getElementById("keepMeUpdated2");

    // if (darkMode) {
    //     dark.checked = true
    //     dark.setAttribute("checked", "true")
    // } else {
    //     dark.checked = false
    //     dark.setAttribute("checked", "false")
    // }

    if (staySignedIn) {
      sign.checked = true;
      sign.setAttribute("checked", "true");
    } else {
      sign.checked = false;
      sign.setAttribute("checked", "false");
    }

    if (allowNotify) {
      up.checked = true;
      up.setAttribute("checked", "true");
    } else {
      up.checked = false;
      up.setAttribute("checked", "false");
    }

    // console.log(dark)
    console.log(sign);
    console.log(up);
  }

  function updateSignedIn(bool) {
    // firebase.functions().httpsCallable("updateStaySignedIn")({ bool });
  }

  const googleProvider = new GoogleAuthProvider();
  const signInWithGoogle = () => {
    const auth = getAuth();
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;

        setDisplayName(user.displayName);
        setProviderId(user.providerId);
        setUserEmail(user.email);
        setUid(user.uid);
        setPhotoURL(user.photoURL);
        toggleAuth();
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  };

  const facebookProvider = new FacebookAuthProvider();
  const signInWithFacebook = () => {
    const auth = getAuth();
    signInWithPopup(auth, facebookProvider)
      .then((result) => {
        // The signed-in user info.
        const user = result.user;

        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        const credential = FacebookAuthProvider.credentialFromResult(result);
        const accessToken = credential.accessToken;

        setDisplayName(user.displayName);
        setProviderId(user.providerId);
        setUserEmail(user.email);
        setUid(user.uid);
        setPhotoURL(user.photoURL);
        console.log("facebook login success", user, displayName);
        toggleAuth();
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("facebook login error", errorMessage);
        // The email of the user's account used.
        const email = error.email;
        // The AuthCredential type that was used.
        const credential = FacebookAuthProvider.credentialFromError(error);

        // ...
      });
  };

  const [pageNum, setPageNum] = useState(0);

  const handlePageNum = (operation) => {
    if (operation == "next" && homePhotos.length <= (pageNum + 1) * 5) {
      pageNum++;
    } else if (operation == "previous" && pageNum > 0) {
      pageNum--;
    } else if (
      typeof operation == "number" &&
      operation > 0 &&
      homePhotos.length <= (operation + 1) * 5
    ) {
      setPageNum(operation);
    }
  };

  const numArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const [showUserRating, setShowUserRating] = useState(false);

  useEffect(() => {
    if (document.getElementById("profile-photo")) {
      if (profilePhoto) {
        getDownloadURL(ref(storage, profilePhoto))
          .then((downloadURL) => {
            document
              .getElementById("profile-photo")
              .setAttribute("src", downloadURL);
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        document.getElementById("profile-photo").setAttribute("src", photoURL);
      }
    }
  }, [profilePhoto]);

  if (requestInfo) {
    return (
      <div>
        <h2>Please provide more information</h2>
        <AddressForm submit={true} photo={true} editName={true} />
      </div>
    );
  } else if (!infoLoaded || !uid) {
    return (
      <div
        style={{
          position: "relative",
          margin: "0 auto",
          marginTop: "20px",
          display: "flex",
          justifyContent: "column",
        }}
      >
        {" "}
        <Lottie
          className="lottie"
          loop
          animationData={loadingData}
          play
          style={{ width: 150, height: 150 }}
        />
      </div>
    );
  } else if (uid && homeAddress) {
    return (
      <div>
        <div
          className="shadowed rounded"
          style={{
            padding: "2em",
            maxWidth: "92%",
            "margin-left": "4vw",
            height: `${isLargeScreen ? "auto" : "90em"}`,
          }}
        >
          <h2 style={{ fontFamily: "luminari" }}>{accountTitleString}</h2>
          <div
            className="centered"
            style={{
              display: "flex",
              flexDirection: `${isLargeScreen ? "row" : "column"}`,
              left: "8vw",
              boxSize: "border-box",
            }}
          >
            <div
              className="google"
              style={{
                flexDirection: "column",
                maxWidth: `${isLargeScreen ? "33%" : "100%"}`,
                padding: "5vw",
                "box-shadow": "0px 0px 5px white",
                // backgroundColor: "lightgray",
                width: `${isLargeScreen ? "33%" : "99%"}`,
              }}
            >
              <div>
                <h4>You are signed in as:</h4>
                <div
                  className="userAccount"
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  <div style={{ float: "left", flexDirection: "column" }}>
                    <h2 className="userInfo">{displayName}</h2>
                    <h2 className="userInfo">{userEmail}</h2>
                    <div style={{ flexDirection: "column" }}>
                      {isAgent && (
                        <Link to="/agent-console">
                          <button type="button">
                            Go to your Agent Console
                          </button>
                        </Link>
                      )}
                      <button
                        type="button"
                        onClick={() => setShowUserRating(!showUserRating)}
                      >
                        {showUserRating ? "Hide Rating" : "Show Rating"}
                      </button>
                    </div>

                    {showUserRating && (
                      <div style={{ display: "flex", flexDirection: "row" }}>
                        <p className="tooltip">
                          Rating: {userRating}
                          <span className="tooltiptext">
                            Your rating is visible to agents
                          </span>
                        </p>
                      </div>
                    )}
                  </div>
                  {/* <h2 className="userInfo">{providerId}</h2> */}
                  <div
                    onMouseOver={() => {
                      document
                        .getElementById("replace-photo")
                        .setAttribute("display", "initial");
                      document.getElementById("replace-photo").style.display =
                        "initial";
                    }}
                    onMouseOut={() => {
                      document
                        .getElementById("replace-photo")
                        .setAttribute("display", "none");
                      document.getElementById("replace-photo").style.display =
                        "none";
                    }}
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      margin: "0 auto",
                      position: "relative",
                    }}
                  >
                    <div style={{ margin: "0 auto", position: "relative" }}>
                      <button
                        id="replace-photo"
                        type="button"
                        style={{
                          backgroundColor: "lightgray",
                          color: "black",
                          display: "none",
                          position: "absolute",
                        }}
                        onClick={() => {
                          setShowModalCenter(true);
                          setIsReplacePhoto(true);
                        }}
                      >
                        {"^"}
                      </button>
                      <img
                        className="accountPhoto"
                        id="profile-photo"
                        src={photoURL}
                        alt="user"
                        style={{
                          height: "100px",
                          width: "100px",
                          margin: "0 auto",
                          position: "relative",
                        }}
                      />
                    </div>
                  </div>
                  <button
                    id="replace-photo"
                    type="button"
                    style={{
                      // backgroundColor: "lightgray",
                      // color: "black",
                      // display: "none",
                      position: "relative",
                      margin: "0 auto",
                    }}
                    onClick={() => {
                      setShowModalCenter(true);
                      setIsReplacePhoto(true);
                    }}
                  >
                    {"Change Profile Photo"}
                  </button>

                  {homePhotos.length > 0 ? (
                    <div
                      className="google"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        textAlign: "left",
                        margin: "0 auto",
                        position: "relative",
                        padding: "10px",
                      }}
                    >
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: `${
                              isPortrait || isSmallScreen ? "column" : "row"
                            }`,
                            overflowX: "scroll",
                            overflowY: "scroll",
                          }}
                        >
                          {homePhotos.map((item, i) => {
                            let photoId = `home-photo-${i}`;
                            let deleteId = `delete-button-${i}`;

                            if (i >= pageNum * 5 && i < (pageNum + 1) * 5) {
                              getDownloadURL(ref(storage, item))
                                .then((downloadURL) => {
                                  document
                                    .getElementById(photoId)
                                    .setAttribute("src", downloadURL);
                                })
                                .catch((error) => {
                                  console.log(error);
                                });
                              return (
                                <div
                                  onMouseOver={() => {
                                    document
                                      .getElementById(deleteId)
                                      .setAttribute("display", "initial");
                                    document.getElementById(
                                      deleteId
                                    ).style.display = "initial";
                                  }}
                                  onMouseOut={() => {
                                    document
                                      .getElementById(deleteId)
                                      .setAttribute("display", "none");
                                    document.getElementById(
                                      deleteId
                                    ).style.display = "none";
                                  }}
                                >
                                  <button
                                    id={deleteId}
                                    type="button"
                                    style={{
                                      backgroundColor: "red",
                                      color: "white",
                                      display: "none",
                                      position: "absolute",
                                    }}
                                    onClick={() => {
                                      handleDeletePhoto();
                                      setWillDelete(homePhotos[i]);
                                    }}
                                  >
                                    X
                                  </button>
                                  <img
                                    alt="home"
                                    src=""
                                    id={photoId}
                                    style={{ height: "200px", width: "200px" }}
                                  />
                                </div>
                              );
                            } else {
                              return <span></span>;
                            }
                          })}
                        </div>

                        <div style={{ display: "flex", flexDirection: "row" }}>
                          <button
                            type="button"
                            onClick={() => handlePageNum("previous")}
                          >
                            {"<"}
                          </button>
                          {numArr.map((index) => {
                            return (
                              <div>
                                {/* {index > 1 && !canShow(index - 1) && (
                                  <div>
                                    <button type="button" disabled={true}>
                                      {"..."}
                                    </button>
                                  </div>
                                )} */}
                                {homePhotos.length <= index * 5 &&
                                homePhotos.length > (index - 1) * 5 &&
                                (index == 1 ||
                                  index == 2 ||
                                  index == 9 ||
                                  index == 10 ||
                                  index == pageNum ||
                                  index == pageNum + 1 ||
                                  index == pageNum - 1 ||
                                  index == pageNum + 2 ||
                                  index == pageNum - 2) ? (
                                  <button
                                    type="button"
                                    onClick={() => handlePageNum(index)}
                                  >{`${index}`}</button>
                                ) : (
                                  <button
                                    style={{
                                      display: `${
                                        index == pageNum + 1 ||
                                        index == pageNum - 1
                                          ? "initial"
                                          : "none"
                                      }`,
                                    }}
                                    type="button"
                                  >
                                    {"."}
                                  </button>
                                )}
                              </div>
                            );
                          })}
                          <button
                            type="button"
                            disabled={{}}
                            onClick={() => handlePageNum("next")}
                          >
                            {">"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p>you have no photos!</p>
                    </div>
                  )}
                  <button type="button" onClick={() => handleAddPhotos()}>
                    Add Photos
                  </button>
                  <br></br>
                  {homeAddress.length > 0 ? (
                    <button
                      style={{
                        width: "100px",
                        margin: "0 auto",
                        position: "relative",
                      }}
                      type="button"
                      onClick={() => setShowAddress(!showAddress)}
                    >{`${
                      showAddress ? "Hide Address" : "Show Address"
                    }`}</button>
                  ) : (
                    <p>No address loaded...</p>
                  )}
                  {showAddress && (
                    <div
                      className="google"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        textAlign: "left",
                        margin: "0 auto",
                        position: "relative",
                        padding: "10px",
                      }}
                    >
                      <Locator />
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          padding: "50px",
                          justifyContent: "space-between",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            position: "relative",
                            float: "right",
                          }}
                        >
                          {homeAddress.map((item, i) => {
                            if (i < homeAddress.length / 2 && item !== "none") {
                              return <p style={{ float: "left" }}>{item}</p>;
                            } else {
                              return <span></span>;
                            }
                          })}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            position: "relative",
                            float: "right",
                          }}
                        >
                          {homeAddress.map((item, i) => {
                            if (
                              i >= homeAddress.length / 2 &&
                              item !== "none"
                            ) {
                              return <p style={{ float: "left" }}>{item}</p>;
                            } else {
                              return <span></span>;
                            }
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="itemCard"></div>
                </div>
              </div>

              {deleteModal && (
                <div>
                  <h3>
                    Are you sure you want to delete your account? All your
                    information will be lost.
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      setDeleteModal(false);
                      handleDeleteAccount();
                    }}
                  >
                    Delete Account
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDeleteModal(false);
                    }}
                  >
                    No Thanks
                  </button>
                </div>
              )}
              <br></br>
              <br></br>

              <div>
                <button
                  type="button"
                  className="userButton button primary"
                  style={{ maxWidth: `${isLargeScreen && "90%"}` }}
                  onClick={() => {
                    setSignOutDisplay(true);
                    setShowModalCenter(true);
                  }}
                >
                  Sign Out
                </button>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                maxWidth: `${isLargeScreen ? "33%" : "120%"}`,
                "padding-left": `${isLargeScreen ? "5vw" : "0vw"}`,
                "padding-right": `${isLargeScreen ? "5vw" : "0vw"}`,
                "padding-top": `${isLargeScreen ? "5vw" : "1em"}`,
                "padding-bottom": `${isLargeScreen ? "5vw" : "0vw"}`,
              }}
            >
              <div
                style={{
                  marginTop: "15px",
                }}
              ></div>
              <div>
                <button
                  type="button"
                  style={{
                    fontSize: "x-large",
                    width: `${isLargeScreen ? "auto" : "10em"}`,
                    height: `${isLargeScreen ? "auto" : "4em"}`,
                    right: `${isLargeScreen ? "" : ".5em"}`,
                    // "height": `${isLargeScreen ? "auto" : "3em"}`
                  }}
                  className="userButton button primary"
                >
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    <img
                      alt=""
                      // width={`${isLargeScreen ? "30%" : "20%"}`}
                      // height="auto"
                      // style={{
                      //   bottom: ".2em",
                      //   position: "relative",
                      //   right: ".5em",
                      // }}
                      src=""
                    />
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                      }}
                    >
                      {userHistory && userHistory.length > 0 ? (
                        <div>
                          <Link
                            to={`/user-history/${uid}`}
                            style={{ textDecoration: "none" }}
                          >
                            <p>View Your History</p>
                          </Link>
                        </div>
                      ) : (
                        <div>
                          <p>You haven't booked any agents yet!</p>
                          <Link to="/browse">
                            <button type="button">Find Housekeepers</button>
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              </div>

              <span
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-evenly",
                  // "textAlign": "left",
                  "padding-right": "5vw",
                  "padding-top": "5vw",
                  "padding-bottom": "5vw",
                  right: "1em",
                  width: "400px",
                  height: "150px",
                }}
              >
                <div class="switch">
                  <input
                    name="keepMeUpdated2"
                    class="switch-input"
                    type="checkbox"
                    id="keepMeUpdated2"
                    checked={updatesBool}
                    onClick={() => {
                      toggleUpdatesBool();
                    }}
                  ></input>
                  <label class="switch-paddle" for="keepMeUpdated2">
                    <span class="show-for-sr">
                      Keep me updated about special events and offers from JK
                      Domestic Collection
                    </span>
                  </label>
                </div>
                <div
                  class="switch"
                  style={{ float: "left", position: "relative", left: "10px" }}
                >
                  <input
                    name="keepMeSignedIn"
                    class="switch-input"
                    type="checkbox"
                    id="keepMeSignedIn"
                    checked={staySignedIn}
                    onClick={() => {
                      toggleStaySignedIn();
                    }}
                    style={{ float: "left" }}
                  ></input>
                  <label class="switch-paddle" for="keepMeSignedIn">
                    <span class="show-for-sr" style={{ float: "left" }}>
                      Keep me signed in
                    </span>
                  </label>
                </div>
              </span>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <button
              type="button"
              id="deleteAccountButton"
              className="userButton button secondary"
              style={{
                maxWidth: `${isLargeScreen ? "10%" : "100%"}`,
                float: "right",
                top: `${!isPortrait || isLargeScreen ? "10em" : "13em"}`,
                "margin-top": "10em",
                width: `${isLargeScreen ? "10%" : "10em"}`,
                position: `${isLargeScreen ? "" : "relative"}`,
              }}
              onClick={() => {
                setDeleteModal(true);
              }}
            >
              Delete Account
            </button>
          </div>
        </div>
        <br></br>
      </div>
    );
  } else if (!uid) {
    return (
      <div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-evenly",
            height: "200px",
            marginTop: "50px",
            marginBottom: "50px",
          }}
        >
          <SignInWithEmail
            className="signInEmail"
            style={{
              width: "150px",
              // height: "30px",
              margin: "0 auto",
              position: "relative",
            }}
          />
          <button
            className="signIn google"
            onClick={() => signInWithGoogle()}
            style={{
              width: "200px",
              margin: "0 auto",
              position: "relative",
              justifyContent: "space-between",
            }}
          >
            <img
              margin="10px"
              width="20px"
              height="20px"
              alt="facebook icon"
              style={{ right: "10px", position: "relative" }}
              src="https://firebasestorage.googleapis.com/v0/b/j-collection.appspot.com/o/icons%2Fgoogle.png?alt=media&token=c1f899f8-dd8f-4689-9ade-31e431a298d7"
            />
            Sign in with Google
          </button>
          <button
            className="signIn facebook"
            onClick={() => signInWithFacebook()}
            style={{
              width: "200px",
              margin: "0 auto",
              position: "relative",
              justifyContent: "space-between",
            }}
          >
            <img
              // margin="10px"
              width="20px"
              height="20px"
              alt="facebook icon"
              style={{ right: "5px", position: "relative" }}
              src="https://firebasestorage.googleapis.com/v0/b/j-collection.appspot.com/o/icons%2Ffacebook%20(1).png?alt=media&token=6a2adf27-c305-41a6-b55e-4d942abb8d52"
            />
            Sign in with Facebook
          </button>
        </div>

        <div style={{ "z-index": "87" }}>
          <p>
            {"By signing up, you agree to our "}
            <Link to="/privacy-policy">Privacy Policy</Link>
            {" and our "}
            <Link to="/terms-of-service">Terms of Service</Link>
          </p>
        </div>
      </div>
    );
  } else if (!userEmail) {
    return (
      <div>
        <h1 style={{ fontFamily: "luminari" }}>Account</h1>
        <h2>Choose a sign-in method below:</h2>
        {/* <div className="shadowed centered" style={{
                    // "borderRadius": "25vw",
                    "position": "absolute",
                    "height": "70%",
                    "zIndex": "30",
                    "width": `${isLargeScreen ? "30%" : "90%"}`,
                    "top": "40%",
                    "left": "35vw"
                }}></div> */}
        <SignInWithEmail />
        <button onClick={() => signInWithGoogle()} className="signIn google">
          Sign in with Google
        </button>
        <button onClick={() => signInWithFacebook()} className="signIn google">
          Sign in with Facebook
        </button>
        {/* <div id="firebaseui-auth-container"></div> */}
        <div style={{ "z-index": "87" }}>
          <p>
            {"By signing up, you agree to our "}
            <Link to="/privacy-policy">Privacy Policy</Link>
            {" and our "}
            <Link to="/terms-of-service">Terms of Service</Link>
          </p>
        </div>
        <nav
          style={{ marginTop: "1em" }}
          className="darkNav"
          aria-label="You are here:"
          role="navigation"
        >
          <ul class="breadcrumbs">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/account">Account</Link>
            </li>
            <li>
              <span class="show-for-sr">Current: Account</span>
            </li>
          </ul>
        </nav>
      </div>
    );
  } else {
    return (
      <div>
        <h2>One moment please...</h2>
        <div class="text-center">
          <div class="spinner-border" role="status"></div>
        </div>
        <nav
          style={{ marginTop: "1em" }}
          className="darkNav"
          aria-label="You are here:"
          role="navigation"
        >
          <ul class="breadcrumbs">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/account">Account</Link>
            </li>
            <li>
              <span class="show-for-sr">Current: Account</span>
            </li>
          </ul>
        </nav>
      </div>
    );
  }
}

export default Account;
// includes to firebase auth UI ID.
