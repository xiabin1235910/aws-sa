import React from "react";
import Mouse from "../meta/Mouse";
import Cat from "../meta/Cat";
import withMouse from "./withMouse";

// const NewMouseTracker = withMouse(Cat);

export default class MouseTracker extends React.Component {
    render() {
        return (
            <>
                <h1>move mouse...</h1>
                <Mouse render={mouse => (
                    <Cat mouse={mouse} />
                )} />

                {/* <NewMouseTracker /> */}
            </>
        )

    }
}