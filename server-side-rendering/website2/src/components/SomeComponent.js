import React, { useRef } from "react";
import loadable from "@loadable/component";

import { useAppState } from './AppStateProvider';

const Button = loadable(() => import("storybook/Button"), { ssr: true });

const SomeComponent = ({ name }) => {

  const textInput = useRef(null);
  const ref = React.createRef();

  function handleClick() {
    console.log(textInput.current.value);
    console.log(ref.current.style.width)
  }

  const [state, dispatch] = useAppState();

  return (
    <>
      <div
        style={{
          padding: "1em",
          margin: "1em",
          border: "1px solid black",
          backgroundColor: "#ccc",
        }}
        onClick={() => {
          handleClick()
          dispatch({ type: 'increment', value: 3 })
        }}
      >
        Header of {name} from website2. You can change this and reload localhost:3001 - the
        changes take new on SSR and client side
      </div>

      <div style={{
        width: "100px",
        height: "150px",
      }}>
        <Button name="hello world" ref={ref} />
      </div>

      <div>
        <input type="text" ref={textInput} />
        <input type="text" value={state.count} />
      </div>
    </>
  )
};

export default SomeComponent;
