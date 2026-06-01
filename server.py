import os
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__, static_folder='.', static_url_path='')
CORS(app)

MONGODB_URI = os.getenv("MONGODB_URI")
PORT = int(os.getenv("PORT", 8080))

client = MongoClient(MONGODB_URI)
db = client['mall_shopping_system']

# --- SEED DATA ---
initial_shops = [
    {
        "id": "SHOP-001",
        "name": "Aura Gourmet Grocery",
        "category": "Grocery",
        "area": "Connaught Place, Delhi",
        "password": "admin123",
        "isLive": True,
        "requestedCouriers": 1,
        "assignedCouriers": 1,
        "desc": "Premium organic fruits, farm-fresh vegetables, dairy, artisanal cheeses, and daily essentials delivered within 30 minutes.",
        "products": [
            {
                "id": "g1",
                "name": "Organic Hass Avocados (Pack of 2)",
                "price": 180.00,
                "discount": 15,
                "stock": 25,
                "rating": 4.7,
                "reviews": 32,
                "image": "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?q=80&w=800",
                "desc": "Perfectly ripe, creamy organic Hass avocados. Packed with healthy monounsaturated fats, potassium, and dietary fibers. Handpicked from local organic farms.",
                "sizes": ["Standard Pack"],
                "colors": ["Organic Fresh"]
            },
            {
                "id": "g2",
                "name": "Alphonso Mangoes (1 Kg)",
                "price": 350.00,
                "stock": 12,
                "rating": 4.9,
                "reviews": 64,
                "image": "https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=800",
                "desc": "Naturally sweet, rich, and aromatic handpicked export-quality Alphonso mangoes. Known as the king of mangoes, delivered ripe and ready to eat.",
                "sizes": ["1 Kg Box"],
                "colors": ["Sweet Ripe"]
            },
            {
                "id": "g3",
                "name": "Unprocessed Raw Forest Honey (500g)",
                "price": 290.00,
                "stock": 30,
                "rating": 4.5,
                "reviews": 21,
                "image": "https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=800",
                "desc": "100% pure, raw, and unfiltered forest honey collected from wild hives. Retains all natural pollen, enzymes, and antioxidants. Healthy sugar alternative.",
                "sizes": ["500g Glass Jar"],
                "colors": ["Golden Amber"]
            }
        ],
        "commissionRate": 20,
        "courierRequests": 1
    },
    {
        "id": "SHOP-002",
        "name": "Apex Wellness Pharmacy",
        "category": "Pharmacy",
        "area": "Saket, Delhi",
        "password": "pass123",
        "isLive": False,
        "requestedCouriers": 1,
        "assignedCouriers": 1,
        "desc": "Authorized prescription drugs, wellness supplements, first-aid kits, baby care, and daily healthcare hygiene essentials.",
        "products": [
            {
                "id": "p1",
                "name": "Daily Multivitamin Supplement (60 Capsules)",
                "price": 420.00,
                "stock": 40,
                "rating": 4.6,
                "reviews": 78,
                "image": "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?q=80&w=800",
                "desc": "Comprehensive daily multivitamin and mineral formula for vitality, immunity, and overall metabolic health. Gelatin-free, vegetarian capsules.",
                "sizes": ["60 Capsule Pack"],
                "colors": ["Supplement"]
            },
            {
                "id": "p2",
                "name": "Premium First-Aid Emergency Kit",
                "price": 750.00,
                "stock": 15,
                "rating": 4.8,
                "reviews": 42,
                "image": "https://images.unsplash.com/photo-1603398938378-e54eab446dde?q=80&w=800",
                "desc": "All-in-one medical response bag containing sterile bandages, antiseptic wipes, burn creams, medical tape, tweezers, scissors, and instant cold packs.",
                "sizes": ["Compact Case"],
                "colors": ["Emergency Red"]
            }
        ],
        "commissionRate": 20,
        "courierRequests": 1
    },
    {
        "id": "SHOP-003",
        "name": "Bistro Delhi Restaurant",
        "category": "Restaurant",
        "area": "Karol Bagh, Delhi",
        "password": "bistro123",
        "isLive": True,
        "requestedCouriers": 1,
        "assignedCouriers": 1,
        "desc": "Hot, fresh, and authentic North Indian delicacies, clay-oven tandoori starters, rich gravies, and premium biryanis.",
        "products": [
            {
                "id": "r1",
                "name": "Mughlai Butter Chicken & Naan Combo",
                "price": 380.00,
                "discount": 10,
                "stock": 50,
                "rating": 4.8,
                "reviews": 142,
                "image": "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=800",
                "desc": "Clay-oven roasted chicken tikka cooked in a velvety rich butter-tomato-cashew gravy. Served with 2 hot butter naans, mint chutney, and salad.",
                "sizes": ["Serves 1-2"],
                "colors": ["Mild Spicy"]
            },
            {
                "id": "r2",
                "name": "Tandoori Paneer Tikka Platter",
                "price": 290.00,
                "stock": 35,
                "rating": 4.4,
                "reviews": 58,
                "image": "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?q=80&w=800",
                "desc": "Fresh cubes of cottage cheese, bell peppers, and onions marinated in yogurt and hand-ground spices, grilled to perfection in a clay oven.",
                "sizes": ["8 Pieces Platter"],
                "colors": ["Medium Spicy"]
            }
        ],
        "commissionRate": 20,
        "courierRequests": 1
    }
]

