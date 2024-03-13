export function toTitleCase(input: string): string {
  return input
    .toLowerCase() // First, make the entire string lowercase
    .split(" ") // Split the string into an array of words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
    .join(" "); // Join the words back into a single string
}
export function ellipsisString(str: string, maxLength: number): string {
  if (str.length <= maxLength) {
    return str;
  }
  return `${str.substring(0, maxLength - 3)}...`;
}

export function sensitizeKey(
  key: string,
  front: number,
  behind: number,
  maxMask?: number
): string {
  if (!key) {
    return "";
  }
  if (key.length <= front + behind) {
    return key;
  }
  const start = key.substring(0, front);
  const end = key.substring(key.length - behind, key.length);
  const maskedLength = key.length - front - behind;
  const masked = "*".repeat(maxMask ?? Math.max(0, maskedLength));
  return `${start}${masked}${end}`;
}
