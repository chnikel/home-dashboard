<script setup lang="ts">
import { HomeIcon } from "lucide-vue-next";
import SidebarGroup from "./ui/sidebar/SidebarGroup.vue";
import SidebarGroupContent from "./ui/sidebar/SidebarGroupContent.vue";
import SidebarMenu from "./ui/sidebar/SidebarMenu.vue";
import SidebarMenuButton from "./ui/sidebar/SidebarMenuButton.vue";
import SidebarMenuItem from "./ui/sidebar/SidebarMenuItem.vue";
</script>

<template>
  <SidebarGroup>
    <SidebarGroupContent>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton as-child>
            <RouterLink to="/">
              <HomeIcon />
              Home
            </RouterLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroupContent>
  </SidebarGroup>
</template>
