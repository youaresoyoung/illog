export function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function randomId(): string {
  return Math.random().toString(36).substring(2, 15);
}
