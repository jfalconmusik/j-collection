import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <nav className="footer">
      <h2
        style={{
          position: "relative",
          top: ".5em",
          left: ".25em",
        }}
        className="footItem"
      >
        <Link to="/privacy-policy" className="li">
          Privacy Policy
        </Link>
      </h2>
      <h2 className="footItem">
        <Link to="/terms-of-service" className="li">
          Terms of Service
        </Link>
      </h2>
      <h2 className="footItem">
        <Link to="/contact" className="li">
          Contact Us
        </Link>
      </h2>
      <a href="https://www.facebook.com/jivaoriginals">
        <img
          alt="jiva facebook page"
          src="https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/fb2.svg?alt=media&token=0cc8b80d-8da9-43d4-9767-0248c8669473"
          width="30em"
          height="auto"
        ></img>
      </a>
      <a
        style={{ position: "relative", margin: "30px" }}
        href="https://jiva-originals.myshopify.com"
      >
        <img
          width="30em"
          height="auto"
          alt="shopify"
          src="https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/svg%2Fshopify_glyph.svg?alt=media&token=1ea3c119-71d3-41d9-95a7-9b810f66d3bf"
        ></img>
      </a>
    </nav>
  );
}

export default Footer;
