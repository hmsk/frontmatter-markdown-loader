import Loader from "../index";
import { mount, createLocalVue } from "@vue/test-utils";
import ChildComponent from "./child-component";
import nodeEval from "node-eval";

let loaded;

const defaultContext = {
  cachable: false
};

const load = (source, context = defaultContext) => {
  const rawLoaded = Loader.call(context, source);
  loaded = nodeEval(rawLoaded);
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

const markdownWithFrontmatterIncludingChildComponent = `---
subject: Hello
tags:
  - tag1
  - tag2
---
# Title

HELLO
<child-component>

\`\`\`html
<child-component>{{ test->() }}</child-component>
\`\`\`
`;

describe("frontmatter-markdown-loader", () => {
  afterEach(() => {
    loaded = undefined;
  });

  describe("against Frontmatter markdown without any option", () => {
    beforeEach(() => {
      load(markdownWithFrontmatter);
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

    it("doesn't returns 'vue' property", () => {
      expect(loaded.vue).toBeUndefined();
    });
  });

  describe("with Vue option", () => {
    const buildVueComponent = () => {
      const localVue = createLocalVue();
      return {
        data () {
          return {
            templateRender: null
          }
        },

        components: { ChildComponent },

        render: function (createElement) {
          return this.templateRender ? this.templateRender() : createElement("div", "Rendering");
        },

        created: function () {
          this.templateRender = new Function(loaded.vue.render)();
          this.$options.staticRenderFns = new Function(loaded.vue.staticRenderFns)();
        }
      }
    };

    it("returns 'vue' property which has render and staticRenderFns", () => {
      load(markdownWithFrontmatter, { ...defaultContext, query: { vue: true } });
      expect(loaded.vue).toBeDefined();
      expect(loaded.vue.render).toBeDefined();
      expect(loaded.vue.staticRenderFns).toBeDefined();
    });

    it("returns functions to run as Vue component giving 'frontmatter-markdown' to class of root element", () => {
      load(markdownWithFrontmatter, { ...defaultContext, query: { vue: true } });
      const component = buildVueComponent();
      const wrapper = mount(component);
      expect(wrapper.attributes().class).toBe("frontmatter-markdown");
    });

    it("returns functions to run as Vue component giving requested name to class of root element", () => {
      load(markdownWithFrontmatter, { ...defaultContext, query: { vue: { root: "forJest" } } });
      const component = buildVueComponent();
      const wrapper = mount(component);
      expect(wrapper.attributes().class).toBe("forJest");
    });

    it("returns functions to run as Vue component which includes child component", () => {
      load(markdownWithFrontmatterIncludingChildComponent, { ...defaultContext, query: { vue: true } });
      const component = buildVueComponent();
      const wrapper = mount(component);
      expect(wrapper.find(ChildComponent).exists()).toBe(true);
      expect(wrapper.find(".childComponent").text()).toBe("Child Vue Component olloeh");
    });

    it("returns extendable base Vue component", () => {
      load(markdownWithFrontmatterIncludingChildComponent, { ...defaultContext, query: { vue: true } });
      const component = {
        extends: loaded.vue.component,
        components: { ChildComponent }
      };
      const wrapper = mount(component);
      expect(wrapper.find(ChildComponent).exists()).toBe(true);
      expect(wrapper.find(".childComponent").text()).toBe("Child Vue Component olloeh");
    });

    it("avoids compiling code snipets on markdown", () => {
      load(markdownWithFrontmatterIncludingChildComponent, { ...defaultContext, query: { vue: true } });
      const component = {
        extends: loaded.vue.component,
        components: { ChildComponent }
      };
      const wrapper = mount(component);
      expect(wrapper.find("code").text()).toContain("<child-component>{{ test->() }}</child-component>");
    });
  });
});
