import * as React from "react";
import Chat from "../components/Chat/Chat";
import {withLayout} from "../components/Layout/Layout";

const Chats = () => {
    return (
        <Chat />
    );
}

export default withLayout(Chats);