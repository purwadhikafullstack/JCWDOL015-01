import { useEffect, useState, useRef } from 'react';
import { reverseGeocoding } from './OpenCage';
import { toast } from 'react-toastify';
import { useAuth } from '../authContext/Provider';
import { saveLocation } from '@/lib/user';
import { createCookie, fetchCookie, deleteCookie } from '@/lib/cookie';

export const useGeolocation = () => {
  const { token } = useAuth();
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
    currentLocation?: string;
  } | null>(null);
  const consentAsked = useRef(false); // Track if the consent has been asked

  useEffect(() => {
    const getLocation = async () => {
      // Retrieve existing location from cookie
      const existingLocation = await fetchCookie('userLocation');
      if (existingLocation && !token) {
        setLocation(JSON.parse(existingLocation));
        return;
      }

      // Ask for permission only if token exists and consent hasn't been asked yet
      const askForPermission = async () => {
        if (consentAsked.current) return;
        consentAsked.current = true; // Mark consent as asked

        const userConsent = window.confirm(
          'Do you allow us to access and record your location? This will help us provide better services.',
        );

        if (userConsent && 'geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(
            async ({ coords }) => {
              const { latitude, longitude } = coords;
              const newLocation = { latitude, longitude };
              setLocation(newLocation);

              // Save location in cookies
              await createCookie('userLocation', JSON.stringify(newLocation));
            },
            (error) => {
              console.error('Error getting location:', error);
              toast.error('Unable to fetch location. Please try again later.');
            },
            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 0,
            }
          );
        } else if (!userConsent) {
          toast.warn(
            'You have denied location access. Some features may not work as expected.',
          );
        }
      };

      if (token) {
        // If logged in, clear existing location and ask again
        await deleteCookie('userLocation');
        askForPermission();
      } else if (!existingLocation) {
        // Automatically fetch location for unauthenticated users
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(
            async ({ coords }) => {
              const { latitude, longitude } = coords;
              const newLocation = { latitude, longitude };
              setLocation(newLocation);

              // Save location in cookies
              await createCookie('userLocation', JSON.stringify(newLocation));
            },
            (error) => {
              console.error('Error getting location:', error);
            },
            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 0,
            }
          );
        }
      }
    };

    getLocation();
  }, [token]);

  useEffect(() => {
    // Handle reverse geocoding if location is set
    if (location && !location.currentLocation) {
      (async () => {
        try {
          const { result, ok } = await reverseGeocoding(
            location.latitude,
            location.longitude,
          );

          if (ok) {
            const updatedLocation = { ...location, currentLocation: result };
            setLocation(updatedLocation);

            // Update the cookie with the new location data
            await createCookie(
              'userLocation',
              JSON.stringify(updatedLocation),
            );

            if (token) {
              await saveLocation(updatedLocation, token);
            }

            toast.success(`Location: ${result}`);
          }
        } catch (error) {
          console.error('Error during reverse geocoding:', error);
        }
      })();
    }
  }, [location, token]);

  return { location };
};
