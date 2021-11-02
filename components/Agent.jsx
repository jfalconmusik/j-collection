import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import Lottie from "react-lottie-player";
import loadingData from "../8682-loading.json";
import { Context } from "../Context.js";
import { getDownloadURL, getStorage, ref } from "firebase/storage";

const Agent = () => {
  //
  //
  //
  // just to be clear, this is how a USER will see the agent page.
  //
  //
  //
  const {
    agentDoc,
    isLargeScreen,
    retrieveAgentDoc,
    setShowModalCenter,
    setIsCheckAvailability,
    bookAgent,
    isOnAgentSite,
    infoLoaded,
    setIsOnAgentSite,
    isPortrait,
    isSmallScreen,
  } = useContext(Context);

  // const firebaseConfig = {
  //   apiKey: "AIzaSyC7kQoX5Lo4Qxe0KS4ZK_ZqYMJKtz0IrVg",
  //   authDomain: "j-collection.firebaseapp.com",
  //   databaseURL: "https://j-collection-default-rtdb.firebaseio.com",
  //   projectId: "j-collection",
  //   storageBucket: "j-collection.appspot.com",
  //   messagingSenderId: "35357744009",
  //   appId: "1:35357744009:web:fc01e5560a16a936b35f58",
  //   measurementId: "G-2ZXZ0QBYV1",
  // };

  // // Initialize Firebase
  // const app = initializeApp(firebaseConfig);
  const storage = getStorage();

  const [pageNum, setPageNum] = useState(0);
  const handlePageNum = (operation) => {
    if (
      operation == "next" &&
      agentDoc.agentPhotos.length <= (pageNum + 1) * 5
    ) {
      pageNum++;
    } else if (operation == "previous" && pageNum > 0) {
      pageNum--;
    } else if (
      typeof operation == "number" &&
      operation > 0 &&
      agentDoc.agentPhotos.length <= (operation + 1) * 5
    ) {
      setPageNum(operation);
    }
  };

  const numArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const [ratingArray, setRatingArray] = useState([]);

  const location = useLocation();

  const [agentId, setAgentId] = useState("");

  const [cost, setCost] = useState(0);

  const [agentSchedule, setAgentSchedule] = useState([]);

  useEffect(() => {
    let id = location.pathname.split("/")[2];
    console.log("location based agent id: ", id);
    setAgentId(id);
  }, [location]);

  useEffect(() => {
    console.log("agent booking page loaded");
    if (
      agentId &&
      (agentDoc.uid !== agentId ||
        agentDoc.uid === undefined ||
        !agentDoc.uid ||
        !agentDoc)
    ) {
      console.log(
        "either no previous document loaded, or the user has selected a new agent"
      );
      retrieveAgentDoc(agentId);
    }
  }, [agentId]);

  useEffect(() => {
    setIsOnAgentSite(false);
    if (agentDoc) {
      getDownloadURL(ref(storage, agentDoc.profilePhoto))
        .then((downloadURL) => {
          document
            .getElementById("profile-photo")
            .setAttribute("src", downloadURL);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [agentDoc]);

  useEffect(() => {
    let newArr = [];
    for (let i = 0; i < Math.floor(Number(agentDoc.rating)); i++) {
      newArr.push(i);
    }
    setRatingArray(newArr);
  }, [agentDoc]);

  if (!infoLoaded || !agentDoc || !agentDoc.uid) {
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
            {agentDoc && agentDoc.address && (
              <h2
                style={{ fontFamily: "luminari" }}
              >{`${agentDoc.address[0]} ${agentDoc.address[1]}`}</h2>
            )}
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
                  <div
                    className="userAccount"
                    style={{ display: "flex", flexDirection: "column" }}
                  >
                    <div className="innerBox">
                      {agentDoc && agentDoc.createTime && (
                        <h2 className="userInfo">{`Agent since: ${agentDoc.createTime}`}</h2>
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
                        <img
                          className="accountPhoto"
                          id="profile-photo"
                          src=""
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

                    {agentDoc &&
                    agentDoc.agentPhotos &&
                    agentDoc.agentPhotos.length > 0 ? (
                      <div
                        className="google"
                        style={{
                          display: "flex",
                          flexDirection: `${
                            isPortrait || isSmallScreen ? "column" : "row"
                          }`,
                          textAlign: "left",
                          margin: "0 auto",
                          position: "relative",
                          padding: "10px",
                        }}
                      >
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <div
                            style={{
                              display: "flex",
                              flexDirection: `${
                                isPortrait || isSmallScreen ? "column" : "row"
                              }`,
                            }}
                          >
                            {agentDoc.agentPhotos.map((item, i) => {
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
                                  <img
                                    alt="home"
                                    src=""
                                    id={photoId}
                                    style={{ height: "200px", width: "200px" }}
                                  />
                                );
                              } else {
                                return <span></span>;
                              }
                            })}
                          </div>

                          <div
                            style={{ display: "flex", flexDirection: "row" }}
                          >
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
                                  {agentDoc.agentPhotos.length <= index * 5 &&
                                  agentDoc.agentPhotos.length >
                                    (index - 1) * 5 &&
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
                        <p>Agent has no photos</p>
                      </div>
                    )}
                    <br></br>

                    <div className="itemCard"></div>
                  </div>
                </div>

                <br></br>
                <br></br>
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
                        {agentDoc && agentDoc.payRate && (
                          <p>Full day rate: {agentDoc.payRate.fullDay}</p>
                        )}
                        {agentDoc && agentDoc.payRate && (
                          <p>Half day rate: {agentDoc.payRate.halfDay}</p>
                        )}
                      </div>
                      <p>Speaks...</p>
                      <div className="innerBox">
                        {agentDoc &&
                          agentDoc.languages &&
                          agentDoc.languages.english && <p>English</p>}
                        {agentDoc &&
                          agentDoc.languages &&
                          agentDoc.languages.spanish && <p>Spanish</p>}
                        {agentDoc &&
                          agentDoc.languages &&
                          agentDoc.languages.extraLanguages.map((language) => {
                            return <p>{language}</p>;
                          })}
                      </div>

                      <p>Skills...</p>
                      <div className="innerBox">
                        {agentDoc &&
                          agentDoc.skills &&
                          agentDoc.skills.cooking && <p>Cooking</p>}
                        {agentDoc &&
                          agentDoc.skills &&
                          agentDoc.skills.gardening && <p>Gardening</p>}
                        {agentDoc &&
                          agentDoc.skills &&
                          agentDoc.skills.housekeeping && <p>Housekeeping</p>}
                        {agentDoc &&
                          agentDoc.skills &&
                          agentDoc.skills.laundry && <p>Laundry</p>}
                        {agentDoc &&
                          agentDoc.skills &&
                          agentDoc.skills.extraSkills.map((skill) => {
                            return <p>{skill}</p>;
                          })}
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
                            agentDoc.currentRating ? agentDoc.currentRating : 0
                          }`}
                        </p>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <div>
                          {agentDoc &&
                          agentDoc.history &&
                          agentDoc.history.length > 0 ? (
                            <div>
                              <div>
                                <Link to={`/agent-history/${agentDoc.uid}`}>
                                  <button type="button">Agent History</button>
                                </Link>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <div>
                                <Link to={`/agent-history/${agentDoc.uid}`}>
                                  <button
                                    className="tooltip"
                                    disabled
                                    type="button"
                                  >
                                    Agent History
                                    <span className="tooltiptext">
                                      {`${
                                        agentDoc.address
                                          ? agentDoc.address[0]
                                          : "This agent"
                                      } `}
                                      hasn't had any appointments yet.
                                    </span>
                                  </button>
                                </Link>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        marginTop: "20px",
                        flexDirection: "column",
                        // "height": `${isLargeScreen ? "auto" : "3em"}`
                      }}
                      className="google"
                    >
                      {agentDoc.bookingPeriod &&
                        agentDoc.bookingPeriod.sameDay && (
                          <button onClick={() => bookAgent("today", cost)}>
                            Book Today!
                          </button>
                        )}
                      {agentDoc.bookingPeriod &&
                        agentDoc.bookingPeriod.nextDay && (
                          <button onClick={() => bookAgent("tomorrow", cost)}>
                            Book Tomorrow!
                          </button>
                        )}
                      {agentDoc.bookingPeriod && agentDoc.bookingPeriod.weekly && (
                        <button
                          onClick={() => {
                            setShowModalCenter(true);
                            setIsCheckAvailability(true);
                          }}
                        >
                          Check Availability
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <br></br>
        </div>
      </div>
    );
  }
};

export default Agent;
