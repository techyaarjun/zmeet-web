<style>
@import "../assets/home.css";
@import "../assets/main.css";
</style>

<template>
  <div class="zmeet-container">
    <div class="top-left-container">
      <button class="users-icon" @click="toggleSidebar">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      </button>
    </div>

    <div class="sidebar" :class="{ 'sidebar-open': isSidebarOpen }">
      <div class="sidebar-header">
        <h3 class="krona-one-light">Connected Users</h3>
        <button class="close-button" @click="toggleSidebar">×</button>
      </div>
      <ul class="users-list">
        <li v-for="user in connectedUsers" :key="user.id" class="user-item krona-one-light">
          <span class="user-status" :class="{ online: user.online }"></span>
          {{ user.name }}
          <button v-if="user.online" class="file-share-button" @click="shareFile(user)">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M4 15v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" y1="2" x2="12" y2="15" />
            </svg>
          </button>
        </li>
      </ul>
    </div>

    <h1 class="zmeet krona-one-regular">z<span class="m">m</span>eet</h1>
    <p class="title krona-one-light">Connect, Share, Collaborate — Seamlessly.</p>
    <p class="status krona-one-light">
      Status ~ <span :class="statusClass">{{ status }}</span>
    </p>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const status = ref("Connected");
const statusClass = computed(() => {
  return status.value === "Connected" ? "connected" : "connecting";
});

const isSidebarOpen = ref(false);
const connectedUsers = ref([
  { id: 1, name: "John Doe", online: true },
  { id: 2, name: "Jane Smith", online: true },
  { id: 4, name: "Bob Brown", online: true }
]);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const shareFile = (user) => {
  alert(`Sharing file with ${user.name}`);
};

</script>
