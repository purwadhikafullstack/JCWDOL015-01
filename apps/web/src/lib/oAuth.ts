import axios from 'axios';

const link = process.env.NEXT_PUBLIC_API_URL;

export const oAuthGoogle = async () => {
  try {
    const res = await axios.get(`${link}/oauth/google`, {
    });
    return res.data;
  } catch (error) {
    console.error('Error fetching jobs by geolocation', error);
    throw error;
  }
};
