import * as React from "react";
import Chat from "../components/Chat/Chat";
import Menu from "../components/Menu/Menu";
import {withLayout} from "../components/Layout/Layout";

const Chats = () => {
    return (
        <div>
            <Menu />
            <Chat />
        </div>
    );
}

export default withLayout(Chats);