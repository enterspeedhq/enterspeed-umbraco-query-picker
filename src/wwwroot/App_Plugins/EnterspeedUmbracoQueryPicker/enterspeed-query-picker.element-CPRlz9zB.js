import { LitElement as x, html as p, css as g, property as _, state as u, customElement as C } from "@umbraco-cms/backoffice/external/lit";
import { UmbPropertyValueChangeEvent as E } from "@umbraco-cms/backoffice/property-editor";
import { UMB_NOTIFICATION_CONTEXT as F } from "@umbraco-cms/backoffice/notification";
import { UmbElementMixin as V } from "@umbraco-cms/backoffice/element-api";
import { UMB_MODAL_MANAGER_CONTEXT as $ } from "@umbraco-cms/backoffice/modal";
var b = Object.defineProperty, q = Object.getOwnPropertyDescriptor, y = (e) => {
  throw TypeError(e);
}, i = (e, t, n, a) => {
  for (var r = a > 1 ? void 0 : a ? q(t, n) : t, h = e.length - 1, c; h >= 0; h--)
    (c = e[h]) && (r = (a ? c(t, n, r) : c(r)) || r);
  return a && r && b(t, n, r), r;
}, P = (e, t, n) => t.has(e) || y("Cannot " + n), T = (e, t, n) => t.has(e) ? y("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, n), o = (e, t, n) => (P(e, t, "access private method"), n), l, v, m, f, R, w, d;
let s = class extends V(x) {
  constructor() {
    super(), T(this, l), this.value = "", this._enterspeedEnvironmentClient = "", this._enterspeedIndex = "", this._enterspeedQueryField = "", this._enterspeedResultValueField = "", this._enterspeedResultDisplayField = "", this._enterspeedQueryFieldPlaceholderText = "", this._queryValue = "", this._queryResult = [], this._showResults = !1, this.consumeContext($, (e) => {
      this._modalManagerContext = e;
    }), this.consumeContext(F, (e) => {
      this._notificationContext = e;
    }), document.addEventListener("click", o(this, l, R).bind(this));
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
          @input=${o(this, l, v)}
        >
        </uui-input>
        
        ${this._showResults ? p`
            <uui-box id="result-wrapper">
            ${this._queryResult.length > 0 ? p`
                  <uui-ref-list>
                    ${this._queryResult.map(
      (e) => p`<uui-ref-node name="${e.name}"
                        class="result"
                        readonly
                        ?selectable=${!1}
                        @click=${(t) => o(this, l, m).call(this, t, e)}
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
            @input=${o(this, l, w)}
            .value=${this.value || ""}
          >
            <div slot="append">
              <uui-button @click=${o(this, l, f)} title="Clear value">
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
  t.filters = {
    and: [{
      field: this._enterspeedQueryField,
      operator: "contains",
      value: `*${this._queryValue}*`
    }]
  }, (async () => {
    const a = await (await fetch(`https://query.dev.enterspeed.io/v1-preview/${this._enterspeedIndex}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": `${this._enterspeedEnvironmentClient}`
      },
      body: JSON.stringify(t)
    })).json();
    this._queryResult = a.results.map((r) => ({
      name: `${r[this._enterspeedResultValueField]}${this._enterspeedResultDisplayField !== "" ? ` - ${r[this._enterspeedResultDisplayField]}` : ""}`,
      value: r[this._enterspeedResultValueField]
    })), this._showResults = !0;
  })();
};
m = function(e, t) {
  e.stopPropagation(), this._queryValue = "", this._queryResult = [], this._showResults = !1, this.value = t.value, o(this, l, d).call(this);
};
f = function() {
  this.value = "", o(this, l, d).call(this);
};
R = function(e) {
  var t;
  (t = document.getElementById("result-wrapper")) != null && t.contains(e.target) || (this._showResults = !1);
};
w = function(e) {
  this.value = e.target.value, o(this, l, d).call(this);
};
d = function() {
  this.dispatchEvent(new E());
};
s.styles = [
  g`
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
          color: var(--uui-color-interactive-emphasis);
        }
      `
];
i([
  _({ type: String })
], s.prototype, "value", 2);
i([
  _({ attribute: !1 })
], s.prototype, "config", 1);
i([
  u()
], s.prototype, "_enterspeedEnvironmentClient", 2);
i([
  u()
], s.prototype, "_enterspeedIndex", 2);
i([
  u()
], s.prototype, "_enterspeedQueryField", 2);
i([
  u()
], s.prototype, "_enterspeedResultValueField", 2);
i([
  u()
], s.prototype, "_enterspeedResultDisplayField", 2);
i([
  u()
], s.prototype, "_enterspeedQueryFieldPlaceholderText", 2);
i([
  u()
], s.prototype, "_queryValue", 2);
i([
  u()
], s.prototype, "_queryResult", 2);
i([
  u()
], s.prototype, "_showResults", 2);
s = i([
  C("enterspeed-query-picker-property-editor-ui")
], s);
export {
  s as default
};
//# sourceMappingURL=enterspeed-query-picker.element-CPRlz9zB.js.map
