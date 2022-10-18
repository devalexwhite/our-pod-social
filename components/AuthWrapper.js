import React from "react";
import { useSigninCheck } from "reactfire";
import EnterPage from "../pages/enter";

import LoadingSpinner from "./LoadingSpinner";

export default function AuthWrapper({ toRender }) {
  const { status, data: signInCheck } = useSigninCheck();

  return (
    <>
      {status == "loading" && <LoadingSpinner />}
      {status != "loading" &&
        signInCheck.signedIn &&
        React.createElement(toRender, { user: signInCheck.user })}
      {status != "loading" && !signInCheck.signedIn && <EnterPage />}
    </>
  );
}
