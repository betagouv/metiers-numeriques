jest.mock('redis', () => ({
  createClient: () => ({
    connect: async () => Promise.resolve(),
    disconnect: async () => Promise.resolve(),
    get: async () => Promise.resolve(null),
    on: () => undefined,
    set: async () => Promise.resolve(),
  }),
}))
