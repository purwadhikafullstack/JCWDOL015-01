import axios from "axios"
import React, { useState } from "react"
const PublicURL = process.env.NEXT_PUBLIC_BASE_API_URL

const SubscriptionForm = () => {
    const [type, setType] = useState('normal')

    const HandleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()

        const response = await axios.post(`${PublicURL}/createSubs`, {
            user_id: 
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        setType(response.data)
    }
}