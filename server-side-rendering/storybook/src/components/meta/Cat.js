import React from "react";

export default class Cat extends React.Component {

    render() {
        const mouse = this.props.mouse;
        return (
            <img src="./cat.jpg" style={{
                position: "absolute",
                top: mouse.y,
                left: mouse.x
            }} />
        )
    }
}