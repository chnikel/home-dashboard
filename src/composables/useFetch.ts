import { ref, toValue, watchEffect } from "vue";

export function useFetch<T, E = unknown>(url: string) {
  const data = ref<T|null>(null);
  const error = ref<E|null>(null);

  watchEffect(() => {
    data.value = null;
    error.value = null;

    fetch(toValue(url))
      .then((res) => res.json())
      .then((json) => (data.value = json))
      .catch((err) => (error.value = err));
  });

  return {
    data,
    error,
  };
}
