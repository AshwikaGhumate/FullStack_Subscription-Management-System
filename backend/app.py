from flask import Flask
from flask_cors import CORS
from models import db
from routes.customer import bp as customer_bp
from routes.subscription import bp as subscription_bp
from routes.product import bp as product_bp
from flask import Blueprint, jsonify, request


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite3'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
CORS(app)

# Register Blueprints
app.register_blueprint(customer_bp)
app.register_blueprint(subscription_bp)
app.register_blueprint(product_bp)

@app.route('/init-db', methods=['GET'])
def init_db():
    db.create_all()
    return jsonify({"message": "Database initialized!"})

if __name__ == "__main__":
    app.run(debug=True)
