export function getListingDisplayName(input: { title: string; name: string }) {
  return input.title || input.name
}
