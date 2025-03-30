<template>
  <div>
    <div v-for="category in categories" :key="category.name">
      <h2>{{ category.displayName }}</h2>
      <div class="section-container">
        <div v-for="(section, sectionIndex) in category.sections" :key="'section-' + sectionIndex" class="section">
          <h3>Sektion {{ sectionIndex + 1 }}</h3>
          <div class="product-list">
            <div v-for="product in section" :key="product.id" class="product-card">
              <h3>{{ product.name }}</h3>
              <img :src="product.images[0]" :alt="product.name" width="150" crossorigin="anonymous" />
              <p>Pris: {{ product.price }} {{ product.currency }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      products: [],
      categories: [],
      itemsPerSection: 3, // hur många produkter 
      maxSections: 5, // hur många sektioner/produkt
      error: null,
      loading: true,
    };
  },
  async mounted() {
    await navigator.serviceWorker.ready;
    await this.fetchProducts();
  },
  methods: {
    async fetchProducts() {
      try {
        const response = await fetch("http://localhost:5000/products");
        if (!response.ok) throw new Error("Misslyckades att hämta data från nätverket");

        const data = await response.json();
        console.log("Data hämtad från nätverket:", data);

        // Cachea datan lokalt för offline-användning
        const cache = await caches.open("products");
        await cache.put("/products", new Response(JSON.stringify(data)));

        this.updateProducts(data);
      } catch (error) {
        console.error("Fel vid hämtning av data, försöker från cache:", error);

        const cache = await caches.open("products");
        const cachedResponse = await cache.match("/products");

        if (cachedResponse) {
          const cachedData = await cachedResponse.json();
          console.log("Data hämtad från cachen:", cachedData);
          this.updateProducts(cachedData);
        } else {
          console.error("Ingen cache-data tillgänglig");
          this.error = "Ingen data tillgänglig online eller offline";
        }
      } finally {
        this.loading = false;
      }
    },

    updateProducts(data) {
      // Säkerställ att bilderna har rätt format
      const processedProducts = data.map((product) => ({
        ...product,
        images: typeof product.images === "string"
          ? JSON.parse(product.images.replace(/'/g, '"'))
          : product.images,
      }));

      // Lista med kategorier , lägg till ta bort här
      const categoryNames = [
        { key: "jackets", displayName: "Jackor" },
        { key: "shoes", displayName: "Skor" },
        { key: "pants", displayName: "Byxor" },
        { key: "puffers", displayName: "Fluffare" },
      ];

      this.categories = categoryNames.map(({ key, displayName }) => ({
        name: key,
        displayName,
        sections: this.splitIntoSections(
          processedProducts.filter((p) => p.terms.toLowerCase().includes(key))
        ),
      }));

      console.log("Kategorier skapade:", this.categories);
    },

    splitIntoSections(products) {
      const totalSections = Math.min(
        Math.ceil(products.length / this.itemsPerSection),
        this.maxSections
      );

      return Array.from({ length: totalSections }, (_, index) => {
        const startIndex = index * this.itemsPerSection;
        return products.slice(startIndex, startIndex + this.itemsPerSection);
      });
    },
  },
};
</script>

  
  
<style scoped>
  .container {
    width: 100%;
    max-width: 375px; /* Anpassad för iPhone SE */
    margin: 0 auto;
    padding: 10px;
  }
  
  h1 {
    text-align: center;
  }
  
  .error {
    color: red;
    text-align: center;
  }
  
  .product-section {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }
  
  .product-card {
    width: 30%;
    background: #fff;
    padding: 10px;
    border-radius: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    text-align: center;
  }
  
  .product-image {
    width: 100%;
    height: auto;
    border-radius: 5px;
  }
  
  .product-name {
    font-size: 14px;
    font-weight: bold;
    margin-top: 5px;
  }
  
  .product-price {
    font-size: 12px;
    color: #666;
  }
</style>
  