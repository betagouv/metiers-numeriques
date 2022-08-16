namespace NodeJS {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ProcessEnv extends NodeJS.ProcessEnv {
    GOOGLE_CLIENT_ID: string
    GOOGLE_CLIENT_SECRET: string
    LINKEDIN_CLIENT_ID: string
    LINKEDIN_CLIENT_SECRET: string
    NODE_ENV: 'development' | 'production'
  }
}
