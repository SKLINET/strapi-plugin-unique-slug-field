<h1 align="center">Strapi plugin Unique Slug Field</h1>

<p align="center">Adds custom slug field to your Strapi application</p>

## 👋 Intro

- [Features](#features)
- [Installation](#installation)
- [Requirements](#requirements)

## <a id="features"></a>✨ Key feature

- **Slug field:** This plugin adds custom slug field into your Strapi application !

## <a id="installation"></a>🔧 Installation

Inside your Strapi app, add the package:

With `npm`:

```bash
npm install @sklinet/strapi-plugin-unique-slug-field
```

With `yarn`:

```bash
yarn add @sklinet/strapi-plugin-unique-slug-field
```

In `config/plugins.js` file add:

```js
"unique-slug-field":{
    enabled:true,
    config: {
      contentTypes: [
        {
          uid: "article",
          field: "test",
          references: "title",
        },
        {
          uid: "page",
          field: "slug",
          references: "title",
        },
      ],
    },
};
```

If you do not yet have this file, then create and add:

```js
module.exports = () => ({
  "unique-slug-field": {
    enabled: true,
    config: {
      contentTypes: [
        {
          uid: "article",
          field: "test",
          references: "title",
        },
        {
          uid: "page",
          field: "slug",
          references: "title",
        },
      ],
    },
  },
});
```

Then run build:

```bash
npm run build
```

or

```bash
yarn build
```

## <a id="requirements"></a>⚠️ Requirements

Strapi **v4.x.x+**

Node **14 - 16**

Tested on **v4.4.1**