initial_deliveries = [
    {
        "id": "#DL-1092",
        "customerName": "Rohit Verma",
        "phone": "9876543210",
        "shopName": "Aura Gourmet Grocery",
        "items": "2x Organic Hass Avocados",
        "originalTotal": 400.00,
        "discount": 0,
        "total": 400.00,
        "status": "Pending",
        "time": "15 mins ago",
        "date": "May 30, 2026",
        "distance": 2.5,
        "deliveryFee": 0.00,
        "subtotal": 400.00,
        "promoDiscount": 0,
        "paymentMethod": "Cash on Delivery (COD)",
        "itemsDetails": [
            {
                "product": {
                    "name": "Organic Hass Avocados",
                    "price": 200.00,
                    "image": "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?q=80&w=800"
                },
                "quantity": 2,
                "shopName": "Aura Gourmet Grocery",
                "selectedSize": "Standard"
            }
        ]
    },
    {
        "id": "#DL-1081",
        "customerName": "Amit Saxena",
        "phone": "9654321098",
        "shopName": "Bistro Delhi Restaurant",
        "items": "1x Mughlai Butter Chicken Combo",
        "originalTotal": 390.00,
        "discount": 0,
        "total": 390.00,
        "status": "Dispatched",
        "time": "45 mins ago",
        "date": "May 30, 2026",
        "distance": 3.2,
        "deliveryFee": 0.00,
        "subtotal": 390.00,
        "promoDiscount": 0,
        "paymentMethod": "Cash on Delivery (COD)",
        "itemsDetails": [
            {
                "product": {
                    "name": "Mughlai Butter Chicken Combo",
                    "price": 390.00,
                    "image": "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?q=80&w=800"
                },
                "quantity": 1,
                "shopName": "Bistro Delhi Restaurant",
                "selectedSize": "Serves 1-2"
            }
        ]
    },
    {
        "id": "#DL-1070",
        "customerName": "Preeti Nair",
        "phone": "9543210987",
        "shopName": "Aura Gourmet Grocery",
        "items": "1x Raw Forest Honey",
        "originalTotal": 280.00,
        "discount": 0,
        "total": 280.00,
        "status": "Delivered",
        "time": "2 hours ago",
        "date": "May 30, 2026",
        "distance": 4.8,
        "deliveryFee": 0.00,
        "subtotal": 280.00,
        "promoDiscount": 0,
        "paymentMethod": "Cash on Delivery (COD)",
        "itemsDetails": [
            {
                "product": {
                    "name": "Raw Forest Honey",
                    "price": 280.00,
                    "image": "https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=800"
                },
                "quantity": 1,
                "shopName": "Aura Gourmet Grocery",
                "selectedSize": "500g Jar"
            }
        ]
    }
]

