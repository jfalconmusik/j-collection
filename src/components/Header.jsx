import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
// import firebase from "firebase";
import { Context } from "../Context";
// import Flexbox from "flexbox-react";

function Header() {
  const {
    accountTitleString,
    userInfo,
    itemList,
    isLargeScreen,
    isSmallScreen,
    isPortrait,
    isDesktopOrLaptop,
  } = useContext(Context);

  // window.onscroll = function () {
  //   scrollSet();
  // };

  // function scrollSet() {
  //   var winScroll =
  //     document.body.scrollTop || document.documentElement.scrollTop;
  //   var height =
  //     document.documentElement.scrollHeight -
  //     document.documentElement.clientHeight;
  //   var scrolled = (winScroll / height) * 100;
  //   document.getElementById("progressBar").completed = scrolled;
  // }

  // const storage = firebase.storage();
  // const storageRef = storage.ref();

  // get cart item number icon url:

  const [urlString, setUrlString] = useState("");

  const [listShow, setListShow] = useState("hidden");

  // useEffect(() => {
  //   if (!firebase.auth().currentUser && itemList.length == 0) {
  //     let url =
  //       "https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/cart%2Fcart-0.png?alt=media&token=60e4c09e-23b4-4ebe-831b-85a9f862d73c";
  //     let img = document.getElementById("headerCartIcon");
  //     // console.log(url)
  //     // img.src = url;
  //     setUrlString(url);
  //   } else if (itemList.length == 0) {
  //     // storageRef.child("cart-no-0.svg").getDownloadURL().then(function (url) {
  //     // })

  //     let url =
  //       "https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/cart%2Fcart-0.png?alt=media&token=60e4c09e-23b4-4ebe-831b-85a9f862d73c";
  //     let img = document.getElementById("headerCartIcon");
  //     // console.log(url)
  //     // img.src = url;
  //     setUrlString(url);
  //   } else if (itemList.length == 1) {
  //     // storageRef.child("cart-no-1.svg").getDownloadURL().then(function (url) {
  //     // })
  //     let img = document.getElementById("headerCartIcon");
  //     let url =
  //       "https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/cart%2Fcart-1.png?alt=media&token=90a75d25-258d-4250-b2be-b3d1e00bce38";
  //     // console.log(url)
  //     // img.src = url;
  //     setUrlString(url);
  //   } else if (itemList.length == 2) {
  //     // storageRef.child("cart-no-2.svg").getDownloadURL().then(function (url) {
  //     // })
  //     let url =
  //       "https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/cart%2Fcart-2.png?alt=media&token=2ad512f5-44cd-4497-bb2a-66f63290cdba";
  //     let img = document.getElementById("headerCartIcon");
  //     // console.log(url)
  //     // img.src = url;
  //     setUrlString(url);
  //   } else if (itemList.length == 3) {
  //     // storageRef.child("cart-no-3.svg").getDownloadURL().then(function (url) {
  //     // })
  //     let url =
  //       "https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/cart%2Fcart-3.png?alt=media&token=950bac7a-f4ff-41fa-95ae-be66f8d62e61";
  //     let img = document.getElementById("headerCartIcon");
  //     // console.log(url)
  //     // img.src = url;
  //     setUrlString(url);
  //   } else if (itemList.length == 4) {
  //     // storageRef.child("cart-no-4.svg").getDownloadURL().then(function (url) {
  //     // })
  //     let url =
  //       "https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/cart%2Fcart-4.png?alt=media&token=441f1ed0-7c9b-4aa7-8cf5-6ab08d2016e7";
  //     let img = document.getElementById("headerCartIcon");
  //     // console.log(url)
  //     // img.src = url;
  //     setUrlString(url);
  //   } else if (itemList.length == 5) {
  //     // storageRef.child("cart-no-5.svg").getDownloadURL().then(function (url) {
  //     // })
  //     let url =
  //       "https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/cart%2Fcart-5.png?alt=media&token=d6119f05-fd88-433d-986b-6ce26240f448";
  //     let img = document.getElementById("headerCartIcon");
  //     // console.log(url)
  //     // img.src = url;
  //     setUrlString(url);
  //   } else if (itemList.length == 6) {
  //     // storageRef.child("cart-no-6.svg").getDownloadURL().then(function (url) {
  //     // })
  //     let url =
  //       "https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/cart%2Fcart-6.png?alt=media&token=19b8b73a-245d-42cf-89cc-1a5094bbb695";
  //     let img = document.getElementById("headerCartIcon");
  //     // console.log(url)
  //     // img.src = url;
  //     setUrlString(url);
  //   } else if (itemList.length == 7) {
  //     // storageRef.child("cart-no-7.svg").getDownloadURL().then(function (url) {
  //     // })
  //     let url =
  //       "https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/cart%2Fcart-7.png?alt=media&token=92ecf7bd-ce5a-4169-99e7-959e20d74058";
  //     let img = document.getElementById("headerCartIcon");
  //     // console.log(url)
  //     // img.src = url;
  //     setUrlString(url);
  //   } else if (itemList.length == 8) {
  //     // storageRef.child("cart-no-8.svg").getDownloadURL().then(function (url) {
  //     // })
  //     let url =
  //       "https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/cart%2Fcart-8.png?alt=media&token=f1cf9f6a-3638-4653-9271-373ee29abfe5";
  //     let img = document.getElementById("headerCartIcon");
  //     // console.log(url)
  //     // img.src = url;
  //     setUrlString(url);
  //   } else if (itemList.length == 9) {
  //     // storageRef.child("cart-no-9.svg").getDownloadURL().then(function (url) {
  //     // })
  //     let url =
  //       "https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/cart%2Fcart-9.png?alt=media&token=d6229d45-2575-455b-8cbd-b9b1fcba2105";
  //     let img = document.getElementById("headerCartIcon");
  //     // console.log(url)
  //     // img.src = url;
  //     setUrlString(url);
  //   } else if (itemList.length == 10) {
  //     // storageRef.child("cart-no-10.svg").getDownloadURL().then(function (url) {
  //     // })
  //     let url =
  //       "https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/cart%2Fcart-10.png?alt=media&token=8174d8ad-4519-4a62-bbe0-bfac03ad39d3";
  //     let img = document.getElementById("headerCartIcon");
  //     // console.log(url)
  //     // img.src = url;
  //     setUrlString(url);
  //   } else if (itemList.length == 11) {
  //     // storageRef.child("cart-no-11.svg").getDownloadURL().then(function (url) {
  //     // })
  //     let url =
  //       "https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/cart%2Fcart-11.png?alt=media&token=1b1d61ea-2761-43c2-bdb6-82421f27c3c3";
  //     let img = document.getElementById("headerCartIcon");
  //     // console.log(url)
  //     // img.src = url;
  //     setUrlString(url);
  //   } else if (itemList.length == 12) {
  //     // storageRef.child("cart-no-12.svg").getDownloadURL().then(function (url) {
  //     // })
  //     let url =
  //       "https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/cart%2Fcart-12.png?alt=media&token=37f85708-53fa-49f0-9aa0-7b6faff6291f";
  //     let img = document.getElementById("headerCartIcon");
  //     // console.log(url)
  //     // img.src = url;
  //     setUrlString(url);
  //   } else if (itemList.length == 13) {
  //     // storageRef.child("cart-no-13.svg").getDownloadURL().then(function (url) {
  //     // })
  //     let url =
  //       "https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/cart%2Fcart-13.png?alt=media&token=519e8de7-35d6-4f3d-b146-46faa2f8df01";
  //     let img = document.getElementById("headerCartIcon");
  //     // console.log(url)
  //     // img.src = url;
  //     setUrlString(url);
  //   } else if (itemList.length > 13) {
  //     // storageRef.child("cart-smiley-2.svg").getDownloadURL().then(function (url) {
  //     // })
  //     let url =
  //       "https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/cart%2Fcart-full.png?alt=media&token=de1671de-333a-4049-9b91-2907b8d29871";
  //     let img = document.getElementById("headerCartIcon");
  //     // console.log(url)
  //     // img.src = url;
  //     setUrlString(url);
  //   }
  // }, [itemList, userInfo]);

  return (
    <div>
      <Link to="/">
        <div
          className="Header"
          style={{
            maxWidth: "100vw",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              position: "relative",
              margin: "0 auto",
              bottom: `55px`,
              height: "150px",
              width: `${isPortrait || isSmallScreen ? "100%" : "113%"}`,
              right: `${isPortrait || isSmallScreen ? "" : "60px"}`,
              justifyContent: "space-around",
              display: "flex",
              flexDirection: "row",
            }}
          >
            <img
              style={{
                position: "relative",
                bottom: "22px",
                // right: `60px`,
                display: `${isPortrait || isSmallScreen ? "none" : "initial"}`,
              }}
              height="100vw"
              width="100vw"
              alt="roses"
              src="https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/Corner%20Flower.png?alt=media&token=20612d0b-05d0-4da9-9086-197a80c8af2d"
            />
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
                width: "100vw",
                bottom: "120px",
                position: "relative",
              }}
            >
              {/* <img
                style={{
                  height: "500px",
                  // width: "100%",
                  // scale: "10",
                  transform: `${isSmallScreen ? "scale(1.6)" : ""}`,
                  bottom: `${isPortrait || isSmallScreen ? "30px" : ""}`,
                  // display: `${
                  //   isPortrait || isSmallScreen ? "none" : "initial"
                  // }`,
                  right: `${isPortrait || isSmallScreen ? "-10vw" : "0vw"}`,
                  // width: `${isPortrait || isSmallScreen ? "100vw" : "initial"}`,
                  position: "relative",
                  margin: "0 auto",
                  zIndex: "90",
                }}
                //   height="90px"
                src="https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/svg%2Fjivasoriginalsbanner.svg?alt=media&token=c144dd62-8ef2-4351-9c20-c0d3a078af55"
                alt="Jiva's Originals Header"
              /> */}
            </div>
            {/* <img
              height="100vw"
              width="100vw"
              alt="roses"
              style={{
                position: "relative",
                transform: "scaleX(-1)",
                bottom: "22px",
                left: `${isLargeScreen ? "0px" : "80px"}`,
                right: `${isPortrait || isSmallScreen ? "-20px" : ""}`,
                display: `${isPortrait || isSmallScreen ? "none" : "initial"}`,
              }}
              src="https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/Corner%20Flower.png?alt=media&token=20612d0b-05d0-4da9-9086-197a80c8af2d"
            /> */}
          </div>
        </div>
      </Link>
    </div>
  );
}

export default Header;
