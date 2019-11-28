/**
 * Removes the trailing slash char.
 */
export default (str: string): string =>
  str.endsWith("/") ? str.slice(0, -1) : str
