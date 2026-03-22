export const hubliStores = [
  { id: 1, name: "Sahyadri Organics Hubli", address: "Vidya Nagar, Hubli", lat: 15.3715, lng: 75.1235 },
  { id: 2, name: "Prakriti Natural Foods", address: "Keshwapur, Hubli", lat: 15.3524, lng: 75.1432 },
  { id: 3, name: "Green Earth Supermarket", address: "Navanagar, Hubli", lat: 15.3850, lng: 75.1105 },
  { id: 4, name: "Desi Millet Mart", address: "Gokul Road, Hubli", lat: 15.3681, lng: 75.1052 },
  { id: 5, name: "Dharwad Organic Center", address: "Dharwad Town", lat: 15.4589, lng: 75.0078 },
  { id: 6, name: "Siri Dhanya Hub", address: "Kittur Chennamma Circle, Hubli", lat: 15.3533, lng: 75.1404 },
  { id: 7, name: "Health First Organics", address: "Shirur Park, Hubli", lat: 15.3698, lng: 75.1156 },
  { id: 8, name: "Rustic Roots", address: "Bhavani Nagar, Hubli", lat: 15.3401, lng: 75.1325 },
  { id: 9, name: "Nisarga Grocers", address: "Unkal, Hubli", lat: 15.3854, lng: 75.1276 },
  { id: 10, name: "Village Millers", address: "Amargol, Hubli", lat: 15.3956, lng: 75.0892 }
];

export const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of logic in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; 
};
