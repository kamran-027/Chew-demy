import React, { useState } from "react";
import "./SignIn.css";
import axios from "axios";

interface userDetails {
  username: string | number | readonly string[] | undefined;
  password: string | number | readonly string[] | undefined;
}

const SignIn = () => {
  const [userDetails, setUserDetails] = useState<userDetails>({
    username: "",
    password: "",
  });
  const [isSignUp, setIsSignUp] = useState(false);

  const signInAdmin = () => {
    axios({
      method: "post",
      url: `http://localhost:3000/admin/signin`,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        username: userDetails.username,
        password: userDetails.password,
      }),
    });
    setUserDetails({
      username: "",
      password: "",
    });
  };

  const signUpAdmin = () => {
    axios({
      method: "post",
      url: `http://localhost:3000/admin/signup`,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        username: userDetails.username,
        password: userDetails.password,
      }),
    });
    setUserDetails({
      username: "",
      password: "",
    });
  };

  return (
    <div className="sign-in-page">
      <h1>Chewdemy</h1>
      <h2 className="header-text">
        {isSignUp ? "Provide the admin details" : "Enter admin details"}
      </h2>
      <input
        className="signin-input"
        placeholder="Enter Username"
        type="text"
        value={userDetails.username}
        onChange={(e) =>
          setUserDetails({ ...userDetails, username: e.target.value })
        }
      />
      <input
        className="signin-input"
        placeholder="Enter Password"
        type="text"
        value={userDetails.password || ""}
        onChange={(e) =>
          setUserDetails({ ...userDetails, password: e.target.value })
        }
      />
      <p>
        Not a admin yet,{" "}
        <a className="signup-link" onClick={() => setIsSignUp(true)}>
          Sign Up
        </a>
      </p>
      <button
        onClick={isSignUp ? signUpAdmin : signInAdmin}
        className="signin-btn"
      >
        {isSignUp ? "Sign Up" : "Sign In"}
      </button>
    </div>
  );
};

export default SignIn;
