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
        <li
          v-for="user in connectedUsers"
          :key="user.id"
          class="user-item krona-one-light"
        >
          <span class="user-status" :class="'online'"></span>
          <span class="user-name">{{ user.name }}</span>
          <button class="file-share-button" @click="shareFile(user)">
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
    <p class="title krona-one-light">
      Connect, Share, Collaborate — Seamlessly.
    </p>
    <p class="status krona-one-light">
      <span :class="statusClass">{{ status }}</span>
    </p>
    <div class="button-container">
      <CustomButton :name="'Connnect'" @click="startConnection" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { Initialize } from "../../lib/library";
import { v4 as uuidv4 } from "uuid";
import CustomButton from "@/components/CustomButton.vue";

const status = ref("waiting...");
const statusClass = computed(() => {
  return status.value === "connected" ? "connected" : "connecting";
});

let zmeetManager = null;
const isSidebarOpen = ref(false);
const connectedUsers = ref([]);

onMounted(() => {
  setInterval(updateConnectedUsers, 2000);
  checkConnection();
});

async function checkConnection() {
  let connectionInterval = setInterval(() => {
    if (zmeetManager) {
      status.value = zmeetManager.connected() ? "connected" : "connecting...";
      console.log(status.value);
      if (status.value === "Connected") {
        clearInterval(connectionInterval);
      }
    }
  }, 3000);
}

async function updateConnectedUsers() {
  if (zmeetManager) {
    const newUsers = await zmeetManager.listAllUsers();
    synchronizeConnectedUsers(newUsers);
  }
}

function synchronizeConnectedUsers(newUsers) {
  const newUserNames = newUsers.map((user) => user.name);
  const oldUserNames = connectedUsers.value.map((user) => user.name);

  newUsers.forEach((user) => {
    if (!oldUserNames.includes(user.name)) {
      connectedUsers.value.push(user);
    }
  });

  connectedUsers.value = connectedUsers.value.filter((user) =>
    newUserNames.includes(user.name)
  );
}

const startConnection = () => {
  let userID = uuidv4();
  zmeetManager = Initialize(userID);
  zmeetManager.start();
};

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const shareFile = (user) => {
  alert(`Sharing file with ${user.name}`);
};
</script>
