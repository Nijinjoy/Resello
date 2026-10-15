// Short "listed" label, e.g. "12m ago", "3h ago", "Yesterday", "4d ago".
export function formatAgo(minutes: number) {
  if (minutes < 60) {
    return `${Math.max(1, Math.round(minutes))}m ago`;
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}h ago`;
  }
  const days = Math.floor(hours / 24);
  return days === 1 ? 'Yesterday' : `${days}d ago`;
}

export function formatDistance(km: number) {
  return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;
}
