export function isNewer(localDate, remoteDate) {
  return new Date(localDate).getTime() > new Date(remoteDate).getTime();
}
