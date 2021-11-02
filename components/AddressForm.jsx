import { getFunctions, httpsCallable } from "firebase/functions";
import React, { useState, useContext, useEffect } from "react";
import { Context } from "../Context";

const AddressForm = (props) => {
  const submitButton = props.submit;
  const photoUpload = props.photo;
  const editName = props.editName;
  console.log("props.submit = ", submitButton);
  const {
    isDesktopOrLaptop,
    saveAddress,
    isPortrait,
    profilePhoto,
    setProfilePhoto,
    savePhotoAndAddress,
    setIsSavePhoto,
    isSavePhoto,
    setShowModalCenter,
    userName,
  } = useContext(Context);

  const [address2, setAddress2] = useState(false);

  const [photoSaved, setPhotoSaved] = useState(false);

  // to be implemented later by listening to changes to each field
  const [addressComplete, setAddressComplete] = useState(true);

  const handleAddress2 = () => {
    setAddress2(!address2);
  };
  const functions = getFunctions();

  const [selectedState, setSelectedState] = useState("");
  const StateSelect = () => {
    return (
      <select
        id="state"
        value={selectedState}
        onChange={(e) => {
          setSelectedState(e.target.value);
        }}
      >
        <option value="AL">Alabama</option>
        <option value="AK">Alaska</option>
        <option value="AZ">Arizona</option>
        <option value="AR">Arkansas</option>
        <option value="CA">California</option>
        <option value="CO">Colorado</option>
        <option value="CT">Connecticut</option>
        <option value="DE">Delaware</option>
        <option value="DC">District Of Columbia</option>
        <option value="FL">Florida</option>
        <option value="GA">Georgia</option>
        <option value="HI">Hawaii</option>
        <option value="ID">Idaho</option>
        <option value="IL">Illinois</option>
        <option value="IN">Indiana</option>
        <option value="IA">Iowa</option>
        <option value="KS">Kansas</option>
        <option value="KY">Kentucky</option>
        <option value="LA">Louisiana</option>
        <option value="ME">Maine</option>
        <option value="MD">Maryland</option>
        <option value="MA">Massachusetts</option>
        <option value="MI">Michigan</option>
        <option value="MN">Minnesota</option>
        <option value="MS">Mississippi</option>
        <option value="MO">Missouri</option>
        <option value="MT">Montana</option>
        <option value="NE">Nebraska</option>
        <option value="NV">Nevada</option>
        <option value="NH">New Hampshire</option>
        <option value="NJ">New Jersey</option>
        <option value="NM">New Mexico</option>
        <option value="NY">New York</option>
        <option value="NC">North Carolina</option>
        <option value="ND">North Dakota</option>
        <option value="OH">Ohio</option>
        <option value="OK">Oklahoma</option>
        <option value="OR">Oregon</option>
        <option value="PA">Pennsylvania</option>
        <option value="RI">Rhode Island</option>
        <option value="SC">South Carolina</option>
        <option value="SD">South Dakota</option>
        <option value="TN">Tennessee</option>
        <option value="TX">Texas</option>
        <option value="UT">Utah</option>
        <option value="VT">Vermont</option>
        <option value="VA">Virginia</option>
        <option value="WA">Washington</option>
        <option value="WV">West Virginia</option>
        <option value="WI">Wisconsin</option>
        <option value="WY">Wyoming</option>
      </select>
    );
  };

  return (
    <div
      // onChange={() => {
      //   handleFocus(addressType);
      // }}
      className="google"
      style={{
        display: "flex",
        position: "relative",
        flexDirection: "column",
        width: "75vw",
        margin: "0 auto",
        justifyContent: "center",
        bottom: `${!editName ? "400px" : ""}`,
        maxHeight: `${!editName ? "80vh" : ""}`,
        overflowY: `${!editName ? "scroll" : ""}`,
      }}
      //   style={{
      //     "margin-left": `${isDesktopOrLaptop ? "auto" : "none"}`,
      //     "margin-right": `${isDesktopOrLaptop ? "50vw" : "none"}`,
      //   }}
    >
      <div
        style={{
          display: "flex",
          position: "relative",
          flexDirection: "column",
          width: "75vw",
          margin: "0 auto",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: `${
              isPortrait || !isDesktopOrLaptop ? "column" : "row"
            }`,
            width: `${isDesktopOrLaptop || !isPortrait ? "45vw" : "40vw"}`,
            margin: "0 auto",
          }}
        >
          <span
            style={{
              width: `${isDesktopOrLaptop ? "23vw" : "70vw"}`,
              display: "inline",
              margin: "1em",
            }}
          >
            <h4>First Name *</h4>
            {!editName ? (
              <input
                // onClick={() => {
                //   setFocusLocked(true);
                // }}
                id={`firstName`}
                type="text"
                required
              ></input>
            ) : (
              <input
                id={`firstName`}
                type="text"
                required
                disabled
                value={userName.firstName}
              ></input>
            )}
          </span>
          <span
            style={{
              width: `${isDesktopOrLaptop ? "23vw" : "70vw"}`,
              display: "inline",
              margin: "1em",
            }}
          >
            <h4>Last Name *</h4>

            {!editName ? (
              <input
                // onClick={() => {
                //   setFocusLocked(true);
                // }}
                // onClick={() => document.getElementById(`lastName${addressType}`).focus()}
                // onClick={() => setCanResize(false)}
                // onBlur={() => setCanResize(true)}
                id={`lastName`}
                onChange={(e) => {
                  document.getElementById(`lastName`).value = e.target.value;
                }}
                type="text"
                required
              ></input>
            ) : (
              <input
                id={`lastName`}
                type="text"
                required
                disabled
                value={userName.lastName}
              ></input>
            )}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: `${
              isPortrait || !isDesktopOrLaptop ? "column" : "row"
            }`,
            width: `${isDesktopOrLaptop || !isPortrait ? "45vw" : "40vw"}`,
            margin: "0 auto",
          }}
        >
          <span
            style={{
              width: `${isDesktopOrLaptop ? "23vw" : "70vw"}`,
              display: "inline",
              margin: "1em",
            }}
          >
            <h4 className="centered">Address *</h4>

            <input
              // onClick={() => {
              //   setFocusLocked(true);
              // }}
              // onClick={() => setCanResize(false)}
              // onBlur={() => setCanResize(true)}
              // width={isDesktopOrLaptop ? "22vw" : "70vw"}
              className="centered"
              id={`address1`}
              type="text"
              required
            ></input>

            <div
              className="centered"
              style={{
                display: "inline",
                // "bottom": "-3.5em",
                // "position": "absolute",
                // "right": "30vw",
                width: "10vw",
              }}
            >
              <button
                style={{
                  fontSize: `${isDesktopOrLaptop ? "medium" : "small"}`,
                  //   backgroundColor: styleColors.hotPink,
                }}
                className="button"
                type="button"
                onClick={() => {
                  handleAddress2();
                }}
              >
                {`${address2 ? "- Address 2" : " + Address 2"}`}
              </button>
            </div>
          </span>
          <span
            style={{
              width: "20vw",
              display: "inline",
              margin: "1em",
            }}
          >
            {address2 && (
              <div>
                <h4 style={{ whiteSpace: "nowrap" }} width="100%">
                  Address Line 2
                </h4>

                <input
                  // onClick={() => {
                  //   setFocusLocked(true);
                  // }}
                  // onClick={() => setCanResize(false)}
                  // onBlur={() => setCanResize(true)}
                  style={{}}
                  className="centered"
                  id={`address2`}
                  type="text"
                ></input>
              </div>
            )}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: `${
              isPortrait || !isDesktopOrLaptop ? "column" : "row"
            }`,
            width: `${isDesktopOrLaptop || !isPortrait ? "45vw" : "40vw"}`,
            margin: "0 auto",
          }}
        >
          <span
            style={{
              width: `${isDesktopOrLaptop || !isPortrait ? "20vw" : "70vw"}`,
              display: "inline",
              margin: "1em",
            }}
          >
            <h4 className="centered" style={{ alignContent: "center" }}>
              City *
            </h4>

            <input
              // onClick={() => {
              //   setFocusLocked(true);
              // }}
              // onClick={() => setCanResize(false)}
              // onBlur={() => setCanResize(true)}
              className="centered"
              id={`city`}
              type="text"
              required
            ></input>
          </span>
          <span
            style={{
              width: `${isDesktopOrLaptop || !isPortrait ? "20vw" : "70vw"}`,
              display: "inline",

              margin: "1em",
            }}
          >
            <h4>State/Province *</h4>

            <StateSelect />
          </span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: `${
              isPortrait || !isDesktopOrLaptop ? "column" : "row"
            }`,
            width: `${isDesktopOrLaptop || !isPortrait ? "45vw" : "40vw"}`,
            margin: "0 auto",
          }}
        >
          <span
            style={{
              width: `${isDesktopOrLaptop ? "20vw" : "70vw"}`,
              display: "inline",
              margin: "1em",
              height: "6em",
            }}
          >
            <h4 className="centered">Country *</h4>
            <input
              // onClick={() => {
              //   setFocusLocked(true);
              // }}
              id={`country`}
              type="text"
              disabled
              value="USA"
              required
            ></input>
          </span>
          <span
            style={{
              width: `${isDesktopOrLaptop ? "20vw" : "70vw"}`,
              display: "inline",
              margin: "1em",
            }}
          >
            <h4>Zip *</h4>
            <input
              // onClick={() => {
              //   setFocusLocked(true);
              // }}
              // onClick={() => setCanResize(false)}
              // onBlur={() => setCanResize(true)}
              id={`zipCode`}
              type="text"
              required
            ></input>
          </span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: `${
              isPortrait || !isDesktopOrLaptop ? "column" : "row"
            }`,
            width: `${isDesktopOrLaptop || !isPortrait ? "45vw" : "40vw"}`,
            margin: "0 auto",
          }}
        >
          <span
            style={{
              width: `${isDesktopOrLaptop || !isPortrait ? "23vw" : "70vw"}`,
              display: "inline",
              margin: "1em",
              marginTop: "1.3em",
            }}
          >
            <h4>Phone *</h4>
            <input
              // onClick={() => {
              //   setFocusLocked(true);
              // }}
              id={`phone`}
              type="text"
              required
            ></input>
          </span>
          <span
            style={{
              width: `${isDesktopOrLaptop ? "23vw" : "70vw"}`,
              display: "inline",
              margin: "1em",
            }}
          >
            <span
              className="centered"
              style={{
                width: "100%",
                bottom: "2em",
                left: `${isDesktopOrLaptop && ".5em"}`,
              }}
            >
              <h3>Email *</h3>
              <input
                // onClick={() => {
                //   setFocusLocked(true);
                // }}
                width={isDesktopOrLaptop ? "38vw" : "50vw"}
                type="text"
                id="emailInputText"
              ></input>
            </span>
          </span>
        </div>

        {photoUpload && (
          <button
            disabled={!addressComplete}
            type="button"
            onClick={() => {
              setIsSavePhoto(true);
              setShowModalCenter(true);
            }}
          >
            Upload Photo
          </button>
        )}
        {!photoUpload && submitButton && (
          <button type="button" onClick={() => saveAddress()}>
            Save Address
          </button>
        )}
      </div>
    </div>
  );
};

export default AddressForm;
