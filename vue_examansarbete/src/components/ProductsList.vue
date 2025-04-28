<template>
  <div>
    <div v-for="category in categories" :key="category.name">
      <h2>{{ category.displayName }}</h2>
      <div class="section-container">
        <div v-for="(section, sectionIndex) in category.sections" :key="'section-' + sectionIndex" class="section">
          <h3>Sektion {{ sectionIndex + 1 }}</h3>
          <div class="product-list">
            <div v-for="product in section" :key="product.id" class="product-card">
              <h3 class="product-name">{{ product.name }}</h3>
              <img :src="product.images[0]" :alt="product.name" width="150" crossorigin="anonymous" class="product-image"/>
              <p class="product-price">Pris: {{ product.price }} {{ product.currency }}</p>
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
      itemsPerSection: 3, // hur många produkter 
      maxSections: 50, // hur många sektioner/produkt
      categories: [
      { name: "jackets", displayName: "Jackor", sections: [] },
      { name: "shoes", displayName: "Skor", sections: [] },
      { name: "pants", displayName: "Byxor", sections: [] },
      { name: "puffers", displayName: "Fluffare", sections: [] },
      ],
    };
  },
  async mounted() {
    await navigator.serviceWorker.ready; // kör service worker först
    this.fetchProducts();
  },
  methods: {
    async fetchProducts() {
      try {
    const cache = await caches.open("products-cache");
    const cachedResponse = await cache.match("http://localhost:5000/products");

    if (cachedResponse) {
      const cachedData = await cachedResponse.json();
      console.log("Data hämtad från cachen:", cachedData);
      this.updateProducts(cachedData);
    } else {
      const response = await fetch("http://localhost:5000/products");
      if (!response.ok) throw new Error("Misslyckades att hämta data från nätverket");
      const data = await response.json();
      console.log("Data hämtad från nätverket:", data);
      this.updateProducts(data);
    }
  } catch (error) {
    console.error("Fel vid hämtning från cache och nätverk:", error);
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
      //loopa igenom och dela upp kategorierna
      this.categories.forEach((category) => {
        category.sections = this.splitIntoSections(
        processedProducts.filter((p) => p.terms.toLowerCase().includes(category.name))
      );
      });
    },

    splitIntoSections(products) {
      const totalSections = Math.min(
        Math.ceil(products.length / this.itemsPerSection),
        this.maxSections
      );
      //räkna ut vilka produkter som ska ingå utifrån index
      return Array.from({ length: totalSections }, (_, index) => {
        const startIndex = index * this.itemsPerSection;
        return products.slice(startIndex, startIndex + this.itemsPerSection);
      }); 
    },
  },
};
</script>  
  
<style scoped>

</style>
  