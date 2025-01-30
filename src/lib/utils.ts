export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
export const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);