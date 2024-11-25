import axios from 'axios';

export const reverseGeocoding = async (latitude: number, longitude: number) => {
  try {
    const res = await axios.get(
      `https://api.opencagedata.com/geocode/v1/json?q=${latitude}%2C${longitude}&key=${process.env.NEXT_PUBLIC_OPENCAGE_API_KEY}`,
    );
    const address = res.data.results[0].formatted;
    return { result: address, ok: true };
  } catch (error: any) {
    return { result: error.response?.data || 'Connection error', ok: false };
  }
};

export const forwardGeocoding = async (query: string) => {
  try {
    const res = await axios.get(
      `https://api.opencagedata.com/geocode/v1/json?q=${query}&key=${process.env.NEXT_PUBLIC_OPENCAGE_API_KEY}`,
    );
    const { lat, lng } = res.data.results[0].geometry;
    return { result: { latitude: lat, longitude: lng }, ok: true };
  } catch (error: any) {
    return { result: error.response?.data || 'Connection error', ok: false };
  }
}
