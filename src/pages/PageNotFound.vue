<script setup lang="ts">
import Header from "@/components/Header.vue";
import Page from "@/components/Page.vue";
import PageContent from "@/components/PageContent.vue";
import Button from "@/components/ui/button/Button.vue";
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
