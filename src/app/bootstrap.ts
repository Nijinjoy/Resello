// Startup work that must finish before leaving the splash screen,
// e.g. restoring the auth session, fetching remote config, loading user settings.
// Keep this list short: every task here delays app launch.
const startupTasks: Array<() => Promise<unknown>> = [];

export async function bootstrapApp(): Promise<void> {
  await Promise.all(startupTasks.map(task => task()));
}
