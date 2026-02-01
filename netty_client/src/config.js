// Dynamically determine the API URL based on the current hostname
// This allows the app to work on both localhost and LAN IPs
export const API_BASE_URL = `http://${window.location.hostname}:5000`;
