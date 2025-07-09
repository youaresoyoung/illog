export function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function randomId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export function getEnvInfo() {
  return {
    nodeEnv: process.env.NODE_ENV,
    isDev: process.env.NODE_ENV === "development",
    isProd: process.env.NODE_ENV === "production",
  };
}
