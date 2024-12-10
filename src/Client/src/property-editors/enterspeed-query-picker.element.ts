import { LitElement, html, css, customElement, property, state } from "@umbraco-cms/backoffice/external/lit";
import { UmbPropertyEditorUiElement } from "@umbraco-cms/backoffice/property-editor";
import { UmbPropertyValueChangeEvent } from "@umbraco-cms/backoffice/property-editor";
import { type UmbPropertyEditorConfigCollection } from "@umbraco-cms/backoffice/property-editor";
import { UMB_NOTIFICATION_CONTEXT, UmbNotificationContext } from "@umbraco-cms/backoffice/notification";
import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import { UMB_MODAL_MANAGER_CONTEXT } from "@umbraco-cms/backoffice/modal";

@customElement('enterspeed-query-picker-property-editor-ui')
export default class EnterspeedQueryPickerPropertyEditorUIElement extends UmbElementMixin((LitElement)) implements UmbPropertyEditorUiElement {
    _modalManagerContext?: typeof UMB_MODAL_MANAGER_CONTEXT.TYPE;
    _notificationContext?: UmbNotificationContext;

    constructor() {
        super();

        this.consumeContext(UMB_MODAL_MANAGER_CONTEXT, (instance) => {
            this._modalManagerContext = instance;
        });
    
        this.consumeContext(UMB_NOTIFICATION_CONTEXT, (instance) => {
            this._notificationContext = instance;
        });

        document.addEventListener('click', this.#onclickOutsideResult.bind(this));
    }

    @property({ type: String })
    public value = "";

    @property({ attribute: false })
    public set config(config: UmbPropertyEditorConfigCollection) {
      this._enterspeedEnvironmentClient = config.getValueByAlias("enterspeedEnvironmentClient") ?? "";
      this._enterspeedIndex = config.getValueByAlias("enterspeedIndex") ?? "";
      this._enterspeedQueryField = config.getValueByAlias("enterspeedQueryField") ?? "";
      this._enterspeedResultValueField = config.getValueByAlias("enterspeedResultValueField") ?? "";
      this._enterspeedResultDisplayField = config.getValueByAlias("enterspeedResultDisplayField") ?? "";
      this._enterspeedQueryFieldPlaceholderText = config.getValueByAlias("enterspeedQueryFieldPlaceholderText") ?? "";
    }

    @state()
    private _enterspeedEnvironmentClient: string = "";

    @state()
    private _enterspeedIndex: string = "";

    @state()
    private _enterspeedQueryField: string = "";

    @state()
    private _enterspeedResultValueField: string = "";

    @state()
    private _enterspeedResultDisplayField: string = "";

    @state()
    private _enterspeedQueryFieldPlaceholderText: string = "";

    @state()
    private _queryValue: string = "";

    @state()
    private _queryResult: Option[] = [];

    #onQuery(e: InputEvent) {
      this._queryValue = (e.target as HTMLInputElement).value;

      if(this._queryValue === ""){
        this._queryResult = [];
        return;
      }

      const query = {
        filters: {},
        pagination: {
          page: 0,
          pageSize: 5
        }
      } as {
        filters: {[key: string] : {}}
      };

      query.filters[this._enterspeedQueryField] = {
        operator: "contains",
        value: `*${this._queryValue}*`
      };

      (async () => {
        const rawResponse = await fetch(`https://query.dev.enterspeed.io/v1-preview/${this._enterspeedIndex}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Api-Key': `${this._enterspeedEnvironmentClient}`,
          },
          body: JSON.stringify(query)
        });

        const content = await rawResponse.json();

        this._queryResult = 
        content
        .results.map((result: {[key: string] : any}) => {
          return {
            name: `${result[this._enterspeedResultValueField]}${this._enterspeedResultDisplayField !== "" ? ` - ${result[this._enterspeedResultDisplayField]}` : ""}`,
            value: result[this._enterspeedResultValueField]
          }
        })
      })();
    }

    #onClickResult(e: Event, result: Option) {
      e.stopPropagation();

      this._queryValue = "";
      this._queryResult = [];
      this.value = result.value;
      this.#dispatchChangeEvent();
    }

    #onClearValue() {
      this.value = "";
      
      this.#dispatchChangeEvent();
    }

    #onclickOutsideResult(e: Event){   
      if (!document.getElementById('result-wrapper')?.contains(e.target as Node)) {
        this._queryResult = [];
      }
    }

    #onValueChange(e: InputEvent) {
      this.value = (e.target as HTMLInputElement).value;
      this.#dispatchChangeEvent();
    }
  
    #dispatchChangeEvent() {
      this.dispatchEvent(new UmbPropertyValueChangeEvent());
    }

    render() {
        return html`
          <uui-input
          class="element"
          label="text input"
          placeholder=${this._enterspeedQueryFieldPlaceholderText}
          .value=${this._queryValue}
          @input=${this.#onQuery}
        >
        </uui-input>
        
        ${this._queryValue ?
          html`
            <uui-box id="result-wrapper">
            ${this._queryResult.length > 0 ?
              html`
                  <uui-ref-list>
                    ${this._queryResult.map((result) =>
                      html`<uui-ref-node name="${result.name}"
                        class="result"
                        readonly
                        ?selectable=${false}
                        @click=${(event: Event) => this.#onClickResult(event, result)}
                      >
									      <umb-icon slot="icon" name=""></umb-icon>
                      </uui-ref-node>`
                    )}
                  </uui-ref-list>`:
              html`
                <uui-ref-list>
                  <uui-ref-node name="No results"
                        readonly
                        ?selectable=${false}
                  >
									      <umb-icon slot="icon" name=""></umb-icon>
                  </uui-ref-node>
                </uui-ref-list>
              `
            }
            </uui-box>`:
          html``
        }

        <div id="wrapper">
          <uui-input
            class="element"
            ?readonly=${true}
            @input=${this.#onValueChange}
            .value=${this.value || ""}
          >
            <div slot="append">
              <uui-button @click=${this.#onClearValue} title="Clear value">
                <uui-icon style="font-size: 40px;">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </uui-icon>
              </uui-button>
            </div>
          </uui-input>
        </div>
        `;
    }

    static styles = [
      css`
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
      `,
    ];
}

declare global {
    interface HTMLElementTagNameMap {
        'enterspeed-query-picker-property-editor-ui': EnterspeedQueryPickerPropertyEditorUIElement;
    }
}