export const apps = [{
  name: "pro-play",
  script: "./build/server/index.js",
  env_production: {
    NODE_ENV: "production",
    PORT: 3000
  }
}];