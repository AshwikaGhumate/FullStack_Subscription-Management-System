import React, { useState, useEffect } from 'react';
import { fetchSubscriptions, extendSubscription, endSubscription, addSubscription, fetchProducts } from './api';
import SubscriptionForm from './components/SubscriptionForm';
import Modal from './components/Modal'; 
import ExtendSubscriptionForm from './components/ExtendSubscriptionForm'; 
import './App.css'; 

const App = () => {
    // State variables to store data
    const [products, setProducts] = useState([]);  // Store product data with cost
    const [subscriptions, setSubscriptions] = useState([]);  // Store active subscriptions
    const [revenueData, setRevenueData] = useState({}); // Store revenue data for each product
    const [totalRevenue, setTotalRevenue] = useState(0); // Store total revenue
    const [showAddForm, setShowAddForm] = useState(false); // Flag to show add subscription form
    const [showExtendForm, setShowExtendForm] = useState(false); // Flag to show extend subscription form
    const [extendSubscriptionData, setExtendSubscriptionData] = useState(null); // Store subscription data to extend
    const [popupMessage, setPopupMessage] = useState(''); // Store message for popup notifications

    // Fetch subscriptions and products when the component mounts
    useEffect(() => {
        const loadSubscriptions = async () => {
            const data = await fetchSubscriptions(); // Fetch subscriptions from the backend
            setSubscriptions(data);
        };
        loadSubscriptions();

        // Fetch product data (costs for each product)
        const loadProducts = async () => {
            const productData = await fetchProducts(); // Fetch product data
            setProducts(productData);
        };
        loadProducts();
    }, []);  // Empty array ensures this effect runs only once when the component mounts

    // Recalculate revenue whenever subscriptions or products change
    useEffect(() => {
        if (subscriptions.length && products.length) {
            const calculateRevenue = () => {
                const revenueMap = {};  // Map to store revenue per product

                // Create a product lookup map for faster access, based on 'name' field
                const productMap = products.reduce((map, product) => {
                    map[product.name] = product; // Use 'name' as the key
                    return map;
                }, {});

                // Calculate revenue for each subscription
                subscriptions.forEach((subscription) => {
                    const product = productMap[subscription.product_name]; // Get product by name
                    if (product) {
                        const revenueForProduct = product.annual_cost * subscription.no_of_users;
                        if (revenueMap[product.name]) {
                            revenueMap[product.name] += revenueForProduct; // Add to existing revenue
                        } else {
                            revenueMap[product.name] = revenueForProduct; // Initialize revenue for new product
                        }
                    }
                });

                setRevenueData(revenueMap); // Store revenue data per product
                const total = Object.values(revenueMap).reduce((acc, rev) => acc + rev, 0); // Calculate total revenue
                setTotalRevenue(total);
            };

            calculateRevenue();
        }
    }, [subscriptions, products]); // Recalculate revenue when subscriptions or products change

    // Display a popup message for success or failure
    const showPopupMessage = (message) => {
        setPopupMessage(message);
        setTimeout(() => setPopupMessage(''), 3000);  // Clear message 
    };

    // Handle adding a new subscription
    const handleAddSubscription = async (data) => {
        try {
            const response = await addSubscription(data); // Send request to add subscription
            showPopupMessage(response.message); // Show popup with message
            const updatedSubscriptions = await fetchSubscriptions(); // Fetch updated subscriptions list
            setSubscriptions(updatedSubscriptions);
            setShowAddForm(false); // Close add form
        } catch (error) {
            console.error('Error adding subscription:', error);
            showPopupMessage('Failed to add subscription.'); // Show error popup
        }
    };

    // Handle ending a subscription
    const handleEndSubscription = async (subscriptionId) => {
        if (window.confirm("Are you sure you want to end and remove this subscription?")) {
            try {
                const result = await endSubscription(subscriptionId); // Send request to end subscription
                showPopupMessage(result.message); // Show popup with message
                const updatedSubscriptions = await fetchSubscriptions(); // Fetch updated subscriptions list
                setSubscriptions(updatedSubscriptions);
            } catch (error) {
                console.error("Error ending subscription:", error);
                showPopupMessage("Failed to end subscription."); // Show error popup
            }
        }
    };

    // Handle extending a subscription
    const handleExtendSubscription = (subscription) => {
        setExtendSubscriptionData(subscription); // Set data for the subscription to extend
        setShowExtendForm(true); // Show extend form
    };

    // Handle submitting the extend subscription form
    const handleExtendSubscriptionSubmit = async (data) => {
        try {
            const response = await extendSubscription(data); // Send request to extend subscription
            showPopupMessage(response.message); // Show popup with message
            const updatedSubscriptions = await fetchSubscriptions(); // Fetch updated subscriptions list
            setSubscriptions(updatedSubscriptions);
            setShowExtendForm(false); // Close extend form
        } catch (error) {
            console.error("Error extending subscription:", error);
            showPopupMessage("Failed to extend subscription."); // Show error popup
        }
    };

    return (
        <div className="app-container">
            <h1 className="app-title">Subscription Management System</h1>

            {/* Add Subscription Form Modal */}
            {showAddForm && (
                <Modal onClose={() => setShowAddForm(false)}>
                    <SubscriptionForm onSubmit={handleAddSubscription} onCancel={() => setShowAddForm(false)} />
                </Modal>
            )}

            {/* Extend Subscription Form Modal */}
            {showExtendForm && (
                <Modal onClose={() => setShowExtendForm(false)}>
                    <ExtendSubscriptionForm 
                        subscription={extendSubscriptionData} 
                        onSubmit={handleExtendSubscriptionSubmit}
                        onCancel={() => setShowExtendForm(false)} 
                    />
                </Modal>
            )}

            {/* Popup message box */}
            {popupMessage && (
                <div className="popup-message-box">
                    <div className="popup-message-content">
                        {popupMessage}
                    </div>
                </div>
            )}

            {/* Header and Add Subscription Button */}
            <div className="header-container">
                <h2>All Active Subscriptions</h2>
                <button className="add-button" onClick={() => setShowAddForm(true)}>Add Subscription</button>
            </div>

            {/* Subscriptions Table */}
            <table className="styled-table">
                <thead>
                    <tr>
                        <th>Customer</th>
                        <th>Product</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>No. of Users</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {subscriptions.map((subscription) => (
                        <tr key={subscription.id}>
                            <td>{subscription.customer_name}</td>
                            <td>{subscription.product_name}</td>
                            <td>{subscription.start_date}</td>
                            <td>{subscription.end_date}</td>
                            <td>{subscription.no_of_users}</td>
                            <td>
                                {/* Buttons for extending and ending subscription */}
                                <button
                                    className="action-button"
                                    onClick={() => handleExtendSubscription(subscription)}
                                >
                                    Extend
                                </button>
                                <button
                                    className="action-button delete-button"
                                    onClick={() => handleEndSubscription(subscription.id)}
                                >
                                    End
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Revenue per Product Table */}
            <h3>Revenue by Product</h3>
            <table className="styled-table">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Revenue</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(revenueData).map(([productName, revenueAmount]) => (
                        <tr key={productName}>
                            <td>{productName}</td>
                            <td>${revenueAmount.toFixed(2)}</td> {/* Format revenue as currency */}
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Display Total Revenue */}
            <div className="revenue-report">
                <h2>Total Revenue: ${totalRevenue.toFixed(2)}</h2> {/* Format total revenue */}
            </div>
        </div>
    );
};

export default App;
