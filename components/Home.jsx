import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../Context";

function Home() {
  const { uid, agentObj, infoLoaded, isAgent, userName, isOnAgentSite } =
    useContext(Context);

  if (infoLoaded && isAgent && agentObj && agentObj.uid) {
    return (
      <div
        style={{
          display: "inline-block",
          minHeight: "500px",
          maxWidth: "80vw",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            flexDirection: "column",
            margin: "0 auto",
            position: "relative",
            marginTop: "100px",
          }}
        >
          <p>Welcome back, {agentObj.address[0]}</p>

          <div
            width="100px"
            style={{ position: "relative", top: "700px", right: "200px" }}
          >
            <Link to={`/agent-console/${agentObj.uid}`}>
              <button
                type="button"
                style={{
                  color: "white",
                  backgroundColor: "hotpink",
                  borderRadius: "15px",
                  border: "none",
                  fontSize: "x-large",
                }}
              >
                Go to Agent Console
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  } else if (infoLoaded && (!isAgent || !isOnAgentSite) && uid) {
    return (
      <div
        style={{
          display: "inline-block",
          minHeight: "500px",
          maxWidth: "80vw",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            flexDirection: "column",
            margin: "0 auto",
            position: "relative",
            marginTop: "100px",
          }}
        >
          <p>Welcome back, {userName.firstName}</p>
          <br></br>
          <p>
            Welcome to JK Domestic Collection, the best marketplace for
            housekeepers and domestics in the greater NYC area.
          </p>
          <br></br>
          <p>Do you live in New York City and are just itching to declutter?</p>
          <img
            style={{
              top: "200px",
              position: "relative",
              width: "700px",
              left: "75px",
            }}
            src="https://i.ibb.co/YyRqctS/With-care-Professional-maid-holding-cleaning-liquid-in-left-hand-and-standing-close-to-chest-of-draw.jpg"
            alt="With-care-Professional-maid-holding-cleaning-liquid-in-left-hand-and-standing-close-to-chest-of-draw"
            border="0"
          />
          <div
            width="100px"
            style={{ position: "relative", top: "700px", right: "200px" }}
          >
            <Link to="/browse">
              <button
                type="button"
                style={{
                  color: "white",
                  backgroundColor: "hotpink",
                  borderRadius: "15px",
                  border: "none",
                  fontSize: "x-large",
                }}
              >
                Get Service Now
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div
        style={{
          display: "inline-block",
          minHeight: "500px",
          maxWidth: "80vw",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            margin: "0 auto",
            position: "relative",
            flexDirection: "column",
          }}
        >
          <p>
            Welcome to JK Domestic Collection, the best marketplace for
            housekeepers and domestics in the greater NYC area.
          </p>
          <br></br>
          <p>Do you live in New York City and are just itching to declutter?</p>
          <img
            style={{
              top: "200px",
              position: "relative",
              width: "700px",
              left: "75px",
            }}
            src="https://i.ibb.co/YyRqctS/With-care-Professional-maid-holding-cleaning-liquid-in-left-hand-and-standing-close-to-chest-of-draw.jpg"
            alt="With-care-Professional-maid-holding-cleaning-liquid-in-left-hand-and-standing-close-to-chest-of-draw"
            border="0"
          />
          <div
            width="100px"
            style={{ position: "relative", top: "700px", right: "200px" }}
          >
            <Link to="/browse">
              <button
                type="button"
                style={{
                  color: "white",
                  backgroundColor: "hotpink",
                  borderRadius: "15px",
                  border: "none",
                  fontSize: "x-large",
                }}
              >
                Get Service Now
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
