// every component should have the mocked ssr prepared data, so that we can can the real feedback from story book UI.
import React from "react";

const Button = React.forwardRef(({ name }, ref) => (
    <div
        style={{
            width: '100%',
            height: '100%',
            backgroundColor: 'orange',
            textAlign: "center",
            borderRadius: "5px",
        }}
        ref={ref}
    >
        {name || 'post ad'}

        <button>Click</button>
    </div>

));

export default Button;