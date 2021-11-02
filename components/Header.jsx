import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
// import firebase from "firebase";
import { Context } from "../Context.js";
// import Flexbox from "flexbox-react";

function Header() {
  const {
    accountTitleString,
    userInfo,
    itemList,
    isLargeScreen,
    isSmallScreen,
    isPortrait,
    sidebarOpen,
    setSidebarOpen,
    setShowMenuHome,
    isSafari,
    handleSidebar,
    setOnAccount,
    setOnBrowse,
    onHomeScreen,
    onAccount,
    onBrowse,
    setOnHomeScreen,
    styleColors,
    setShowMenuShop,
    uid,
    isPendingVerification,
    isAgent,
    isOnAgentSite,
    setIsOnAgentSite,
    requestRejected,
    setRequestRejected,
    setShowModalCenter,
    setShowRejected,
    agentDoc,
    isBigScreen,
  } = useContext(Context);

  return (
    <header
      id="header"
      className="column"
      style={{
        justifyContent: "space-around",
        margin: "0 auto",
        width: "100vw",

        backgroundColor: `${isOnAgentSite ? styleColors.altPink : "white"}`,
      }}
    >
      {/* first header row - includes search bar, logo, and social icons */}
      <div
        className="row"
        style={{
          right: "6vw",
          position: "relative",
          margin: "0 auto",
          justifyContent: "space-evenly",
          maxWidth: "100vw",
          marginTop: "0",
          top: "5vh",
          pointerEvents: "none",
        }}
      >
        <div className="column" style={{ pointerEvents: "none" }}>
          {/* search bar for large screen */}
        </div>
        {/* logo */}
        <div
          className="column"
          style={{
            justifyContent: "space-around",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              zIndex: "99",
              position: "relative",
              margin: "0 auto",
              display: "flex",
              flexDirection: "row",
              top: "100px",
              justifyContent: "center",
            }}
          >
            <button
              onClick={() => handleSidebar()}
              style={{
                "z-index": "99",
                "font-size": "larger",
                // top: ".75em",
                float: "right",

                width: "8vw",
                height: "10vw",
                position: "relative",
                color: "pink",
                backgroundColor: "white",
                pointerEvents: "all",
                // paddingRight: "-50px",
                display: `${isPortrait ? "initial" : "none"}`,
              }}
              data-toggle="example-menu"
              className="hide-for-large menu-icon"
              type="button"
            >
              ☰
            </button>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Link
                className="headerItem"
                to="/"
                onMouseOver={() => setShowMenuHome(true)}
              >
                <img
                  style={{
                    // transform: "scale(3)",
                    pointerEvents: "all",
                    position: "relative",
                    overflow: "hidden",
                    height: "150px",
                    width: "400px",
                    objectFit: "cover",
                    margin: "0 auto",
                  }}
                  className="logo"
                  src="https://i.ibb.co/xzRRZyf/untitled-1.png"
                  alt="j collection logo"
                ></img>
              </Link>
              <div
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  margin: "0 auto",
                  display: "flex",
                  bottom: "300px",
                  position: "relative",
                }}
              >
                {isOnAgentSite ? (
                  <div
                    style={{
                      pointerEvents: "none",
                      position: "relative",
                      justifyContent: "space-between",
                      flexDirection: "row",
                      textDecoration: "none",
                      margin: "0 auto",
                    }}
                    // onMouseOver={() => setShowMenuShop(true)}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Link
                        // onClick={() => setOnHomeScreen(true)}
                        style={{
                          color: `${
                            onHomeScreen ? styleColors.maroon : "black"
                          }`,
                          "overflow-x": "hidden",
                          // visibility: `${listItemDisplay}`,
                          "font-size": "xx-large",
                          position: "relative",
                          padding: "30px",
                          paddingBottom: "15px",
                          textDecoration: "none",
                          zIndex: "98",
                          pointerEvents: "all",
                        }}
                        to={`/agent-appointments/${uid}`}
                      >
                        <span className="shimmerText">Jobs</span>
                      </Link>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <Link
                        // onClick={() => setOnAccount(true)}
                        style={{
                          "overflow-x": "hidden",
                          // visibility: `${listItemDisplay}`,
                          "font-size": "xx-large",
                          position: "relative",
                          padding: "30px",
                          paddingBottom: "15px",
                          textDecoration: "none",
                          // color: `${onAccount ? styleColors.maroon : "black"}`,
                          zIndex: "99",
                          pointerEvents: "all",
                        }}
                        to="/agent-console"
                      >
                        <span className="shimmerText">Console</span>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      pointerEvents: "none",
                      position: "relative",
                      justifyContent: "space-between",
                      flexDirection: "row",
                      // maxWidth: `${isPortrait ? "100vw" : "50vw"}`,
                      textDecoration: "none",
                      margin: "0 auto",
                    }}
                    // onMouseOver={() => setShowMenuShop(true)}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                      }}
                    >
                      <Link
                        onClick={() => setOnHomeScreen(true)}
                        style={{
                          color: `${
                            onHomeScreen ? styleColors.maroon : "black"
                          }`,
                          "overflow-x": "hidden",
                          // visibility: `${listItemDisplay}`,
                          "font-size": "xx-large",
                          position: "relative",
                          padding: "30px",
                          paddingBottom: "15px",
                          textDecoration: "none",
                          zIndex: "98",
                          pointerEvents: "all",
                        }}
                        to={`/user-appointments/${uid}`}
                      >
                        <span className="shimmerText">Appointments</span>
                      </Link>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <Link
                        onClick={() => setOnBrowse(true)}
                        style={{
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
                        to="/browse"
                        // className="show-for-large"
                        id="shopId"
                      >
                        <span className="shimmerText">Browse</span>
                      </Link>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <Link
                        onClick={() => setOnAccount(true)}
                        style={{
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
                        <span className="shimmerText">Account</span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div
              style={{
                position: "relative",
                top: "75px",
              }}
            >
              {uid && !isAgent && !requestRejected && (
                <div
                  style={{
                    position: "relative",
                  }}
                >
                  <button
                    type="button"
                    disabled={isPendingVerification}
                    style={{
                      whitespace: "no-wrap",
                      width: "150px",
                      marginRight: "-30px",
                      pointerEvents: "all",
                      textDecoration: "none",
                    }}
                  >
                    {isPendingVerification ? (
                      "In Review"
                    ) : (
                      <Link to="/agent-sign-up">Create Agent Account</Link>
                    )}
                  </button>
                </div>
              )}
              {uid && !isAgent && requestRejected && (
                <div
                  style={{
                    position: "relative",
                  }}
                >
                  <button
                    onClick={() => {
                      setShowModalCenter(true);
                      setShowRejected(true);
                    }}
                    type="button"
                    style={{
                      whitespace: "no-wrap",
                      marginRight: "-30px",
                      pointerEvents: "all",
                      textDecoration: "none",
                      marginTop: `${
                        !isPortrait || isLargeScreen ? "" : "30px"
                      }`,
                    }}
                  >
                    <img
                      style={{ width: "15px", height: "15px" }}
                      src="https://firebasestorage.googleapis.com/v0/b/j-collection.appspot.com/o/icons%2Fexclamation.jpg?alt=media&token=b0a827ba-7d62-4f20-8bc8-5ea2bc871aa4"
                      alt="!!!"
                    />
                  </button>
                </div>
              )}
              {uid && isAgent && !isOnAgentSite && (
                <div
                  style={{
                    position: "relative",
                  }}
                >
                  <button
                    type="button"
                    disabled={isPendingVerification}
                    onClick={() => setIsOnAgentSite(true)}
                    style={{
                      whitespace: "no-wrap",
                      marginRight: "-30px",
                      pointerEvents: "all",
                      textDecoration: "none",
                    }}
                  >
                    <Link to="/agent-console">Agent Console</Link>
                  </button>
                </div>
              )}
              {uid && isAgent && isOnAgentSite && (
                <div
                  style={{
                    position: "relative",
                  }}
                >
                  <button
                    type="button"
                    disabled={isPendingVerification}
                    onClick={() => setIsOnAgentSite(false)}
                    style={{
                      whitespace: "no-wrap",
                      marginRight: "-30px",
                      pointerEvents: "all",
                      textDecoration: "none",
                    }}
                  >
                    <Link to="/">View User Site</Link>
                  </button>
                </div>
              )}
            </div>
          </div>
          {/* inner row for links */}
        </div>
        {/* social media icons */}

        <div
          className="column"
          style={{
            position: "relative",
            pointerEvents: "none",
            // "max-height": "3.5em",
            margin: "0 auto",
          }}
        >
          {isPortrait && (
            <div className="row headerItem" style={{ zIndex: "90" }}>
              <img
                className="socialIcon"
                width="20px"
                alt="pinterest"
                src="https://i.ibb.co/5Bb3gHX/pinterest-social-logo.png"
              />
              <img
                className="socialIcon"
                width="20px"
                src="https://i.ibb.co/MhrzBKH/twitter.png"
                alt="twitter"
                border="0"
              />
              <img
                className="socialIcon"
                width="20px"
                src="https://i.ibb.co/gP4RKF8/facebook.png"
                alt="facebook"
                border="0"
              />
              <img
                className="socialIcon"
                width="20px"
                src="https://i.ibb.co/nMcYrk9/instagram.png"
                alt="instagram"
                border="0"
              />
            </div>
          )}
        </div>
        {/* sidebar button if mobile */}
      </div>
    </header>
  );
}

export default Header;
