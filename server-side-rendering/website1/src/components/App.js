import React from "react";
import loadable from "@loadable/component";
import { Routes, Route, Link } from "react-router-dom";

// eslint-disable-next-line
const Website2App = loadable(() => import("website2/App"), { ssr: false });
const Button = loadable(() => import("storybook/Button"));

export default () => (
  <div>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="website1" element={<Home />} />
      <Route path="website2" element={<Website2App />} />
    </Routes>

  </div>
);

// App.js
function Home() {
  return (
    <>
      <main>
        <h1 onClick={() => alert("website1 is interactive")}>This is website 1</h1>
        <Button name="Hi Bin" />
      </main>
      <nav>
        <Link to="/website2">website2</Link>
      </nav>
    </>
  );
}