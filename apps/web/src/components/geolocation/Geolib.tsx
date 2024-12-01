import { getDistance } from 'geolib';


const userLocation = { latitude: 37.7749, longitude: -122.4194 }; 


const jobLocation = { latitude: 34.0522, longitude: -118.2437 }; 


const distance = getDistance(userLocation, jobLocation);

console.log(`Distance: ${distance} meters`);
