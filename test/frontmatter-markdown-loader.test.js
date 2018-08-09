import Loader from "../index";

const context = {
  cachable: false
};

const load = (source) => {
  const rawLoaded = Loader.call(context, source);
  return JSON.parse(rawLoaded.replace(/^module.exports =/, ""));
}

const markdownWithFrontmatter = `---
subject: Hello
tags:
  - tag1
  - tag2
---
# Title

GOOD BYE
`;

describe("loader", () => {
  let loaded;

  beforeEach(() => {
    loaded = load(markdownWithFrontmatter);
  });

  it("returns compiled HTML for 'html' property", () => {
    expect(loaded.html).toBe("<h1>Title</h1>\n<p>GOOD BYE</p>\n");
  });

  it("returns raw markdown body for 'body' property", () => {
    expect(loaded.body).toBe("# Title\n\nGOOD BYE\n");
  });

 it("returns frontmatter object for 'attributes' property", () => {
    expect(loaded.attributes).toEqual({
      subject: "Hello",
      tags: ["tag1", "tag2"]
    });
  });
});
