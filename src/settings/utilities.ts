export function setDarkMode(isEnabled: boolean) {
  if (isEnabled) {
    document.body.classList.add('awsui-dark-mode');
  } else {
    document.body.classList.remove('awsui-dark-mode');
  }
}
export function handleMatchChange(event: MediaQueryListEvent) {
  setDarkMode(event.matches);
}
export function getLengthInMinutes(seconds: number): string {
  return String(seconds / 60);
}
