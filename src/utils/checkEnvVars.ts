/* eslint-disable no-console */

const checkEnvVars = (): boolean => {
  const requiredEnvVars = [
    'NODE_ENV',
    'PORT',
    'DATABASE',
    'AUTH_URL',
    'RATELIMIT_MAXCONNECTIONS',
    'RATELIMIT_WINDOWMS',
    'CORS_WHITELIST'
  ];

  const missingEnvVars: string[] = [];

  requiredEnvVars.forEach((envVar) => {
    if (!process.env[envVar]) {
      missingEnvVars.push(envVar);
    }
  });

  if (missingEnvVars.length > 0) {
    console.error(`Missing environment variables: ${missingEnvVars.join(', ')}`);
    return true;
  } else {
    return false;
  }
};

export default checkEnvVars;
