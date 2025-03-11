module.exports = {
  apps: [
    {
      name: 'twenty-server',
      script: 'dist/src/main.js',
      cwd: './packages/twenty-server',
      env: {
        NODE_ENV: 'production',
      },
      dotenv: true,
    },
    {
      name: 'twenty-worker',
      script: 'dist/src/queue-worker/queue-worker.js',
      cwd: './packages/twenty-server',
      env: {
        NODE_ENV: 'production',
      },
      dotenv: true,
    },
  ],
};
