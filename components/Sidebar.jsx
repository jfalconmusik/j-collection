import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../Context";

const Sidebar = () => {
  const {
    sidebarOpen,
    setSidebarOpen,
    isSafari,
    handleSidebar,
    styleColors,
    isOnAgentSite,
    onHomeScreen,
    uid,
    onBrowse,
    setOnHomeScreen,
    setOnBrowse,
    setOnAccount,
    onAccount,
    isAgent,
    isPendingVerification,
    requestRejected,
    setShowModalCenter,
    setShowRejected,
    setIsOnAgentSite,
    isPortrait,
  } = useContext(Context);

  return (
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
      {isOnAgentSite ? (
        <div
          style={{
            pointerEvents: "none",
            position: "relative",
            justifyContent: "space-between",
            flexDirection: "column",
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
                color: `${onHomeScreen ? styleColors.maroon : "black"}`,
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
            flexDirection: "column",
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
                color: `${onHomeScreen ? styleColors.maroon : "black"}`,
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
          {uid && !isAgent && !requestRejected && (
            <div
              style={{
                position: "relative",
                top: "200px",
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
                top: "200px",
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
                  width: "150px",
                  marginRight: "-30px",
                  pointerEvents: "all",
                  textDecoration: "none",
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
                top: "200px",
              }}
            >
              <button
                type="button"
                disabled={isPendingVerification}
                onClick={() => setIsOnAgentSite(true)}
                style={{
                  whitespace: "no-wrap",
                  width: "150px",
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
                top: "200px",
              }}
            >
              <button
                type="button"
                disabled={isPendingVerification}
                onClick={() => setIsOnAgentSite(false)}
                style={{
                  whitespace: "no-wrap",
                  width: "150px",
                  marginRight: "-30px",
                  pointerEvents: "all",
                  textDecoration: "none",
                }}
              >
                <Link to="/">View User Site</Link>
              </button>
            </div>
          )}
          <div
            className="column"
            style={{
              position: "relative",
              pointerEvents: "none",
              // "max-height": "3.5em",
              margin: "0 auto",
            }}
          >
            {isPortrait ? (
              <img
                style={{ zIndex: "90" }}
                width="42px"
                src="https://i.ibb.co/wpP9R9W/magnifying-glass.png"
                alt="search button magnifying glass"
              ></img>
            ) : (
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
        </div>
      )}
    </div>
  );
};

export default Sidebar;
