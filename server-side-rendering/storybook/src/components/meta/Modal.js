import React, { useEffect } from "react";
import ReactDOM from "react-dom";

const Modal = ({ children }) => {
    const modalRoot = document.getElementById('modal-root');
    const element = document.createElement('div');

    useEffect(() => {
        modalRoot.appendChild(element)

        return () => {
            modalRoot.removeChild(element)
        }
    })

    return ReactDOM.createPortal(
        children,
        element
    )


}

export default Modal;