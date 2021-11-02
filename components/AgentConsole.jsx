import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  FacebookAuthProvider,
} from "firebase/auth";
import Lottie from "react-lottie-player";
import loadingData from "../8682-loading.json";
// import firebase from "firebase";
// import firebaseui from "firebaseui";
import { Context } from "../Context";
import SignInWithEmail from "./SignInWithEmail";
import RecentlyViewed from "./RecentlyViewed";
import AddressForm from "./AddressForm";
import Locator from "./Locator";
import { getDownloadURL, getStorage, ref } from "firebase/storage";

import { initializeApp } from "firebase/app";
import { getFunctions, httpsCallable } from "firebase/functions";
// import { saveHomePhotos } from "../../functions";
// import { updateStaySignedIn } from "../functions"

function AgentConsole() {
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

    agentPhotos,
    setAgentPhotos,

    handleAddPhotos,
    handleAddAgentPhotos,

    deletePhoto,
    handleDeletePhoto,
    willDelete,
    setWillDelete,

    profilePhoto,
    setProfilePhoto,

    handleReplacePhoto,

    setIsReplacePhoto,
    agentObj,
    agentRating,
    setShowLottieLoading,
    setShowLottieError,
    infoLoaded,
  } = useContext(Context);

  // useEffect(() => {
  // setOnCheckout(false);
  // setUseExpressMode(false);
  // setOnProductPage(false);
  // setOnHomeScreen(false);
  // }, []);  const firebaseConfig = {

  // Initialize Firebase
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
  const app = initializeApp(firebaseConfig);

  const functions = getFunctions(app);

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

  function handleReload() {
    window.location.reload();
  }

  const [updatesBool, setUpdatesBool] = useState(true);

  const [agentSchedule, setAgentSchedule] = useState([]);

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

  useEffect(() => {
    console.log("agentObj: ", agentObj);
    console.log(JSON.stringify(agentObj));
  }, [agentObj]);

  const handlePageNum = (operation) => {
    if (operation == "next" && agentPhotos.length <= (pageNum + 1) * 5) {
      pageNum++;
    } else if (operation == "previous" && pageNum > 0) {
      pageNum--;
    } else if (
      typeof operation == "number" &&
      operation > 0 &&
      agentPhotos.length <= (operation + 1) * 5
    ) {
      setPageNum(operation);
    }
  };

  const numArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const [ratingArray, setRatingArray] = useState([]);

  const [editAccount, setEditAccount] = useState(false);

  const toggleEdit = () => {
    setEditAccount(!editAccount);
  };

  useEffect(() => {
    let newArr = [];
    for (let i = 0; i < Math.floor(Number(agentRating)); i++) {
      newArr.push(i);
    }
    setRatingArray(newArr);
  }, [agentRating]);

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

  const [availableForWork, setAvailableForWork] = useState(true);

  useEffect(() => {
    if (agentObj && agentObj.availableForWork) {
      setAvailableForWork(true);
    } else {
      setAvailableForWork(false);
    }
  }, [agentObj]);

  const [isEditAvail, setIsEditAvail] = useState(false);

  const handleAvailable = async () => {
    setShowModalCenter(true);
    setShowLottieLoading(true);

    let bool = !availableForWork;

    let temp = agentObj;
    temp.availableForWork = bool;

    // const saveAgentInfo = httpsCallable(functions, "saveAgentInfo");
    // return saveAgentInfo({ agentObj: temp, userAccessCode, userName });

    const updateAgentInfo = httpsCallable(functions, "updateAgentInfo");
    return await updateAgentInfo({ agentObj: temp })
      .then((result) => {
        setShowModalCenter(false);
        setShowLottieLoading(false);
        setAvailableForWork(bool);
        let data = result.data;
      })
      .catch((error) => {
        setShowLottieLoading(false);
        setShowLottieError(true);
        console.log(error);
      });
  };

  const [isEditBio, setIsEditBio] = useState(false);

  const editBio = () => {
    setIsEditBio(!isEditBio);
  };

  const [tempBio, setTempBio] = useState("");

  const confirmEditBio = async () => {
    setShowModalCenter(true);
    setShowLottieLoading(true);
    let temp = agentObj;
    temp.bio = tempBio;

    // const saveAgentInfo = httpsCallable(functions, "saveAgentInfo");
    // return saveAgentInfo({ agentObj: temp, userAccessCode, userName });

    const updateAgentInfo = httpsCallable(functions, "updateAgentInfo");
    return await updateAgentInfo({ agentObj: temp })
      .then((result) => {
        setShowModalCenter(false);
        setShowLottieLoading(false);
        let data = result.data;
      })
      .catch((error) => {
        setShowLottieLoading(false);
        setShowLottieError(true);
        console.log(error);
      });
  };

  const [isEditAddress, setIsEditAddress] = useState(false);
  const editAddress = () => {
    setIsEditAddress(!isEditAddress);
  };

  const confirmEditAddress = () => {};

  const [isEditSkills, setIsEditSkills] = useState(false);
  const editSkills = () => {
    setIsEditSkills(!isEditSkills);
  };

  const confirmEditSkills = async () => {
    setShowModalCenter(true);
    setShowLottieLoading(true);
    let temp = agentObj;
    temp.skills = {
      housekeeping: housekeepingChecked,
      gardening: gardeningChecked,
      laundry: laundryChecked,
      cooking: cookingChecked,
      extraSkills: [...extraSkillArray],
    };

    // const saveAgentInfo = httpsCallable(functions, "saveAgentInfo");
    // return saveAgentInfo({ agentObj: temp, userAccessCode, userName });

    const updateAgentInfo = httpsCallable(functions, "updateAgentInfo");
    return await updateAgentInfo({ agentObj: temp })
      .then((result) => {
        setShowModalCenter(false);
        setShowLottieLoading(false);
        let data = result.data;
      })
      .catch((error) => {
        setShowLottieLoading(false);
        setShowLottieError(true);
        console.log(error);
      });
  };

  const [housekeepingChecked, setHousekeepingChecked] = useState(true);
  const [housekeepingYears, setHousekeepingYears] = useState(0);
  //
  const [gardeningChecked, setGardeningChecked] = useState(true);
  const [gardeningYears, setGardeningYears] = useState(0);
  //
  const [laundryChecked, setLaundryChecked] = useState(true);
  const [laundryYears, setLaundryYears] = useState(0);
  //
  const [cookingChecked, setCookingChecked] = useState(true);
  const [cookingYears, setCookingYears] = useState(0);

  const [skillString, setSkillString] = useState("");
  const [extraSkillArray, setExtraSkillArray] = useState([]);
  const [extraSkillYearsExp, setExtraSkillYearsExp] = useState(0);

  const addSkillInput = () => {
    if (extraSkillArray.length < 3) {
      setExtraSkillArray([
        ...extraSkillArray,
        { skill: skillString, yearsExp: extraSkillYearsExp },
      ]);
      setSkillString("");
      setExtraSkillYearsExp(0);
    } else {
      window.alert("No more than 3 extra skills!");
    }
  };

  const removeSkillInput = (string) => {
    let counter = 0;
    let found = false;
    while (counter < extraSkillArray.length && !found) {
      if (extraSkillArray[counter].skill === string) {
        found = true;
        let newArr = [...extraSkillArray].splice(counter, 1);
        setExtraSkillArray([...newArr]);
      }
      counter++;
    }
  };

  const SkillSet = () => {
    return (
      <div>
        <p>1. What are your skills?</p>
        <div
          id="skill-input"
          style={{ flexDirection: "row", justifyContent: "space-evenly" }}
        >
          <div
            id="skill-list"
            style={{
              flexDirection: "column",
              justifyContent: "space-evenly",
            }}
          >
            <div
              className="skill"
              style={{
                flexDirection: "row",
                justifyContent: "space-evenly",
              }}
            >
              <input
                id="housekeeping-input"
                type="checkbox"
                checked={housekeepingChecked}
                onChange={() => {
                  setHousekeepingChecked(!housekeepingChecked);
                }}
              />
              <label for="housekeeping-input">Housekeeping</label>
              {housekeepingChecked && (
                <div>
                  <select
                    id="housekeeping-years"
                    type="select"
                    onChange={(e) => setHousekeepingYears(e.target.value)}
                  >
                    <option value="0">{"<1"}</option>
                    <option value="1">{"1"}</option>
                    <option value="2">{"2"}</option>
                    <option value="3">{"3"}</option>
                    <option value="4">{"4"}</option>
                    <option value="5">{"5"}</option>
                    <option value="6">{"6"}</option>
                    <option value="7">{"7"}</option>
                    <option value="8">{"8"}</option>
                    <option value="9">{"9"}</option>
                    <option value="10">{"10+"}</option>
                  </select>
                </div>
              )}
            </div>

            <div
              className="skill"
              style={{
                flexDirection: "row",
                justifyContent: "space-evenly",
              }}
            >
              <input
                id="laundry-input"
                type="checkbox"
                checked={laundryChecked}
                onChange={() => {
                  setLaundryChecked(!laundryChecked);
                }}
              />
              <label for="laundry-input">Laundry</label>
              {laundryChecked && (
                <div>
                  <select
                    id="laundry-years"
                    type="select"
                    onChange={(e) => setLaundryYears(e.target.value)}
                  >
                    <option value="0">{"<1"}</option>
                    <option value="1">{"1"}</option>
                    <option value="2">{"2"}</option>
                    <option value="3">{"3"}</option>
                    <option value="4">{"4"}</option>
                    <option value="5">{"5"}</option>
                    <option value="6">{"6"}</option>
                    <option value="7">{"7"}</option>
                    <option value="8">{"8"}</option>
                    <option value="9">{"9"}</option>
                    <option value="10">{"10+"}</option>
                  </select>
                </div>
              )}
            </div>

            <div className="skill" style={{ flexDirection: "row" }}>
              <input
                type="checkbox"
                checked={gardeningChecked}
                onChange={() => {
                  setGardeningChecked(!gardeningChecked);
                }}
                id="gardening-input"
              />
              <label for="gardening-input">Gardening</label>
              {gardeningChecked && (
                <div>
                  <select
                    id="gardening-years"
                    type="select"
                    onChange={(e) => setGardeningYears(e.target.value)}
                  >
                    <option value="0">{"<1"}</option>
                    <option value="1">{"1"}</option>
                    <option value="2">{"2"}</option>
                    <option value="3">{"3"}</option>
                    <option value="4">{"4"}</option>
                    <option value="5">{"5"}</option>
                    <option value="6">{"6"}</option>
                    <option value="7">{"7"}</option>
                    <option value="8">{"8"}</option>
                    <option value="9">{"9"}</option>
                    <option value="10">{"10+"}</option>
                  </select>
                </div>
              )}
            </div>

            <div className="skill" style={{ flexDirection: "row" }}>
              <input
                type="checkbox"
                checked={cookingChecked}
                onChange={() => {
                  setCookingChecked(!cookingChecked);
                }}
                id="cooking-input"
              />
              <label for="cooking-input">Cooking</label>
              {cookingChecked && (
                <div>
                  <select
                    id="cooking-years"
                    type="select"
                    onChange={(e) => setCookingYears(e.target.value)}
                  >
                    <option value="0">{"<1"}</option>
                    <option value="1">{"1"}</option>
                    <option value="2">{"2"}</option>
                    <option value="3">{"3"}</option>
                    <option value="4">{"4"}</option>
                    <option value="5">{"5"}</option>
                    <option value="6">{"6"}</option>
                    <option value="7">{"7"}</option>
                    <option value="8">{"8"}</option>
                    <option value="9">{"9"}</option>
                    <option value="10">{"10+"}</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={{ flexDirection: "row" }}>
          <input
            type="text"
            placeholder="Additional Skill?"
            value={skillString}
            onChange={(e) => setSkillString(e.target.value)}
          ></input>
          {skillString && (
            <div>
              <p>Years Experience:</p>
              <select
                id="extra-skill-years"
                type="select"
                onChange={(e) => setExtraSkillYearsExp(e.target.value)}
              >
                <option value="0">{"<1"}</option>
                <option value="1">{"1"}</option>
                <option value="2">{"2"}</option>
                <option value="3">{"3"}</option>
                <option value="4">{"4"}</option>
                <option value="5">{"5"}</option>
                <option value="6">{"6"}</option>
                <option value="7">{"7"}</option>
                <option value="8">{"8"}</option>
                <option value="9">{"9"}</option>
                <option value="10">{"10+"}</option>
              </select>
              <button type="button" onClick={() => addSkillInput()}>
                Add Skill
              </button>
            </div>
          )}
          {extraSkillArray.map((skillObj) => {
            return (
              <div>
                <p>{skillObj.skill}</p>
                <p>{`Years Experience ${skillObj.yearsExp}`}</p>
                <button
                  type="button"
                  onClick={() => {
                    removeSkillInput(skillObj.skill);
                  }}
                >
                  Remove
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (!infoLoaded || !agentObj || !agentObj.uid) {
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
        <Lottie
          className="lottie"
          loop
          animationData={loadingData}
          play
          style={{ width: 150, height: 150 }}
        />
      </div>
    );
  } else {
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
                <h4>Agent Console</h4>
                <div
                  className="userAccount"
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  <div className="innerBox">
                    <h2 className="userInfo">{displayName}</h2>
                    <h2 className="userInfo">{userEmail}</h2>
                    {agentObj && agentObj.createTime && (
                      <h2 className="userInfo">{`Agent since: ${agentObj.createTime}`}</h2>
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

                  {agentPhotos.length > 0 ? (
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
                        <div style={{ display: "flex", flexDirection: "row" }}>
                          {agentPhotos.map((item, i) => {
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
                                      setWillDelete(agentPhotos[i]);
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
                                {agentPhotos.length <= index * 5 &&
                                agentPhotos.length > (index - 1) * 5 &&
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
                  <button type="button" onClick={() => handleAddAgentPhotos()}>
                    Add Agent Photos
                  </button>
                  <br></br>
                  {homeAddress.length > 0 && !isEditAddress ? (
                    <button
                      className="tooltip"
                      style={{
                        width: "100px",
                        margin: "0 auto",
                        position: "relative",
                      }}
                      type="button"
                      onClick={() => setShowAddress(!showAddress)}
                    >
                      {`${showAddress ? "Hide Address" : "Show Address"}`}
                      <span class="tooltiptext">
                        Your address will never be shared with a client.
                      </span>
                    </button>
                  ) : (
                    <p>No address loaded...</p>
                  )}
                  {showAddress && !isEditAddress && (
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
                          padding: "30px",
                          justifyContent: "space-between",
                        }}
                      >
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
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
                          style={{ display: "flex", flexDirection: "column" }}
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
                  {isEditAddress && (
                    <div style={{ position: "fixed", zIndex: "99" }}>
                      <AddressForm
                        style={{ position: "relative", margin: "0 auto" }}
                        submit={true}
                        editName={false}
                        photo={false}
                      />
                    </div>
                  )}
                  <button type="button" onClick={() => editAddress()}>
                    {isEditAddress ? "Cancel" : "Change Address"}
                  </button>

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
                    <div className="innerBox">
                      {agentObj && agentObj.payRate && (
                        <p>Full day rate: {agentObj.payRate.fullDay}</p>
                      )}
                      {agentObj && agentObj.payRate && (
                        <p>Half day rate: {agentObj.payRate.halfDay}</p>
                      )}
                    </div>
                    <div className="innerBox">
                      {agentObj && <p>Speaks...</p>}
                      <div className="innerBox">
                        {agentObj &&
                          agentObj.languages &&
                          agentObj.languages.english && <p>English</p>}
                        {agentObj &&
                          agentObj.languages &&
                          agentObj.languages.spanish && <p>Spanish</p>}
                        {agentObj &&
                          agentObj.languages &&
                          agentObj.languages.extraLanguages.map((language) => {
                            return <p>{language}</p>;
                          })}
                      </div>

                      <p>Skills...</p>
                      <div className="innerBox">
                        {agentObj &&
                          agentObj.skills &&
                          agentObj.skills.cooking &&
                          !editSkills && <p>Cooking</p>}
                        {agentObj &&
                          agentObj.skills &&
                          agentObj.skills.gardening &&
                          !editSkills && <p>Gardening</p>}
                        {agentObj &&
                          agentObj.skills &&
                          agentObj.skills.housekeeping &&
                          !editSkills && <p>Housekeeping</p>}
                        {agentObj &&
                          agentObj.skills &&
                          agentObj.skills.laundry &&
                          !editSkills && <p>Laundry</p>}
                        {agentObj &&
                          agentObj.skills &&
                          agentObj.skills.extraSkills.map((skill) => {
                            return <p>{skill}</p>;
                          })}
                        {agentObj && isEditSkills && <div></div>}
                        {isEditSkills && (
                          <div>
                            <SkillSet />
                            <button
                              type="button"
                              onClick={() => confirmEditSkills()}
                            >
                              Confirm
                            </button>
                          </div>
                        )}
                        <button type="button" onClick={() => editSkills()}>
                          {isEditSkills ? "Cancel" : "Edit Skills"}
                        </button>
                      </div>
                      <div className="innerBox">
                        {agentObj && agentObj.bio && !editBio && (
                          <div>
                            <p>{agentObj.bio}</p>
                          </div>
                        )}
                        {agentObj && agentObj.bio && editBio && (
                          <div>
                            <input
                              type="textarea"
                              placeholder="new bio"
                              value={tempBio}
                              onClick={(e) => {
                                setTempBio(e.target.value);
                              }}
                            />
                          </div>
                        )}
                        {isEditBio && (
                          <button
                            type="button"
                            onClick={() => confirmEditBio()}
                          >
                            Confirm
                          </button>
                        )}
                        <button type="button" onClick={() => editBio()}>
                          {isEditBio ? "Cancel" : "Edit Bio"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div
                  style={{
                    marginTop: "20px",
                    width: `${isLargeScreen ? "auto" : "10em"}`,
                    height: `${isLargeScreen ? "auto" : "4em"}`,
                    right: `${isLargeScreen ? "" : ".5em"}`,
                    // "height": `${isLargeScreen ? "auto" : "3em"}`
                  }}
                  className="google"
                >
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        float: "left",
                      }}
                    >
                      <div style={{ flexDirection: "row" }}>
                        {ratingArray.map((star) => {
                          return (
                            <img
                              alt="star icon"
                              width={`15px`}
                              height="auto"
                              //   style={{
                              //     bottom: ".2em",
                              //     position: "relative",
                              //     right: ".5em",
                              //   }}
                              src="https://firebasestorage.googleapis.com/v0/b/j-collection.appspot.com/o/icons%2F5_point_star.png?alt=media&token=0bbffa05-ddb6-44d1-9f43-4bf4452b69c6"
                            />
                          );
                        })}
                      </div>
                      <p>
                        Rating:
                        {`${
                          agentObj.currentRating ? agentObj.currentRating : 0
                        }`}
                      </p>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <div>
                        {agentObj && agentObj.history.length > 0 ? (
                          <div>
                            <Link to={`/agent-history/${agentObj.uid}`}>
                              <button type="button">Your Job History</button>
                            </Link>
                          </div>
                        ) : (
                          <div>
                            <p>You haven't had any appointments yet!</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <button
                  disabled={!isEditAvail}
                  onClick={() => {
                    handleAvailable();
                  }}
                >
                  {availableForWork
                    ? "Available For Work"
                    : "Not Available For Work"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditAvail(!isEditAvail);
                  }}
                >
                  {isEditAvail ? "Cancel" : "Edit"}
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
  }
}

export default AgentConsole;
// includes to firebase auth UI ID.
