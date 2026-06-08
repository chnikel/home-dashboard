import { host } from "@/api";
import { computed, ref } from "vue";

const MAX_RETRIES = 10;
let interval: number | undefined = undefined;

const status = ref<"connecting" | "offline" | "online">("connecting");
let retryCount = ref(0);

const testBackendConnection = async () => {
  return fetch(host)
    .then((response) => response.ok)
    .catch(() => false);
};

const check = async () => {
  if (await testBackendConnection()) {
    status.value = "online";
    retryCount.value = 0;
    return;
  }

  if (retryCount.value >= MAX_RETRIES) {
    status.value = "offline";
    return;
  }

  status.value = "connecting";
  retryCount.value++;
};

export function useConnectionStatus() {
  const start = () => {
    if (interval) {
      return;
    }

    check();
    interval = setInterval(() => {
      check();
    }, 8000);

    console.log("start: " + interval);
  };

  const stop = () => {
    if (!interval) {
      return;
    }
    console.log("Clear: " + interval);

    clearInterval(interval);
    interval = undefined;
  };

  if (!interval) {
    start();
  }

  const isConnected = computed(() => status.value === "online");

  return {
    status,
    check,
    start,
    stop,
    retryCount,
    isConnected,
  };
}
