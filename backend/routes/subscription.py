from flask import Blueprint, jsonify, request
from models import db, Subscription, Customer, Product
from datetime import datetime, date
from sqlalchemy import func

bp = Blueprint('subscription', __name__)

# Route to get all Subscriptions
@bp.route('/subscriptions', methods=['GET'])
def get_subscriptions():
    subscriptions = db.session.query(
        Subscription.id,
        Subscription.product_name,
        Subscription.start_date,
        Subscription.end_date,
        Subscription.no_of_users,
        Customer.name.label('customer_name')  # Join with Customer table
    ).join(Customer, Subscription.customer_id == Customer.id).all()

    result = [
        {
            "id": sub.id,
            "product_name": sub.product_name,
            "start_date": sub.start_date.isoformat(),
            "end_date": sub.end_date.isoformat(),
            "no_of_users": sub.no_of_users,
            "customer_name": sub.customer_name,
        }
        for sub in subscriptions
    ]
    return jsonify(result)




# Route to add Product Subscription
@bp.route('/subscriptions', methods=['POST'])
def add_subscription():
    data = request.get_json()

    # Ensure required fields are present
    if not data.get('customer_id') or not data.get('product_name') or not data.get('start_date') or not data.get('end_date') or not data.get('no_of_users'):
        return jsonify({'message': 'Missing required fields'}), 400
    
    # Convert string dates to datetime.date objects
    try:
        start_date = datetime.strptime(data['start_date'], '%Y-%m-%d').date()
        end_date = datetime.strptime(data['end_date'], '%Y-%m-%d').date()
    except ValueError:
        return jsonify({'message': 'Invalid date format, should be YYYY-MM-DD'}), 400

    
    # Check if the customer already has an active subscription for the product
    existing_subscription = Subscription.query.filter(
        Subscription.customer_id == data['customer_id'], 
        Subscription.product_name == data['product_name'], 
        Subscription.end_date >= date.today()
    ).first()


    if existing_subscription:
        return jsonify({'message': 'Customer already has an active subscription for this product'}), 400

    # Create the new subscription
    new_subscription = Subscription(
        customer_id=data['customer_id'],
        product_name=data['product_name'],
        start_date=start_date,
        end_date=end_date,
        no_of_users=data['no_of_users']
    )

    db.session.add(new_subscription)
    db.session.commit()

    return jsonify({'message': 'Subscription added successfully!'}), 201

# Route to extend Subscription
@bp.route('/subscriptions/extend', methods=['PUT'])
def extend_subscription():
    data = request.get_json()

    # Check for existing subscription by ID
    subscription = Subscription.query.get(data['subscription_id'])
    if not subscription:
        return jsonify({'message': 'Subscription not found'}), 404

    # Convert new_end_date to datetime.date object
    try:
        new_end_date = datetime.strptime(data['new_end_date'], '%Y-%m-%d').date()
    except ValueError:
        return jsonify({'message': 'Invalid date format, should be YYYY-MM-DD'}), 400

    # Extend the end date of the subscription
    subscription.end_date = new_end_date
    db.session.commit()

    return jsonify({'message': 'Subscription extended successfully!'}), 200


# Route to delete specific subscription
@bp.route('/subscriptions/end', methods=['DELETE'])
def end_subscription():
    data = request.get_json()

    # Check for existing subscription by ID
    subscription = Subscription.query.get(data['subscription_id'])
    if not subscription:
        return jsonify({'message': 'Subscription not found'}), 404

    # Delete the subscription permanently from the database
    db.session.delete(subscription)
    db.session.commit()

    return jsonify({'message': 'Subscription ended and removed successfully!'}), 200



# Route to fetch all products
@bp.route('/products', methods=['GET'])
def fetch_products():
    try:
        # Fetch all products from the database
        products = Product.query.all()

        # Serialize product data
        product_data = []
        for product in products:
            product_data.append({
                'name': product.name,
                'annual_cost': product.annual_cost
            })

        return jsonify(product_data), 200
    except Exception as e:
        print(f"Error fetching products: {e}")
        return jsonify({'message': 'Failed to fetch products.'}), 500
    

# Route to get all active subscriptions
@bp.route('/subscriptions/active', methods=['GET'])
def get_active_subscriptions():
    # Assuming 'end_date' being None or a future date means the subscription is active
    active_subscriptions = Subscription.query.filter(
        (Subscription.end_date == None) | (Subscription.end_date > datetime.utcnow())
    ).all()
    
    return jsonify([{
        'id': sub.id,
        'customer_id': sub.customer_id,
        'product_name': sub.product_name,
        'start_date': sub.start_date,
        'end_date': sub.end_date,
        'no_of_users': sub.no_of_users
    } for sub in active_subscriptions])

