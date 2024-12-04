from flask import Blueprint, jsonify, request
from models import db, Product  

bp = Blueprint('product', __name__)


# Route to get all products
@bp.route('/products', methods=['GET'])
def get_products():
    products = Product.query.all()
    return jsonify([{
        "name": product.name,
        "description": product.description,
        "annual_cost": product.annual_cost
    } for product in products])
 

# Route to add a new product
@bp.route('/products', methods=['POST'])
def add_product():
    data = request.get_json()  # Get the incoming JSON data

    # Ensure required fields are present in the request
    if not data.get('name') or not data.get('description') or not data.get('annual_cost'):
        return jsonify({'message': 'Missing required fields: name, description, or annual_cost'}), 400
    
    # Create and add new product
    new_product = Product(
        name=data['name'],
        description=data['description'],
        annual_cost=data['annual_cost']
    )
    db.session.add(new_product)
    db.session.commit()

    return jsonify({'message': 'Product added successfully!'}), 201




# Route to remove a specific product
@bp.route('/products/<name>', methods=['DELETE'])
def delete_product(name):
    product = Product.query.filter_by(name=name).first()
    if product:
        db.session.delete(product)
        db.session.commit()
        return jsonify({'message': f'Product {name} deleted successfully'}), 200
    else:
        return jsonify({'message': 'Product not found'}), 404