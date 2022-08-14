import React from "react";
import { BrowserRouter } from "react-router-dom";
import { default as App } from "./App.js";

export default function FederationApp() {
  return (
    <BrowserRouter>
      <App {...window.__INITIAL__DATA__} />
    </BrowserRouter>
  )
}