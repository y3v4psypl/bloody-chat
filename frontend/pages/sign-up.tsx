import * as React from "react";
import { SignUp } from "../components/SignUp/SignUp";
import { withLayout } from "../components/Layout/Layout";

const Signup = () => {
    return (
        <SignUp />
    );

}

export default withLayout(Signup);