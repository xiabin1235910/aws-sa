import React from "react";
import MouseTracker from "./composite/MouseTracker.js"; // use loadable-component ?
import { default as Button } from "./meta/Button.js";

export default function App() {

    return (
        <>
            <div style={{
                width: "100px",
                height: "100px"
            }}>
                <Button></Button>
            </div>

            <MouseTracker></MouseTracker>
        </>
    )
}

App.getInitialProps = () => {
    return null
}
