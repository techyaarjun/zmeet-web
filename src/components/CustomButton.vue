<style scoped>
@import "../assets/main.css";
@import "../assets/custom-btn.css";
</style>

<template>
  <button class="cssbuttons-io">
    <span class="krona-one-light">
      {{ name }}</span
    >
  </button>
</template>

<script setup>
const props = defineProps({
  name: String,
});
</script>
