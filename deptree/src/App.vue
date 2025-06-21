<template>
  <main class="wrapper">
    <QBE/>
  </main>

</template>

<script setup>
// https://github.com/kirianguiller/reactive-dep-tree


import QBE from "./QBE.vue";



</script>

<style scoped>
.wrapper { max-width: 100%; margin: auto; padding: 2rem }
textarea { width: 100%; font: inherit; margin-bottom: 0.5rem; }
button   { padding: 0.4rem 1rem; font-weight: 600; }
.tree    { width: auto; min-height: 180px; border: 0px solid #ddd; margin-top: 1.5rem }
.error   { color: red; }
.query   { display: block; white-space: pre; background: #f6f8fa; padding: 0.75rem; }
</style>

