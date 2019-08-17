import Loader from "../index";
import { mount, createLocalVue } from "@vue/test-utils";
import ChildComponent from "./child-component";
import CodeConfusing from "./code-confusing";
import nodeEval from "node-eval";

let loaded;

const defaultContext = {
  cachable: false,
  resourcePath: "/somewhere/frontmatter.md"
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

GOOD \`BYE\` FRIEND
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

<code-confusing />

\`\`\`html
<child-component>{{ test->() }}</child-component>
\`\`\`

\`\`\`
<sample-component>{{ app->() }}</sample-component>
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
      expect(loaded.html).toBe("<h1>Title</h1>\n<p>GOOD <code>BYE</code> FRIEND</p>\n");
    });

    it("returns raw markdown body for 'body' property", () => {
      expect(loaded.body).toBe("# Title\n\nGOOD `BYE` FRIEND\n");
    });

    it("returns frontmatter object for 'attributes' property", () => {
      expect(loaded.attributes).toEqual({
        subject: "Hello",
        tags: ["tag1", "tag2"]
      });
    });

    it("returns meta data on 'meta' property", () => {
      expect(loaded.meta).toEqual({
        resourcePath: "/somewhere/frontmatter.md"
      });
    });

    it("doesn't returns 'vue' property", () => {
      expect(loaded.vue).toBeUndefined();
    });
  });

  describe("with Vue option", () => {
    const mountComponent = (component) => {
      const localVue = createLocalVue();
      return mount(component, { localVue });
    };

    const buildVueComponent = () => {
      return {
        data () {
          return {
            templateRender: null
          }
        },

        components: { ChildComponent, CodeConfusing },

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
      load(markdownWithFrontmatter, { ...defaultContext, query: { mode: ["vue-render-functions"] } });
      expect(loaded.vue).toBeDefined();
      expect(loaded.vue.render).toBeDefined();
      expect(loaded.vue.staticRenderFns).toBeDefined();
    });

    it("returns functions to run as Vue component giving 'frontmatter-markdown' to class of root element", () => {
      load(markdownWithFrontmatter, { ...defaultContext, query: { mode: ["vue-render-functions"] } });
      const wrapper = mountComponent(buildVueComponent());
      expect(wrapper.attributes().class).toBe("frontmatter-markdown");
    });

    it("returns functions to run as Vue component giving requested name to class of root element", () => {
      load(markdownWithFrontmatter, { ...defaultContext, query: { mode: ["vue-render-functions"], vue: { root: "forJest" } } });
      const wrapper = mountComponent(buildVueComponent());
      expect(wrapper.attributes().class).toBe("forJest");
    });

    it("returns functions to run as Vue component which has the correct template", () => {
      load(markdownWithFrontmatter, { ...defaultContext, query: { mode: ["vue-render-functions"], vue: { root: "forJest" } } });
      const wrapper = mountComponent(buildVueComponent());
      expect(wrapper.html()).toBe('<div class=\"forJest\"><h1>Title</h1> <p>GOOD <code>BYE</code> FRIEND</p></div>');
    });

    it("returns functions to run as Vue component which includes child component", () => {
      load(markdownWithFrontmatterIncludingChildComponent, { ...defaultContext, query: { mode: ["vue-render-functions"] } });
      const wrapper = mountComponent(buildVueComponent());
      expect(wrapper.find(ChildComponent).exists()).toBe(true);
      expect(wrapper.find(".childComponent").text()).toBe("Child Vue Component olloeh");
    });

    it("returns extendable base Vue component", () => {
      load(markdownWithFrontmatterIncludingChildComponent, { ...defaultContext, query: { mode: ["vue-component"] } });
      const component = {
        extends: loaded.vue.component,
        components: { ChildComponent, CodeConfusing }
      };
      const wrapper = mountComponent(component);
      expect(wrapper.find(ChildComponent).exists()).toBe(true);
      expect(wrapper.find(".childComponent").text()).toBe("Child Vue Component olloeh");
    });

    it("avoids compiling code snipets on markdown", () => {
      load(markdownWithFrontmatterIncludingChildComponent, { ...defaultContext, query: { mode: ["vue-component"] } });
      const component = {
        extends: loaded.vue.component,
        components: { ChildComponent, CodeConfusing }
      };
      const wrapper = mountComponent(component);
      const snipets = wrapper.findAll("code");
      expect(snipets).toHaveLength(2);
      expect(snipets.at(0).text()).toContain("<child-component>{{ test->() }}</child-component>");
      expect(snipets.at(1).text()).toContain("<sample-component>{{ app->() }}</sample-component>");
      expect(wrapper.contains(CodeConfusing)).toBe(true);
    });
  });
});
