export function formatDay(iso) {
  return new Intl.DateTimeFormat('de-AT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(`${iso}T00:00:00`))
}
