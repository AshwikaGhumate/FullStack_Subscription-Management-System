import axios from 'axios';

const API_URL = 'http://localhost:5000';

export const fetchSubscriptions = async () => {
    const response = await axios.get(`${API_URL}/subscriptions`);
    return response.data;
};

export const fetchCustomers = async () => {
    const response = await axios.get(`${API_URL}/customers`);
    return response.data;
};

export const fetchProducts = async () => {
    const response = await axios.get(`${API_URL}/products`);
    return response.data;
};

export const addSubscription = async (data) => {
    const response = await axios.post(`${API_URL}/subscriptions`, data);
    return response.data;
};

export const extendSubscription = async (data) => {
    const response = await axios.put(`${API_URL}/subscriptions/extend`, data);
    return response.data;
};

export const endSubscription = async (subscriptionId) => {
    const response = await axios.delete(`${API_URL}/subscriptions/end`, { data: { subscription_id: subscriptionId } });
    return response.data;
};

export const fetchRevenue = async () => {
    try {
        const response = await fetch('/api/revenue');
        const data = await response.json();
        return data; // Example: { "Product A": 120000, "Product B": 85000 }
    } catch (error) {
        console.error('Error fetching revenue:', error);
        throw error;
    }
};

export const fetchActiveSubscriptions = async () => {
    try {
        const response = await axios.get('http://127.0.0.1:5000/subscriptions/active');
        return response.data;
    } catch (error) {
        console.error('Error fetching active subscriptions:', error);
        throw error;
    }
};

