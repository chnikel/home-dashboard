import { ref } from "vue";

let interval: number | undefined;
const duration = 1500;
const progress = ref(0);

let finished = false;

export function useRouteProgress() {
  const start = () => {
    if (interval) {
      return;
    }

    if (finished) {
      return;
    }

    finished = false;

    progress.value = 0.01;
    setTimeout(() => {
      progress.value = 10;
    }, 0);

    interval = setInterval(() => {
      inc();
    }, duration);
  };
  const finish = () => {
    finished = true;

    if (interval) {
      clearInterval(interval);
      interval = undefined;
    }

    progress.value = 100;
    setTimeout(() => {
      progress.value = 0;
    }, 100);
  };
  const inc = () => {
    const incrementBy = 2;
    const maxPercentage = 95;
    if (progress.value + incrementBy > maxPercentage) {
      return;
    }

    progress.value += incrementBy;
  };
  return {
    progress,
    start,
    inc,
    finish,
  };
}
