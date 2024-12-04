from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Customer(db.Model):
    id = db.Column(db.String(20), primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    pan = db.Column(db.String(10), unique=True, nullable=True)

class Product(db.Model):
    name = db.Column(db.String(50), primary_key=True)
    description = db.Column(db.String(200), nullable=False)
    annual_cost = db.Column(db.Float, nullable=False)

class Subscription(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    customer_id = db.Column(db.String(20), db.ForeignKey('customer.id'), nullable=False)
    product_name = db.Column(db.String(50), db.ForeignKey('product.name'), nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    no_of_users = db.Column(db.Integer, nullable=False)

