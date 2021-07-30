import React, { useContext, useEffect } from "react";
// import StripeCheckout from "react-stripe-checkout"

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Context } from "../Context";
import CheckoutForm from "./CheckoutForm";
import firebase from "firebase";
import Flexbox from "flexbox-react";

function Checkout() {
  const {
    stripePromise,
    displayPayPal,
    payPalHeightArr,
    payPalCost,
    setPayPalSuccess,
    setItemList,
    itemList,
    setAnonList,
    setFinalItemList,
    setSpinnerDisplayed,
    updateDatabaseOrders,
    modifyTotalPrice,
    modifyCartCount,
    stripeDisplayed,
    setStripeDisplayed,
    displayStripe,
    isLargeScreen,
    storeCreditExceedsCost,
    setStoreCreditExceedsCost,
    totalCost,
    storeCredit,
    changeAmount,
    setChangeAmount,
    handleAllCredit,
    modStoreCredit,
    isPortrait,
    isSmallScreen,
  } = useContext(Context);

  function closeStoreCreditModal() {
    setChangeAmount(false);
    document.getElementById("storeCreditModal").style.display = "none";
  }

  return (
    <div
      className="rounded"
      style={{
        width: `${isPortrait || isSmallScreen ? "90vw" : "60vw"}`,
        height: `80vh`,
        margin: "0 auto",
        position: "fixed",
        // left: "50vw",
        right: `${isPortrait || isSmallScreen ? "5vw" : "20vw"}`,
        // top: "50vh",
        zIndex: "99",
        bottom: "12vh",
      }}
    >
      <div>
        <Elements
          className="centered"
          style={{ width: "99%" }}
          stripe={stripePromise}
        >
          <div
            className="roundedLight"
            style={{
              //   width: `${isPortrait || isSmallScreen ? "80vw" : "50vw"}`,
              width: "80vw",
              //   width: `${isLargeScreen ? "45%" : "99%"}`,
              top: "3vh",
              height: "70vh",
              //   right: "110%",
              margin: "0 auto",
              position: "relative",
              //   left: "50vw",
              //   right: "50vw",
              //   top: "50vh",
              bottom: "3vh",
              zIndex: "99",
              //   left: `${isLargeScreen ? "30vw" : "2vw"}`,
              // "paddingRight": "-6vw"
              // "margin-bottom": "5em",
              // "bottom": "5em"
            }}
          >
            <Flexbox
              style={{
                // "margin-left": "11vw",
                position: "relative",
              }}
              flexDirection="column"
            >
              <CheckoutForm
                className="centered"
                style={{
                  width: "100%",
                  left: "10vw",
                  position: "relative",
                }}
              />
            </Flexbox>
          </div>
        </Elements>
        <div
          className={`storeCreditModal ${!isLargeScreen && "centered"}`}
          id="storeCreditModal"
          style={{
            display: "none",
            "box-shadow": "0px 0px 5px white",
            maxWidth: `${window.innerWidth}`,
            zIndex: "99",
            top: `${isLargeScreen ? "16.5vw" : "50vw"}`,
            left: `${isLargeScreen ? "30vw" : "5vw"}`,
          }}
        >
          {!storeCreditExceedsCost && (
            <p>
              Would you like to use your store credit of $
              {(Number(storeCredit) / 100).toFixed(2)}?
            </p>
          )}
          {storeCreditExceedsCost && (
            <p>
              Would you like to use ${(Number(totalCost) / 100).toFixed(2)} of
              your store credit?
            </p>
          )}
          {changeAmount && (
            <div>
              <input
                id="modStoreCreditInput"
                type="number"
                min="0"
                max={`${Number(storeCredit) / 100}`}
              ></input>
            </div>
          )}
          {!changeAmount && (
            <button
              type="button"
              style={{ width: "3em", margin: "1em" }}
              className="storeCreditModalButton button primary"
              id="storeCreditModalButton"
              onClick={() => {
                handleAllCredit();
                closeStoreCreditModal();
              }}
            >
              Yes
            </button>
          )}
          {changeAmount && (
            <div style={{ width: "6em" }}>
              <button
                type="button"
                onClick={() => {
                  modStoreCredit();
                  closeStoreCreditModal();
                }}
              >
                Accept Amount
              </button>
            </div>
          )}
          {!changeAmount && (
            <button
              type="button"
              style={{ width: "6em", margin: "1em" }}
              className="storeCreditModalButton button primary"
              id="storeCreditModalButton"
              onClick={() => {
                setChangeAmount(true);
              }}
            >
              Change Amount
            </button>
          )}
          <button
            type="button"
            style={{ width: "3em", margin: "1em" }}
            className="storeCreditModalButton button primary"
            id="storeCreditModalButton"
            onClick={() => {
              closeStoreCreditModal();
            }}
          >
            No
          </button>
        </div>
        <br></br>
        <br></br>
      </div>
    </div>
  );
}

export default Checkout;
