const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(__dirname));

// --- CONNECT TO MONGODB ---
if (!process.env.MONGODB_URI) {
  console.error('FATAL ERROR: MONGODB_URI environment variable is not set.');
  console.error('Please add MONGODB_URI in your Render Environment Variables.');
  process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000
})
  .then(() => {
    console.log('Successfully connected to MongoDB.');
    seedDatabase();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    console.error('Please check your MONGODB_URI and ensure MongoDB Atlas allows connections from 0.0.0.0/0.');
    process.exit(1);
  });

// --- MONGOOSE SCHEMAS & MODELS ---
const shopSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: String,
  category: String,
  area: String,
  password: { type: String, default: 'admin123' },
  isLive: { type: Boolean, default: false },
  requestedCouriers: { type: Number, default: 1 },
  assignedCouriers: { type: Number, default: 1 },
  desc: String,
  products: Array,
  commissionRate: { type: Number, default: 20 },
  courierRequests: { type: Number, default: 1 }
});

const deliverySchema = new mongoose.Schema({
  id: { type: String, required: true },
  customerName: String,
  phone: String,
  shopName: String,
  items: String,
  originalTotal: Number,
  discount: Number,
  total: Number,
  status: String,
  time: String,
  date: String,
  distance: Number,
  deliveryFee: Number,
  subtotal: Number,
  promoDiscount: Number,
  commissionRate: Number,
  paymentMethod: String,
  itemsDetails: Array
});

const settingSchema = new mongoose.Schema({
  key: { type: String, default: "global_config" },
  totalCouriersPool: { type: Number, default: 10 },
  baseDeliveryFee: { type: Number, default: 30 },
  perKmDeliveryFee: { type: Number, default: 10 },
  tieredCommissionRules: {
    enabled: { type: Boolean, default: false },
    tier1Limit: { type: Number, default: 5 },
    tier1Rate: { type: Number, default: 10 },
    tier2Limit: { type: Number, default: 10 },
    tier2Rate: { type: Number, default: 15 },
    tier3Rate: { type: Number, default: 20 }
  },
  dailyCommissions: { type: Map, of: Number, default: {} }
});

const Shop = mongoose.model('Shop', shopSchema);
const Delivery = mongoose.model('Delivery', deliverySchema);
const Setting = mongoose.model('Setting', settingSchema);

