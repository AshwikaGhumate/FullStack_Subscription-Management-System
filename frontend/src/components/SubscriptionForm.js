import React, { useState, useEffect } from 'react';
import { fetchCustomers, fetchProducts, fetchActiveSubscriptions } from '../api'; 
import './SubscriptionForm.css'; // Import the CSS file for styles

const SubscriptionForm = ({ onSubmit, onCancel }) => {
    const [customers, setCustomers] = useState([]);  // State to store customers
    const [products, setProducts] = useState([]);  // State to store products
    const [subscriptionData, setSubscriptionData] = useState({
        customer_id: '',
        product_name: '',
        start_date: '',
        end_date: '',
        no_of_users: 0
    });
    const [errorMessage, setErrorMessage] = useState('');  // State for error message

    useEffect(() => {
        // Fetch customers and products on component mount
        const loadData = async () => {
            const customersData = await fetchCustomers();
            const productsData = await fetchProducts();
            setCustomers(customersData);
            setProducts(productsData);
        };
        loadData();
    }, []);  // Run only once when the component is mounted

    const checkIfSubscriptionExists = async () => {
        // Check if a subscription already exists for the same customer and product
        const activeSubscriptions = await fetchActiveSubscriptions();
        return activeSubscriptions.some(subscription =>
            subscription.customer_id === subscriptionData.customer_id &&
            subscription.product_name === subscriptionData.product_name &&
            subscription.end_date >= new Date().toISOString().split('T')[0]  // Check if active
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate: Ensure all required fields are filled
        if (!subscriptionData.customer_id || !subscriptionData.product_name || !subscriptionData.start_date || !subscriptionData.end_date || !subscriptionData.no_of_users) {
            alert("Please fill in all required fields.");
            return;
        }
        
        // Check if there's already an active subscription
        const isActiveSubscription = await checkIfSubscriptionExists();
        if (isActiveSubscription) {
            setErrorMessage('An active subscription already exists for this customer and product.');
            return; 
        }
        onSubmit(subscriptionData);  // Call onSubmit with the subscription data

        setErrorMessage('');  // Clear error message if submission is successful
    };

    return (
        <form onSubmit={handleSubmit} className="subscription-form">
            <h2 className="form-title">Add New Subscription</h2> {/* Form title */}

            {/* Customer selection */}
            <div>
                <label >Select Customer<span className="required">*</span></label>
                <select 
                    value={subscriptionData.customer_id} 
                    onChange={(e) => setSubscriptionData({ ...subscriptionData, customer_id: e.target.value })}
                    className="form-input"
                >
                    <option value="">Select Customer</option>
                    {customers.map(customer => (
                        <option key={customer.id} value={customer.id}>{customer.name}</option>
                    ))}
                </select>
            </div>

            {/* Product selection */}
            <div>
                <label>Select Product<span className="required">*</span></label>
                <select 
                    value={subscriptionData.product_name} 
                    onChange={(e) => setSubscriptionData({ ...subscriptionData, product_name: e.target.value })}
                    className="form-input"
                >
                    <option value="">Select Product</option>
                    {products.map(product => (
                        <option key={product.name} value={product.name}>{product.name}</option>
                    ))}
                </select>
            </div>

            {/* Start date input */}
            <div>
                <label>Start Date<span className="required">*</span></label>
                <input
                    type="date"
                    value={subscriptionData.start_date}
                    onChange={(e) => setSubscriptionData({ ...subscriptionData, start_date: e.target.value })}
                    className="form-input"
                />
            </div>

            {/* End date input */}
            <div>
                <label>End Date<span className="required">*</span></label>
                <input
                    type="date"
                    value={subscriptionData.end_date}
                    onChange={(e) => setSubscriptionData({ ...subscriptionData, end_date: e.target.value })}
                    className="form-input"
                />
            </div>

            {/* Number of users input */}
            <div>
                <label>Number of Users<span className="required">*</span></label>
                <input
                    type="number"
                    value={subscriptionData.no_of_users}
                    onChange={(e) => setSubscriptionData({ ...subscriptionData, no_of_users: e.target.value })}
                    className="form-input"
                />
            </div>

            {/* Display error message if any */}
            {errorMessage && <div className="error-message">{errorMessage}</div>}

            {/* Action buttons */}
            <div className="form-buttons">
                <button type="submit" className="btn btn-submit">Add</button>
                <button type="button" onClick={onCancel} className="btn btn-cancel">Cancel</button>
            </div>
        </form>
    );
};

export default SubscriptionForm;
