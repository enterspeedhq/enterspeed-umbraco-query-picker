import { LitElement as g, html as p, css as C, property as y, state as a, customElement as E } from "@umbraco-cms/backoffice/external/lit";
import { UmbPropertyValueChangeEvent as F } from "@umbraco-cms/backoffice/property-editor";
import { UMB_NOTIFICATION_CONTEXT as V } from "@umbraco-cms/backoffice/notification";
import { UmbElementMixin as w } from "@umbraco-cms/backoffice/element-api";
import { UMB_MODAL_MANAGER_CONTEXT as q } from "@umbraco-cms/backoffice/modal";
var $ = Object.defineProperty, b = Object.getOwnPropertyDescriptor, _ = (e) => {
  throw TypeError(e);
}, r = (e, t, n, o) => {
  for (var s = o > 1 ? void 0 : o ? b(t, n) : t, h = e.length - 1, c; h >= 0; h--)
    (c = e[h]) && (s = (o ? c(t, n, s) : c(s)) || s);
  return o && s && $(t, n, s), s;
}, P = (e, t, n) => t.has(e) || _("Cannot " + n), T = (e, t, n) => t.has(e) ? _("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, n), u = (e, t, n) => (P(e, t, "access private method"), n), l, v, m, f, x, R, d;
let i = class extends w(g) {
  constructor() {
    super(), T(this, l), this.value = "", this._enterspeedEnvironmentClient = "", this._enterspeedIndex = "", this._enterspeedQueryField = "", this._enterspeedResultValueField = "", this._enterspeedResultDisplayField = "", this._enterspeedQueryFieldPlaceholderText = "", this._queryValue = "", this._queryResult = [], this.consumeContext(q, (e) => {
      this._modalManagerContext = e;
    }), this.consumeContext(V, (e) => {
      this._notificationContext = e;
    }), document.addEventListener("click", u(this, l, x).bind(this));
  }
  set config(e) {
    this._enterspeedEnvironmentClient = e.getValueByAlias("enterspeedEnvironmentClient") ?? "", this._enterspeedIndex = e.getValueByAlias("enterspeedIndex") ?? "", this._enterspeedQueryField = e.getValueByAlias("enterspeedQueryField") ?? "", this._enterspeedResultValueField = e.getValueByAlias("enterspeedResultValueField") ?? "", this._enterspeedResultDisplayField = e.getValueByAlias("enterspeedResultDisplayField") ?? "", this._enterspeedQueryFieldPlaceholderText = e.getValueByAlias("enterspeedQueryFieldPlaceholderText") ?? "";
  }
  render() {
    return p`
          <uui-input
          class="element"
          label="text input"
          placeholder=${this._enterspeedQueryFieldPlaceholderText}
          .value=${this._queryValue}
          @input=${u(this, l, v)}
        >
        </uui-input>
        
        ${this._queryValue ? p`
            <uui-box id="result-wrapper">
            ${this._queryResult.length > 0 ? p`
                  <uui-ref-list>
                    ${this._queryResult.map(
      (e) => p`<uui-ref-node name="${e.name}"
                        class="result"
                        readonly
                        ?selectable=${!1}
                        @click=${(t) => u(this, l, m).call(this, t, e)}
                      >
									      <umb-icon slot="icon" name=""></umb-icon>
                      </uui-ref-node>`
    )}
                  </uui-ref-list>` : p`
                <uui-ref-list>
                  <uui-ref-node name="No results"
                        readonly
                        ?selectable=${!1}
                  >
									      <umb-icon slot="icon" name=""></umb-icon>
                  </uui-ref-node>
                </uui-ref-list>
              `}
            </uui-box>` : p``}

        <div id="wrapper">
          <uui-input
            class="element"
            ?readonly=${!0}
            @input=${u(this, l, R)}
            .value=${this.value || ""}
          >
            <div slot="append">
              <uui-button @click=${u(this, l, f)} title="Clear value">
                <uui-icon style="font-size: 40px;">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </uui-icon>
              </uui-button>
            </div>
          </uui-input>
        </div>
        `;
  }
};
l = /* @__PURE__ */ new WeakSet();
v = function(e) {
  if (this._queryValue = e.target.value, this._queryValue === "") {
    this._queryResult = [];
    return;
  }
  const t = {
    filters: {},
    pagination: {
      page: 0,
      pageSize: 5
    }
  };
  t.filters[this._enterspeedQueryField] = {
    operator: "equals",
    value: this._queryValue
  }, (async () => {
    const o = await (await fetch(`https://query.dev.enterspeed.io/v1-preview/${this._enterspeedIndex}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": `${this._enterspeedEnvironmentClient}`
      },
      body: JSON.stringify(t)
    })).json();
    this._queryResult = o.results.map((s) => ({
      name: `${s[this._enterspeedResultValueField]}${this._enterspeedResultDisplayField !== "" ? ` - ${s[this._enterspeedResultDisplayField]}` : ""}`,
      value: s[this._enterspeedResultValueField]
    }));
  })();
};
m = function(e, t) {
  e.stopPropagation(), this._queryValue = "", this._queryResult = [], this.value = t.value, u(this, l, d).call(this);
};
f = function() {
  this.value = "", u(this, l, d).call(this);
};
x = function(e) {
  var t;
  (t = document.getElementById("result-wrapper")) != null && t.contains(e.target) || (this._queryResult = []);
};
R = function(e) {
  this.value = e.target.value, u(this, l, d).call(this);
};
d = function() {
  this.dispatchEvent(new F());
};
i.styles = [
  C`
        #result-wrapper {
          border: solid 1px #999999;
          position: absolute;
          z-index: 9999;
        }
        .element {
          width: 100%;
          margin-bottom: 10px;
        }
        .result {
          cursor: pointer;
        }
        .result:hover {
          color: #3544b1;
          /* color: var(--uui-color-interactive-emphasi); */
        }
      `
];
r([
  y({ type: String })
], i.prototype, "value", 2);
r([
  y({ attribute: !1 })
], i.prototype, "config", 1);
r([
  a()
], i.prototype, "_enterspeedEnvironmentClient", 2);
r([
  a()
], i.prototype, "_enterspeedIndex", 2);
r([
  a()
], i.prototype, "_enterspeedQueryField", 2);
r([
  a()
], i.prototype, "_enterspeedResultValueField", 2);
r([
  a()
], i.prototype, "_enterspeedResultDisplayField", 2);
r([
  a()
], i.prototype, "_enterspeedQueryFieldPlaceholderText", 2);
r([
  a()
], i.prototype, "_queryValue", 2);
r([
  a()
], i.prototype, "_queryResult", 2);
i = r([
  E("enterspeed-query-picker-property-editor-ui")
], i);
export {
  i as default
};
//# sourceMappingURL=enterspeed-query-picker.element-C3MBiCz4.js.map
