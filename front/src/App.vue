<!-- App.vue -->

<script setup>
import Navigation from "@/components/Navigation.vue";
</script>

<template>
  <Navigation />
  <div class="container mt-4">
    <router-view />
  </div>
</template>

<style scoped></style>
