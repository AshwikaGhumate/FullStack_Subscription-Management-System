import React, { useState } from 'react';
import './ExtendSubscriptionForm.css'; // Import the styling file

const ExtendSubscriptionForm = ({ subscription, onSubmit, onCancel }) => {
    // State to track the new end date input
    const [newEndDate, setNewEndDate] = useState('');

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        if (newEndDate) {
            onSubmit({
                subscription_id: subscription.id, // Send the subscription ID
                new_end_date: newEndDate        // Send the updated end date
            });
        } else {
            alert('Please select a new end date.'); 
        }
    };

    return (
        <div>
            <form className="form-container" onSubmit={handleSubmit}>
                <h2 className="form-title">Extend Subscription</h2>

                {/* Display customer name */}
                <div className="form-group">
                    <label className="form-label"><strong>Customer:</strong></label>
                    <span className="form-info">{subscription.customer_name}</span>
                </div>

                {/* Display product name */}
                <div className="form-group">
                    <label className="form-label"><strong>Product:</strong></label>
                    <span className="form-info">{subscription.product_name}</span>
                </div>

                {/* Display current subscription end date */}
                <div className="form-group">
                    <label className="form-label"><strong>Current End Date:</strong></label>
                    <span className="form-info">{subscription.end_date}</span>
                </div>

                {/* Input field for new end date */}
                <div className="form-group">
                    <label className="form-label">New End Date:</label>
                    <input
                        type="date"
                        className="form-input"
                        value={newEndDate}
                        onChange={(e) => setNewEndDate(e.target.value)}
                    />
                </div>

                {/* Buttons for submission or cancellation */}
                <div className="form-actions">
                    <button type="submit" className="submit-button">Extend</button>
                    <button type="button" className="cancel-button" onClick={onCancel}>Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default ExtendSubscriptionForm;
