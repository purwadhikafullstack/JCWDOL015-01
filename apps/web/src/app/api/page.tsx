'use client'

import axios from "axios";
import { useState } from "react";
const PublicURL = process.env.NEXT_PUBLIC_BASE_API_URL

export default function CVGen() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleGenerateCV = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.post(`${PublicURL}/generate-cv`, {
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));

            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'CV.pdf');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        } catch (error) {
            setError('Error generating CV');
            console.error("ERROR: ", error)
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <button onClick={handleGenerateCV} disabled={loading}>
                {loading ? 'Generating CV...' : 'Generate CV'}
            </button>
            {error && <p>{error}</p>}
        </div>
    );

}