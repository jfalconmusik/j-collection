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
import { ConsoleLogger } from "@aws-amplify/core";
import Lottie from "react-lottie-player";
import loadingData from "../8682-loading.json";
const TicketsUser = () => {
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
    agentList,
    setAgentList,
    infoLoaded,
  } = useContext(Context);

  const storage = getStorage();

  const location = useLocation();

  const functions = getFunctions();

  const [userId, setUserId] = useState(null);

  // each object in the agent list will include an agent property and a ticket property

  useEffect(() => {
    let id = location.pathname.split("/")[2];
    console.log("location based user id: ", id);
    setUserId(id);
  }, [location]);

  useEffect(() => {
    if (userSchedule && userSchedule.length > 0) {
      const getAgentsFromTickets = httpsCallable(
        functions,
        "getAgentsFromTickets"
      );
      getAgentsFromTickets({ userSchedule }).then((result) => {
        let data = result.data;
        let agents = data.agents;
        if (data.success) {
          console.log(agents);
          let schedule = [...userSchedule];
          let combined = [];

          for (let item of schedule) {
            let ticket = item.ticket;
            console.log("ticket: ", ticket);
            console.log("ticket.agentId: ", ticket.agentId);

            let ticketAgentId = ticket.agentId;
            let agentAgentId = null;
            let agentTemp = null;

            for (let agent of agents) {
              console.log("agent: ", agent);
              console.log("agent.agentId: ", agent.agentId);
              if (ticketAgentId == agent.agentId) {
                agentAgentId = agent.agentId;
                agentTemp = agent;
                break;
              }
            }
            if (ticketAgentId == agentAgentId) {
              console.log("match found");
              console.log("ticketAgentId: ", ticketAgentId);
              console.log("agentAgentId: ", agentAgentId);
              combined.push({ agent: agentTemp, ticket });
            }
          }
          //   let newArr = userSchedule.map((ticket) => {
          //     let agent = agents.find((i) => i.agentId === ticket.agentId);
          //     console.log("correct agent: ", agent);
          //     console.log("ticket: ", ticket);
          //     return { ticket, agent };
          //   });

          console.log("combined: ", combined);
          setAgentList(combined);
        } else {
          console.log("error retrieving agents");
          setAgentList([]);
        }
      });
    }
  }, [userSchedule]);

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
  } else if (agentList && agentList.length > 0) {
    return (
      <div className="userTickets">
        <div
          style={{
            flexDirection: "column",
            overflowY: "scroll",
            maxHeight: "80vh",
            width: "80vw",
            position: "relative",
            margin: "0 auto",
            borderRadius: "10px",
          }}
        >
          {agentList.map((agentTicket, i) => {
            // write a function which retrieves

            console.log("agentTicket: ", agentTicket);
            let agent = agentTicket.agent;
            let agentId = agent.agentId;
            let ticket = agentTicket.ticket;
            let agentPhotos = ticket.agentPhotos || [];
            let hasPhotos = agentPhotos.length > 0;

            let photoId = `agent-photo-${i}`;
            let photoSrc = agent.photo;
            let firstName = agent.name.firstName;
            let lastName = agent.name.lastName;
            let rating = agent.rating;
            let phone = agent.phone;

            let term = ticket.term;
            let status = ticket.status;
            let complete = status == "complete";
            let unable = status == "unable";
            let timeFrame = ticket.timeFrame;
            let paidInFull = ticket.paidInFull || false;
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
            let nowDay = nowDate.getDate();
            let nowMonth = nowDate.getMonth();
            let nowYear = nowDate.getFullYear();

            let scheduleDay = scheduleDate.getDate();
            let scheduleMonth = scheduleDate.getMonth();
            let scheduleYear = scheduleDate.getFullYear();

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
                  padding: "20px",
                  backgroundColor: "pink",
                  marginTop: "10px",
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
                      backgroundColor: "red",
                      borderRadius: "10px",
                    }}
                  >
                    Unable to Complete
                  </p>
                )}
                <Link to={`/book-agent/${agentId}`}>
                  <p>
                    {firstName} {lastName}
                  </p>
                  <img
                    id={photoId}
                    src=""
                    style={{ width: "60px", height: "60px" }}
                    alt="agent profile"
                  />
                </Link>
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
                  <p>Expect them today, {scheduleDateString}!</p>
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
                {!pastTime || isToday ? (
                  <button
                    type="button"
                    disabled={!pastTime || isToday}
                    onClick={() => {
                      setShowModalCenter(true);
                      setIsReviewTicket(true);
                      setSelectedTicket({ ticket, agent });
                    }}
                  >
                    Leave Review
                  </button>
                ) : (
                  <div>
                    <button
                      disabled={!pastTime || isToday}
                      className="tooltip"
                      style={{
                        // width: "100px",
                        // margin: "0 auto",
                        position: "relative",
                      }}
                      type="button"
                      onClick={() => {
                        setShowModalCenter(true);
                        setIsReviewTicket(true);
                        setSelectedTicket({ ticket, agent });
                      }}
                    >
                      Leave Review
                      <span class="tooltiptext">
                        You can only leave a review after the appointment date.
                      </span>
                    </button>
                  </div>
                )}

                <button
                  type="button"
                  disabled={pastTime}
                  onClick={() => {
                    setShowModalCenter(true);
                    setIsCancelTicket(true);
                    setSelectedTicket({ ticket, agent });
                  }}
                >
                  Cancel
                </button>

                <button
                  disabled={!pastTime || !paidInFull}
                  className="tooltip"
                  style={{
                    // width: "100px",
                    // margin: "0 auto",
                    position: "relative",
                  }}
                  type="button"
                  onClick={() => {
                    setShowModalCenter(true);
                    setIsDeleteTicket(true);
                    setSelectedTicket({ ticket });
                  }}
                >
                  Delete
                  <span class="tooltiptext">
                    Once the agent reports that you have paid in full,
                    appointments are deleted automatically after a week and
                    moved to Your History.
                  </span>
                </button>
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
          <p>No Appointments Scheduled!</p>
        </div>
      </div>
    );
  }
};
export default TicketsUser;
