import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../Context.js";
import Lottie from "react-lottie-player";
import loadingData from "../8682-loading.json";
import successData from "../5449-success-tick.json";
import errorData from "../38213-error.json";
import { FilePicker } from "react-file-picker";
import { getFunctions, httpsCallable } from "firebase/functions";
import { initializeApp } from "firebase/app";
import { loadStripe } from "@stripe/stripe-js";
import {
  useStripe,
  useElements,
  CardElement,
  Elements,
  PaymentRequestButtonElement,
} from "@stripe/react-stripe-js";

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.

// import { database } from "firebase-functions/v1/firestore";

const Modal = () => {
  const stripePromise = loadStripe(
    "pk_test_51JmfSfIMVSRR1M7sPszwzT4NfBhywyysiLoomEnCGuP56ahIW9e5ZCNDfNSE8VnkRYXAelAtRSPP6XvsRyZIPR7e001sB2BL7J"
  );

  const CARD_ELEMENT_OPTIONS = {
    style: {
      base: {
        width: `${isLargeScreen ? "100%" : "100vw"}`,
        // height: "10em",
        padding: `20em`,
        margin: `${isLargeScreen ? "20em" : ""}`,
        boxSizing: "border-box",
        border: "2px solid pink",
        color: "#32325d",
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: "antialiased",
        // fontSize: `${isLargeScreen ? "16px" : "12px"}`,
        "::placeholder": {
          color: "#aab7c4",
        },
        maxWidth: "100vw",
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
  };

  const [processError, setProcessError] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  const [paymentComplete, setPaymentComplete] = useState(false);

  const [amountPaid, setAmountPaid] = useState(0);

  const {
    isPortrait,
    isLargeScreen,
    isSmallScreen,
    modalExecute,
    modalText,
    showModalCenter,
    setShowModalCenter,
    styleColors,
    modalTextCenter,
    hideLotties,
    showLottieLoading,
    showLottieSuccess,
    showLottieError,
    setShowLottieSuccess,
    setShowLottieError,
    setShowLottieLoading,
    saveAddress,
    signOutDisplay,
    setSignOutDisplay,
    handleSignOut,
    setShowModalPhotosMenu,
    showModalPhotosMenu,
    showModalAgentPhotosMenu,
    setShowModalAgentPhotosMenu,
    savePhotos,

    saveAgentPhotos,
    isSaveAgentPhotos,

    isSaveAddressModal,
    setIsSaveAddressModal,
    setShowModalEdge,
    showModalEdge,
    setModalText,
    files,
    setFiles,

    filenames,
    setFilenames,
    showModalDeletePhotoMenu,
    setShowModalDeletePhotoMenu,
    deletePhoto,
    savePhotoSuccess,
    savePhotoError,
    savePhotoAndAddress,
    isSavePhoto,
    isSaveHomePhotos,
    profilePhotoName,
    setProfilePhotoName,
    profilePhotoCache,
    setProfilePhotoCache,

    isReplacePhoto,
    handleReplacePhoto,
    setIsReplacePhoto,

    replacePhotoError,
    showModalAgentAuth,
    setShowModalAgentAuth,
    setIsOnAgentSite,

    setShowRejected,
    showRejected,
    requestRejected,
    setRequestRejected,
    setIsPendingVerification,

    isSearchModal,
    setIsSearchModal,

    setIsCheckAvailability,
    isCheckAvailability,
    setIsBookingPayment,
    isBookingPayment,
    timeFrame,
    payMethod,
    agentDoc,
    setPayMethod,
    userName,
    uid,

    photosRequired,
    setPhotosRequired,

    note,
    setNote,
    localRating,
    setLocalRating,
    review,
    setReview,
    ticketRating,
    setTicketRating,
    cancelTicket,
    reviewTicket,
    deleteTicket,

    setIsCancelTicket,
    isCancelTicket,

    setIsReviewTicket,
    isReviewTicket,

    setIsDeleteTicket,
    isDeleteTicket,

    selectedTicket,
    setSelectedTicket,
    isUpdateTicket,
    setIsUpdateTicket,
    agentUpdate,
    isComplete,
    setIsComplete,

    agentTicketPhotos,
    setAgentTicketPhotos,

    agentTicketPhotoName,
    agentTicketPhotoCache,

    setAgentTicketPhotoCache,
    setAgentTicketPhotoName,
    isEditClientReview,
    setIsEditClientReview,
    isEditAgentReview,
    setIsEditAgentReview,

    handleEditAgentReview,
    handleEditClientReview,
    reviewSuccess,
    setReviewSuccess,
  } = useContext(Context);

  const [order, setOrder] = useState({});

  const [totalCost, setTotalCost] = useState(0);

  useEffect(() => {
    if (agentDoc && agentDoc.payRate) {
      if (fullDayChecked) {
        setTotalCost((Number(agentDoc.payRate.fullDay) * 100) / 3); // times 100 to move from cents to dollars, divide by 3 to get amount that JK Collection takes.
      } else {
        setTotalCost((Number(agentDoc.payRate.halfDay) * 100) / 3);
      }

      console.log("fullDay", agentDoc.payRate.fullDay);
      console.log("halfDay", agentDoc.payRate.halfDay);
    }
  }, [fullDayChecked, agentDoc]);

  const disableButton = () => {
    if (document.getElementById("confirmPaymentButton")) {
      document.getElementById("confirmPaymentButton").style.display = "none";
    }
    if (document.getElementById("confirmPaymentButton2")) {
      document.getElementById("confirmPaymentButton2").style.display = "none";
    }
  };

  const enableButton = () => {
    if (document.getElementById("confirmPaymentButton")) {
      document.getElementById("confirmPaymentButton").style.display = "initial";
    }
    if (document.getElementById("confirmPaymentButton2")) {
      document.getElementById("confirmPaymentButton2").style.display =
        "initial";
    }
  };

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
  // const loadingOptions = {
  //   loop: true,
  //   autoplay: true,
  //   animationData: loadingData,
  //   rendererSettings: {
  //     preserveAspectRatio: "xMidYMid slice",
  //   },
  // };

  // const successOptions = {
  //   loop: true,
  //   autoplay: true,
  //   animationData: successData,
  //   rendererSettings: {
  //     preserveAspectRatio: "xMidYMid slice",
  //   },
  // };

  // const errorOptions = {
  //   loop: true,
  //   autoplay: true,
  //   animationData: errorData,
  //   rendererSettings: {
  //     preserveAspectRatio: "xMidYMid slice",
  //   },
  // };

  const [clientSecret, setClientSecret] = useState("");

  const acceptRejection = () => {
    const accept = httpsCallable("acceptRejection")({})
      .then((result) => {
        if (result.data.success) {
          setRequestRejected(false);
          setIsPendingVerification(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });

    setShowRejected(false);
    setShowModalCenter(false);
    accept();
  };

  const [isStarted, setIsStarted] = useState(true);
  const [isStopped, setIsStopped] = useState(false);

  const [confirmBooking, setConfirmBooking] = useState(false);

  const [priceChosen, setPriceChosen] = useState(true);

  const addFile = (file) => {
    const path = file.name;
    console.log("adding path to photos: ", path);
    setShowModalEdge(true);
    setModalText(`${path} is queued to upload`);
    setFiles([...files, file]);
    setFilenames([...filenames, path]);
  };

  const addProfilePhoto = (file) => {
    const path = file.name;
    console.log("adding path for profile photo: ", path);
    setShowModalEdge(true);
    setModalText(`Your new profile photo will be ${path}`);
    setProfilePhotoCache(file);
    setProfilePhotoName(path);
  };

  const addAgentTicketPhoto = (file) => {
    const path = file.name;
    console.log("adding path for profile photo: ", path);
    setShowModalEdge(true);
    setModalText(`Your new profile photo will be ${path}`);
    setAgentTicketPhotoCache(file);
    setAgentTicketPhotoName(path);
  };

  const [paymentIntent, setPaymentIntent] = useState(null);

  const createIntent = async () => {
    setConfirmBooking(true);
    setShowLottieLoading(true);
    setShowRates(false);
    console.log("create intent fired");
    const createPaymentIntent = httpsCallable(functions, "paymentIntent");
    await createPaymentIntent({ totalCost })
      .then((result) => {
        console.log("result: ", result);
        console.log("created payment intent");
        console.log("result.data: ", result.data);
        setPaymentIntent(result.data);

        return result.data;
      })
      .catch((error) => {
        console.log("no response from callable " + error);
      });
  };

  useEffect(() => {
    if (isUpdateTicket) {
      setNote("");
    }
  }, [isUpdateTicket]);

  useEffect(() => {
    console.log("paymentIntent: ", paymentIntent);
    if (paymentIntent !== null) {
      console.log("paymentIntent: ", paymentIntent);
      const getClientSecret = httpsCallable(functions, "clientSecret");
      getClientSecret({})
        .then((result) => {
          console.log("client secret received.");
          let client_secret;
          console.log(result.data);
          if (result.data.success) {
            client_secret = result.data.client_secret;
            setClientSecret(client_secret);
            console.log("retrieved client secret", client_secret);
          }
          return client_secret;
        })
        .catch((error) => {
          setProcessError(true);
          setShowLottieLoading(false);
          setShowLottieError(true);
          enableButton();
          return console.log("error getting client secret: " + error);
        });
    }
  }, [paymentIntent]);

  const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();

    const completePurchase = async () => {
      console.log("complete purchase fired");

      let ticket = {};
      let payAmount = 0;
      const cardElement = elements.getElement(CardElement);

      const { paymentIntent, error } = await stripe
        .confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: `${userName.firstName} ${userName.lastName}`,
            },
          },
        })
        .then((result) => {
          console.log(result);
          setShowLottieLoading(true);
          // if the result has a type, it was not confirmed:

          if (result.type || result.error) {
            setProcessError(true);
            setShowLottieLoading(false);
            setShowLottieError(true);
            enableButton();
            throw new Error("payment was not confirmed");
          }
          console.log("client secret was accepted, card payment went through.");

          let intent = result.paymentIntent;
          console.log("intent: ", intent);
          setAmountPaid(intent.amount);
          payAmount = Number(intent.amount);
          // let checkoutNote = document.getElementById("checkoutNote").value;
          let checkoutNote = "";

          // let date = new Date();

          let now = Date.now();

          ticket = {
            collectedPayout: Number(payAmount),
            totalTicketPrice: Number(payAmount * 3),
            bookingTimeMilli: now,
            agentId: agentDoc.uid,
            clientId: uid,
            timeFrame,
            term: `${fullDayChecked ? "full_day" : "half_day"}`,
            checkoutNote,
          };

          const updateDatabase = httpsCallable(functions, "updateBase");
          return updateDatabase({
            result: intent,
            agentDoc,
            ticket,
            checkoutNote,
          });
        })
        .then(() => {
          console.log("encoded data into database");
          // cartItems, cost, lastFour, deliverDate
          // let lastFour = payMethod[0];

          const receipt = [
            (payAmount / 100).toFixed(2).toString(),
            "XXXX", // lastFour.toString(),
          ];

          setPaymentComplete(true);
          setPaid(Math.floor(Number(payAmount / 100)));
          setPaymentProcessing(false);
          setProcessError(false);
          setClientSecret("");
          setPaymentIntent(null);

          let date = new Date();

          let now = Number(date.getTime());

          ticket = {
            collectedPayout: Number(payAmount),
            totalTicketPrice: Number(payAmount * 3),
            bookingTimeMilli: now,
            agentId: agentDoc.uid,
            clientId: uid,
            timeFrame,
            term: `${fullDayChecked ? "full_day" : "half_day"}`,
            checkoutNote: "",
          };

          const sendReceiptEmail = httpsCallable(functions, "emailReceipt");
          return sendReceiptEmail({
            receipt,
            agentId: agentDoc.uid,
            ticket,
            agentEmail: agentDoc.address[9],
            agentFirstName: agentDoc.address[0],
            agentLasttName: agentDoc.address[0],
          });
        })
        .then((result) => {
          console.log("receipt email sent");
          setShowLottieLoading(false);
          setShowLottieSuccess(true);
          console.log(result);
        })
        .catch((error) => {
          console.log(error);
          setShowLottieError(true);
          setShowLottieLoading(false);
        });
    };

    // const createPayMethod = async () => {
    //   const cardElement = elements.getElement(CardElement);
    //   await stripe
    //     .createPaymentMethod({
    //       type: "card",
    //       card: cardElement,
    //       billing_details: {
    //         name: `${userName.firstName} ${userName.lastName}`,
    //       },
    //     })
    //     .then(async (result) => {
    //       console.log(result);
    //       console.log(result.paymentMethod);
    //       // ./ last four, brand, id, country
    //       const lastFour = result.paymentMethod.card.last4;
    //       let method = {
    //         last4: result.paymentMethod.card.last4,
    //         country: result.paymentMethod.card.country,
    //         brand: result.paymentMethod.card.brand,
    //         id: result.paymentMethod.id,
    //       };
    //       console.log(payMethod);
    //       setPayMethod(method);
    //     })
    //     .catch((error) => {
    //       throw new Error(error);
    //     });
    // };

    const handleConfirmPayment = () => {
      // We don't want to let default form submission happen here,
      // which would refresh the page.
      disableButton();
      setProcessError(false);
      if (!stripe || !elements) {
        console.log("stripe not loaded");
        // Stripe.js has not yet loaded.
        // Make sure to disable form submission until Stripe.js has loaded.
        return;
      } else {
        // setShowLottieLoading(true);

        try {
          console.log("about to fire completePurchase");
          completePurchase();
        } catch {
          throw new Error("Unable to confirm payment");
        }
        // try {
        //   createPayMethod();
        // } catch {
        //   throw new Error("Unable to create pay method");
        // }
      }
    };

    useEffect(() => {
      if (selectedTicket !== null) {
        let date = new Date(selectedTicket.ticket.timeFrame);
        let dateString = date.toUTCString;
        setAppointment(dateString);
      } else {
        setAppointment(null);
      }
    }, [selectedTicket]);

    return (
      <form>
        <label
          style={{
            width: "100%",
          }}
        />
        Card details
        <CardElement
          options={CARD_ELEMENT_OPTIONS}
          // className={`${isLargeScreen ? "wideForm" : "cardResponsive"} `}
        />
        <button
          // style={{ left: `${isLargeScreen ? "initial" : "-10vw"}` }}
          className="button primary"
          type="button"
          id="confirmPaymentButton"
          onClick={() => {
            handleConfirmPayment();
          }}
        >
          Confirm Payment
        </button>
        {/* {!usePrevCard && <div id="paypal-button-container"
                      onLoad={() => {
                          handleShowPaypal()
                      }}></div>} */}
      </form>
    );
  };

  const [fullDayChecked, setFullDayChecked] = useState(true);

  const [paid, setPaid] = useState(0);

  const [options, setOptions] = useState({});

  useEffect(() => {
    if (clientSecret !== "") {
      setOptions({ clientSecret });
      setShowLottieLoading(false);
    }
  }, [clientSecret]);

  const Elementor = () => {
    if (clientSecret && stripePromise) {
      return (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm />
        </Elements>
      );
    } else {
      return <div></div>;
    }
  };

  const [showRates, setShowRates] = useState(true);

  const [appointment, setAppointment] = useState("");

  const [canceled, setCanceled] = useState(false);

  const handleCancelTicket = (ticket) => {
    setCanceled(true);
    cancelTicket(ticket);
  };

  const [deleted, setDeleted] = useState(false);

  const handleDeleteTicket = (ticket) => {
    setDeleted(true);
    deleteTicket(ticket);
  };

  const [reviewed, setReviewed] = useState(false);

  const handleReviewTicket = (ticket) => {
    setReviewed(true);
    reviewTicket(ticket);
  };

  const [ratingSaved, setRatingSaved] = useState(false);

  const saveRating = () => {
    let ticket = selectedTicket;
    ticket.clientRating = ticketRating;
    ticket.clientNote = note;
    setShowLottieLoading(true);
    const saveUserRating = httpsCallable(functions, "saveUserRating");
    saveUserRating({ ticket })
      .then((result) => {
        let data = result.data;
        console.log(data);
        setRatingSaved(true);
      })
      .catch((error) => console.log(error));

    // setIsEditClientReview(false);
    // setShowModalCenter(false);
  };

  const [paidFullChecked, setPaidFullChecked] = useState(false);

  return (
    <div
      className="modalCenter"
      id="modalCenter"
      style={{
        // top: `${isLargeScreen ? "16.5vw" : "75vw"}`,
        // left: `${isLargeScreen ? "30vw" : "5vw"}`,
        right: `${isSmallScreen || isPortrait ? "80vw" : "60vw"}`,
        fontSize: `${isLargeScreen ? "initial" : "small"}`,
        display: `${showModalCenter ? "flex" : "none"}`,
        flexDirection: "column",
        // "box-shadow": "0px 0px 5px white",
      }}
    >
      {showRejected && (
        <div>
          <p>
            Something's not right with the information you've sent us. This
            usually means your access code wasn't correct, or wasn't completely
            visible. Tis could also happen because you look significantly
            different in your verification photo than in your profile photo.
            Please reapply to become an agent with JK Domestic Collection.
          </p>
          <button type="button" onClick={() => acceptRejection()}>
            OK
          </button>
        </div>
      )}
      {showModalDeletePhotoMenu && (
        <div>
          <p>Are you sure you want to delete this photo?</p>
          <button
            type="button"
            className="itemOptionsModalButton button primary"
            id="signOutModalButton"
            style={{ margin: "1em" }}
            onClick={() => {
              setShowModalDeletePhotoMenu(false);
              deletePhoto();
              setShowModalCenter(false);
            }}
          >
            Yes
          </button>
          <button
            type="button"
            className="itemOptionsModalButton button primary"
            id="signOutModalButton"
            style={{ margin: "1em" }}
            onClick={() => {
              setShowModalDeletePhotoMenu(false);
              setShowModalCenter(false);
            }}
          >
            No
          </button>
        </div>
      )}
      {isReplacePhoto && (
        <div>
          <p>Choose your new profile photo:</p>
          <div style={{ flexDirection: "column" }}>
            {profilePhotoName ? (
              <p>{profilePhotoName}</p>
            ) : (
              <p>{" - No Photo Selected - "}</p>
            )}
          </div>
          <FilePicker
            extensions={["jpg", "png"]}
            onChange={(FileObject) => {
              addProfilePhoto(FileObject);
            }}
            onError={(errMsg) => console.log(errMsg)}
          >
            <button>Choose File</button>
          </FilePicker>
          <button
            type="button"
            className="itemOptionsModalButton button primary"
            id="signOutModalButton"
            disabled={!profilePhotoName}
            style={{ margin: "1em" }}
            onClick={() => {
              handleReplacePhoto();
              // setShowModalPhotosMenu(false);
            }}
          >
            Confirm Upload
          </button>
          <button
            type="button"
            className="itemOptionsModalButton button primary"
            id="signOutModalButton"
            style={{ margin: "1em" }}
            onClick={() => {
              setProfilePhotoCache({});
              setProfilePhotoName("");
              setShowModalEdge(true);
              setModalText(`files removed from queue`);
            }}
          >
            Clear
          </button>
          <button
            type="button"
            className="itemOptionsModalButton button primary"
            id="signOutModalButton"
            style={{ margin: "1em" }}
            onClick={() => {
              setIsReplacePhoto(false);
              setShowModalCenter(false);
              setProfilePhotoCache({});
              setProfilePhotoName("");
            }}
          >
            Cancel
          </button>
        </div>
      )}
      {!showModalAgentPhotosMenu && isSavePhoto && (
        <div>
          <p>Choose your profile photo:</p>
          <div style={{ flexDirection: "column" }}>
            {profilePhotoName ? (
              <p>{profilePhotoName}</p>
            ) : (
              <p>{" - No Photo Selected - "}</p>
            )}
          </div>
          <FilePicker
            extensions={["jpg", "png"]}
            onChange={(FileObject) => {
              addProfilePhoto(FileObject);
            }}
            onError={(errMsg) => console.log(errMsg)}
          >
            <button>Choose File</button>
          </FilePicker>
          <button
            type="button"
            className="itemOptionsModalButton button primary"
            id="signOutModalButton"
            disabled={!profilePhotoName}
            style={{ margin: "1em" }}
            onClick={() => {
              savePhotoAndAddress();
              // setShowModalPhotosMenu(false);
            }}
          >
            Confirm Upload
          </button>
          <button
            type="button"
            className="itemOptionsModalButton button primary"
            id="signOutModalButton"
            style={{ margin: "1em" }}
            onClick={() => {
              setProfilePhotoCache({});
              setProfilePhotoName("");
              setShowModalEdge(true);
              setModalText(`files removed from queue`);
            }}
          >
            Clear
          </button>
          <button
            type="button"
            className="itemOptionsModalButton button primary"
            id="signOutModalButton"
            style={{ margin: "1em" }}
            onClick={() => {
              setShowModalPhotosMenu(false);
              setShowModalCenter(false);
              setProfilePhotoCache({});
              setProfilePhotoName("");
            }}
          >
            Cancel
          </button>
        </div>
      )}
      {showModalPhotosMenu && !showModalAgentPhotosMenu && (
        <div>
          <p>Choose which photos of your property to upload:</p>
          <div style={{ flexDirection: "column" }}>
            {filenames.map((i) => {
              return <div>{i}</div>;
            })}
          </div>
          <FilePicker
            extensions={["jpg", "png"]}
            onChange={(FileObject) => {
              addFile(FileObject);
            }}
            onError={(errMsg) => console.log(errMsg)}
          >
            <button>Choose Photos</button>
          </FilePicker>
          <button
            type="button"
            className="itemOptionsModalButton button primary"
            id="signOutModalButton"
            style={{ margin: "1em" }}
            onClick={() => {
              savePhotos(files);
            }}
          >
            Confirm Upload
          </button>
          <button
            type="button"
            className="itemOptionsModalButton button primary"
            id="signOutModalButton"
            style={{ margin: "1em" }}
            onClick={() => {
              setFilenames([]);
              setFiles([]);
              setShowModalEdge(true);
              setModalText(`files removed from queue`);
            }}
          >
            Clear
          </button>
          <button
            type="button"
            className="itemOptionsModalButton button primary"
            id="signOutModalButton"
            style={{ margin: "1em" }}
            onClick={() => {
              setShowModalPhotosMenu(false);
              setShowModalCenter(false);
              setFilenames([]);
              setFiles([]);
            }}
          >
            Cancel
          </button>
        </div>
      )}
      {showModalAgentPhotosMenu && !isSavePhoto && (
        <div>
          <p>
            Do you have any photos of yourself at work that you're really proud
            of? Upload them here for your clients to see:
          </p>
          <div style={{ flexDirection: "column" }}>
            {filenames.map((i) => {
              return <div>{i}</div>;
            })}
          </div>
          <FilePicker
            extensions={["jpg", "png"]}
            onChange={(FileObject) => {
              addFile(FileObject);
            }}
            onError={(errMsg) => console.log(errMsg)}
          >
            <button>Choose Photos</button>
          </FilePicker>
          <button
            type="button"
            className="itemOptionsModalButton button primary"
            id="signOutModalButton"
            style={{ margin: "1em" }}
            onClick={() => {
              saveAgentPhotos(files);
            }}
          >
            Confirm Upload
          </button>
          <button
            type="button"
            className="itemOptionsModalButton button primary"
            id="signOutModalButton"
            style={{ margin: "1em" }}
            onClick={() => {
              setFilenames([]);
              setFiles([]);
              setShowModalEdge(true);
              setModalText(`files removed from queue`);
            }}
          >
            Clear
          </button>
          <button
            type="button"
            className="itemOptionsModalButton button primary"
            id="signOutModalButton"
            style={{ margin: "1em" }}
            onClick={() => {
              setShowModalAgentPhotosMenu(false);
              setShowModalCenter(false);
              setFilenames([]);
              setFiles([]);
            }}
          >
            Cancel
          </button>
        </div>
      )}
      {signOutDisplay && (
        <div>
          <p>Are you sure you want to sign out?</p>
          <button
            type="button"
            className="itemOptionsModalButton button primary"
            id="signOutModalButton"
            style={{ margin: "1em" }}
            onClick={() => {
              setSignOutDisplay(false);
              handleSignOut();
              setShowModalCenter(false);
            }}
          >
            Yes
          </button>
          <button
            type="button"
            className="itemOptionsModalButton button primary"
            id="signOutModalButton"
            style={{ margin: "1em" }}
            onClick={() => {
              setSignOutDisplay(false);
              setShowModalCenter(false);
            }}
          >
            No
          </button>
        </div>
      )}
      {showLottieLoading && (
        <div>
          <Lottie
            className="lottie"
            loop
            animationData={loadingData}
            play
            style={{ width: 150, height: 150 }}
          />
          {!isSearchModal && !isBookingPayment && <p>Saving your info...</p>}
          {isBookingPayment && (
            <div>
              <p>Generating request...</p>
            </div>
          )}
        </div>
      )}
      {showLottieSuccess && (
        <div>
          <Lottie
            className="lottie"
            loop={false}
            animationData={successData}
            play
            style={{ width: 150, height: 150 }}
          />
          <p>Success!</p>
          {reviewSuccess && (
            <button
              type="button"
              onClick={() => {
                setShowLottieSuccess(false);
                setShowModalCenter(false);
                setIsEditAgentReview(false);
                setIsEditClientReview(false);
              }}
            >
              OK
            </button>
          )}
          {paymentComplete && (
            <div>
              <p>Your payment of ${paid} is complete!</p>
              <button
                type="button"
                onClick={() => {
                  setShowLottieSuccess(false);
                  setShowModalCenter(false);
                  setPaymentComplete(false);
                }}
              >
                OK
              </button>
            </div>
          )}
          {showModalAgentAuth ? (
            <div>
              <Link to="/agent-console">
                <button
                  type="button"
                  onClick={() => {
                    setIsOnAgentSite(true);
                    setShowModalCenter(false);
                    setShowLottieSuccess(false);
                    setShowModalAgentAuth(false);
                  }}
                >
                  Go to Agent Console
                </button>
              </Link>
            </div>
          ) : (
            <div>
              <Link to="/browse">
                <button
                  type="button"
                  onClick={() => {
                    setIsSaveAddressModal(false);
                    setShowLottieSuccess(false);
                    setShowModalCenter(false);
                  }}
                >
                  Find Housekeepers
                </button>
              </Link>
              {isSaveAddressModal && (
                <div>
                  <p>or</p>
                  <Link to="/agent-sign-up">
                    <button
                      type="button"
                      onClick={() => {
                        setIsSaveAddressModal(false);
                        setShowLottieSuccess(false);
                        setShowModalCenter(false);
                      }}
                    >
                      Become an Agent with Us
                    </button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      {showLottieError && (
        <div>
          <Lottie
            className="lottie"
            loop
            animationData={errorData}
            play
            style={{ width: 150, height: 150 }}
          />

          {processError && (
            <div>
              <p>Your payment was not processed.</p>
              <button
                type="button"
                onClick={() => {
                  setShowLottieError(false);
                  setShowModalCenter(false);
                  setProcessError(false);
                }}
              >
                OK
              </button>
            </div>
          )}
          {isSearchModal && (
            <div>
              <p>We had trouble contacting the server.</p>
              <button
                type="button"
                onClick={() => {
                  setShowLottieError(false);
                  setShowModalCenter(false);
                  setIsSearchModal(false);
                }}
              >
                OK
              </button>
            </div>
          )}
          {isSaveAddressModal && (
            <div>
              <p>We couldn't save your address.</p>
              <button
                type="button"
                onClick={() => {
                  hideLotties();
                  saveAddress();
                }}
              >
                Try again
              </button>
            </div>
          )}
          {isSavePhoto && savePhotoError && (
            <div>
              <p>We couldn't save your profile photo.</p>
              <button
                type="button"
                onClick={() => {
                  savePhotoAndAddress();
                }}
              >
                Try again
              </button>
            </div>
          )}
          {isSaveHomePhotos && (
            <div>
              <p>We couldn't save your home photos.</p>
              <button
                type="button"
                onClick={() => {
                  hideLotties();
                  savePhotos(files);
                }}
              >
                Try again
              </button>
            </div>
          )}
          {isSaveAgentPhotos && (
            <div>
              <p>We couldn't save your agent photos.</p>
              <button
                type="button"
                onClick={() => {
                  hideLotties();
                  saveAgentPhotos(files);
                }}
              >
                Try again
              </button>
            </div>
          )}
          {isReplacePhoto && replacePhotoError && (
            <div>
              <p>We couldn't update your profile photo.</p>
              <button
                type="button"
                onClick={() => {
                  handleReplacePhoto();
                }}
              >
                Try again
              </button>
            </div>
          )}
          {showModalAgentAuth && (
            <div>
              <p>Your request couldn't be processed. Please try again.</p>
              <button
                type="button"
                onClick={() => {
                  setShowModalCenter(false);
                  setShowLottieError(false);
                  setShowModalAgentAuth(false);
                }}
              >
                OK
              </button>
            </div>
          )}
        </div>
      )}
      <p
        style={{
          left: `${isLargeScreen ? "initial" : "-5vw"}`,
        }}
      >
        {modalTextCenter}
      </p>
      {!signOutDisplay && !isSearchModal && (
        <button
          type="button"
          className="modalCenterButton button small"
          id="modalCenterButton"
          // style={{ backgroundColor: styleColors.hotPink }}
          onClick={() => {
            hideLotties();
            setShowModalCenter(false);
          }}
        >
          {isBookingPayment ? "Exit" : "OK"}
        </button>
      )}
      {isCheckAvailability && (
        <div>
          <p>Availability...</p>
          <button
            type="button"
            onClick={() => {
              setIsCheckAvailability(false);
              setShowModalCenter(false);
            }}
          >
            OK
          </button>
        </div>
      )}
      {photosRequired && (
        <div>
          <p>You must add photos of your home before you can book an agent!</p>
          <Link to="/account">
            <button
              type="button"
              onClick={() => {
                setPhotosRequired(false);
                setShowModalCenter(false);
              }}
            >
              Add Photos
            </button>
          </Link>
          <button
            type="button"
            onClick={() => {
              setPhotosRequired(false);
              setShowModalCenter(false);
            }}
          >
            OK
          </button>
        </div>
      )}
      {isEditClientReview && (
        <div>
          <div>
            <p>How would you rate your agent's work?</p>
            <select
              id="ratingSelect"
              onChange={(e) => setLocalRating(e.target.value)}
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
            <input
              type="textarea"
              placeholder="Please leave a review (optional)."
              value={review}
              onChange={(e) => setReview(e.target.value)}
            />
            <button type="button" onClick={() => handleEditClientReview()}>
              Save Review
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              setIsEditClientReview(false);
              setShowModalCenter(false);
              setReview("");
            }}
          >
            Exit
          </button>
        </div>
      )}
      {isEditAgentReview && (
        <div>
          <div>
            <p>How would you rate your client?</p>
            <select
              id="ratingSelect"
              onChange={(e) => setLocalRating(e.target.value)}
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
            <input
              type="textarea"
              placeholder="Please leave a review (optional)."
              value={review}
              onChange={(e) => setReview(e.target.value)}
            />
            <button type="button" onClick={() => handleEditAgentReview()}>
              Save Review
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              setIsEditAgentReview(false);
              setShowModalCenter(false);
              setReview("");
            }}
          >
            Exit
          </button>
        </div>
      )}
      {isUpdateTicket && (
        <div>
          {!isComplete ? (
            <div>
              <p>Are you sure you are unable to complete this appointment?</p>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Care to elaborate?"
              />
            </div>
          ) : (
            <div>
              <p>You are about to mark this appointment complete.</p>
              <br></br>
              <input
                id="fullPay-input"
                type="checkbox"
                checked={paidFullChecked}
                onChange={() => {
                  setPaidFullChecked(!paidFullChecked);
                }}
              />
              <label for="fullpay-input">Client paid in full</label>
              <br></br>
              <p>{"Please upload a photo of your completed work."}</p>
              <p>{agentTicketPhotoName}</p>
              <FilePicker
                extensions={["jpg", "png"]}
                onChange={(FileObject) => {
                  addAgentTicketPhoto(FileObject);
                }}
                onError={(errMsg) => console.log(errMsg)}
              >
                <button>Choose file</button>
              </FilePicker>
            </div>
          )}

          <button
            disabled={isComplete && !agentTicketPhotoName}
            type="button"
            onClick={() => {
              agentUpdate(selectedTicket.ticket, isComplete, paidFullChecked);
              setIsComplete(false);
              setIsUpdateTicket(false);
              setShowModalCenter(false);
            }}
          >
            Continue
          </button>
          <button
            type="button"
            onClick={() => {
              setIsComplete(false);
              setIsUpdateTicket(false);
              setShowModalCenter(false);
            }}
          >
            Cancel
          </button>
        </div>
      )}
      {isCancelTicket && (
        <div>
          {!canceled ? (
            <p>
              Are you sure you want to cancel your appointment for
              {` ${selectedTicket.agent.name.firstName}`}'s help? This can't be
              undone.
            </p>
          ) : (
            <p>Your appointment has been cancelled</p>
          )}
          <label for="reasonSelect">Cancellation Reason:</label>
          <select id="reasonSelect" onChange={(e) => setNote(e.target.value)}>
            <option value="No Longer Needed">Service No Longer Needed</option>
            <option value="Better Service Found">Better Service Found</option>
            <option value="Insufficient Funds">Insufficient Funds</option>
            <option value="Other (please explain)">{`Other (please explain)`}</option>
          </select>
          <input
            type="text"
            placeholder="Note (optional)"
            value={note}
            onClick={(e) => setNote(e.target.value)}
          />
          {!canceled && (
            <button
              type="button"
              onClick={() => handleCancelTicket(selectedTicket.ticket)}
            >
              Cancel Appointment
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              setShowModalCenter(false);
              setIsCancelTicket(false);
              setCanceled(false);
              setSelectedTicket(null);
              setNote("");
              setTicketRating(1);
            }}
          >
            Exit
          </button>
        </div>
      )}
      {isDeleteTicket && (
        <div>
          {!deleted ? (
            <p>
              You are about to delete this appointment and move it to Your
              History. Are you sure? Appointments are automatically moved to
              History after 1 week.
            </p>
          ) : (
            <div>
              <p>
                Appointment deleted! It can still be viewed in Your History.
              </p>
            </div>
          )}
          {!deleted && (
            <button
              type="button"
              onClick={() => handleDeleteTicket(selectedTicket.ticket)}
            >
              Yes
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              setShowModalCenter(false);
              setIsDeleteTicket(false);
              setDeleted(false);
              setSelectedTicket(null);
            }}
          >
            Exit
          </button>
        </div>
      )}
      {isBookingPayment && (
        <div>
          <div style={{ display: `${showRates ? "initial" : "none"}` }}>
            <input
              id="fullDay-input"
              type="checkbox"
              checked={fullDayChecked}
              onChange={() => {
                setFullDayChecked(!fullDayChecked);
              }}
            />
            <label for="fullDay-input">
              Full day: {agentDoc.payRate ? agentDoc.payRate.fullDay : "..."}
            </label>
          </div>
          <div style={{ display: `${showRates ? "initial" : "none"}` }}>
            <input
              id="halfDay-input"
              type="checkbox"
              checked={!fullDayChecked}
              onChange={() => {
                setFullDayChecked(!fullDayChecked);
              }}
            />
            <label for="halfDay-input">
              Half day: {agentDoc.payRate ? agentDoc.payRate.halfDay : "..."}
            </label>
          </div>

          <Elementor />
          {!confirmBooking && (
            <button
              disabled={!priceChosen}
              type="button"
              onClick={() => {
                createIntent();
              }}
            >
              Enter Payment Info
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Modal;
