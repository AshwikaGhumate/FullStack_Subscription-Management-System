from flask import Blueprint, jsonify, request
from models import db, Customer  # Import db and Customer model

bp = Blueprint('customer', __name__)

# Route to get all the customers
@bp.route('/customers', methods=['GET'])
def get_customers():
    customers = Customer.query.all()  # Fetch all customers from the database
    customer_list = []

    for customer in customers:
        customer_list.append({
            "id": customer.id,
            "name": customer.name,
            "pan": customer.pan
        })

    return jsonify(customer_list)


# Route to add a new customer
@bp.route('/customers', methods=['POST'])
def add_customer():
    data = request.get_json()  # Get the incoming JSON data

    # Ensure required fields are present in the request
    if not data.get('id') or not data.get('name') or not data.get('pan'):
        return jsonify({'message': 'Missing required fields: id, name, or pan'}), 400
    
    # Create and add new customer
    new_customer = Customer(
        id=data['id'],
        name=data['name'],
        pan=data['pan']
    )
    db.session.add(new_customer)
    db.session.commit()

    return jsonify({'message': 'Customer added successfully!'}), 201


# Route to remove a specific customer
@bp.route('/customers/<id>', methods=['DELETE'])
def delete_customer(id):
    customer = Customer.query.filter_by(id=id).first()
    if customer:
        db.session.delete(customer)
        db.session.commit()
        return jsonify({'message': f'Customer {id} deleted successfully'}), 200
    else:
        return jsonify({'message': 'Customer not found'}), 404