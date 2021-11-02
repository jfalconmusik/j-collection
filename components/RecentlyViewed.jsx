import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
// import Flexbox from "flexbox-react";
import { Context } from "../Context";
// import PreloadImage from "react-preload-image";

function RecentlyViewed() {
  const {
    previouslyViewed,
    setPreviouslyViewed,
    isLargeScreen,
    isPortrait,
    onProductPage,
    styleColors,
  } = useContext(Context);

  const [reversed, setReversed] = useState([]);

  useEffect(() => {
    setReversed(previouslyViewed.reverse());
  }, [previouslyViewed]);

  const [responsiveHeight, setResponsiveHeight] = useState("");

  useEffect(() => {
    let num = Number(reversed.length * 200);
    let numString = num.toString();
    setResponsiveHeight(`${numString}px`);
  }, [reversed]);

  if (reversed.length > 0) {
    return (
      <div
        style={{
          position: "relative",
          maxWidth: "75%",
          margin: "0 auto",
          marginTop: "2em",
          marginBottom: "2em",
          maxHeight: `${isLargeScreen ? "15em" : "200em"}`,
          // "height": `${isLargeScreen ? "initial" : responsiveHeight}`,
          zIndex: "89",
          //   left: `${!isPortrait ? "-15vw" : "15vw"}`,
        }}
        className="centered shadowed roundedDark"
      >
        <h4>Recently Viewed...</h4>
        <div
          style={{
            display: "flex",
            flexDirection: `${isLargeScreen ? "row" : "column"}`,
          }}
        >
          {reversed.map((item) => {
            if (reversed.indexOf(item) < 10) {
              if (item[2].includes("product")) {
                if (onProductPage) {
                  return (
                    <Link
                      to={`${item[2]}`}
                      style={{
                        margin: "1em",
                        left: `${isLargeScreen ? "initial" : "5%"}`,
                      }}
                    >
                      <div style={{ flexDirection: "column" }}>
                        <img
                          alt=""
                          className={`${!isLargeScreen && "centered"}`}
                          width="100em"
                          height="auto"
                          src={item[1]}
                        />
                        <p
                          style={{ color: styleColors.hotPink }}
                          className="pinkText"
                        >
                          {item[0]}
                        </p>
                      </div>
                    </Link>
                  );
                } else {
                  return (
                    <Link
                      to={`/product/${item[2]}`}
                      style={{
                        margin: "1em",
                        left: `${isLargeScreen ? "initial" : "5%"}`,
                      }}
                    >
                      <div style={{ flexDirection: "column" }}>
                        <img
                          className={`${!isLargeScreen && "centered"}`}
                          width="100em"
                          height="auto"
                          src={item[1]}
                        />
                        <p
                          style={{ color: styleColors.hotPink }}
                          className="pinkText"
                        >
                          {item[0]}
                        </p>
                      </div>
                    </Link>
                  );
                }
              } else {
                if (onProductPage) {
                  return (
                    <Link
                      to={`${item[2]}`}
                      style={{
                        margin: "1em",
                        left: `${isLargeScreen ? "initial" : "5%"}`,
                      }}
                    >
                      <div style={{ flexDirection: "column" }}>
                        <img width="100em" height="auto" src={item[1]} />
                        <p
                          style={{ color: styleColors.hotPink }}
                          className="pinkText"
                        >
                          {item[0]}
                        </p>
                      </div>
                    </Link>
                  );
                } else {
                  return (
                    <Link
                      to={`/product/${item[2]}`}
                      style={{
                        margin: "1em",
                        left: `${isLargeScreen ? "initial" : "5%"}`,
                        position: `${isLargeScreen ? "initial" : "relative"}`,
                      }}
                    >
                      <div style={{ flexDirection: "column" }}>
                        <img
                          style={{
                            left: `${isLargeScreen ? "initial" : "5%"}`,
                            position: `${
                              isLargeScreen ? "initial" : "relative"
                            }`,
                          }}
                          width="100em"
                          height="auto"
                          src={item[1]}
                        />
                        <p
                          style={{ color: styleColors.hotPink }}
                          className="pinkText"
                        >
                          {item[0]}
                        </p>
                      </div>
                    </Link>
                  );
                }
              }
            }
          })}
        </div>
      </div>
    );
  } else {
    return <div style={{ display: "none" }}></div>;
  }
}

export default RecentlyViewed;
