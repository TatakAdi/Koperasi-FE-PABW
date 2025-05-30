// In app/lib/api/user.js

// Assuming you have an API client or direct fetch for your backend
export async function addUser(userData) {
    try {
        const response = await fetch('/api/create-user', { // Replace with your actual user creation endpoint
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Add authorization header if required, e.g., 'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(userData),
        });

        const responseData = await response.json(); // Parse the response body

        if (!response.ok) {
            // Handle HTTP errors (e.g., 400, 500)
            console.error("API Error adding user:", responseData.message || response.statusText);
            return { error: responseData.message || 'Failed to add user' };
        }

        // Assuming your backend API sends back the created user's data,
        // which includes the 'id' (or 'user_id', or whatever your backend names it).
        // Adjust 'responseData.id' to match the actual property name from your API response.
        if (responseData && responseData.id) { // Or responseData.user_id, etc.
            return { data: responseData.id }; // **This is the key part: return the ID!**
        } else {
            console.warn("User added successfully, but no ID found in response:", responseData);
            return { data: null, error: "User created, but ID not returned by API" };
        }

    } catch (error) {
        console.error("Network or parsing error adding user:", error);
        return { error: error.message };
    }
}