// --- SEED DATABASE IF EMPTY ---
async function seedDatabase() {
  try {
    const shopCount = await Shop.countDocuments();
    if (shopCount === 0) {
      const initialShops = [
        {
          id: 'SHOP-001',
          name: 'Aura Gourmet Grocery',
          category: 'Grocery',
          area: 'Connaught Place, Delhi',
          password: 'admin123',
          isLive: true,
          requestedCouriers: 1,
          assignedCouriers: 1,
          desc: 'Premium organic fruits, farm-fresh vegetables, dairy, artisanal cheeses, and daily essentials delivered within 30 minutes.',
          products: [
            {
              id: 'g1',
              name: 'Organic Hass Avocados (Pack of 2)',
              price: 180.00,
              discount: 15,
              stock: 25,
              rating: 4.7,
              reviews: 32,
              image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?q=80&w=800',
              desc: 'Perfectly ripe, creamy organic Hass avocados. Packed with healthy monounsaturated fats, potassium, and dietary fibers. Handpicked from local organic farms.',
              sizes: ['Standard Pack'],
              colors: ['Organic Fresh']
            },
            {
              id: 'g2',
              name: 'Alphonso Mangoes (1 Kg)',
              price: 350.00,
              stock: 12,
              rating: 4.9,
              reviews: 64,
              image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=800',
              desc: 'Naturally sweet, rich, and aromatic handpicked export-quality Alphonso mangoes. Known as the king of mangoes, delivered ripe and ready to eat.',
              sizes: ['1 Kg Box'],
              colors: ['Sweet Ripe']
            },
            {
              id: 'g3',
              name: 'Unprocessed Raw Forest Honey (500g)',
              price: 290.00,
              stock: 30,
              rating: 4.5,
              reviews: 21,
              image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=800',
              desc: '100% pure, raw, and unfiltered forest honey collected from wild hives. Retains all natural pollen, enzymes, and antioxidants. Healthy sugar alternative.',
              sizes: ['500g Glass Jar'],
              colors: ['Golden Amber']
            }
          ]
        },
        {
          id: 'SHOP-002',
          name: 'Apex Wellness Pharmacy',
          category: 'Pharmacy',
          area: 'Saket, Delhi',
          password: 'pass123',
          isLive: false,
          requestedCouriers: 1,
          assignedCouriers: 1,
          desc: 'Authorized prescription drugs, wellness supplements, first-aid kits, baby care, and daily healthcare hygiene essentials.',
          products: [
            {
              id: 'p1',
              name: 'Daily Multivitamin Supplement (60 Capsules)',
              price: 420.00,
              stock: 40,
              rating: 4.6,
              reviews: 78,
              image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?q=80&w=800',
              desc: 'Comprehensive daily multivitamin and mineral formula for vitality, immunity, and overall metabolic health. Gelatin-free, vegetarian capsules.',
              sizes: ['60 Capsule Pack'],
              colors: ['Supplement']
            },
            {
              id: 'p2',
              name: 'Premium First-Aid Emergency Kit',
              price: 750.00,
              stock: 15,
              rating: 4.8,
              reviews: 42,
              image: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?q=80&w=800',
              desc: 'All-in-one medical response bag containing sterile bandages, antiseptic wipes, burn creams, medical tape, tweezers, scissors, and instant cold packs.',
              sizes: ['Compact Case'],
              colors: ['Emergency Red']
            }
          ]
        },
        {
          id: 'SHOP-003',
          name: 'Bistro Delhi Restaurant',
          category: 'Restaurant',
          area: 'Karol Bagh, Delhi',
          password: 'bistro123',
          isLive: true,
          requestedCouriers: 1,
          assignedCouriers: 1,
          desc: 'Hot, fresh, and authentic North Indian delicacies, clay-oven tandoori starters, rich gravies, and premium biryanis.',
          products: [
            {
              id: 'r1',
              name: 'Mughlai Butter Chicken & Naan Combo',
              price: 380.00,
              discount: 10,
              stock: 50,
              rating: 4.8,
              reviews: 142,
              image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=800',
              desc: 'Clay-oven roasted chicken tikka cooked in a velvety rich butter-tomato-cashew gravy. Served with 2 hot butter naans, mint chutney, and salad.',
              sizes: ['Serves 1-2'],
              colors: ['Mild Spicy']
            },
            {
              id: 'r2',
              name: 'Tandoori Paneer Tikka Platter',
              price: 290.00,
              stock: 35,
              rating: 4.4,
              reviews: 58,
              image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?q=80&w=800',
              desc: 'Fresh cubes of cottage cheese, bell peppers, and onions marinated in yogurt and hand-ground spices, grilled to perfection in a clay oven.',
              sizes: ['8 Pieces Platter'],
              colors: ['Medium Spicy']
            }
          ]
        }
      ];
      await Shop.insertMany(initialShops);
      console.log('Seeded default shops into database.');
    }

    const deliveryCount = await Delivery.countDocuments();
    if (deliveryCount === 0) {
      const initialDeliveries = [
        {
          id: '#DL-1092',
          customerName: 'Rohit Verma',
          phone: '9876543210',
          shopName: 'Aura Gourmet Grocery',
          items: '2x Organic Hass Avocados',
          originalTotal: 400.00,
          discount: 0,
          total: 400.00,
          status: 'Pending',
          time: '15 mins ago',
          date: 'May 30, 2026',
          distance: 2.5,
          deliveryFee: 0.00,
          subtotal: 400.00,
          promoDiscount: 0,
          paymentMethod: 'Cash on Delivery (COD)',
          itemsDetails: [
            {
              product: {
                name: 'Organic Hass Avocados',
                price: 200.00,
                image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?q=80&w=800'
              },
              quantity: 2,
              shopName: 'Aura Gourmet Grocery',
              selectedSize: 'Standard'
            }
          ]
        },
        {
          id: '#DL-1081',
          customerName: 'Amit Saxena',
          phone: '9654321098',
          shopName: 'Bistro Delhi Restaurant',
          items: '1x Mughlai Butter Chicken Combo',
          originalTotal: 390.00,
          discount: 0,
          total: 390.00,
          status: 'Dispatched',
          time: '45 mins ago',
          date: 'May 30, 2026',
          distance: 3.2,
          deliveryFee: 0.00,
          subtotal: 390.00,
          promoDiscount: 0,
          paymentMethod: 'Cash on Delivery (COD)',
          itemsDetails: [
            {
              product: {
                name: 'Mughlai Butter Chicken Combo',
                price: 390.00,
                image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?q=80&w=800'
              },
              quantity: 1,
              shopName: 'Bistro Delhi Restaurant',
              selectedSize: 'Serves 1-2'
            }
          ]
        },
        {
          id: '#DL-1070',
          customerName: 'Preeti Nair',
          phone: '9543210987',
          shopName: 'Aura Gourmet Grocery',
          items: '1x Raw Forest Honey',
          originalTotal: 280.00,
          discount: 0,
          total: 280.00,
          status: 'Delivered',
          time: '2 hours ago',
          date: 'May 30, 2026',
          distance: 4.8,
          deliveryFee: 0.00,
          subtotal: 280.00,
          promoDiscount: 0,
          paymentMethod: 'Cash on Delivery (COD)',
          itemsDetails: [
            {
              product: {
                name: 'Raw Forest Honey',
                price: 280.00,
                image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=800'
              },
              quantity: 1,
              shopName: 'Aura Gourmet Grocery',
              selectedSize: '500g Jar'
            }
          ]
        }
      ];
      await Delivery.insertMany(initialDeliveries);
      console.log('Seeded default deliveries into database.');
    }

    const settingsCount = await Setting.countDocuments();
    if (settingsCount === 0) {
      await Setting.create({
        key: 'global_config',
        totalCouriersPool: 10,
        baseDeliveryFee: 30.00,
        perKmDeliveryFee: 10.00,
        tieredCommissionRules: {
          enabled: false,
          tier1Limit: 5,
          tier1Rate: 10,
          tier2Limit: 10,
          tier2Rate: 15,
          tier3Rate: 20
        },
        dailyCommissions: {}
      });
      console.log('Seeded default settings into database.');
    }
  } catch (err) {
    console.error('Error seeding database:', err);
  }
}

