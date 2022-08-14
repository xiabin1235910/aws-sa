import render from "./render.js"

export default () =>
  (req, res, next) => {
    return render(req, res, next);
  };