initial_settings = {
    "key": "global_config",
    "totalCouriersPool": 10,
    "baseDeliveryFee": 30.00,
    "perKmDeliveryFee": 10.00,
    "tieredCommissionRules": {
        "enabled": False,
        "tier1Limit": 5,
        "tier1Rate": 10,
        "tier2Limit": 10,
        "tier2Rate": 15,
        "tier3Rate": 20
    },
    "dailyCommissions": {}
}


# --- DATABASE SEEDING ---
def seed_database():
    try:
        if db.shops.count_documents({}) == 0:
            db.shops.insert_many(initial_shops)
            print("Seeded default shops into database.")
            
        if db.deliveries.count_documents({}) == 0:
            db.deliveries.insert_many(initial_deliveries)
            print("Seeded default deliveries into database.")
            
        if db.settings.count_documents({}) == 0:
            db.settings.insert_one(initial_settings)
            print("Seeded default settings into database.")
    except Exception as e:
        print("Database seeding error:", e)


# Run Seeding
seed_database()


# --- HELPER FUNCTIONS ---
def serialize_mongo(doc):
    if doc is None:
        return None
    if '_id' in doc:
        doc['_id'] = str(doc['_id'])
    return doc

def serialize_mongo_list(docs):
    return [serialize_mongo(doc) for doc in docs]


# --- API ROUTES ---

@app.route('/api/state', methods=['GET'])
def get_state():
    try:
        shops = list(db.shops.find({}))
        deliveries = list(db.deliveries.find({}))
        settings = db.settings.find_one({"key": "global_config"})
        if not settings:
            settings = initial_settings.copy()
            db.settings.insert_one(settings)
            
        return jsonify({
            "shops": serialize_mongo_list(shops),
            "deliveries": serialize_mongo_list(deliveries),
            "settings": serialize_mongo(settings)
        })
    except Exception as e:
        print("Error fetching state:", e)
        return jsonify({"error": "Failed to fetch state"}), 500


@app.route('/api/state', methods=['POST'])
def update_state():
    try:
        data = request.json
        shops = data.get('shops')
        deliveries = data.get('deliveries')
        totalCouriersPool = data.get('totalCouriersPool', 10)
        baseDeliveryFee = data.get('baseDeliveryFee', 30.00)
        perKmDeliveryFee = data.get('perKmDeliveryFee', 10.00)
        dailyCommissions = data.get('dailyCommissions', {})
        tieredCommissionRules = data.get('tieredCommissionRules')

        # Sync Shops
        if isinstance(shops, list):
            db.shops.delete_many({})
            if shops:
                # Remove _id key to let MongoDB recreate them uniquely
                for s in shops:
                    s.pop('_id', None)
                db.shops.insert_many(shops)

        # Sync Deliveries
        if isinstance(deliveries, list):
            db.deliveries.delete_many({})
            if deliveries:
                # Remove _id key to let MongoDB recreate them uniquely
                for d in deliveries:
                    d.pop('_id', None)
                db.deliveries.insert_many(deliveries)

        # Sync Settings
        db.settings.update_one(
            {"key": "global_config"},
            {"$set": {
                "totalCouriersPool": totalCouriersPool,
                "baseDeliveryFee": baseDeliveryFee,
                "perKmDeliveryFee": perKmDeliveryFee,
                "dailyCommissions": dailyCommissions,
                "tieredCommissionRules": tieredCommissionRules or initial_settings["tieredCommissionRules"]
            }},
            upsert=True
        )

        return jsonify({"success": True, "message": "Database state updated successfully."})
    except Exception as e:
        print("Error updating state:", e)
        return jsonify({"error": "Failed to sync state to database"}), 500


# --- STATIC FILE SERVING ---

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def static_files(path):
    return send_from_directory('.', path)


if __name__ == '__main__':
    print(f"Flask server is running on port {PORT}")
    app.run(host='0.0.0.0', port=PORT, debug=True)
