import React from "react";
import Mouse from "../meta/Mouse";

export default function withMouse(Component) {
    return class extends React.Component {
        render() {
            <Mouse render={mouse => (
                <Component mouse={mouse} {...this.props}></Component>
            )}></Mouse>
        }
    }
}