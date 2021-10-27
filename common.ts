export function timed<T>(label: string, action: () => T): T {
  console.time(label);
  try {
    return action();
  } finally {
    console.timeEnd(label);
  }
}
