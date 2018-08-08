import Loader from "../index";

const context = {
  cachable: false
};

const load = (source) => {
  const rawLoaded = Loader.call(context, source);
  return JSON.parse(rawLoaded.replace(/^module.exports =/, ""));
}

describe("loader", () => {
  it("returns compiled HTML for 'html' property", () => {
    expect(load("# Title").html).toBe("<h1>Title</h1>\n");
  });
});
