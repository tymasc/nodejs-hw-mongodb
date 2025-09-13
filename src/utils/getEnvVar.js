import dotenv from 'dotenv';

dotenv.config();

export function getEnvVar(key, defaultValue) {
  const value = process.env[key];

  if (value === undefined || value === '') {
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    throw new Error(`Environment variable ${key} is required but not defined`);
  }

  return value;
}
