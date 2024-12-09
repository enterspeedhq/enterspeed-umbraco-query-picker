export const manifests: Array<UmbExtensionManifest> = [
  {
    name: "Enterspeed QueryPicker",
    alias: "Enterspeed.Umbraco.QueryPicker",
    type: 'propertyEditorUi',
    js: () => import("./enterspeed-query-picker.element"),
    meta: {
      label: "Enterspeed Query Picker",
      icon: "icon-search",
      group: "common",
      propertyEditorSchemaAlias: "Umbraco.Plain.String",
      settings: {
        properties: [
              {
                  alias: "enterspeedEnvironmentClient",
                  label: "Enterspeed environment client",
                  description: "The Enterspeed environment client API key",
                  propertyEditorUiAlias: "Umb.PropertyEditorUi.TextBox"
              },
              {
                  alias: "enterspeedIndex",
                  label: "Enterspeed index",
                  description: "The Enterspeed index alias",
                  propertyEditorUiAlias: "Umb.PropertyEditorUi.TextBox"
              },
              {
                  alias: "enterspeedQueryField",
                  label: "Enterspeed query field",
                  description: "The field in the Enterspeed index to query on",
                  propertyEditorUiAlias: "Umb.PropertyEditorUi.TextBox"
              },
              {
                  alias: "enterspeedResultValueField",
                  label: "Enterspeed result value field",
                  description: "The field in the Enterspeed index to use as value",
                  propertyEditorUiAlias: "Umb.PropertyEditorUi.TextBox"
              },
              {
                  alias: "enterspeedResultDisplayField",
                  label: "Enterspeed result display field",
                  description: "The field in the Enterspeed index to use as display",
                  propertyEditorUiAlias: "Umb.PropertyEditorUi.TextBox"
              },
              {
                  alias: "enterspeedQueryFieldPlaceholderText",
                  label: "Placeholder text for the query field i Umbraco",
                  description: "Let the editors know what to search for",
                  propertyEditorUiAlias: "Umb.PropertyEditorUi.TextBox"
              },
            ]
      }
    },
  }
];
