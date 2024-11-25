import { useEffect, useState, useRef } from 'react';
import { reverseGeocoding } from './OpenCage';
import { toast } from 'react-toastify';
import { useAuth } from '../authContext/Provider';
import { saveLocation } from '@/lib/user';

export const useGeolocation = () => {
  const { token } = useAuth();
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
    currentLocation?: string;
  } | null>(() => {
    const storedLocation = localStorage.getItem('userLocation');
    return storedLocation ? JSON.parse(storedLocation) : null;
  });
  const permissionAsked = useRef(false);

  useEffect(() => {
    const askForPermission = async () => {
      if (permissionAsked.current) return;
      permissionAsked.current = true;

      const userConsent = window.confirm(
        'Do you allow us to access and record your location? This will help us provide better services.',
      );

      if (userConsent && 'geolocation' in navigator) {
        const options = {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        };

        navigator.geolocation.getCurrentPosition(
          ({ coords }) => {
            const { latitude, longitude } = coords;
            const newLocation = { latitude, longitude };
            setLocation(newLocation);
            localStorage.setItem('userLocation', JSON.stringify(newLocation));
          },
          (error) => {},
          options,
        );
      } else if (!userConsent) {
        toast.warn(
          'You have denied location access. Some features may not work as expected.',
        );
      }
    };

    if (!location) {
      askForPermission();
    }
  }, [location]);

  useEffect(() => {
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
            localStorage.setItem(
              'userLocation',
              JSON.stringify(updatedLocation),
            );

            if (token) {
              await saveLocation(updatedLocation, token);
            }

            toast.success(`Location: ${result}`);
          }
        } catch (error) {
          console.error('Error during geocoding', error);
        }
      })();
    }
  }, [location, token]);

  return { location };
};
