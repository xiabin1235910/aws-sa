import React from "react";
import { renderToString } from "react-dom/server.js";
import { Helmet } from "react-helmet";
import { ChunkExtractor } from "@loadable/server";
import path from "path";
import { default as App } from "../src/components/App.js";

const statsFile = path.resolve("./buildClientUp/static/stats.json");

export default async (req, res, next) => {
  try {
    const extractor = new ChunkExtractor({ statsFile });
    // Wrap your application using "collectChunks"

    const serverData = await App.getInitialProps() || { props: {} };
    serverData.props.ssr = true;

    const jsx = extractor.collectChunks(createApp(App, serverData));

    // Render your application
    const html = renderToString(jsx);
    // You can now collect your script tags
    const scriptTags = extractor.getScriptTags(); // or extractor.getScriptElements();
    // You can also collect your "preload/prefetch" links
    const linkTags = extractor.getLinkTags(); // or extractor.getLinkElements();
    // And you can even collect your style tags (if you use "mini-css-extract-plugin")
    const styleTags = extractor.getStyleTags(); // or extractor.getStyleElements();
    const helmet = Helmet.renderStatic();

    return res.send(`<!DOCTYPE html>
     <html ${helmet.htmlAttributes.toString()}>
        <head>
            ${helmet.title.toString()}
            ${helmet.meta.toString()}
            ${helmet.link.toString()}
          
            <link rel="shortcut icon" href="data:;base64,=">
            ${styleTags}
        </head>
       
        <body ${helmet.bodyAttributes.toString()}>
          <div id="root">${html}</div>
          ${scriptTags}
        </body>

        <script>window.__INITIAL__DATA__ = ${JSON.stringify({ ...serverData.props })}</script>
      </html>`);
  } catch (err) {
    console.error(err);
  }
};

const createApp = (App, data) => {
  return <App {...data.props} />
};
