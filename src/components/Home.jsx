import React from "react";

function Home() {
  return (
    <div style={{ display: "inline-block", minHeight: "1000px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          flexDirection: "row",
        }}
      >
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
            Get Service
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
