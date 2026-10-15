// Muted brand tints so each person gets a stable avatar colour.
const AVATAR_COLORS = ['#0E5E4E', '#1C7A66', '#B7862F', '#6B7A4B', '#8A5A44'];

export function avatarColor(name: string) {
  let hash = 0;
  for (const char of name) {
    hash = (hash * 31 + char.charCodeAt(0)) % 1000003;
  }
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

export function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0].toUpperCase())
    .join('');
}
