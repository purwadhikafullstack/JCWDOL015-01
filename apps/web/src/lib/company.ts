import axios from "axios";

const link = process.env.NEXT_PUBLIC_API_URL;

export const getCompanyInfo = async () => {
    try {
        const res = await axios.get(`${link}/companies`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return { result: res.data, ok: true };
    } catch (error) {
        const err = error as any;
        return { result: err.response?.data || 'Connection error', ok: false };
    }
}