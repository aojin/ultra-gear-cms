global.console = {
  ...console,
  log: console.log, // Keep default behavior
  error: console.error, // Keep default behavior
  warn: console.warn, // Keep default behavior
};
