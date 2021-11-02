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

const HistoryUser = () => {
  const {
    homeAddress,
    setShowModalCenter,
    styleColors,
    setShowLottieLoading,

    note,
    setNote,
    ticketRating,
    setTicketRating,
    userHistory,
    setUserHistory,
    selectedTicket,
    setSelectedTicket,
    editClientReview,
    editAgentReview,
    agentList,
    setAgentList,
    historyAgents,
    setHistoryAgents,
    handleEditRating,
    handleEditReview,
    uid,

    handleEditClientRating,
    agentObj,
    handleEditClientReview,
    handleEditAgentReview,
    handleEditAgentRating,
    review,
    setReview,
    localRating,
    setLocalRating,
    infoLoaded,
  } = useContext(Context);

  const storage = getStorage();

  const location = useLocation();

  const functions = getFunctions();

  const [userId, setUserId] = useState(null);

  // each object in the agent list will include an agent property and a ticket property
  // const [agentList, setAgentList] = useState([]);

  useEffect(() => {
    let id = location.pathname.split("/")[2];
    console.log("location based agent id: ", id);
    setUserId(id);
  }, [location]);

  useEffect(() => {
    if (userHistory.length > 0) {
      console.log("getting agents from history...");
      const getAgentsFromHistory = httpsCallable(
        functions,
        "getAgentsFromHistory"
      );
      getAgentsFromHistory({ userHistory }).then((result) => {
        let data = result.data;
        if (data.success) {
          console.log(data.agents);
          let newArr = userHistory.map((ticket, i) => {
            let temp = ticket;
            for (let agent of data.agents) {
              if (Number(agent.agentId) === Number(ticket.agentId)) {
                temp.agent = agent;
                break;
              }
            }
            return temp;
          });

          console.log("historyAgents: ", newArr);
          setHistoryAgents(newArr);
        } else {
          console.log("error retrieving agents");
          setHistoryAgents([]);
        }
      });
    }
  }, [userHistory]);

  // TODO
  const leaveUserReview = (ticket) => {
    const userReview = httpsCallable(functions, "userReview");
    userReview({ ticket })
      .then((result) => {
        let data = result.data;
        return data;
      })
      .catch((error) => console.log(error));
  };

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
  } else if (historyAgents && historyAgents.length > 0) {
    return (
      <div className="userTickets">
        <div
          style={{
            flexDirection: "column",
            overflowY: "scroll",
            maxHeight: "80vh",
            width: "80vw",
            margin: "0 auto",
          }}
        >
          {historyAgents.map((agentTicket, i) => {
            // write a function which retrieves

            let ticket = agentTicket;
            let agentPhotos = ticket.agentPhotos;
            let agentId = ticket.agentId;
            let hasPhotos = agentPhotos.length > 0;

            let clientId = ticket.clientId;

            let isClient = clientId == uid;
            let isAgent = agentId == agentObj.uid;
            // let agent = ticket.agent;
            // let photoId = `agent-photo-${i}`;
            // let photoSrc = agent.photo;
            // let firstName = agent.name.firstName;
            // let lastName = agent.name.lastName;
            // let rating = agent.rating;
            // let phone = agent.phone;

            let term = ticket.term;
            let status = ticket.status;
            let complete = status == "complete";
            let unable = status == "unable";
            let timeFrame = ticket.timeFrame;
            let scheduleDate = new Date(timeFrame);
            let scheduleDateString = scheduleDate.toUTCString();

            let bookingTimeMilli = ticket.bookingTimeMilli;
            let bookDate = new Date(bookingTimeMilli);
            let bookDateString = bookDate.toUTCString();
            let collectedPayout = ticket.collectedPayout;

            let clientReview = ticket.clientNote;
            let clientRating = ticket.clientRating; //given by client
            let agentRating = ticket.agentRating;
            let agentReview = ticket.agentReview;

            let clientEditDate = ticket.clientEditDate
              ? new Date(ticket.clientEditDate)
              : null;
            let agentEditDate = ticket.agentEditDate
              ? new Date(ticket.agentEditDate)
              : null;

            let clientDateString = clientEditDate.toUTCString();
            let agentDateString = agentEditDate.toUTCString();

            let now = Date.now();
            let nowDate = new Date(now);
            let nowDateString = nowDate
              .toUTCString()
              .split(" ")
              .slice(0, 4)
              .join(" ");

            let isToday = nowDateString === scheduleDateString;

            let paidInFull = ticket.paidInFull || false;

            // write code that retrieves the agent name, photo, and services from the server.

            // getDownloadURL(ref(storage, data.profilePhoto))
            //   .then((downloadURL) => {
            //     document
            //       .getElementById(photoId)
            //       .setAttribute("src", downloadURL);
            //   })
            //   .catch((error) => {
            //     console.log(error);
            //   });

            // let address = data.address;
            // let name = `${address[0]} ${address[1]}`;

            // getDownloadURL(ref(storage, photoSrc))
            //   .then((downloadURL) => {
            //     document
            //       .getElementById(photoId)
            //       .setAttribute("src", downloadURL);
            //   })
            //   .catch((error) => {
            //     console.log(error);
            //   });

            return (
              <div
                style={{
                  display: "flex",
                  position: "relative",
                  margin: "0 auto",
                  flexDirection: "row",
                  maxWidth: "80vw",
                  padding: "20px",
                  backgroundColor: "pink",
                  marginTop: "20px",
                  justifyContent: "space-evenly",
                  borderRadius: "10px",
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
                      backgroundColor: "red",
                      borderRadius: "10px",
                    }}
                  >
                    Unable to Complete
                  </p>
                )}
                {/* <p>
                  {firstName} {lastName}
                </p> */}

                {clientReview && (
                  <div>
                    <p>Client Review: {clientReview}</p>
                    <p>Edited: {clientDateString}</p>
                  </div>
                )}
                {isClient && (
                  <button
                    type="button"
                    onClick={() => editClientReview(ticket)}
                  >
                    Edit
                  </button>
                )}
                {agentReview && (
                  <div>
                    <p>Agent Review: {agentReview}</p>
                    <p>Edited: {agentDateString}</p>
                  </div>
                )}
                {isAgent && (
                  <button type="button" onClick={() => editAgentReview(ticket)}>
                    Edit
                  </button>
                )}
                <Link to={`/book-agent/${agentId}`}>
                  <button type="button">Go to Agent Profile</button>
                </Link>

                {/* <img
                  id={photoId}
                  src=""
                  style={{ width: "30px", height: "30px" }}
                  alt="agent profile"
                /> */}
                <p>{term === "full_day" ? "Full Day" : "Half Day"}</p>

                <p>Scheduled for {scheduleDateString}</p>

                <p>Booked on {bookDateString}</p>
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

                {paidInFull ? (
                  <p>{`Paid in Full: ${Math.floor(
                    Number((collectedPayout / 100) * 3)
                  )}`}</p>
                ) : (
                  <p>
                    Prepaid ${collectedPayout / 100} of $
                    {Math.floor(Number((collectedPayout / 100) * 3))}
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
          marginTop: "100px",
          margin: "0 auto",
        }}
      >
        <div className="google" style={{ padding: "100px" }}>
          <p>No Appointments in Your History</p>
        </div>
      </div>
    );
  }
};
export default HistoryUser;
