# Examensarbete_Vue_PWA
## Created from terminal using
npm install -g @vue/cli

vue create vue_examensarbete

Vue add pwa
## How to run from terminal
npm run build

have json server installed (npm install json-server)
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
The entire db.JSON is put in the storage as a JSON, but only 10 fetched pictures, to change: `maxEntries: 10`
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

Make sure that the service worker is running in devtools application:
![image](https://github.com/user-attachments/assets/1797c7e4-a80e-48b6-b35c-a170bb0d7cd5)

and that cache is used:

![image](https://github.com/user-attachments/assets/1c9be015-65f6-4b0e-9ea8-c637e7707937)

service worker used for the fetch:

![image](https://github.com/user-attachments/assets/7b987076-1312-459d-bf59-c8964e6df44d)

this will make it work online, aswell as offline:

![image](https://github.com/user-attachments/assets/e10025a5-f0ed-418d-b085-643f7c62c17d)

