import Loader from "../index";

const defaultContext = {
  cachable: false
};

const load = (source, context = defaultContext) => {
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

describe("frontmatter-markdown-loader", () => {
  let loaded;

  describe("against Frontmatter markdown without any option", () => {
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

  it("doesn't returns 'vue' property", () => {
    expect(loaded.vue).toBeUndefined();
  });


  describe("with Vue option", () => {
    beforeEach(() => {
      loaded = load(markdownWithFrontmatter, { ...defaultContext, query: { vue: true } });
    });

    it("returns 'vue' property which has render and staticRenderFns", () => {
      expect(loaded.vue).toBeDefined();
      expect(loaded.vue.render).toBeDefined();
      expect(loaded.vue.staticRenderFns).toBeDefined();
    });
  });
});
