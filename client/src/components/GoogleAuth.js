import React from "react";
import Button from "../styles/Auth";
import { SignInIcon } from "./Icons";
import { GoogleLogin } from "react-google-login";
import { authenticate } from '../utils/api-client';

function GoogleAuth() {
  

  return (
    <GoogleLogin
      render={(props) => (
        <Button tabIndex={0} type="button" onClick={props.onClick} disabled={props.disabled}>
          <span className="outer">
            <span className="inner">
              <SignInIcon />
            </span>
            sign in
          </span>
        </Button>
      )}
      clientId="311563765460-8amt6ikkopolg6rmq74k0otq0eseuuv0.apps.googleusercontent.com"
      onSuccess={authenticate}
      onFailure={authenticate}
      cookiePolicy={'single_host_origin'}
    />
  );
}

export default GoogleAuth;