// --- API ENDPOINTS ---

// GET: Fetch entire system state
app.get('/api/state', async (req, res) => {
  try {
    const shops = await Shop.find({});
    const deliveries = await Delivery.find({});
    let settings = await Setting.findOne({ key: 'global_config' });
    if (!settings) {
      settings = await Setting.create({ key: 'global_config' });
    }
    res.json({ shops, deliveries, settings });
  } catch (err) {
    console.error('Error fetching state:', err);
    res.status(500).json({ error: 'Failed to fetch state' });
  }
});

// POST: Save/Sync entire system state
app.post('/api/state', async (req, res) => {
  try {
    const { shops, deliveries, totalCouriersPool, baseDeliveryFee, perKmDeliveryFee, dailyCommissions, tieredCommissionRules } = req.body;

    // Overwrite Shops
    if (shops && Array.isArray(shops)) {
      await Shop.deleteMany({});
      await Shop.insertMany(shops);
    }

    // Overwrite Deliveries
    if (deliveries && Array.isArray(deliveries)) {
      await Delivery.deleteMany({});
      await Delivery.insertMany(deliveries);
    }

    // Update Settings
    await Setting.findOneAndUpdate(
      { key: 'global_config' },
      {
        totalCouriersPool: totalCouriersPool !== undefined ? totalCouriersPool : 10,
        baseDeliveryFee: baseDeliveryFee !== undefined ? baseDeliveryFee : 30,
        perKmDeliveryFee: perKmDeliveryFee !== undefined ? perKmDeliveryFee : 10,
        tieredCommissionRules: tieredCommissionRules || {
          enabled: false,
          tier1Limit: 5,
          tier1Rate: 10,
          tier2Limit: 10,
          tier2Rate: 15,
          tier3Rate: 20
        },
        dailyCommissions: dailyCommissions || {}
      },
      { upsert: true, new: true }
    );

    res.json({ success: true, message: 'Database state updated successfully.' });
  } catch (err) {
    console.error('Error updating state:', err);
    res.status(500).json({ error: 'Failed to sync state to database' });
  }
});

// Serve frontend SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
