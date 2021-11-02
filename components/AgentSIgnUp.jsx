import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../Context";
import TermsOfService from "./TermsOfService";
import VisibilitySensor from "react-visibility-sensor";
import { FilePicker } from "react-file-picker";
import { initializeApp } from "firebase/app";
import { getFunctions, httpsCallable } from "firebase/functions";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const AgentSignUp = () => {
  const {
    uid,
    userName,
    isPendingVerification,
    isAgent,
    setShowModalCenter,
    setShowModalAgentAuth,
    setShowLottieLoading,
    setShowLottieError,
    setShowLottieSuccess,
    homeAddress,
    profilePhoto,
  } = useContext(Context);

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

  const [userAccessCode, setUserAccessCode] = useState("");

  useEffect(() => {
    console.log("agent sign up page loaded.");
  }, []);

  useEffect(() => {
    // the user access code is the six last characters of their uid
    if (uid) {
      setUserAccessCode(uid.substring(uid.length - 7));
    } else {
      setUserAccessCode("");
    }
  }, [uid]);

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

  const changeSkillInput = (string) => {};

  const [termsAgreed, setTermsAgreed] = useState(false);
  const [termsScrolled, setTermsScrolled] = useState(false);

  const [spanishChecked, setSpanishChecked] = useState(false);
  const [englishChecked, setEnglishChecked] = useState(true);

  const [langString, setLangString] = useState("");
  const [langArray, setLangArray] = useState([]);

  const addLangInput = () => {
    if (langString && langArray.length < 3) {
      setLangArray([...langArray, langString]);
      setLangString("");
    } else if (langString && langString.length == 3) {
      window.alert(
        "Only adding up to 3 additional languages is supported at this time."
      );
    } else if (!langString) {
      window.alert("No language entered!");
    }
  };

  const removeLang = (lang) => {
    let newArr = [...langArray];
    newArr.splice(newArr.indexOf(lang), 1);
    setLangArray([...newArr]);
  };

  const [travelDist, setTravelDist] = useState("____");

  //

  const [halfDayPay, setHalfDayPay] = useState("");
  const [fullDayPay, setFullDayPay] = useState("");

  //

  const [slideNum, setSlideNum] = useState(1);

  const [agentObj, setAgentObj] = useState({});

  //
  const [verifyPhoto, setVerifyPhoto] = useState({});
  const [verifyPhotoName, setVerifyPhotoName] = useState("");
  //

  const saveSlide = (n) => {
    let num = Number(n);
    console.log("save slide: ", num);
    if (num === 1) {
      const temp = agentObj;
      temp.skills = {
        housekeeping: housekeepingChecked,
        gardening: gardeningChecked,
        laundry: laundryChecked,
        cooking: cookingChecked,
        extraSkills: [...extraSkillArray],
      };
      temp.languages = {
        english: englishChecked,
        spanish: spanishChecked,
        extraLanguages: [...langArray],
      };
      temp.address = [...homeAddress];
      temp.profilePhoto = profilePhoto || "";
      setAgentObj(temp);
    } else if (num === 2) {
      const temp = agentObj;
      // we want to keeo travelDist as a number for the sake of searches
      temp.travelDist = Number(travelDist.split(" ")[0]);
      temp.bookingPeriod = {
        nextDay: nextDayChecked,
        sameDay: sameDayChecked,
        weekly: weeklyChecked,
      };

      setAgentObj(temp);
      setTravelDist("____");
    } else if (num === 3) {
      const temp = agentObj;
      // again, we want these stored as numbers
      let payRate = {
        fullDay: Number(fullDayPay),
        halfDay: Number(halfDayPay),
      };
      temp.payRate = payRate;
      setAgentObj(temp);
      setFullDayPay("");
      setHalfDayPay("");
      //
    } else if (num === 4) {
      console.log("Slide 4 completed");
      //  Agree to these terms and conditions...
    } else if (num === 5) {
      setShowModalCenter(true);
      setShowLottieLoading(true);
      setShowModalAgentAuth(true);

      let url = `agent-verification-photos/${uid}/${verifyPhotoName}`;
      const storageRef = ref(storage, url);
      const metadata = {
        contentType: "image/jpeg",
      };

      // const file = new File([`${filename}`], `${path}`, {
      //   type: "image/jpeg",
      // });

      // 'file' comes from the Blob or File API
      const result = uploadBytes(storageRef, verifyPhoto, metadata)
        .then((snapshot) => {
          console.log("Uploaded a blob or file!");
          console.log(snapshot);
          return getDownloadURL(snapshot.ref);
        })
        .then((downloadURL) => {
          console.log("File available at", downloadURL);

          let temp = agentObj;
          temp.photoName = verifyPhotoName;

          const saveAgentInfo = httpsCallable(functions, "saveAgentInfo");
          return saveAgentInfo({ agentObj: temp, userAccessCode, userName });
        })
        .then((result) => {
          let data = result.data;
          if (data.success) {
            console.log(
              "server reported that the agent object was saved to the database"
            );
            setShowLottieLoading(false);
            setShowLottieSuccess(true);
          } else {
            setShowLottieLoading(false);
            setShowLottieError(true);
            console.log("server reported data save failure: ", data.success);
          }
        })
        .catch((error) => {
          setShowLottieLoading(false);
          setShowLottieError(true);
          console.log("unable to call function", error);
        });
      // upload photo, save data, complete account request verificaiton.
    }
    if (num < 5) {
      let next = Number(num + 1);
      setSlideNum(Number(next));
    }
  };

  useEffect(() => {
    const slideOne = document.getElementById("slide-one");
    const slideTwo = document.getElementById("slide-two");
    const slideThree = document.getElementById("slide-three");
    const slideFour = document.getElementById("slide-four");
    const slideFive = document.getElementById("slide-five");

    const slideArr = [slideOne, slideTwo, slideThree, slideFour, slideFive];

    for (let i = 0; i < slideArr.length; i++) {
      let index = i;
      let slide = slideArr[i];

      console.log("slide object: ", slide);
      if (index === slideNum - 1) {
        // so index 0, the first element in our array of slides, is slideNum - 1
        // add animation class, setTimeout, remove it. This creates "transition in" effect

        slide.style.display = "initial";
        slide.setAttribute("display", "initial");
        slide.classList.add("slideIn");
        setTimeout(() => {
          slide.classList.remove("slideIn");
        }, 300);
      } else if (index === slideNum - 2) {
        // when we bump up the slide number, the slide which equals slideNum - 2 is the one
        // we are transitioning FROM, so add "transition out" class and display is set to false

        slide.classList.add("slideOut");
        setTimeout(() => {
          slide.classList.remove("slideOut");
        }, 300);
        // as long as this class is visible, we'll apply an animation. Otherwise we will leave it be.
        // add animation class, setTimeout, remove it. This creates "transition in" effect

        slide.style.display = "none";
        slide.setAttribute("display", "none");
      }
    }

    console.log("slideNum: ", slideNum);
  }, [slideNum]);

  const SaveButton = () => {
    return (
      <button
        style={{ backgroundColor: "green", color: "white" }}
        type="button"
        disabled={
          (slideNum === 4 && !termsAgreed) ||
          (slideNum === 5 && !verifyPhotoName) ||
          (slideNum === 2 &&
            !sameDayChecked &&
            !nextDayChecked &&
            !weeklyChecked)
        }
        onClick={() => {
          saveSlide(slideNum);
        }}
      >
        {slideNum === 5 ? "Request Verification" : "Save and Continue"}
      </button>
    );
  };

  const [sameDayChecked, setSameDayChecked] = useState(true);
  const [nextDayChecked, setNextDayChecked] = useState(true);
  const [weeklyChecked, setWeeklyChecked] = useState(false);

  return (
    <div
      id="agentSignUp"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-evenly",
      }}
    >
      <div style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
        <h2>Become an Agent in Just 5 Steps</h2>
      </div>
      <div style={{ flexDirection: "column", justifyContent: "space-evenly" }}>
        <div id="slide-one" style={{ display: "none" }}>
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
          <div id="language-option">
            <p>Which languages do you speak?</p>

            <input
              id="english-checkbox"
              type="checkbox"
              checked={englishChecked}
              onChange={() => {
                setEnglishChecked(!englishChecked);
              }}
            />
            <label for="english-checkbox">English</label>
            <input
              id="spanish-checkbox"
              type="checkbox"
              checked={spanishChecked}
              onChange={() => {
                setSpanishChecked(!spanishChecked);
              }}
            />
            <label for="spanish-checkbox">Spanish</label>
            {langArray.map((lang) => (
              <div style={{ flexDirection: "row" }}>
                <input
                  id={`extra-lang-checkbox-${lang}`}
                  type="checkbox"
                  checked={true}
                />
                <label for={`extra-lang-checkbox-${lang}`}>{lang}</label>

                <button
                  type="button"
                  style={{ backgroundColor: "red", color: "white" }}
                  onClick={() => {
                    removeLang(lang);
                  }}
                >
                  X
                </button>
              </div>
            ))}
            <div style={{ flexDirection: "row" }}>
              <input
                type="text"
                placeholder="Language"
                value={langString}
                onChange={(e) => setLangString(e.target.value)}
              ></input>
              <button type="button" onClick={() => addLangInput()}>
                Add Language
              </button>
            </div>
          </div>
          <SaveButton num="1" />
        </div>
        <div id="slide-two" style={{ display: "none" }}>
          <p>2. How far are you willing to travel?</p>
          <p>{`I'm willing to travel ${travelDist} for a gig.`}</p>
          <select
            type="select"
            onChange={(e) => {
              setTravelDist(e.target.value);
            }}
          >
            <option value="5 mi.">{"5 mi."}</option>
            <option value="10 mi.">{"10 mi."}</option>
            <option value="25 mi.">{"25 mi."}</option>
            <option value="50 mi.">{"50 mi."}</option>
            <option value="100 mi.">{"100 mi."}</option>
            <option value="250 mi.">{"250 mi."}</option>
          </select>
          <br></br>
          <p>What's your availability?</p>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              margin: "0 auto",
              position: "relative",
            }}
          >
            <input
              id="sameday-input"
              type="checkbox"
              checked={sameDayChecked}
              onChange={() => {
                setSameDayChecked(!sameDayChecked);
              }}
            />
            <label for="sameday-input">Same-Day Booking</label>
            <input
              id="nextday-input"
              type="checkbox"
              checked={nextDayChecked}
              onChange={() => {
                setNextDayChecked(!nextDayChecked);
              }}
            />
            <label for="sameday-input">Next-Day Booking</label>
            <input
              id="weekly-input"
              type="checkbox"
              checked={weeklyChecked}
              onChange={() => {
                setWeeklyChecked(!weeklyChecked);
              }}
            />
            <label for="sameday-input">Up to one week in advance</label>
          </div>

          <SaveButton num="2" />
        </div>
        <div id="slide-three" style={{ display: "none" }}>
          <div style={{ flexDirection: "row" }}>
            <p>3. How much do you charge per day?</p>
            <input
              type="text"
              placeholder="full day"
              value={fullDayPay}
              onChange={(e) => {
                setFullDayPay(e.target.value);
              }}
            ></input>
          </div>
          <div style={{ flexDirection: "row" }}>
            <p>Per half day?</p>
            <input
              type="text"
              placeholder="half day"
              value={halfDayPay}
              onChange={(e) => {
                setHalfDayPay(e.target.value);
              }}
            ></input>
          </div>
          <SaveButton num="3" />
        </div>
        <div id="slide-four" style={{ display: "none" }}>
          <div
            style={{
              maxHeight: "100vh",
              maxWidth: "100vw",
              overflowY: "scroll",
            }}
          >
            <TermsOfService />
            <VisibilitySensor>
              {({ isVisible }) => {
                if (isVisible) {
                  setTermsScrolled(true);
                }

                return <div id="nillDiv">*** end ***</div>;
              }}
            </VisibilitySensor>
          </div>
          <button
            disabled={!termsScrolled}
            type="button"
            onClick={() => setTermsAgreed(true)}
          >
            Agree
          </button>
          <SaveButton num="4" />
        </div>
        <div id="slide-five" style={{ display: "none" }}>
          {userAccessCode ? (
            <div>
              <p>
                5. Upload a photo of yourself holding up this unique code:
                <span style={{ fontWeight: "bold" }}>{userAccessCode}</span>
              </p>
              <img
                id="user-access-example-img"
                alt="user access example"
                src="https://firebasestorage.googleapis.com/v0/b/j-collection.appspot.com/o/agent-verification-photos%2Fjk-user-sign-up-example.jpeg?alt=media&token=d8689e2a-aca9-4fdb-a00f-cf26fc2a2e95"
              />
            </div>
          ) : (
            <p>
              Error retrieving user access code. Please refresh the page and try
              again.
            </p>
          )}
          {verifyPhotoName && <p>{verifyPhotoName}</p>}
          <FilePicker
            extensions={["jpg", "png"]}
            onChange={(FileObject) => {
              setVerifyPhoto(FileObject);
              setVerifyPhotoName(FileObject.name);
            }}
            onError={(errMsg) => console.log(errMsg)}
          >
            <button>Choose File</button>
          </FilePicker>
          <input type="file" />
          <SaveButton num="5" />
        </div>
      </div>
    </div>
  );
};

export default AgentSignUp;
