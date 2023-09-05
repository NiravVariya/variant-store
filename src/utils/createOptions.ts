function createOptions<T extends string>(map: Record<T, string>) {
  return Object.keys(map).map((key: T) => ({
    value: key,
    label: map[key],
  }));
}

export default createOptions;
