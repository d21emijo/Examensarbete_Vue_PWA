# Examensarbete_Vue_PWA
## Creation from terminal
npm install -g @vue/cli

vue create vue_examensarbete

Vue add pwa
## How to run from terminal
npm run build

json-server --watch db.json --port 5000

serve -s dist -l 4000
## Usage
To add/remove categories add a `name` That's included in the [db.JSON](/vue_examansarbete/src/db.JSON) from "terms" 
To change how many products thats displayed change `maxSections` as it displayes the maximum nr of products based on the index
```
  data() {
    return {
      itemsPerSection: 3, // hur många produkter 
      maxSections: 5, // hur många sektioner/produkt
      categories: [
      { name: "jackets", displayName: "Jackor", sections: [] },
      { name: "shoes", displayName: "Skor", sections: [] },
      { name: "pants", displayName: "Byxor", sections: [] },
      { name: "puffers", displayName: "Fluffare", sections: [] },
      ],
    };
  },
```
this is located in the [ProductsList.Vue file](/vue_examansarbete/src/components/ProductsList.vue)

## Service Worker
The fetch puts products in storage and the service worker intercepts this and puts images in storage aswell.
This is set to `CacheFirst` and is put in cache storage under `images`-
The entire db.JSON is put in the storage as a JSON, but only 10 pictures, to change: `maxEntries: 10`
```
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200], // 0 krävs för CORS
      }),
      new ExpirationPlugin({
        maxEntries: 10, // Max antal bilder i cache
        maxAgeSeconds: 7 * 24 * 60 * 60, // Sparas i en vecka
      }),
    ],
  })
);
```
This is located in the [Service-worker.js file](/vue_examansarbete/service-worker.js)

## Testing
