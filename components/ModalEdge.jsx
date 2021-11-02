import React, { useEffect, useState, useContext } from "react";
import { Context } from "../Context.js";

const Modal = () => {
  const {
    isPortrait,
    isLargeScreen,
    isSmallScreen,
    modalExecute,
    modalText,
    styleColors,
    showModalEdge,
    setShowModalEdge,
  } = useContext(Context);
  return (
    <div
      className="modalEdge"
      id="modalEdge"
      style={{
        // top: `${isLargeScreen ? "40vw" : "80vw"}`,

        left: `${isPortrait || isSmallScreen ? "10vw" : "60vw"}`,
        bottom: `${isPortrait || isSmallScreen ? "5px" : "auto"}`,
        // marginRight: `${isPortrait || isSmallScreen ? "20px" : ""}`,
        fontSize: `${isLargeScreen ? "initial" : "small"}`,
        display: "none",
        "box-shadow": "0px 0px 5px white",
      }}
    >
      <p
        style={{
          left: `${isLargeScreen ? "initial" : "-5vw"}`,
        }}
      >
        {modalText}
      </p>
      <button
        type="button"
        className="modalEdgeButton button small"
        id="modalEdgeButton"
        style={{
          width: "5em",
          marginRight: "1em",
          backgroundColor: styleColors.hotPink,
        }}
        onClick={() => {
          setShowModalEdge(false);
          // turnOffModal();
        }}
      >
        OK
      </button>
    </div>
  );
};

export default Modal;
