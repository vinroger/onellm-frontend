export function toTitleCase(input: string): string {
  return input
    .toLowerCase() // First, make the entire string lowercase
    .split(" ") // Split the string into an array of words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
    .join(" "); // Join the words back into a single string
}
