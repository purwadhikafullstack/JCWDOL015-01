import axios from "axios";

const link = process.env.NEXT_PUBLIC_API_URL;

export const submission = async (data: FormData) => {
    try {
        const res = await axios.post(`${link}/applications/submission`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            
        });
        return { result: res.data, ok: true };
    } catch (error) {
        const err = error as any;
        return { result: err.response?.data || 'Connection error', ok: false };
    }
}