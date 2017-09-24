export default class Utils {

  // Checks if a string is empty
  // Returns true if empty, false otherwise
  static isEmpty(str: string): boolean {
    if (!str || str.length === 0 || !/\S+/.test(str)) {
      return true;
    }

    return false;
  }
}
