async function groupBy(array, key) {
  return array.reduce((acc, item) => {
    (acc[item[key]] ??= []).push(item);
    return acc;
  }, {});
}

export { groupBy };
