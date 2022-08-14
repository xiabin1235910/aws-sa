export default () =>
  async (req, res, next) => {
    const renderer = (await import("./render.js")).default;
    return renderer(req, res, next);
  };
