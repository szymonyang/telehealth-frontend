import React from "react";
import ReactDom from "react-dom";
import Chat from "./containers/chat";

class App extends React.Component {
    render() {
        // return <div>hello</div>;
        return <Chat />;
    }
}

ReactDom.render(<App />, document.getElementById("app"));
