import { prefixPluginTranslations } from "@strapi/helper-plugin";
import pluginId from "./pluginId";
import FieldIcon from "./components/SlugField/FieldIcon";
import { getTrad } from "./utils";

export default {
  register(app) {
    app.customFields.register({
      name: "unique-slug",
      pluginId: "unique-slug-field",
      type: "string",
      icon: FieldIcon,
      intlLabel: {
        id: getTrad("unique-slug-field.label"),
        defaultMessage: "Unique Slug",
      },
      intlDescription: {
        id: getTrad("unique-slug-field.description"),
        defaultMessage: "Unique slug field.",
      },
      components: {
        Input: async () =>
          import(
            /* webpackChunkName: "unique-slug-field-input-component" */ "./components/SlugField/UniqueSlugField"
          ),
      },
      options: {
        validator: (args) => ({
          returnValue: yup.string().required({
            id: "unique-slug.required",
            defaultMessage: "Value is required.",
          }),
        }),
      },
    });
  },

  bootstrap(app) {},
  async registerTrads({ locales }) {
    const importedTrads = await Promise.all(
      locales.map((locale) => {
        return import(
          /* webpackChunkName: "translation-[request]" */ `./translations/${locale}.json`
        )
          .then(({ default: data }) => {
            return {
              data: prefixPluginTranslations(data, pluginId),
              locale,
            };
          })
          .catch(() => {
            return {
              data: {},
              locale,
            };
          });
      })
    );

    return Promise.resolve(importedTrads);
  },
};
