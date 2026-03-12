export function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      resolve(null);
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          resolve(userLocation);
        },
        (error) => {
          resolve(null);
        }
      );
    }
  });
}
