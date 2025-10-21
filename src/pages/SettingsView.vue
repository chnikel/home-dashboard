<script setup lang="ts">
import { store, updateLocalTags } from '@/store';
import { onBeforeMount } from 'vue';


onBeforeMount(() => {
  updateLocalTags()
})

</script>

<template>
  <div>

    <div v-for="tag in store.tags">
      {{ tag.name }}
    </div>
   
  </div>
</template>
