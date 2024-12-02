import axiosInstance from "@/lib/axiosInstance"

export const shareJobs = async () => {
    try {
        const response = await axiosInstance.get('/shareJob')
        return response.data
    } catch (error) {
        console.error('Error fetching assessments: ', error)
        throw error
    }
}