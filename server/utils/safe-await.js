async function safeAwait(promise) {
  try {
    const result = await promise;
    return [null, result];
  } catch (e) {
    return [e, null];
  }
}

export { safeAwait };
