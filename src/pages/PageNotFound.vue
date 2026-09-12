<script setup lang="ts">
import Header from "@/components/Header.vue";
import Page from "@/components/Page.vue";
import EmptyPageContent from "@/views/EmptyPageContent.vue";
</script>

<template>
  <Page>
    <Header />

    <EmptyPageContent
      title="Die Seite existiert nicht."
      primary-action-text="Zurück zur Startseite"
      primary-action="/"
    />
  </Page>
</template>
