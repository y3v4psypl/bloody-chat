import * as React from "react";
import { SignIn } from "../components/SignIn/SignIn";
import { withLayout } from "../components/Layout/Layout";

const Signup = () => {
    return (
        <SignIn />
    );

}

export default withLayout(Signup);