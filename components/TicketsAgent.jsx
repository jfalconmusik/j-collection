import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import Amplify, {
  Analytics,
  Storage,
  API,
  graphqlOperation,
  S3Album,
} from "aws-amplify";
import { Loader } from "@googlemaps/js-api-loader";
import { Context } from "../Context";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFunctions, httpsCallable } from "firebase/functions";
import Lottie from "react-lottie-player";
import loadingData from "../8682-loading.json";

const TicketsUser = () => {
  //
  //
  //  Totally change this to represent the agent's schedule, not the user!
  //
  //
  //
  const {
    homeAddress,
    setShowModalCenter,
    styleColors,
    setShowLottieLoading,
    userSchedule,
    setUserSchedule,
    note,
    setNote,
    ticketRating,
    setTicketRating,
    cancelTicket,
    setIsCancelTicket,
    isCancelTicket,
    reviewTicket,
    setIsReviewTicket,
    isReviewTicket,
    deleteTicket,
    setIsDeleteTicket,
    isDeleteTicket,
    setSelectedTicket,
    agentObj,
    setAgentObj,
    isUpdateTicket,
    setIsUpdateTicket,
    agentUpdate,
    isComplete,
    setIsComplete,
    infoLoaded,
  } = useContext(Context);

  const storage = getStorage();

  const location = useLocation();

  const functions = getFunctions();

  const [userId, setUserId] = useState(null);

  // each object in the agent list will include an agent property and a ticket property
  const [clientList, setClientList] = useState([]);

  const [status, setStatus] = useState("");

  useEffect(() => {
    let id = location.pathname.split("/")[2];
    console.log("location based agent id: ", id);
    // setUserId(id);
  }, [location]);

  useEffect(() => {
    if (agentObj && agentObj.schedule.length > 0) {
      const getUsersFromTickets = httpsCallable(
        functions,
        "getUsersFromTickets"
      );
      console.log("retrieving client list");
      getUsersFromTickets({ schedule: agentObj.schedule }).then((result) => {
        let data = result.data;
        if (data.success) {
          console.log(data.clients);

          console.log("client list: ", data.clients);
          setClientList(data.clients);
        } else {
          console.log("error retrieving agents");
          setClientList([]);
        }
      });
    } else {
      console.log("agent has no pending tickets in schedule");
    }
  }, [agentObj]);

  if (!infoLoaded) {
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
  } else if (clientList && clientList.length > 0) {
    return (
      <div className="userTickets">
        <div
          style={{
            flexDirection: "column",
            overflowY: "scroll",
            maxHeight: "80vh",
            width: "80vw",
            margin: "0 auto",
            borderRadius: "10px",
          }}
        >
          {clientList.map((clientTicket, i) => {
            // write a function which retrieves

            console.log("clientTicket: ", clientTicket);
            let ticket = clientTicket;
            let client = clientTicket.client;
            let photoId = `client-photo-${i}`;
            let photoSrc = client.photo;
            let firstName = client.name.firstName;
            let lastName = client.name.lastName;
            let rating = client.rating;
            let phone = client.phone;

            let paidInFull = !!ticket.paidInFull;

            let agentPhotos = ticket.agentPhotos || [];
            let hasPhotos = agentPhotos.length > 0;
            let hasHistory = client.hasHistory;

            let term = ticket.term;
            let status = ticket.status;
            let complete = status == "complete";
            let unable = status == "unable";

            let timeFrame = ticket.timeFrame;
            let scheduleDate = new Date(timeFrame);
            let scheduleDateString = scheduleDate
              .toUTCString()
              .split(" ")
              .slice(0, 4)
              .join(" ");

            let bookingTimeMilli = ticket.bookingTimeMilli;
            let bookDate = new Date(bookingTimeMilli);
            let bookDateString = bookDate
              .toUTCString()
              .split(" ")
              .slice(0, 4)
              .join(" ");
            let collectedPayout = Number(ticket.collectedPayout) / 100;

            let now = Date.now();
            let nowDate = new Date(now);
            let nowDateString = nowDate
              .toUTCString()
              .split(" ")
              .slice(0, 4)
              .join(" ");

            let isToday = nowDateString === scheduleDateString;

            getDownloadURL(ref(storage, photoSrc))
              .then((downloadURL) => {
                document
                  .getElementById(photoId)
                  .setAttribute("src", downloadURL);
              })
              .catch((error) => {
                console.log(error);
              });

            let pastTime = now > timeFrame;
            return (
              <div
                style={{
                  display: "flex",
                  position: "relative",
                  margin: "0 auto",
                  flexDirection: "row",
                  maxWidth: "80vw",
                  marginTop: "20px",
                  padding: "20px",
                  backgroundColor: "pink",
                  justifyContent: "space-evenly",
                }}
              >
                {complete && (
                  <p
                    style={{
                      color: "white",
                      backgroundColor: "green",
                      borderRadius: "10px",
                    }}
                  >
                    Complete
                  </p>
                )}
                {unable && (
                  <p
                    style={{
                      color: "white",
                      backgroundColor: "green",
                      borderRadius: "10px",
                    }}
                  >
                    Unable to Complete
                  </p>
                )}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <p>
                    {firstName} {lastName}
                  </p>
                  <img
                    id={photoId}
                    src=""
                    style={{ width: "60px", height: "60px" }}
                    alt="client profile"
                  />
                  {hasHistory ? (
                    <Link to={`/client-history/${ticket.clientId}`}>
                      <button type="button">View Client History</button>
                    </Link>
                  ) : (
                    <button className="tooltip" type="button" disabled>
                      View Client History
                      <span className="tooltiptext">
                        Client has no appointment records yet.
                      </span>
                    </button>
                  )}
                </div>
                {!pastTime && isToday && (
                  <div>
                    <button
                      className="tooltip"
                      type="button"
                      style={{
                        height: "30px",
                        width: "30px",
                        backgroundColor: "green",
                      }}
                    >
                      <span class="tooltiptext">
                        You're scheduled for today! Expect {firstName} soon!
                      </span>
                    </button>
                  </div>
                )}
                {pastTime && !isToday && (
                  <div>
                    <button
                      className="tooltip"
                      type="button"
                      style={{
                        height: "30px",
                        width: "30px",
                        backgroundColor: styleColors.red,
                      }}
                    >
                      <span class="tooltiptext">
                        The appointment date has passed.
                      </span>
                    </button>
                  </div>
                )}
                {!pastTime && !isToday && (
                  <div>
                    <button
                      className="tooltip"
                      type="button"
                      style={{
                        height: "30px",
                        width: "30px",
                        backgroundColor: styleColors.aqua,
                      }}
                    >
                      <span class="tooltiptext">
                        {firstName} looks forward to meeting you!
                      </span>
                    </button>
                  </div>
                )}
                <p>{term === "full_day" ? "Full Day" : "Half Day"}</p>
                {!isToday ? (
                  <p>Scheduled: {scheduleDateString}</p>
                ) : (
                  <p>Schedule for Today, {scheduleDateString}!</p>
                )}

                <p>Booked: {bookDateString}</p>
                {isToday && <button type="button">Phone: {phone}</button>}
                {hasPhotos &&
                  agentPhotos.map((photo, j) => {
                    let agentPhotoId = `agent-photo-${j}`;

                    getDownloadURL(ref(storage, photo))
                      .then((downloadURL) => {
                        document
                          .getElementById(agentPhotoId)
                          .setAttribute("src", downloadURL);
                      })
                      .catch((error) => {
                        console.log(error);
                      });

                    return (
                      <div>
                        <img
                          id={agentPhotoId}
                          style={{ width: "60px", height: "60px" }}
                          src=""
                          alt="job completed"
                        />
                      </div>
                    );
                  })}
                {!complete && !unable ? (
                  <div
                    style={{
                      flexDirection: "column",
                      justifyContent: "space-evenly",
                    }}
                  >
                    <button
                      className="tooltip"
                      type="button"
                      disabled={!pastTime}
                      style={{ backgroundColor: "green", color: "white" }}
                      onClick={() => {
                        setShowModalCenter(true);
                        setIsComplete(true);
                        setIsUpdateTicket(true);
                        setSelectedTicket({ ticket, client });
                      }}
                    >
                      ☑ Mark Complete
                      <span
                        style={{ display: `${!pastTime ? "initial" : "none"}` }}
                        class="tooltiptext"
                      >
                        You can update the status of your appointment upon your
                        appointment date.
                      </span>
                    </button>

                    <button
                      className="tooltip"
                      style={{ backgroundColor: "red", color: "white" }}
                      type="button"
                      disabled={!pastTime && !isToday}
                      onClick={() => {
                        setShowModalCenter(true);
                        setIsComplete(false);
                        setIsUpdateTicket(true);
                        setSelectedTicket({ ticket, client });
                      }}
                    >
                      ✖ Cannot Complete
                      <span
                        style={{ display: `${!pastTime ? "initial" : "none"}` }}
                        class="tooltiptext"
                      >
                        You can update the status of your appointment upon your
                        appointment date.
                      </span>
                    </button>
                  </div>
                ) : (
                  <p>
                    {complete ? (
                      <span style={{ color: "green" }}>☑ Completed</span>
                    ) : (
                      <span style={{ color: "red" }}>✖ Unable to Complete</span>
                    )}
                  </p>
                )}
                {paidInFull ? (
                  <p>{`Paid in Full: ${Math.floor(
                    Number(collectedPayout * 3)
                  )}`}</p>
                ) : (
                  <p>
                    Prepaid ${collectedPayout} of $
                    {Math.floor(Number(collectedPayout * 3))}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  } else {
    return (
      <div
        style={{
          flexDirection: "column",
          overflowY: "scroll",
          maxHeight: "80vh",
          width: "80vw",
          margin: "0 auto",
          marginTop: "100px",
        }}
      >
        <div className="google" style={{ padding: "100px" }}>
          <p>You Have No Active Agent Tickets</p>
        </div>
      </div>
    );
  }
};
export default TicketsUser;
