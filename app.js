// --- MOCK DATABASE (SHOPS & PRODUCTS) ---
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
    isLive: false, // Starts offline by default
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

// --- APP GLOBAL STATE ---
let shops = [];
let cart = JSON.parse(localStorage.getItem('delivery_cart')) || [];
let totalCouriersPool = 10;
let baseDeliveryFee = 30.00;
let perKmDeliveryFee = 10.00;
let currentCheckoutDistance = 0.0;
let deliveryToDeliverIndex = null;
let deliveries = [];

let currentTheme = localStorage.getItem('delivery_theme') || 'dark';
let activePortal = 'customer'; // customer | shop | agency
let activeShopSession = JSON.parse(sessionStorage.getItem('active_shop_session')) || null;
let activeCustomerShop = null; // Shop object being viewed by customer
let discountPercent = 0;
let appliedPromo = '';
let dailyCommissions = {};
let tieredCommissionRules = {
  enabled: false,
  tier1Limit: 5,
  tier1Rate: 10,
  tier2Limit: 10,
  tier2Rate: 15,
  tier3Rate: 20
};

// --- DOM ELEMENTS SELECTION ---
const body = document.body;
const appBackdrop = document.getElementById('app-backdrop');
const toastContainer = document.getElementById('toast-container');

// Portals & Nav
const portalTabs = document.querySelectorAll('.portal-tab-btn');
const portalCustomerView = document.getElementById('portal-customer-view');
const portalShopView = document.getElementById('portal-shop-view');
const portalAgencyView = document.getElementById('portal-agency-view');

const navLogo = document.getElementById('nav-logo');
const themeBtn = document.getElementById('theme-btn');
const themeDropdown = document.getElementById('theme-dropdown');
const cartBtn = document.getElementById('cart-btn');
const cartCount = document.getElementById('cart-count');

// Customer Views
const custShopsDirectory = document.getElementById('cust-shops-directory');
const custShopCatalog = document.getElementById('cust-shop-catalog');
const custCheckoutView = document.getElementById('cust-checkout-view');
const custSuccessView = document.getElementById('cust-success-view');

const shopsDirectoryGrid = document.getElementById('shops-directory-grid');
const catalogProductsGrid = document.getElementById('catalog-products-grid');
const directorySearch = document.getElementById('directory-search');
const catalogShopName = document.getElementById('catalog-shop-name');
const catalogShopCategory = document.getElementById('catalog-shop-category');
const catalogShopArea = document.getElementById('catalog-shop-area');
const catalogBackBtn = document.getElementById('catalog-back-btn');
const shopCatalogSearch = document.getElementById('shop-catalog-search');
const catalogSort = document.getElementById('catalog-sort');

// Cart Drawer
const cartDrawer = document.getElementById('cart-drawer');
const cartCloseBtn = document.getElementById('cart-close-btn');
const cartItemsContainer = document.getElementById('cart-items-container');
const cartSubtotal = document.getElementById('cart-subtotal');
const cartTax = document.getElementById('cart-tax');
const cartDiscount = document.getElementById('cart-discount');
const cartTotal = document.getElementById('cart-total');
const cartPromoInput = document.getElementById('cart-promo-input');
const cartPromoApplyBtn = document.getElementById('cart-promo-apply-btn');
const cartCheckoutBtn = document.getElementById('cart-checkout-btn');

// Checkout Wizard
const stepInds = [
  document.getElementById('step-ind-1'),
  document.getElementById('step-ind-2'),
  document.getElementById('step-ind-3')
];
const panels = [
  document.getElementById('checkout-panel-1'),
  document.getElementById('checkout-panel-2'),
  document.getElementById('checkout-panel-3')
];
const shippingForm = document.getElementById('shipping-form');
const paymentForm = document.getElementById('payment-form');
const cardNumInput = document.getElementById('pay-card-num');
const cardNameInput = document.getElementById('pay-name');
const cardExpiryInput = document.getElementById('pay-expiry');

const cardBrandDisplay = document.getElementById('card-brand-display');
const cardNumDisplay = document.getElementById('card-num-display');
const cardNameDisplay = document.getElementById('card-name-display');
const cardExpDisplay = document.getElementById('card-exp-display');

const next1 = document.getElementById('checkout-next-1');
const back2 = document.getElementById('checkout-back-2');
const next2 = document.getElementById('checkout-next-2');
const back3 = document.getElementById('checkout-back-3');
const confirmBtn = document.getElementById('checkout-confirm-btn');

const checkoutSummaryItems = document.getElementById('checkout-summary-items');
const checkoutSubtotal = document.getElementById('checkout-subtotal');
const checkoutShipping = document.getElementById('checkout-shipping');
const checkoutDiscount = document.getElementById('checkout-discount');
const checkoutTotal = document.getElementById('checkout-total');

// Order Success
const successOrderId = document.getElementById('success-order-id');
const successReceiptItems = document.getElementById('success-receipt-items');
const successReceiptTotal = document.getElementById('success-receipt-total');
const successContinueBtn = document.getElementById('success-continue-btn');
const successPrintBtn = document.getElementById('success-print-btn');

// Shop Portal Elements
const shopLoginPanel = document.getElementById('shop-login-panel');
const shopDashboardPanel = document.getElementById('shop-dashboard-panel');
const shopLoginForm = document.getElementById('shop-login-form');
const loginShopIdInput = document.getElementById('login-shop-id');
const loginShopPassInput = document.getElementById('login-shop-pass');

const partnerShopName = document.getElementById('partner-shop-name');
const partnerShopId = document.getElementById('partner-shop-id');
const partnerShopCategory = document.getElementById('partner-shop-category');
const partnerShopArea = document.getElementById('partner-shop-area');
const partnerStatusLabel = document.getElementById('partner-status-label');
const partnerStatusToggleBtn = document.getElementById('partner-status-toggle-btn');
const partnerLogoutBtn = document.getElementById('partner-logout-btn');

const shopAddProductForm = document.getElementById('shop-add-product-form');
const partnerInventoryRows = document.getElementById('partner-inventory-rows');
const partnerDeliveryRows = document.getElementById('partner-delivery-rows');

// Agency Portal Panels & Links
const dbNavLinks = document.querySelectorAll('.db-nav-link[data-panel]');
const dbPanels = document.querySelectorAll('.db-panel');

const agStatTotalShops = document.getElementById('ag-stat-total-shops');
const agStatLiveShops = document.getElementById('ag-stat-live-shops');
const agStatPendingDeliveries = document.getElementById('ag-stat-pending-deliveries');
const agStatCompletedDeliveries = document.getElementById('ag-stat-completed-deliveries');

const agencyDeliveriesRows = document.getElementById('agency-deliveries-rows');
const agencyRegisterShopForm = document.getElementById('agency-register-shop-form');
const agencyShopsRows = document.getElementById('agency-shops-rows');

// Registration Modal
const regSuccessModal = document.getElementById('registration-success-modal');
const successRegName = document.getElementById('success-reg-name');
const successRegId = document.getElementById('success-reg-id');
const successRegPass = document.getElementById('success-reg-pass');
const closeRegSuccessBtn = document.getElementById('close-reg-success-btn');

// Details Modal
const modalDialog = document.getElementById('product-detail-modal');
const modalCloseBtn = document.getElementById('modal-close-btn');


// --- TOAST NOTIFICATIONS ---
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  let icon = 'info';
  if (type === 'success') icon = 'check-circle';
  if (type === 'error') icon = 'alert-octagon';
  if (type === 'warning') icon = 'alert-triangle';

  toast.innerHTML = `
    <i data-lucide="${icon}"></i>
    <span>${message}</span>
  `;
  
  toastContainer.appendChild(toast);
  lucide.createIcons();

  setTimeout(() => toast.classList.add('show'), 10);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}


// --- THEME MANAGEMENT ---
function changeTheme(theme) {
  currentTheme = theme;
  body.className = '';
  
  if (theme === 'light') {
    body.classList.add('light-theme');
  } else if (theme === 'glass') {
    body.classList.add('glass-theme');
  } else {
    body.classList.add('dark-theme');
  }
  
  document.querySelectorAll('.theme-option').forEach(opt => {
    if (opt.dataset.theme === theme) {
      opt.classList.add('active');
    } else {
      opt.classList.remove('active');
    }
  });

  localStorage.setItem('delivery_theme', theme);
}


// --- LOCALSTORAGE & BACKEND DATABASE SYNC ---
async function loadStateFromServer() {
  try {
    const response = await fetch('/api/state');
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    
    // Assign global state variables from database
    shops = data.shops || [];
    deliveries = data.deliveries || [];
    
    if (data.settings) {
      totalCouriersPool = data.settings.totalCouriersPool || 10;
      baseDeliveryFee = data.settings.baseDeliveryFee || 30.00;
      perKmDeliveryFee = data.settings.perKmDeliveryFee || 10.00;
      dailyCommissions = data.settings.dailyCommissions || {};
      
      // Mongoose Map is fetched as an object, ensure it's mapped correctly
      if (data.settings.dailyCommissions && typeof data.settings.dailyCommissions === 'object') {
        dailyCommissions = data.settings.dailyCommissions;
      }
      
      tieredCommissionRules = data.settings.tieredCommissionRules || {
        enabled: false,
        tier1Limit: 5,
        tier1Rate: 10,
        tier2Limit: 10,
        tier2Rate: 15,
        tier3Rate: 20
      };
    }
    
    console.log('Successfully loaded application state from MongoDB.');
  } catch (err) {
    console.error('Failed to load state from database. Falling back to localStorage:', err);
    // Fallback to localStorage
    shops = JSON.parse(localStorage.getItem('delivery_shops')) || initialShops;
    shops.forEach(s => { if (s.commissionRate === undefined) s.commissionRate = 20; });
    deliveries = JSON.parse(localStorage.getItem('delivery_orders')) || [];
    totalCouriersPool = parseInt(localStorage.getItem('total_couriers_pool')) || 10;
    baseDeliveryFee = parseFloat(localStorage.getItem('agency_base_delivery_fee')) || 30.00;
    perKmDeliveryFee = parseFloat(localStorage.getItem('agency_per_km_delivery_fee')) || 10.00;
    dailyCommissions = JSON.parse(localStorage.getItem('agency_daily_commissions')) || {};
    tieredCommissionRules = JSON.parse(localStorage.getItem('agency_commission_rules')) || {
      enabled: false,
      tier1Limit: 5,
      tier1Rate: 10,
      tier2Limit: 10,
      tier2Rate: 15,
      tier3Rate: 20
    };
  }

  // Trigger UI renders
  renderShopsDirectory();
  renderPartnerDeliveries();
  renderPartnerInventory();
  renderAgencyDeliveries();
  renderAgencyCommissionSettings();
  renderAgencyDailyReports();
  renderCourierAllocation();
  updateAgencyStats();
}

function syncStorage() {
  // Save to localStorage as quick local cache
  localStorage.setItem('delivery_shops', JSON.stringify(shops));
  localStorage.setItem('delivery_cart', JSON.stringify(cart));
  localStorage.setItem('delivery_orders', JSON.stringify(deliveries));
  localStorage.setItem('total_couriers_pool', totalCouriersPool);
  localStorage.setItem('agency_base_delivery_fee', baseDeliveryFee);
  localStorage.setItem('agency_per_km_delivery_fee', perKmDeliveryFee);
  localStorage.setItem('agency_daily_commissions', JSON.stringify(dailyCommissions));
  localStorage.setItem('agency_commission_rules', JSON.stringify(tieredCommissionRules));

  // Sync to Express MongoDB backend
  fetch('/api/state', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      shops,
      deliveries,
      totalCouriersPool,
      baseDeliveryFee,
      perKmDeliveryFee,
      dailyCommissions,
      tieredCommissionRules
    })
  })
  .then(res => {
    if (!res.ok) throw new Error('API Sync Failed');
    return res.json();
  })
  .then(data => {
    console.log('MongoDB successfully synced:', data.message);
  })
  .catch(err => {
    console.error('Error syncing state to MongoDB backend:', err);
  });
}


// --- VIEW PORTAL CONTROL ---
function switchPortal(portal) {
  activePortal = portal;
  
  // Update Tab States
  portalTabs.forEach(tab => {
    if (tab.dataset.portal === portal) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });

  // Toggle Visibility
  portalCustomerView.classList.remove('active');
  portalShopView.classList.remove('active');
  portalAgencyView.classList.remove('active');
  cartBtn.style.display = 'none';

  if (portal === 'customer') {
    portalCustomerView.classList.add('active');
    cartBtn.style.display = 'flex';
    switchCustomerSubview('cust-shops-directory');
    renderShopsDirectory();
  } else if (portal === 'shop') {
    portalShopView.classList.add('active');
    renderShopPartnerPortal();
  } else if (portal === 'agency') {
    portalAgencyView.classList.add('active');
    renderAgencyPortal();
  }
}

// Subview router inside Customer Portal
function switchCustomerSubview(subviewId) {
  const subviews = [custShopsDirectory, custShopCatalog, custCheckoutView, custSuccessView];
  subviews.forEach(view => {
    if (view.id === subviewId) {
      view.classList.add('active');
    } else {
      view.classList.remove('active');
    }
  });
}


// --- PORTAL A: CUSTOMER STOREFRONT LOGIC ---

// Render live online shops directory
function renderShopsDirectory() {
  shopsDirectoryGrid.innerHTML = '';
  const searchVal = directorySearch.value.trim().toLowerCase();

  // Filter only Live shops or shops matching query
  const liveShops = shops.filter(s => {
    // Must be online (Live) to display on customer front
    if (!s.isLive) return false;

    if (searchVal) {
      const matchName = s.name.toLowerCase().includes(searchVal);
      const matchCat = s.category.toLowerCase().includes(searchVal);
      const matchArea = s.area.toLowerCase().includes(searchVal);
      return matchName || matchCat || matchArea;
    }
    return true;
  });

  document.getElementById('live-shops-count').innerText = shops.filter(s => s.isLive).length;

  if (liveShops.length === 0) {
    shopsDirectoryGrid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted);">
        <i data-lucide="store" style="width: 48px; height: 48px; display: block; margin: 0 auto 12px auto;"></i>
        <p>No online shops are active in your neighborhood right now.</p>
        <small style="display:block; margin-top:8px;">Switch to "Shop Partner Login" to open a shop and bring it online, or "Agency Control Hub" to onboard shops.</small>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  liveShops.forEach(shop => {
    const freeCouriers = getFreeCouriersCount(shop);
    const totalCouriers = shop.assignedCouriers || 1;
    const courierStatusHTML = freeCouriers > 0
      ? `<span style="font-size: 0.8rem; color: var(--success-color); font-weight: 600;"><i data-lucide="user-check" style="width:12px;height:12px;display:inline-block;vertical-align:middle;margin-right:4px;"></i>${freeCouriers}/${totalCouriers} Couriers Free</span>`
      : `<span style="font-size: 0.8rem; color: var(--warning-color); font-weight: 600;"><i data-lucide="clock" style="width:12px;height:12px;display:inline-block;vertical-align:middle;margin-right:4px;"></i>0/${totalCouriers} Busy (Delays Expected)</span>`;

    const cardHTML = `
      <div class="product-card glass-card">
        <div class="product-image-container" style="height: 180px; background: linear-gradient(135deg, var(--bg-tertiary), var(--bg-secondary)); display: flex; align-items: center; justify-content: center;">
          <span class="shop-tag fashion" style="background: var(--accent-color); font-size: 0.7rem;">${shop.category}</span>
          <i data-lucide="store" style="width: 60px; height: 60px; color: var(--accent-color); opacity: 0.85;"></i>
        </div>
        <div class="product-info" style="padding: 16px;">
          <h3 class="product-name" style="height: auto; margin-bottom: 4px; font-size: 1.15rem;">${shop.name}</h3>
          <div style="display: flex; flex-direction: column; gap: 4px; margin-bottom: 8px;">
            <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: 500;"><i data-lucide="map-pin" style="width:12px;height:12px;display:inline-block;vertical-align:middle;margin-right:4px;"></i>${shop.area}</span>
            <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: 500;"><i data-lucide="truck" style="width:12px;height:12px;display:inline-block;vertical-align:middle;margin-right:4px;"></i>Delivery: ₹${perKmDeliveryFee.toFixed(2)}/km (+ ₹${baseDeliveryFee.toFixed(2)} base)</span>
          </div>
          <p class="shop-card-desc">${shop.desc}</p>
          <div class="product-footer" style="padding-top: 10px;">
            <div style="display:flex; flex-direction:column; gap:4px; align-items:flex-start;">
              <span style="color: var(--success-color); font-weight: 700; font-size: 0.8rem;"><i data-lucide="wifi" style="width:14px;height:14px;vertical-align:middle;margin-right:4px;"></i>ONLINE</span>
              ${courierStatusHTML}
            </div>
            <button class="next-btn" onclick="enterShopCatalog('${shop.id}')" style="padding: 8px 16px; font-size: 0.85rem; border-radius: var(--border-radius-full);">
              <span>View Store</span>
              <i data-lucide="arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
    `;
    shopsDirectoryGrid.innerHTML += cardHTML;
  });

  lucide.createIcons();
}

directorySearch.addEventListener('input', renderShopsDirectory);

// Enter specific shop products list
function enterShopCatalog(shopId) {
  const shop = shops.find(s => s.id === shopId);
  if (!shop) return;

  activeCustomerShop = shop;
  
  // Set Catalog Titles
  catalogShopName.innerText = shop.name;
  catalogShopCategory.innerText = shop.category + ' department';
  catalogShopArea.innerHTML = `<i data-lucide="map-pin" style="width:14px;height:14px;vertical-align:middle;margin-right:4px;"></i> ${shop.area}`;
  
  const deliverySpan = document.getElementById('catalog-shop-delivery');
  if (deliverySpan) {
    deliverySpan.innerHTML = `<i data-lucide="truck" style="width:14px;height:14px;vertical-align:middle;margin-right:4px;"></i> ₹${perKmDeliveryFee.toFixed(2)}/km (+ ₹${baseDeliveryFee.toFixed(2)} base)`;
  }

  // Reset filters
  document.getElementById('shop-catalog-search').value = '';
  catalogSort.value = 'featured';

  switchCustomerSubview('cust-shop-catalog');
  renderShopCatalog();
}

function renderShopCatalog() {
  if (!activeCustomerShop) return;
  catalogProductsGrid.innerHTML = '';

  const searchVal = shopCatalogSearch.value.trim().toLowerCase();
  const sortBy = catalogSort.value;

  let filteredProducts = [...activeCustomerShop.products].filter(p => {
    if (searchVal) {
      return p.name.toLowerCase().includes(searchVal) || p.desc.toLowerCase().includes(searchVal);
    }
    return true;
  });

  if (sortBy === 'price-low') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  if (filteredProducts.length === 0) {
    catalogProductsGrid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted);">
        <i data-lucide="help-circle" style="width: 48px; height: 48px; display: block; margin: 0 auto 12px auto;"></i>
        <p>No products cataloged by this shop match your query.</p>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  filteredProducts.forEach(p => {
    const isOutOfStock = p.stock === 0;
    const hasDiscount = p.discount && p.discount > 0;
    const finalPrice = hasDiscount ? getDiscountedPrice(p) : p.price;
    const discountBadgeHTML = hasDiscount ? `<span class="discount-badge">${p.discount}% OFF</span>` : '';
    const priceHTML = hasDiscount 
      ? `<span class="product-price">₹${finalPrice.toFixed(2)}<span class="original-price-crossed">₹${p.price.toFixed(2)}</span></span>` 
      : `<span class="product-price">₹${p.price.toFixed(2)}</span>`;

    const itemHTML = `
      <div class="product-card glass-card">
        <div class="product-image-container">
          <img src="${p.image}" alt="${p.name}" class="product-img">
          ${discountBadgeHTML}
          <div class="card-actions-overlay">
            <button class="card-btn" onclick="openProductDetails('${p.id}')" title="Quick View">
              <i data-lucide="eye"></i>
            </button>
            <button class="card-btn" onclick="triggerQuickAdd('${p.id}')" title="Quick Purchase" ${isOutOfStock ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>
              <i data-lucide="shopping-cart"></i>
            </button>
          </div>
        </div>
        <div class="product-info">
          <div class="product-rating">
            ${generateRatingStars(p.rating)}
            <span class="rating-count">(${p.reviews})</span>
          </div>
          <h3 class="product-name" onclick="openProductDetails('${p.id}')" style="cursor: pointer;">${p.name}</h3>
          <div class="product-footer">
            ${priceHTML}
            ${isOutOfStock ? 
              `<span style="color: var(--error-color); font-weight: 700; font-size: 0.85rem; text-transform: uppercase;">Sold Out</span>` :
              `<button class="add-to-cart-btn" onclick="triggerQuickAdd('${p.id}')" title="Add to Basket">
                <i data-lucide="plus"></i>
               </button>`
            }
          </div>
        </div>
      </div>
    `;
    catalogProductsGrid.innerHTML += itemHTML;
  });

  lucide.createIcons();
}

catalogBackBtn.addEventListener('click', () => {
  activeCustomerShop = null;
  switchCustomerSubview('cust-shops-directory');
  renderShopsDirectory();
});

shopCatalogSearch.addEventListener('input', renderShopCatalog);
catalogSort.addEventListener('change', renderShopCatalog);


// --- PRODUCT DETAILS MODAL ---
let activeModalProduct = null;

function openProductDetails(productId) {
  if (!activeCustomerShop) return;
  const p = activeCustomerShop.products.find(prod => prod.id === productId);
  if (!p) return;

  activeModalProduct = p;
  
  const modalImg = document.getElementById('modal-image');
  modalImg.src = p.image;
  modalImg.alt = p.name;
  
  const isOutOfStock = p.stock === 0;

  let sizeOptionsHTML = p.sizes.map((s, idx) => `
    <button class="option-pill ${idx === 0 ? 'active' : ''}" onclick="selectModalSize(this, '${s}')">${s}</button>
  `).join('');

  let colorOptionsHTML = p.colors.map((c, idx) => `
    <div class="color-dot ${idx === 0 ? 'active' : ''}" style="background-color: ${getColorHex(c)};" title="${c}" onclick="selectModalColor(this, '${c}')"></div>
  `).join('');

  const detailContainer = document.getElementById('modal-details-container');
  detailContainer.innerHTML = `
    <span class="modal-shop">${activeCustomerShop.name}</span>
    <h2 class="modal-title">${p.name}</h2>
    
    <div class="modal-meta">
      <div class="product-rating" style="margin-bottom: 0;">
        ${generateRatingStars(p.rating)}
        <span class="rating-count">(${p.reviews} reviews)</span>
      </div>
      <div class="modal-stock ${isOutOfStock ? 'out' : ''}">
        <i data-lucide="${isOutOfStock ? 'x-circle' : 'check-circle'}"></i>
        <span>${isOutOfStock ? 'Out of Stock' : `${p.stock} In Stock`}</span>
      </div>
    </div>
    
    <div class="modal-price">
      ${(() => {
        const hasDiscount = p.discount && p.discount > 0;
        const finalPrice = hasDiscount ? getDiscountedPrice(p) : p.price;
        return hasDiscount 
          ? `₹${finalPrice.toFixed(2)} <span class="original-price-crossed">₹${p.price.toFixed(2)}</span> <span style="font-size:0.8rem;background:rgba(239,68,68,0.1);color:#ef4444;padding:2px 6px;border-radius:4px;font-weight:700;margin-left:8px;">${p.discount}% OFF</span>` 
          : `₹${p.price.toFixed(2)}`;
      })()}
    </div>
    
    <p class="modal-desc">${p.desc}</p>
    
    <div class="modal-options">
      ${p.sizes.length > 0 ? `
        <div class="option-group">
          <div class="option-label">Option Pack / Size</div>
          <div class="option-selector" id="modal-size-selector">
            ${sizeOptionsHTML}
          </div>
        </div>
      ` : ''}
      
      ${p.colors.length > 0 ? `
        <div class="option-group">
          <div class="option-label">Variant Preference</div>
          <div class="option-selector" id="modal-color-selector">
            ${colorOptionsHTML}
          </div>
        </div>
      ` : ''}
    </div>
    
    <div class="modal-purchase">
      <div class="quantity-picker">
        <button class="qty-btn" id="modal-qty-dec">-</button>
        <div class="qty-num" id="modal-qty-val">1</div>
        <button class="qty-btn" id="modal-qty-inc">+</button>
      </div>
      <button class="modal-buy-btn" id="modal-add-to-cart-btn" style="background: var(--accent-color);" ${isOutOfStock ? 'disabled style="opacity: 0.5; cursor: not-allowed; background: var(--text-muted);"' : ''}>
        <i data-lucide="shopping-bag"></i>
        <span>${isOutOfStock ? 'Sold Out' : 'Add to Delivery Basket'}</span>
      </button>
    </div>
  `;
  
  activeModalProduct.chosenSize = p.sizes[0];
  activeModalProduct.chosenColor = p.colors[0];
  activeModalProduct.chosenQty = 1;

  const qtyVal = document.getElementById('modal-qty-val');
  document.getElementById('modal-qty-dec').addEventListener('click', () => {
    let q = parseInt(qtyVal.innerText);
    if (q > 1) {
      q--;
      qtyVal.innerText = q;
      activeModalProduct.chosenQty = q;
    }
  });

  document.getElementById('modal-qty-inc').addEventListener('click', () => {
    let q = parseInt(qtyVal.innerText);
    if (q < p.stock) {
      q++;
      qtyVal.innerText = q;
      activeModalProduct.chosenQty = q;
    } else {
      showToast(`Stock limit of ${p.stock} reached.`, 'warning');
    }
  });

  document.getElementById('modal-add-to-cart-btn').addEventListener('click', () => {
    addToCart(p.id, activeModalProduct.chosenQty, activeModalProduct.chosenColor, activeModalProduct.chosenSize);
    modalDialog.close();
    modalDialog.classList.remove('active');
  });

  lucide.createIcons();
  modalDialog.showModal();
  modalDialog.classList.add('active');
}

function selectModalSize(btn, size) {
  document.querySelectorAll('#modal-size-selector .option-pill').forEach(el => el.classList.remove('active'));
  btn.classList.add('active');
  activeModalProduct.chosenSize = size;
}

function selectModalColor(dot, color) {
  document.querySelectorAll('#modal-color-selector .color-dot').forEach(el => el.classList.remove('active'));
  dot.classList.add('active');
  activeModalProduct.chosenColor = color;
}

// Calculate the discounted price of a product
function getDiscountedPrice(product) {
  if (!product) return 0;
  const price = product.price || 0;
  const discount = product.discount || 0;
  return price - (price * discount / 100);
}

// Calculate distance-based delivery fee (Base + per-km fee configured by agency)
function calculateDeliveryFee(distance) {
  return baseDeliveryFee + (distance * perKmDeliveryFee);
}

// Get commission percentage for a specific date and shop (default falls back to shop settings)
function getDailyCommissionRate(dateStr, shopName) {
  const key = `${dateStr}_${shopName}`;
  if (dailyCommissions[key] !== undefined) {
    return dailyCommissions[key];
  }
  return getShopCommissionRate(shopName);
}

// Calculate or retrieve default commission percentage for a shop based on historical orders (manual vs. auto tiered)
function getShopCommissionRate(shopName) {
  const shop = shops.find(s => s.name === shopName);
  if (!shop) return 20.00;

  const totalOrdersCount = deliveries.filter(d => d.shopName === shopName).length;

  if (tieredCommissionRules.enabled) {
    if (totalOrdersCount < tieredCommissionRules.tier1Limit) {
      return tieredCommissionRules.tier1Rate;
    } else if (totalOrdersCount < tieredCommissionRules.tier2Limit) {
      return tieredCommissionRules.tier2Rate;
    } else {
      return tieredCommissionRules.tier3Rate;
    }
  }

  return shop.commissionRate !== undefined ? shop.commissionRate : 20.00;
}

// Calculate the number of free couriers for a shop
function getFreeCouriersCount(shop) {
  if (!shop) return 0;
  if (shop.assignedCouriers === undefined) shop.assignedCouriers = 1;
  const busyCount = deliveries.filter(d => d.shopName === shop.name && d.status === 'Dispatched').length;
  return Math.max(0, shop.assignedCouriers - busyCount);
}

function generateRatingStars(rating) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5 ? 1 : 0;
  let starsHTML = '';
  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      starsHTML += '<i data-lucide="star" class="fill"></i>';
    } else if (i === fullStars + 1 && halfStar) {
      starsHTML += '<i data-lucide="star-half"></i>';
    } else {
      starsHTML += '<i data-lucide="star" style="fill: none;"></i>';
    }
  }
  return starsHTML;
}

function triggerQuickAdd(id) {
  if (!activeCustomerShop) return;
  const p = activeCustomerShop.products.find(prod => prod.id === id);
  if (!p) return;
  addToCart(p.id, 1, p.colors[0], p.sizes[0]);
}

function getColorHex(colorName) {
  const colors = {
    'Organic Fresh': '#556B2F',
    'Sweet Ripe': '#FFD700',
    'Golden Amber': '#FFBF00',
    'Supplement': '#87CEEB',
    'Emergency Red': '#B22222',
    'Mild Spicy': '#FF8C00',
    'Medium Spicy': '#FF4500'
  };
  return colors[colorName] || '#CCCCCC';
}

modalCloseBtn.addEventListener('click', () => {
  modalDialog.close();
  modalDialog.classList.remove('active');
});


// --- CART / BASKET ACTIONS ---
function openCart() {
  cartDrawer.classList.add('active');
  appBackdrop.classList.add('active');
}

function closeCart() {
  cartDrawer.classList.remove('active');
  appBackdrop.classList.remove('active');
}

function updateCartBadge() {
  const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.innerText = totalQty;
}

function addToCart(productId, quantity, color, size) {
  if (!activeCustomerShop) return;
  const product = activeCustomerShop.products.find(p => p.id === productId);
  if (!product) return;

  // Enforce single-shop cart consistency (cannot mix items from multiple shops in one delivery)
  if (cart.length > 0 && cart[0].shopId !== activeCustomerShop.id) {
    if (confirm(`Your basket already contains items from "${cart[0].shopName}". Would you like to clear your basket to order from "${activeCustomerShop.name}" instead?`)) {
      cart = [];
    } else {
      return;
    }
  }

  const existingIndex = cart.findIndex(item => 
    item.product.id === productId && 
    item.selectedColor === color && 
    item.selectedSize === size
  );

  if (existingIndex > -1) {
    if (cart[existingIndex].quantity + quantity > product.stock) {
      showToast(`Stock limit of ${product.stock} items reached.`, 'warning');
      return;
    }
    cart[existingIndex].quantity += quantity;
  } else {
    cart.push({
      product,
      quantity,
      selectedColor: color,
      selectedSize: size,
      shopId: activeCustomerShop.id,
      shopName: activeCustomerShop.name
    });
  }

  showToast(`Added ${quantity} ${product.name} to Delivery Basket!`, 'success');
  renderCart();
  
  cartBtn.style.transform = 'scale(1.2)';
  setTimeout(() => cartBtn.style.transform = '', 300);
}

function renderCart() {
  updateCartBadge();
  syncStorage();

  if (currentCheckoutDistance === 0.0) {
    currentCheckoutDistance = parseFloat((Math.random() * 6.5 + 1.5).toFixed(1));
  }

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="cart-empty">
        <i data-lucide="shopping-bag" style="width: 48px; height: 48px;"></i>
        <p>Your basket is empty.</p>
      </div>
    `;
    cartSubtotal.innerText = '₹0.00';
    cartTax.innerText = '₹0.00';
    cartDiscount.innerText = '₹0.00';
    cartTotal.innerText = '₹0.00';
    return;
  }

  cartItemsContainer.innerHTML = '';
  let subtotal = 0;

  cart.forEach((item, index) => {
    const itemSubtotal = getDiscountedPrice(item.product) * item.quantity;
    subtotal += itemSubtotal;

    const cartItemHTML = `
      <div class="cart-item">
        <img src="${item.product.image}" alt="${item.product.name}" class="cart-item-img">
        <div class="cart-item-details">
          <div class="cart-item-name">${item.product.name}</div>
          <div class="cart-item-meta">Store: ${item.shopName} | Option: ${item.selectedSize}</div>
          <div class="cart-item-footer">
            <div class="quantity-picker" style="transform: scale(0.85); transform-origin: left center;">
              <button class="qty-btn" onclick="adjustCartQty(${index}, -1)">-</button>
              <div class="qty-num">${item.quantity}</div>
              <button class="qty-btn" onclick="adjustCartQty(${index}, 1)">+</button>
            </div>
            <div class="cart-item-price">₹${itemSubtotal.toFixed(2)}</div>
          </div>
        </div>
        <div class="cart-item-remove" onclick="removeCartItem(${index})" title="Remove item">
          <i data-lucide="trash-2" style="width:16px;height:16px;"></i>
        </div>
      </div>
    `;
    cartItemsContainer.innerHTML += cartItemHTML;
  });

  const discountAmount = subtotal * (discountPercent / 100);
  const total = subtotal - discountAmount;

  cartSubtotal.innerText = `₹${subtotal.toFixed(2)}`;
  cartTax.innerHTML = `<span style="color:var(--warning-color);font-weight:600;">Pending</span> <span style="font-size:0.75rem;color:var(--text-muted);font-weight:normal;">(Assigned after delivery)</span>`;
  cartDiscount.innerText = `-₹${discountAmount.toFixed(2)} (${discountPercent}%)`;
  cartTotal.innerText = `₹${total.toFixed(2)}`;

  lucide.createIcons();
}

function adjustCartQty(index, change) {
  const item = cart[index];
  
  // Find product stock limit in active shop list
  const shop = shops.find(s => s.id === item.shopId);
  const product = shop ? shop.products.find(p => p.id === item.product.id) : null;
  const maxStock = product ? product.stock : 99;

  const newQty = item.quantity + change;
  if (newQty <= 0) {
    removeCartItem(index);
    return;
  }
  if (newQty > maxStock) {
    showToast(`Maximum stock limit of ${maxStock} reached.`, 'warning');
    return;
  }

  item.quantity = newQty;
  renderCart();
}

function removeCartItem(index) {
  const name = cart[index].product.name;
  cart.splice(index, 1);
  showToast(`Removed ${name} from Delivery Basket`, 'info');
  renderCart();
}

// Promo Apply
cartPromoApplyBtn.addEventListener('click', () => {
  const code = cartPromoInput.value.trim().toUpperCase();
  if (code === 'AURAPLAZA') {
    if (appliedPromo === code) {
      showToast('Promo code already active', 'warning');
      return;
    }
    discountPercent = 15;
    appliedPromo = code;
    showToast('Promo code applied! Saved 15%', 'success');
    renderCart();
  } else if (code === '') {
    showToast('Please enter a valid code', 'warning');
  } else {
    showToast('Invalid promo code.', 'error');
  }
});


// --- CHECKOUT FLOW ---
let selectedPaymentMethod = 'cod';
const paymentMethodSelector = document.getElementById('payment-method-selector');
const cardContainer = document.getElementById('payment-method-card-container');
const upiContainer = document.getElementById('payment-method-upi-container');
const codContainer = document.getElementById('payment-method-cod-container');
const payUpiInput = document.getElementById('pay-upi-id');

if (paymentMethodSelector) {
  paymentMethodSelector.addEventListener('click', (e) => {
    const pill = e.target.closest('.option-pill');
    if (!pill) return;

    paymentMethodSelector.querySelectorAll('.option-pill').forEach(btn => btn.classList.remove('active'));
    pill.classList.add('active');

    selectedPaymentMethod = pill.dataset.method;
    
    cardContainer.style.display = selectedPaymentMethod === 'card' ? 'block' : 'none';
    upiContainer.style.display = selectedPaymentMethod === 'upi' ? 'block' : 'none';
    codContainer.style.display = selectedPaymentMethod === 'cod' ? 'block' : 'none';

    // Required toggles
    const cardName = document.getElementById('pay-name');
    const cardNum = document.getElementById('pay-card-num');
    const cardExp = document.getElementById('pay-expiry');
    const cardCvv = document.getElementById('pay-cvv');

    if (selectedPaymentMethod === 'card') {
      cardName.setAttribute('required', 'true');
      cardNum.setAttribute('required', 'true');
      cardExp.setAttribute('required', 'true');
      cardCvv.setAttribute('required', 'true');
      payUpiInput.removeAttribute('required');
    } else if (selectedPaymentMethod === 'upi') {
      cardName.removeAttribute('required');
      cardNum.removeAttribute('required');
      cardExp.removeAttribute('required');
      cardCvv.removeAttribute('required');
      payUpiInput.setAttribute('required', 'true');
    } else {
      cardName.removeAttribute('required');
      cardNum.removeAttribute('required');
      cardExp.removeAttribute('required');
      cardCvv.removeAttribute('required');
      payUpiInput.removeAttribute('required');
    }
  });
}

function renderCheckoutSummary() {
  checkoutSummaryItems.innerHTML = '';
  let subtotal = 0;

  cart.forEach(item => {
    const itemSubtotal = getDiscountedPrice(item.product) * item.quantity;
    subtotal += itemSubtotal;

    const html = `
      <div class="checkout-summary-item">
        <div>
          <div class="checkout-summary-name" style="max-width:200px;font-weight:600;">${item.product.name}</div>
          <span style="font-size: 0.75rem; color: var(--text-muted);">Qty: ${item.quantity} | ${item.shopName}</span>
        </div>
        <strong>₹${itemSubtotal.toFixed(2)}</strong>
      </div>
    `;
    checkoutSummaryItems.innerHTML += html;
  });

  const discountAmount = subtotal * (discountPercent / 100);
  const grandTotal = subtotal - discountAmount;

  checkoutSubtotal.innerText = `₹${subtotal.toFixed(2)}`;
  checkoutShipping.innerHTML = `<span style="color:var(--warning-color);font-weight:600;">Pending</span> <span style="font-size:0.75rem;color:var(--text-muted);font-weight:normal;">(Assigned after delivery)</span>`;
  checkoutDiscount.innerText = `-₹${discountAmount.toFixed(2)}`;
  checkoutTotal.innerText = `₹${grandTotal.toFixed(2)}`;
}

cartCheckoutBtn.addEventListener('click', () => {
  if (cart.length === 0) {
    showToast("Your basket is empty.", "warning");
    return;
  }
  closeCart();
  currentCheckoutDistance = parseFloat((Math.random() * 6.5 + 1.5).toFixed(1));
  switchCustomerSubview('cust-checkout-view');
  setCheckoutStep(1);
  renderCheckoutSummary();
});

function setCheckoutStep(step) {
  // Toggle forms panels
  panels.forEach((p, idx) => {
    if (idx === step - 1) {
      p.classList.add('active');
    } else {
      p.classList.remove('active');
    }
  });

  // Toggle markers
  stepInds.forEach((ind, idx) => {
    ind.classList.remove('active', 'completed');
    if (idx === step - 1) {
      ind.classList.add('active');
    } else if (idx < step - 1) {
      ind.classList.add('completed');
    }
  });
}

next1.addEventListener('click', (e) => {
  e.preventDefault();
  if (shippingForm.checkValidity()) {
    setCheckoutStep(2);
  } else {
    shippingForm.reportValidity();
  }
});

back2.addEventListener('click', () => setCheckoutStep(1));

next2.addEventListener('click', (e) => {
  e.preventDefault();
  
  let isValid = false;
  if (selectedPaymentMethod === 'card') {
    isValid = paymentForm.checkValidity();
  } else if (selectedPaymentMethod === 'upi') {
    isValid = payUpiInput.checkValidity();
  } else {
    isValid = true; // COD
  }

  if (isValid) {
    // Populate review summary values
    const firstName = document.getElementById('ship-first-name').value;
    const lastName = document.getElementById('ship-last-name').value;
    const address = document.getElementById('ship-address').value;
    const city = document.getElementById('ship-city').value;
    const zip = document.getElementById('ship-zip').value;
    
    document.getElementById('review-shipping-address').innerText = 
      `${firstName} ${lastName}, ${address}, ${city}, ${zip}`;

    const reviewPaymentMethod = document.getElementById('review-payment-method');
    if (selectedPaymentMethod === 'card') {
      const cardNumVal = cardNumInput.value.replace(/\s+/g, '');
      const last4 = cardNumVal.slice(-4) || '4444';
      const cardBrand = cardBrandDisplay.innerText;
      reviewPaymentMethod.innerText = `${cardBrand} ending in ${last4}`;
    } else if (selectedPaymentMethod === 'upi') {
      const upiId = payUpiInput.value.trim();
      reviewPaymentMethod.innerText = `UPI ID: ${upiId}`;
    } else if (selectedPaymentMethod === 'cod') {
      reviewPaymentMethod.innerText = 'Cash on Delivery (COD)';
    }

    setCheckoutStep(3);
  } else {
    if (selectedPaymentMethod === 'card') {
      paymentForm.reportValidity();
    } else if (selectedPaymentMethod === 'upi') {
      payUpiInput.reportValidity();
    }
  }
});

back3.addEventListener('click', () => setCheckoutStep(2));

// Live payment card graphics sync
cardNumInput.addEventListener('input', (e) => {
  let val = e.target.value.replace(/\D/g, '');
  let formatted = '';
  for (let i = 0; i < val.length; i++) {
    if (i > 0 && i % 4 === 0) formatted += ' ';
    formatted += val[i];
  }
  e.target.value = formatted;
  cardNumDisplay.innerText = formatted || '•••• •••• •••• ••••';

  if (val.startsWith('4')) {
    cardBrandDisplay.innerText = 'VISA';
  } else if (val.startsWith('5')) {
    cardBrandDisplay.innerText = 'MASTERCARD';
  } else if (val.startsWith('3')) {
    cardBrandDisplay.innerText = 'AMEX';
  } else {
    cardBrandDisplay.innerText = 'CARD';
  }
});

cardNameInput.addEventListener('input', (e) => {
  cardNameDisplay.innerText = e.target.value.toUpperCase() || 'RAHUL SHARMA';
});

cardExpiryInput.addEventListener('input', (e) => {
  let val = e.target.value.replace(/\D/g, '');
  if (val.length > 2) {
    e.target.value = val.slice(0,2) + '/' + val.slice(2,4);
  } else {
    e.target.value = val;
  }
  cardExpDisplay.innerText = e.target.value || 'MM/YY';
});

// Place Delivery Dispatch Request
confirmBtn.addEventListener('click', () => {
  // Deduct inventory levels
  cart.forEach(cartItem => {
    const shop = shops.find(s => s.id === cartItem.shopId);
    if (shop) {
      const product = shop.products.find(p => p.id === cartItem.product.id);
      if (product) {
        product.stock = Math.max(0, product.stock - cartItem.quantity);
      }
    }
  });

  const grandTotalText = checkoutTotal.innerText;
  const itemsText = cart.map(i => `${i.quantity}x ${i.product.name}`).join(', ');
  const firstName = document.getElementById('ship-first-name').value;
  const lastName = document.getElementById('ship-last-name').value;
  
  const newOrderId = '#DL-' + Math.floor(1000 + Math.random() * 9000);

  const customerPhone = document.getElementById('ship-phone').value;
  const subtotal = cart.reduce((acc, item) => acc + (getDiscountedPrice(item.product) * item.quantity), 0);
  const promoDiscount = subtotal * (discountPercent / 100);

  // Push new courier delivery item to dispatch log
  const computedTotal = parseFloat(grandTotalText.replace('₹', ''));
  deliveries.unshift({
    id: newOrderId,
    customerName: `${firstName} ${lastName}`,
    phone: customerPhone,
    shopName: cart[0].shopName,
    items: itemsText,
    originalTotal: computedTotal,
    discount: 0,
    total: computedTotal,
    status: 'Pending',
    time: 'Just now',
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
    distance: currentCheckoutDistance,
    deliveryFee: 0.00, // Assigned after delivery
    subtotal: subtotal,
    promoDiscount: promoDiscount,
    commissionRate: getShopCommissionRate(cart[0].shopName),
    paymentMethod: 'Cash on Delivery (COD)',
    itemsDetails: JSON.parse(JSON.stringify(cart))
  });

  // Success Receipt details
  successOrderId.innerText = newOrderId;
  successReceiptTotal.innerText = grandTotalText;

  successReceiptItems.innerHTML = '';
  cart.forEach(item => {
    const row = document.createElement('div');
    row.className = 'receipt-row';
    row.innerHTML = `
      <span>${item.quantity}x ${item.product.name}</span>
      <strong>₹${(getDiscountedPrice(item.product) * item.quantity).toFixed(2)}</strong>
    `;
    successReceiptItems.appendChild(row);
  });

  // Clear Basket
  cart = [];
  discountPercent = 0;
  appliedPromo = '';
  cartPromoInput.value = '';

  syncStorage();
  renderCart();
  renderShopsDirectory();
  renderPartnerDeliveries();

  switchCustomerSubview('cust-success-view');
  showToast("Courier dispatched successfully!", "success");
});

successContinueBtn.addEventListener('click', () => {
  activeCustomerShop = null;
  switchCustomerSubview('cust-shops-directory');
  renderShopsDirectory();
});

successPrintBtn.addEventListener('click', () => {
  window.print();
});


// --- PORTAL B: SHOP PARTNER LOGIC ---

function renderShopPartnerPortal() {
  if (activeShopSession) {
    // Show Dashboard
    shopLoginPanel.classList.remove('active');
    shopDashboardPanel.classList.add('active');
    
    // Draw Details
    partnerShopName.innerText = activeShopSession.name;
    partnerShopId.innerText = activeShopSession.id;
    partnerShopCategory.innerText = activeShopSession.category + ' business';
    partnerShopArea.innerText = activeShopSession.area;
    
    // Status Switch layout
    updatePartnerStatusDisplay();
    renderPartnerInventory();
    renderPartnerDeliveries();

    // Courier Staffing requirements display
    const dbShop = shops.find(s => s.id === activeShopSession.id);
    if (dbShop) {
      if (dbShop.requestedCouriers === undefined) dbShop.requestedCouriers = 1;
      if (dbShop.assignedCouriers === undefined) dbShop.assignedCouriers = 1;
      
      const assignedDisplay = document.getElementById('partner-assigned-couriers-display');
      const requiredSelect = document.getElementById('s-couriers-required');
      if (assignedDisplay) assignedDisplay.innerText = dbShop.assignedCouriers;
      if (requiredSelect) requiredSelect.value = dbShop.requestedCouriers;
    }
  } else {
    // Show Login
    shopLoginPanel.classList.add('active');
    shopDashboardPanel.classList.remove('active');
  }
}

// Shop Login form submit
shopLoginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const inputId = loginShopIdInput.value.trim();
  const inputPass = loginShopPassInput.value.trim();

  const matchedShop = shops.find(s => s.id === inputId && s.password === inputPass);
  
  if (matchedShop) {
    activeShopSession = matchedShop;
    sessionStorage.setItem('active_shop_session', JSON.stringify(activeShopSession));
    
    loginShopIdInput.value = '';
    loginShopPassInput.value = '';

    showToast(`Welcome back, ${matchedShop.name}!`, 'success');
    renderShopPartnerPortal();
  } else {
    showToast("Invalid Shop Partner ID or Password", "error");
  }
});

// Logout
partnerLogoutBtn.addEventListener('click', () => {
  if (activeShopSession) {
    // Automatically turn shop offline upon logout to simulate "closed shop"
    const dbShop = shops.find(s => s.id === activeShopSession.id);
    if (dbShop) {
      dbShop.isLive = false;
    }
    
    showToast(`Logged out from ${activeShopSession.name}`, 'info');
    activeShopSession = null;
    sessionStorage.removeItem('active_shop_session');
    
    syncStorage();
    renderShopPartnerPortal();
    renderShopsDirectory();
  }
});

// Toggle partner live online status
partnerStatusToggleBtn.addEventListener('click', () => {
  if (!activeShopSession) return;

  const dbShop = shops.find(s => s.id === activeShopSession.id);
  if (!dbShop) return;

  dbShop.isLive = !dbShop.isLive;
  activeShopSession.isLive = dbShop.isLive;
  sessionStorage.setItem('active_shop_session', JSON.stringify(activeShopSession));

  syncStorage();
  updatePartnerStatusDisplay();
  
  // Notice Customer Front
  renderShopsDirectory();

  if (dbShop.isLive) {
    showToast("Your Shop is now LIVE! Customers can view and order products.", "success");
  } else {
    showToast("Your Shop is now OFFLINE. Products hidden from customers.", "info");
  }
});

function updatePartnerStatusDisplay() {
  if (!activeShopSession) return;
  
  if (activeShopSession.isLive) {
    partnerStatusLabel.innerText = "Live (Online)";
    partnerStatusLabel.style.color = "var(--success-color)";
    partnerStatusToggleBtn.className = "nav-btn live";
    partnerStatusToggleBtn.innerHTML = '<i data-lucide="wifi"></i>';
  } else {
    partnerStatusLabel.innerText = "Offline (Closed)";
    partnerStatusLabel.style.color = "var(--error-color)";
    partnerStatusToggleBtn.className = "nav-btn offline";
    partnerStatusToggleBtn.innerHTML = '<i data-lucide="wifi-off"></i>';
  }
  lucide.createIcons();
}

// Render shop catalog inventory
function renderPartnerInventory() {
  partnerInventoryRows.innerHTML = '';
  if (!activeShopSession) return;

  // Find shop listing from actual dynamic memory
  const dbShop = shops.find(s => s.id === activeShopSession.id);
  if (!dbShop) return;

  if (dbShop.products.length === 0) {
    partnerInventoryRows.innerHTML = `
      <tr>
        <td colspan="4" style="text-align: center; color: var(--text-muted); padding: 20px;">
          No products listed yet. Add items using the left form.
        </td>
      </tr>
    `;
    return;
  }

  dbShop.products.forEach(p => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>
        <div style="display:flex; align-items:center; gap:10px;">
          <img src="${p.image}" alt="${p.name}" style="width:40px;height:40px;object-fit:cover;border-radius:8px;background:#1e293b;">
          <div>
            <div style="font-weight:600;">${p.name}</div>
            <span style="font-size:0.75rem;color:var(--text-muted);">${p.id}</span>
          </div>
        </div>
      </td>
      <td>
        ${(() => {
          const hasDiscount = p.discount && p.discount > 0;
          return hasDiscount 
            ? `<strong>₹${getDiscountedPrice(p).toFixed(2)}</strong> <span style="font-size:0.75rem;color:var(--error-color);font-weight:700;">(-${p.discount}%)</span><div style="font-size:0.75rem;color:var(--text-muted);text-decoration:line-through;">₹${p.price.toFixed(2)}</div>` 
            : `<strong>₹${p.price.toFixed(2)}</strong>`;
        })()}
      </td>
      <td>
        <span class="inv-stock-badge ${p.stock === 0 ? 'out' : (p.stock <= 5 ? 'low' : 'in')}">
          ${p.stock} units
        </span>
      </td>
      <td>
        <div style="display:flex; gap:8px;">
          <button class="inv-action-btn" onclick="editPartnerProductStock('${p.id}')" title="Modify Stock count"><i data-lucide="edit-2" style="width:14px;height:14px;"></i></button>
          <button class="inv-action-btn" onclick="editPartnerProductDiscount('${p.id}')" title="Modify Discount percentage" style="color: #f97316; border-color: rgba(249, 115, 22, 0.2);"><i data-lucide="percent" style="width:14px;height:14px;"></i></button>
          <button class="inv-action-btn delete" onclick="deletePartnerProduct('${p.id}')" title="Delete listing"><i data-lucide="trash-2" style="width:14px;height:14px;"></i></button>
        </div>
      </td>
    `;
    partnerInventoryRows.appendChild(tr);
  });

  lucide.createIcons();
}

// Adjust stock count inside shop portal
function editPartnerProductStock(prodId) {
  if (!activeShopSession) return;
  const dbShop = shops.find(s => s.id === activeShopSession.id);
  if (!dbShop) return;

  const product = dbShop.products.find(p => p.id === prodId);
  if (!product) return;

  const inputStock = prompt(`Update stock units for "${product.name}":`, product.stock);
  if (inputStock === null) return;

  const newStock = parseInt(inputStock);
  if (isNaN(newStock) || newStock < 0) {
    showToast("Invalid stock count.", 'error');
    return;
  }

  product.stock = newStock;
  syncStorage();
  renderPartnerInventory();
  showToast(`Updated stock to ${newStock} units.`, 'success');
}

// Adjust discount percentage inside shop portal
function editPartnerProductDiscount(prodId) {
  if (!activeShopSession) return;
  const dbShop = shops.find(s => s.id === activeShopSession.id);
  if (!dbShop) return;

  const product = dbShop.products.find(p => p.id === prodId);
  if (!product) return;

  const inputDiscount = prompt(`Update discount percentage (0-99%) for "${product.name}":`, product.discount || 0);
  if (inputDiscount === null) return;

  const newDiscount = parseInt(inputDiscount);
  if (isNaN(newDiscount) || newDiscount < 0 || newDiscount > 99) {
    showToast("Invalid discount percentage. Must be between 0 and 99.", 'error');
    return;
  }

  product.discount = newDiscount;
  syncStorage();
  renderPartnerInventory();
  showToast(`Updated discount for "${product.name}" to ${newDiscount}%.`, 'success');
}
window.editPartnerProductDiscount = editPartnerProductDiscount;

// Delete product inside shop portal
function deletePartnerProduct(prodId) {
  if (!activeShopSession) return;
  const dbShop = shops.find(s => s.id === activeShopSession.id);
  if (!dbShop) return;

  const idx = dbShop.products.findIndex(p => p.id === prodId);
  if (idx === -1) return;

  if (confirm(`Remove "${dbShop.products[idx].name}" from your shop catalog?`)) {
    const name = dbShop.products[idx].name;
    dbShop.products.splice(idx, 1);
    
    syncStorage();
    renderPartnerInventory();
    showToast(`Removed product listing: ${name}`, 'info');
  }
}

// Shop lists new product storefront
shopAddProductForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!activeShopSession) return;

  const dbShop = shops.find(s => s.id === activeShopSession.id);
  if (!dbShop) return;

  const name = document.getElementById('s-prod-name').value.trim();
  const price = parseFloat(document.getElementById('s-prod-price').value);
  const discountInput = document.getElementById('s-prod-discount');
  const discount = discountInput && discountInput.value ? parseInt(discountInput.value) : 0;
  const stock = parseInt(document.getElementById('s-prod-stock').value);
  const desc = document.getElementById('s-prod-desc').value.trim();

  // Assign category-based default image
  let image = 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800'; // default Grocery
  if (dbShop.category === 'Pharmacy') {
    image = 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?q=80&w=800';
  } else if (dbShop.category === 'Restaurant') {
    image = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800';
  } else if (dbShop.category === 'Boutique') {
    image = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800';
  }

  if (price <= 0 || stock < 0) {
    showToast("Price must be positive and stock non-negative.", "error");
    return;
  }
  if (discount < 0 || discount > 99) {
    showToast("Discount must be between 0% and 99%.", "error");
    return;
  }

  const newProduct = {
    id: 'p-' + dbShop.id.toLowerCase() + '-' + Math.floor(100 + Math.random() * 900),
    name,
    price,
    discount,
    stock,
    rating: 5.0,
    reviews: 0,
    image,
    desc,
    sizes: ['Standard Size'],
    colors: ['Standard Variant']
  };

  dbShop.products.push(newProduct);
  syncStorage();

  shopAddProductForm.reset();
  renderPartnerInventory();
  showToast(`Successfully listed "${name}"!`, 'success');
});

// Render delivery dispatches for the logged-in shop partner
function renderPartnerDeliveries() {
  if (!partnerDeliveryRows) return;
  partnerDeliveryRows.innerHTML = '';

  if (!activeShopSession) return;

  const shopDeliveries = deliveries.filter(d => d.shopName === activeShopSession.name);

  if (shopDeliveries.length === 0) {
    partnerDeliveryRows.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; color: var(--text-muted); padding: 20px;">
          No active dispatches.
        </td>
      </tr>
    `;
    return;
  }

  shopDeliveries.forEach(del => {
    let badgeHTML = '';
    if (del.status === 'Pending') {
      const shopOfDelivery = shops.find(s => s.name === del.shopName);
      const freeCouriersOfShop = shopOfDelivery ? getFreeCouriersCount(shopOfDelivery) : 0;
      if (freeCouriersOfShop <= 0) {
        badgeHTML = `<span class="delivery-badge pending" style="background: rgba(249, 115, 22, 0.15); color: #f97316;">Queued (Waiting)</span>`;
      } else {
        badgeHTML = `<span class="delivery-badge pending">Pending Dispatch</span>`;
      }
    } else if (del.status === 'Dispatched') {
      badgeHTML = `<span class="delivery-badge dispatched">Out for Delivery</span>`;
    } else {
      badgeHTML = `<span class="delivery-badge delivered">Delivered</span>`;
    }

    const hasOrderDiscount = del.discount && del.discount > 0;
    const displayTotalHTML = hasOrderDiscount 
      ? `<strong>₹${del.total.toFixed(2)}</strong><div style="font-size:0.75rem;color:var(--text-muted);text-decoration:line-through;">₹${(del.originalTotal || del.total).toFixed(2)}</div>`
      : `<strong>₹${del.total.toFixed(2)}</strong>`;

    const isDelivered = del.status === 'Delivered';
    const discountOptions = [0, 5, 10, 15, 20, 30, 50].map(opt => {
      const isSelected = (del.discount || 0) === opt ? 'selected' : '';
      return `<option value="${opt}" ${isSelected}>${opt}% OFF</option>`;
    }).join('');

    const selectDisabled = isDelivered ? 'disabled' : '';
    const discountSelectorHTML = `
      <select onchange="applyOrderDiscount('${del.id}', this.value)" ${selectDisabled} style="background:var(--bg-tertiary);border:1px solid var(--border-color);color:var(--text-primary);padding:4px 8px;border-radius:var(--border-radius-sm);font-size:0.8rem;outline:none;">
        ${discountOptions}
      </select>
    `;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong style="color: var(--accent-color);">${del.id}</strong></td>
      <td><strong>${del.customerName}</strong></td>
      <td><div style="font-size: 0.85rem; max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${del.items}">${del.items}</div></td>
      <td>${displayTotalHTML}</td>
      <td>${discountSelectorHTML}</td>
      <td>${badgeHTML}</td>
      <td>
        <button class="back-btn delete-order-track-btn" style="padding: 6px 12px; border-color: rgba(239, 68, 68, 0.3); color: var(--error-color); font-size: 0.8rem; border-radius: var(--border-radius-sm);">
          <i data-lucide="trash-2" style="width:12px; height:12px; vertical-align:middle; margin-right:4px;"></i> Delete
        </button>
      </td>
    `;

    // Bind delete tracking button
    const deleteBtn = tr.querySelector('.delete-order-track-btn');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', () => {
        if (confirm(`Are you sure you want to delete order tracking for "${del.id}"?`)) {
          deliveries = deliveries.filter(d => d.id !== del.id);
          syncStorage();
          renderPartnerDeliveries();
          renderAgencyDeliveries();
          updateAgencyStats();
          showToast(`Order tracking for "${del.id}" deleted successfully.`, "success");
        }
      });
    }

    partnerDeliveryRows.appendChild(tr);
  });

  lucide.createIcons();
  renderPartnerDailyReports();
}


// --- PORTAL C: DELIVERY AGENCY HUB LOGIC ---

// Tab panels routers in Agency View
dbNavLinks.forEach(link => {
  link.addEventListener('click', () => {
    dbNavLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');

    const target = link.dataset.panel;
    dbPanels.forEach(panel => {
      if (panel.id === target) {
        panel.classList.add('active');
      } else {
        panel.classList.remove('active');
      }
    });
  });
});

// Render Agency Portal (checks login session)
function renderAgencyPortal() {
  const agencyLoginPanel = document.getElementById('agency-login-panel');
  const agencyDashboardPanel = document.getElementById('agency-dashboard-panel');
  const isAgencyLoggedIn = sessionStorage.getItem('active_agency_session') === 'true';

  if (isAgencyLoggedIn) {
    if (agencyLoginPanel) agencyLoginPanel.classList.remove('active');
    if (agencyDashboardPanel) agencyDashboardPanel.classList.add('active');
    updateAgencyStats();
    renderAgencyDeliveries();
    renderAgencyShops();
    renderCourierAllocation();
    renderAgencyCommissionSettings();

    // Load delivery fee inputs
    const baseFeeInput = document.getElementById('agency-base-fee-input');
    const perKmInput = document.getElementById('agency-per-km-input');
    if (baseFeeInput) baseFeeInput.value = baseDeliveryFee.toFixed(2);
    if (perKmInput) perKmInput.value = perKmDeliveryFee.toFixed(2);
  } else {
    if (agencyLoginPanel) agencyLoginPanel.classList.add('active');
    if (agencyDashboardPanel) agencyDashboardPanel.classList.remove('active');
  }
}

// Update top statistics panel
function updateAgencyStats() {
  agStatTotalShops.innerText = shops.length;
  agStatLiveShops.innerText = shops.filter(s => s.isLive).length;
  
  const pending = deliveries.filter(d => d.status === 'Pending' || d.status === 'Dispatched').length;
  const completed = deliveries.filter(d => d.status === 'Delivered').length;

  agStatPendingDeliveries.innerText = pending;
  agStatCompletedDeliveries.innerText = completed;

  // Courier Pool Allocation Stats
  const totalAssigned = shops.reduce((sum, s) => sum + (s.assignedCouriers || 0), 0);
  const availableCouriers = Math.max(0, totalCouriersPool - totalAssigned);

  const statTotalCouriers = document.getElementById('ag-stat-total-couriers');
  const statAvailableCouriers = document.getElementById('ag-stat-available-couriers');
  if (statTotalCouriers) statTotalCouriers.innerText = totalCouriersPool;
  if (statAvailableCouriers) statAvailableCouriers.innerText = availableCouriers;
}

// Render active dispatches deliveries monitor
function renderAgencyDeliveries() {
  agencyDeliveriesRows.innerHTML = '';

  if (deliveries.length === 0) {
    agencyDeliveriesRows.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; color: var(--text-muted); padding: 30px;">
          No active delivery requests on log.
        </td>
      </tr>
    `;
    return;
  }

  deliveries.forEach((del, index) => {
    let badgeHTML = '';
    if (del.status === 'Pending') {
      const shopOfDelivery = shops.find(s => s.name === del.shopName);
      const freeCouriersOfShop = shopOfDelivery ? getFreeCouriersCount(shopOfDelivery) : 0;
      if (freeCouriersOfShop <= 0) {
        badgeHTML = `<span class="delivery-badge pending" style="background: rgba(249, 115, 22, 0.15); color: #f97316;">Queued (Waiting)</span>`;
      } else {
        badgeHTML = `<span class="delivery-badge pending">Pending Dispatch</span>`;
      }
    } else if (del.status === 'Dispatched') {
      badgeHTML = `<span class="delivery-badge dispatched">Out for Delivery</span>`;
    } else {
      badgeHTML = `<span class="delivery-badge delivered">Delivered</span>`;
    }

    let actionButton = '';
    if (del.status === 'Pending') {
      const shopOfDelivery = shops.find(s => s.name === del.shopName);
      const freeCouriersOfShop = shopOfDelivery ? getFreeCouriersCount(shopOfDelivery) : 0;
      if (freeCouriersOfShop <= 0) {
        actionButton = `<button class="next-btn" onclick="progressDeliveryStatus(${index}, 'Dispatched')" style="padding: 6px 12px; font-size: 0.75rem; border-radius: 8px; background: var(--text-muted); cursor: not-allowed; opacity: 0.65;" title="All delivery boys busy">Queue Order</button>`;
      } else {
        actionButton = `<button class="next-btn" onclick="progressDeliveryStatus(${index}, 'Dispatched')" style="padding: 6px 12px; font-size: 0.75rem; border-radius: 8px;">Assign & Dispatch</button>`;
      }
    } else if (del.status === 'Dispatched') {
      actionButton = `<button class="next-btn" onclick="progressDeliveryStatus(${index}, 'Delivered')" style="padding: 6px 12px; font-size: 0.75rem; border-radius: 8px; background: var(--success-color);">Mark Delivered</button>`;
    } else {
      actionButton = `<span style="font-size:0.8rem;color:var(--success-color);font-weight:600;"><i data-lucide="check-circle" style="width:14px;height:14px;vertical-align:middle;margin-right:4px;"></i>Complete</span>`;
    }

    const tr = document.createElement('tr');
    const phoneVal = del.phone || '9876543210';
    const distanceVal = del.distance || 3.5;
    const distanceLabel = del.status === 'Delivered' 
      ? `<div style="font-size: 0.75rem; color: var(--success-color); font-weight: 600; margin-top: 2px;"><i data-lucide="map-pin" style="width:10px;height:10px;display:inline-block;margin-right:2px;vertical-align:middle;"></i>Covered: ${distanceVal} km</div>`
      : `<div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;"><i data-lucide="map-pin" style="width:10px;height:10px;display:inline-block;margin-right:2px;vertical-align:middle;"></i>Distance: ${distanceVal} km</div>`;

    tr.innerHTML = `
      <td>
        <strong style="color: var(--accent-color);">${del.id}</strong>
        <div style="font-size: 0.85rem; font-weight:600;">${del.customerName}</div>
        <div style="font-size: 0.75rem; color: var(--text-muted);"><i data-lucide="phone" style="width:10px;height:10px;display:inline-block;margin-right:2px;vertical-align:middle;"></i>${phoneVal}</div>
        ${distanceLabel}
      </td>
      <td><strong>${del.shopName}</strong></td>
      <td><div style="font-size:0.85rem;max-width:240px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${del.items}">${del.items}</div></td>
      <td>
        ${(() => {
          const hasOrderDiscount = del.discount && del.discount > 0;
          return hasOrderDiscount 
            ? `<strong>₹${del.total.toFixed(2)}</strong> <span style="font-size:0.7rem;color:var(--error-color);font-weight:700;">(-${del.discount}%)</span><div style="font-size:0.75rem;color:var(--text-muted);text-decoration:line-through;">₹${(del.originalTotal || del.total).toFixed(2)}</div>`
            : `<strong>₹${del.total.toFixed(2)}</strong>`;
        })()}
      </td>
      <td>${badgeHTML}</td>
      <td>${actionButton}</td>
    `;
    agencyDeliveriesRows.appendChild(tr);
  });

  lucide.createIcons();
  renderAgencyDailyReports();
}

function progressDeliveryStatus(index, newStatus) {
  const order = deliveries[index];
  if (!order) return;

  if (newStatus === 'Dispatched') {
    const shop = shops.find(s => s.name === order.shopName);
    const freeCouriers = getFreeCouriersCount(shop);
    if (freeCouriers <= 0) {
      showToast(`All delivery boys for "${order.shopName}" are busy. Order ${order.id} is queued.`, 'warning');
      return; // Block status transition, keep in Pending queue
    }
  }

  if (newStatus === 'Delivered') {
    deliveryToDeliverIndex = index;
    const distModal = document.getElementById('enter-distance-modal');
    if (distModal) {
      document.getElementById('dist-modal-order-id').innerText = order.id;
      document.getElementById('actual-distance-input').value = order.distance !== undefined ? order.distance : 3.5;
      distModal.showModal();
      distModal.classList.add('active');
    }
    return;
  }

  deliveries[index].status = newStatus;

  syncStorage();
  updateAgencyStats();
  renderAgencyDeliveries();
  renderPartnerDeliveries();
  renderShopsDirectory();
  renderCourierAllocation();
  showToast(`Delivery status updated to ${newStatus.toUpperCase()}`, 'success');
}

function showDeliveryInvoice(order) {
  const modal = document.getElementById('delivery-invoice-modal');
  if (!modal) return;

  // Set Order Ref ID
  document.getElementById('invoice-order-id').innerText = order.id;

  // Customer Details
  document.getElementById('inv-cust-name').innerText = order.customerName || '-';
  document.getElementById('inv-cust-phone').innerText = order.phone || '9876543210';
  document.getElementById('inv-store-name').innerText = order.shopName || '-';
  document.getElementById('inv-pay-method').innerText = order.paymentMethod || 'Cash on Delivery (COD)';

  // Subtotal, Distance, Delivery Fee
  const distance = order.distance !== undefined ? order.distance : 3.5;
  const deliveryFee = order.deliveryFee !== undefined ? order.deliveryFee : calculateDeliveryFee(distance);
  const promoDiscount = order.promoDiscount !== undefined ? order.promoDiscount : 0;
  const shopDiscountPercent = order.discount || 0;

  // Subtotal calculation fallback if not saved
  let subtotal = order.subtotal;
  if (subtotal === undefined) {
    subtotal = order.total;
  }

  // Calculate order-level discount amount
  const baseTotalForShopDiscount = subtotal + deliveryFee - promoDiscount;
  const shopDiscountAmount = baseTotalForShopDiscount * (shopDiscountPercent / 100);
  const finalGrandTotal = order.total;

  document.getElementById('inv-subtotal').innerText = `₹${subtotal.toFixed(2)}`;
  document.getElementById('inv-distance').innerText = distance;
  document.getElementById('inv-delivery-fee').innerText = `₹${deliveryFee.toFixed(2)}`;

  const discountRow = document.getElementById('inv-discount-row');
  if (shopDiscountPercent > 0) {
    discountRow.style.display = 'flex';
    document.getElementById('inv-discount-percent').innerText = shopDiscountPercent;
    document.getElementById('inv-discount-amount').innerText = `-₹${shopDiscountAmount.toFixed(2)}`;
  } else {
    discountRow.style.display = 'none';
  }

  document.getElementById('inv-grand-total').innerText = `₹${finalGrandTotal.toFixed(2)}`;

  // Render Items List
  const itemsContainer = document.getElementById('inv-items-list');
  itemsContainer.innerHTML = '';

  if (order.itemsDetails && order.itemsDetails.length > 0) {
    order.itemsDetails.forEach(item => {
      const itemRow = document.createElement('div');
      itemRow.style.display = 'flex';
      itemRow.style.justifyContent = 'space-between';
      const discountedPrice = getDiscountedPrice(item.product);
      itemRow.innerHTML = `
        <span>${item.quantity}x ${item.product.name} <span style="font-size:0.75rem;color:var(--text-muted);">(${item.selectedSize})</span></span>
        <strong>₹${(discountedPrice * item.quantity).toFixed(2)}</strong>
      `;
      itemsContainer.appendChild(itemRow);
    });
  } else {
    const fallbackRow = document.createElement('div');
    fallbackRow.style.display = 'flex';
    fallbackRow.style.justifyContent = 'space-between';
    fallbackRow.innerHTML = `
      <span>${order.items}</span>
      <strong>₹${subtotal.toFixed(2)}</strong>
    `;
    itemsContainer.appendChild(fallbackRow);
  }

  // Agency Hub Statement details
  const todayStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  const orderDate = order.date || todayStr;
  const commissionRate = order.commissionRate !== undefined ? order.commissionRate : getDailyCommissionRate(orderDate, order.shopName);
  const riderPayout = deliveryFee;
  const agencyCommission = subtotal * (commissionRate / 100);
  const netStorePayout = Math.max(0, finalGrandTotal - riderPayout - agencyCommission);

  document.getElementById('inv-agency-collected').innerText = `₹${finalGrandTotal.toFixed(2)}`;
  document.getElementById('inv-agency-distance').innerText = `${distance} km`;
  document.getElementById('inv-agency-rider-payout').innerText = `₹${riderPayout.toFixed(2)}`;
  document.getElementById('inv-agency-commission').innerText = `₹${agencyCommission.toFixed(2)}`;
  if (document.getElementById('inv-commission-percent')) {
    document.getElementById('inv-commission-percent').innerText = commissionRate;
  }
  document.getElementById('inv-agency-store-payout').innerText = `₹${netStorePayout.toFixed(2)}`;

  // SMS Simulator text
  const smsBody = document.getElementById('inv-sms-body');
  const customerPhone = order.phone || '9876543210';
  smsBody.innerText = `Aura Dispatch SMS to +91 ${customerPhone}:
"Hi ${order.customerName || 'Customer'}, your order ${order.id} from ${order.shopName} has been delivered by Aura Dispatch!
Total Cash Collected (COD): ₹${finalGrandTotal.toFixed(2)} (Subtotal: ₹${subtotal.toFixed(2)}${shopDiscountPercent > 0 ? `, Shop Discount: ${shopDiscountPercent}%` : ''}).
Rider covered ${distance} km. Thank you for choosing Aura Plaza!"`;

  // Open modal
  modal.showModal();
  modal.classList.add('active');
}

// Controller to apply shop owner discounts directly to registered orders
function applyOrderDiscount(id, discountVal) {
  const discount = parseInt(discountVal) || 0;
  const order = deliveries.find(d => d.id === id);
  if (!order) return;

  if (order.status === 'Delivered') {
    showToast("Cannot apply discounts to completed deliveries.", "error");
    return;
  }

  if (order.originalTotal === undefined) {
    order.originalTotal = order.total;
  }

  order.discount = discount;
  order.total = order.originalTotal - (order.originalTotal * discount / 100);

  syncStorage();
  renderPartnerDeliveries();
  renderAgencyDeliveries();
  updateAgencyStats();
  showToast(`Applied ${discount}% discount to order ${id}`, 'success');
}
window.applyOrderDiscount = applyOrderDiscount;

// Onboard new shop partner
agencyRegisterShopForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('reg-shop-name').value.trim();
  const category = document.getElementById('reg-shop-category').value;
  const area = document.getElementById('reg-shop-area').value.trim();

  // Generate unique Shop ID: SHOP- followed by next index + random padding
  const shopNum = shops.length + 1;
  const shopId = `SHOP-${String(shopNum).padStart(3, '0')}`;
  
  // Generate random 8-character alphabetic/numeric password
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let password = '';
  for (let i = 0; i < 8; i++) {
    password += chars[Math.floor(Math.random() * chars.length)];
  }

  const newShop = {
    id: shopId,
    name,
    category,
    area,
    password,
    isLive: false, // Default closed upon onboarding
    requestedCouriers: 1,
    assignedCouriers: 1,
    desc: `Local registered partner shop offering quick dispatch delivery in ${area}. Category: ${category}.`,
    products: []
  };

  shops.push(newShop);
  syncStorage();

  // Reset Form
  agencyRegisterShopForm.reset();

  // Draw credentials on Modal
  successRegName.innerText = name;
  successRegId.innerText = shopId;
  successRegPass.innerText = password;

  // Open modal
  regSuccessModal.showModal();
  regSuccessModal.classList.add('active');

  // Reload tables
  updateAgencyStats();
  renderAgencyShops();
});

closeRegSuccessBtn.addEventListener('click', () => {
  regSuccessModal.close();
  regSuccessModal.classList.remove('active');
  
  // Take admin back to Shops Registry List
  document.querySelector('.db-nav-link[data-panel="agency-shops-list"]').click();
});

// Render Registered Merchant Registry list
function renderAgencyShops() {
  agencyShopsRows.innerHTML = '';

  shops.forEach(shop => {
    const statusBadge = shop.isLive ? 
      `<span class="status-badge live"><i data-lucide="wifi" style="width:12px;height:12px;vertical-align:middle;margin-right:4px;"></i>Online</span>` :
      `<span class="status-badge offline"><i data-lucide="wifi-off" style="width:12px;height:12px;vertical-align:middle;margin-right:4px;"></i>Offline</span>`;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>
        <strong style="font-size:0.95rem;">${shop.name}</strong>
        <div style="font-size:0.75rem;color:var(--text-muted);text-transform:uppercase;">${shop.category}</div>
      </td>
      <td><code style="font-weight:700;color:var(--accent-color);">${shop.id}</code></td>
      <td><span style="font-size:0.85rem;">${shop.area}</span></td>
      <td>${statusBadge}</td>
      <td>
        <button class="inv-action-btn delete" onclick="deleteAgencyShop('${shop.id}')" title="Delete Shop Partner">
          <i data-lucide="trash-2" style="width:14px;height:14px;"></i>
        </button>
      </td>
    `;
    agencyShopsRows.appendChild(tr);
  });

  lucide.createIcons();
}

// Delete shop registry entry
function deleteAgencyShop(shopId) {
  const idx = shops.findIndex(s => s.id === shopId);
  if (idx === -1) return;

  const shopName = shops[idx].name;
  if (confirm(`Are you sure you want to remove shop "${shopName}" (${shopId}) from the registered merchants registry? All associated products will also be deleted.`)) {
    if (activeShopSession && activeShopSession.id === shopId) {
      activeShopSession = null;
      sessionStorage.removeItem('active_shop_session');
    }

    shops.splice(idx, 1);
    syncStorage();
    
    renderShopsDirectory();
    renderAgencyShops();
    updateAgencyStats();
    
    showToast(`Removed shop: ${shopName}`, 'info');
  }
}

// --- PORTAL C: DELIVERY AGENCY HUB LOGIC CONT. ---

// Agency Login form submission
const agencyLoginForm = document.getElementById('agency-login-form');
const loginAgencyPassInput = document.getElementById('login-agency-pass');
const agencyLogoutBtn = document.getElementById('agency-logout-btn');

if (agencyLoginForm) {
  agencyLoginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const pass = loginAgencyPassInput.value.trim();

    if (pass === 'agency123') {
      sessionStorage.setItem('active_agency_session', 'true');
      loginAgencyPassInput.value = '';
      showToast("Access Granted. Agency Console Unlocked.", "success");
      renderAgencyPortal();
    } else {
      showToast("Invalid Agency Password", "error");
    }
  });
}

if (agencyLogoutBtn) {
  agencyLogoutBtn.addEventListener('click', () => {
    sessionStorage.removeItem('active_agency_session');
    showToast("Agency console locked.", "info");
    renderAgencyPortal();
  });
}

// Shop Courier Requirements Form Listener
const shopCourierRequirementsForm = document.getElementById('shop-courier-requirements-form');
if (shopCourierRequirementsForm) {
  shopCourierRequirementsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!activeShopSession) return;
    const dbShop = shops.find(s => s.id === activeShopSession.id);
    if (!dbShop) return;

    const requestedCount = parseInt(document.getElementById('s-couriers-required').value);
    dbShop.requestedCouriers = requestedCount;
    syncStorage();
    showToast(`Courier staffing requirements updated to ${requestedCount} delivery boys.`, 'success');
  });
}

// Render active shop-level courier allocations table
function renderCourierAllocation() {
  const allocationRows = document.getElementById('agency-courier-allocation-rows');
  if (!allocationRows) return;
  allocationRows.innerHTML = '';

  shops.forEach(shop => {
    if (shop.requestedCouriers === undefined) shop.requestedCouriers = 1;
    if (shop.assignedCouriers === undefined) shop.assignedCouriers = 1;

    const freeCouriers = getFreeCouriersCount(shop);
    const assignedCouriers = shop.assignedCouriers || 1;
    const assignedCellHTML = `
      <strong>${assignedCouriers} delivery boys</strong>
      <div style="font-size:0.75rem;color:${freeCouriers > 0 ? 'var(--success-color)' : 'var(--warning-color)'};font-weight:600;">
        ${freeCouriers} / ${assignedCouriers} Available
      </div>
    `;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${shop.name}</strong><br><span style="font-size:0.75rem;color:var(--text-muted);">${shop.id}</span></td>
      <td>${shop.area}</td>
      <td><span style="font-weight:600;color:var(--accent-color);">${shop.requestedCouriers} delivery boys</span></td>
      <td>${assignedCellHTML}</td>
      <td>
        <div style="display:flex; align-items:center; gap:8px;">
          <button class="inv-action-btn" onclick="adjustCourierAllocation('${shop.id}', -1)" title="Remove 1 Delivery Boy"><i data-lucide="minus" style="width:12px;height:12px;"></i></button>
          <button class="inv-action-btn" onclick="adjustCourierAllocation('${shop.id}', 1)" title="Assign 1 Delivery Boy"><i data-lucide="plus" style="width:12px;height:12px;"></i></button>
        </div>
      </td>
    `;
    allocationRows.appendChild(tr);
  });

  lucide.createIcons();
}
window.renderCourierAllocation = renderCourierAllocation;

// Adjust allocated courier count for a shop
function adjustCourierAllocation(shopId, amount) {
  const shop = shops.find(s => s.id === shopId);
  if (!shop) return;

  if (shop.assignedCouriers === undefined) shop.assignedCouriers = 1;

  const currentTotalAssigned = shops.reduce((sum, s) => sum + (s.assignedCouriers || 0), 0);
  
  if (amount > 0) {
    if (currentTotalAssigned + amount > totalCouriersPool) {
      showToast(`Cannot allocate. Insufficient courier agents in global pool (Total Pool: ${totalCouriersPool}).`, 'error');
      return;
    }
    shop.assignedCouriers += amount;
  } else if (amount < 0) {
    if (shop.assignedCouriers + amount < 0) {
      showToast("Cannot reduce allocation below 0.", 'error');
      return;
    }
    shop.assignedCouriers += amount;
  }

  syncStorage();
  renderCourierAllocation();
  updateAgencyStats();
  showToast(`Updated courier staffing for ${shop.name}.`, 'success');
}
window.adjustCourierAllocation = adjustCourierAllocation;

// Agency Update Pool Size bindings
const agencyUpdatePoolBtn = document.getElementById('agency-update-pool-btn');
const agencyCouriersPoolInput = document.getElementById('agency-couriers-pool-input');

if (agencyUpdatePoolBtn && agencyCouriersPoolInput) {
  agencyCouriersPoolInput.value = totalCouriersPool;
  
  agencyUpdatePoolBtn.addEventListener('click', () => {
    const val = parseInt(agencyCouriersPoolInput.value);
    if (isNaN(val) || val < 1) {
      showToast("Invalid pool size.", 'error');
      return;
    }
    
    const totalAssigned = shops.reduce((sum, s) => sum + (s.assignedCouriers || 0), 0);
    if (val < totalAssigned) {
      showToast(`Cannot reduce pool size to ${val}. Currently ${totalAssigned} couriers are assigned to shops.`, 'error');
      return;
    }
    
    totalCouriersPool = val;
    syncStorage();
    updateAgencyStats();
    renderCourierAllocation();
    showToast(`Global courier pool size updated to ${totalCouriersPool}.`, 'success');
  });
}


// --- INITIALIZATION ---

navLogo.addEventListener('click', () => {
  switchPortal('customer');
});

// Global Portal Selectors
portalTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    switchPortal(tab.dataset.portal);
  });
});

// Cart Drawer bindings
cartBtn.addEventListener('click', openCart);
cartCloseBtn.addEventListener('click', closeCart);
appBackdrop.addEventListener('click', closeCart);

// Theme selectors bindings
themeBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  themeDropdown.classList.toggle('show');
});

document.addEventListener('click', () => {
  themeDropdown.classList.remove('show');
});

document.querySelectorAll('.theme-option').forEach(opt => {
  opt.addEventListener('click', () => {
    changeTheme(opt.dataset.theme);
  });
});

// Launch logic on ready
document.addEventListener('DOMContentLoaded', async () => {
  changeTheme(currentTheme);
  
  // Initial portal draw
  switchPortal(activePortal);
  renderCart();
  
  lucide.createIcons();

  // Load state from MongoDB database
  await loadStateFromServer();
});

// Agency Fee Settings Form Listener
const agencyFeeSettingsForm = document.getElementById('agency-fee-settings-form');
if (agencyFeeSettingsForm) {
  agencyFeeSettingsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const baseFee = parseFloat(document.getElementById('agency-base-fee-input').value);
    const perKm = parseFloat(document.getElementById('agency-per-km-input').value);
    
    if (isNaN(baseFee) || baseFee < 0 || isNaN(perKm) || perKm < 0) {
      showToast("Fee rates must be positive numbers.", "error");
      return;
    }
    
    baseDeliveryFee = baseFee;
    perKmDeliveryFee = perKm;
    syncStorage();
    showToast("Delivery fee configuration updated successfully!", "success");
    
    // Trigger redraws
    renderCart();
  });
}

// Delivery Invoice Modal Bindings
const deliveryInvoiceModal = document.getElementById('delivery-invoice-modal');
const printInvoiceBtn = document.getElementById('print-invoice-btn');
const closeInvoiceBtn = document.getElementById('close-invoice-btn');

if (printInvoiceBtn) {
  printInvoiceBtn.addEventListener('click', () => {
    window.print();
  });
}

if (closeInvoiceBtn && deliveryInvoiceModal) {
  closeInvoiceBtn.addEventListener('click', () => {
    deliveryInvoiceModal.close();
    deliveryInvoiceModal.classList.remove('active');
  });
}

if (deliveryInvoiceModal) {
  deliveryInvoiceModal.addEventListener('close', () => {
    deliveryInvoiceModal.classList.remove('active');
  });
}

// Enter Distance Modal Bindings
const enterDistanceModal = document.getElementById('enter-distance-modal');
const enterDistanceForm = document.getElementById('enter-distance-form');
const closeDistModalBtn = document.getElementById('close-dist-modal-btn');

if (enterDistanceForm) {
  enterDistanceForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (deliveryToDeliverIndex === null) return;

    const order = deliveries[deliveryToDeliverIndex];
    if (!order) return;

    const enteredDistance = parseFloat(document.getElementById('actual-distance-input').value);
    if (isNaN(enteredDistance) || enteredDistance <= 0) {
      showToast("Please enter a valid distance.", "error");
      return;
    }

    const oldDistance = order.distance !== undefined ? order.distance : 3.5;
    // Update distance
    order.distance = enteredDistance;

    // Recalculate delivery fee
    const newDeliveryFee = calculateDeliveryFee(enteredDistance);
    order.deliveryFee = newDeliveryFee;

    // Retrieve or fallback subtotal
    let subtotal = order.subtotal;
    if (subtotal === undefined) {
      const oldDeliveryFee = calculateDeliveryFee(oldDistance);
      subtotal = Math.max(0, order.total - oldDeliveryFee);
    }
    order.subtotal = subtotal;

    const promoDiscount = order.promoDiscount || 0;
    const shopDiscountPercent = order.discount || 0;

    const baseTotalForShopDiscount = subtotal + newDeliveryFee - promoDiscount;
    const shopDiscountAmount = baseTotalForShopDiscount * (shopDiscountPercent / 100);

    order.total = baseTotalForShopDiscount - shopDiscountAmount;
    order.originalTotal = baseTotalForShopDiscount;

    // Update status to Delivered
    order.status = 'Delivered';

    // Auto-dispatch queue checking if an order was completed (Delivered)
    const shopName = order.shopName;
    let oldestPendingIndex = -1;
    for (let i = deliveries.length - 1; i >= 0; i--) {
      if (deliveries[i].shopName === shopName && deliveries[i].status === 'Pending') {
        oldestPendingIndex = i;
        break;
      }
    }

    if (oldestPendingIndex !== -1) {
      deliveries[oldestPendingIndex].status = 'Dispatched';
      setTimeout(() => {
        showToast(`Delivery boy returned! Queued order ${deliveries[oldestPendingIndex].id} has been auto-dispatched.`, 'success');
        renderAgencyDeliveries();
        renderPartnerDeliveries();
        renderShopsDirectory();
        renderCourierAllocation();
      }, 800);
    }

    // Close modal & sync storage/redraw
    if (enterDistanceModal) {
      enterDistanceModal.close();
      enterDistanceModal.classList.remove('active');
    }

    syncStorage();
    updateAgencyStats();
    renderAgencyDeliveries();
    renderPartnerDeliveries();
    renderShopsDirectory();
    renderCourierAllocation();

    showToast(`Delivery completed & bill generated with ${enteredDistance} km.`, "success");

    // Show invoice modal
    showDeliveryInvoice(order);

    // Reset index
    deliveryToDeliverIndex = null;
  });
}

if (closeDistModalBtn && enterDistanceModal) {
  closeDistModalBtn.addEventListener('click', () => {
    enterDistanceModal.close();
    enterDistanceModal.classList.remove('active');
    deliveryToDeliverIndex = null;
  });
}

if (enterDistanceModal) {
  enterDistanceModal.addEventListener('close', () => {
    enterDistanceModal.classList.remove('active');
  });
}

// --- CUSTOMER ORDER TRACKING LOGIC ---
const trackOrderBtn = document.getElementById('track-order-btn');
const customerTrackOrderModal = document.getElementById('customer-track-order-modal');
const closeTrackModalX = document.getElementById('close-track-modal-x');
const trackOrderForm = document.getElementById('track-order-form');
const trackOrderIdInput = document.getElementById('track-order-id-input');
const trackResultContainer = document.getElementById('track-result-container');

if (trackOrderBtn && customerTrackOrderModal) {
  trackOrderBtn.addEventListener('click', () => {
    // Reset track modal states
    if (trackOrderIdInput) trackOrderIdInput.value = '';
    if (trackResultContainer) trackResultContainer.style.display = 'none';
    customerTrackOrderModal.showModal();
    customerTrackOrderModal.classList.add('active');
  });
}

if (closeTrackModalX && customerTrackOrderModal) {
  closeTrackModalX.addEventListener('click', () => {
    customerTrackOrderModal.close();
    customerTrackOrderModal.classList.remove('active');
  });
}

if (customerTrackOrderModal) {
  customerTrackOrderModal.addEventListener('close', () => {
    customerTrackOrderModal.classList.remove('active');
  });
}

if (trackOrderForm) {
  trackOrderForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!activeCustomerShop) return;

    const inputId = trackOrderIdInput.value.trim().toUpperCase();
    const formattedId = inputId.startsWith('#') ? inputId : '#' + inputId;

    // Search for order
    const order = deliveries.find(d => d.id === formattedId);

    if (!order) {
      showToast("Order ID not found.", "error");
      trackResultContainer.style.display = 'none';
      return;
    }

    // Verify shop mismatch
    if (order.shopName !== activeCustomerShop.name) {
      showToast(`Order found, but it belongs to "${order.shopName}", not "${activeCustomerShop.name}".`, "warning");
      trackResultContainer.style.display = 'none';
      return;
    }

    // Render Tracking Result
    trackResultContainer.style.display = 'block';
    document.getElementById('track-order-ref').innerText = order.id;

    const statusBox = document.getElementById('track-status-box');
    const stepPlaced = document.getElementById('track-step-placed');
    const stepDispatched = document.getElementById('track-step-dispatched');
    const stepDelivered = document.getElementById('track-step-delivered');

    const dotPlaced = stepPlaced.querySelector('.stepper-dot');
    const dotDispatched = stepDispatched.querySelector('.stepper-dot');
    const dotDelivered = stepDelivered.querySelector('.stepper-dot');

    // Reset styles
    statusBox.className = '';
    statusBox.style.background = '';
    statusBox.style.color = '';
    
    [stepPlaced, stepDispatched, stepDelivered].forEach(step => {
      step.style.color = 'var(--text-muted)';
      step.querySelector('.stepper-dot').style.background = 'var(--border-color)';
    });

    if (order.status === 'Pending') {
      const shopOfDelivery = shops.find(s => s.name === order.shopName);
      const freeCouriers = shopOfDelivery ? getFreeCouriersCount(shopOfDelivery) : 0;
      
      if (freeCouriers <= 0) {
        statusBox.innerText = 'Queued (Waiting)';
        statusBox.style.background = 'rgba(249, 115, 22, 0.15)';
        statusBox.style.color = '#f97316';
        
        document.getElementById('track-step-placed-title').innerText = 'Queued in Dispatch Queue';
        document.getElementById('track-step-placed-desc').innerText = 'All delivery riders are currently busy.';
      } else {
        statusBox.innerText = 'Pending Dispatch';
        statusBox.style.background = 'rgba(59, 130, 246, 0.15)';
        statusBox.style.color = '#3b82f6';
        
        document.getElementById('track-step-placed-title').innerText = 'Order Placed';
        document.getElementById('track-step-placed-desc').innerText = 'Merchant is preparing your package.';
      }

      stepPlaced.style.color = 'var(--text-primary)';
      dotPlaced.style.background = '#3b82f6';

    } else if (order.status === 'Dispatched') {
      statusBox.innerText = 'Out for Delivery';
      statusBox.style.background = 'rgba(59, 130, 246, 0.15)';
      statusBox.style.color = '#3b82f6';

      stepPlaced.style.color = 'var(--text-primary)';
      stepDispatched.style.color = 'var(--text-primary)';
      
      dotPlaced.style.background = 'var(--success-color)';
      dotDispatched.style.background = '#3b82f6';

      document.getElementById('track-step-placed-title').innerText = 'Order Placed';
      document.getElementById('track-step-placed-desc').innerText = 'Merchant confirmed and assigned courier.';
      document.getElementById('track-step-dispatched-desc').innerText = `Rider is on the way (Distance: ${order.distance || 3.5} km).`;

    } else if (order.status === 'Delivered') {
      // Order ID expires and shows ORDER delivered
      statusBox.innerText = 'ORDER delivered (Expired)';
      statusBox.style.background = 'rgba(16, 185, 129, 0.15)';
      statusBox.style.color = 'var(--success-color)';

      stepPlaced.style.color = 'var(--text-secondary)';
      stepDispatched.style.color = 'var(--text-secondary)';
      stepDelivered.style.color = 'var(--success-color)';

      dotPlaced.style.background = 'var(--success-color)';
      dotDispatched.style.background = 'var(--success-color)';
      dotDelivered.style.background = 'var(--success-color)';

      document.getElementById('track-step-placed-title').innerText = 'Order Placed';
      document.getElementById('track-step-placed-desc').innerText = 'Completed.';
      document.getElementById('track-step-dispatched-desc').innerText = 'Completed.';
      document.getElementById('track-step-delivered-desc').innerText = `Arrived successfully (Total: ${order.distance || 3.5} km covered).`;
    }

    lucide.createIcons();
  });
}

// --- DAILY OPERATIONS & SALES REPORTS ---

function renderPartnerDailyReports() {
  const container = document.getElementById('partner-reports-rows');
  if (!container) return;
  container.innerHTML = '';

  if (!activeShopSession) return;

  // Filter deliveries belonging to this shop
  const shopDeliveries = deliveries.filter(d => d.shopName === activeShopSession.name);

  // Group deliveries by date.
  const grouped = {};
  shopDeliveries.forEach(del => {
    const dStr = del.date || 'May 30, 2026';
    if (!grouped[dStr]) {
      grouped[dStr] = [];
    }
    grouped[dStr].push(del);
  });

  const sortedDates = Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a));

  if (sortedDates.length === 0) {
    container.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; color: var(--text-muted); padding: 20px;">
          No operational records found.
        </td>
      </tr>
    `;
    return;
  }

  sortedDates.forEach(dateStr => {
    const dayOrders = grouped[dateStr];
    const completedCount = dayOrders.filter(o => o.status === 'Delivered').length;
    const totalCount = dayOrders.length;
    
    // Resolve commission rate for this specific day and shop
    const commissionRate = getDailyCommissionRate(dateStr, activeShopSession.name);

    // Calculate total commission paid for this date
    const totalCommission = dayOrders.reduce((sum, o) => {
      const sub = o.subtotal !== undefined ? o.subtotal : o.total;
      return sum + (sub * (commissionRate / 100));
    }, 0);

    // Revenue calculations net of custom commission percentage
    const netRevenue = dayOrders.reduce((sum, o) => {
      const sub = o.subtotal !== undefined ? o.subtotal : o.total;
      const commission = sub * (commissionRate / 100);
      const payout = Math.max(0, o.total - (o.deliveryFee || 0) - commission);
      return sum + payout;
    }, 0);

    const distanceCovered = dayOrders.reduce((sum, o) => sum + (o.distance || 0), 0);
    const deliveryFeesPaid = dayOrders.reduce((sum, o) => sum + (o.deliveryFee || 0), 0);

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="font-weight: 600;">${dateStr}</td>
      <td>${completedCount} / ${totalCount} Completed</td>
      <td><strong>${commissionRate}%</strong></td>
      <td><strong style="color: var(--error-color);">₹${totalCommission.toFixed(2)}</strong></td>
      <td><strong style="color: var(--success-color);">₹${netRevenue.toFixed(2)}</strong></td>
      <td>${distanceCovered.toFixed(1)} km</td>
      <td>₹${deliveryFeesPaid.toFixed(2)}</td>
      <td>
        <button class="back-btn delete-report-btn" data-date="${dateStr}" style="padding: 6px 12px; border-color: rgba(239, 68, 68, 0.3); color: var(--error-color); font-size: 0.8rem; border-radius: var(--border-radius-sm);">
          <i data-lucide="trash-2" style="width:12px; height:12px; vertical-align:middle; margin-right:4px;"></i> Delete Report
        </button>
      </td>
    `;

    // Bind delete button
    const deleteBtn = tr.querySelector('.delete-report-btn');
    deleteBtn.addEventListener('click', () => {
      if (confirm(`Are you sure you want to delete all operations reports and records for ${dateStr}?`)) {
        // Delete all orders for this shop on this day
        deliveries = deliveries.filter(d => !(d.shopName === activeShopSession.name && (d.date || 'May 30, 2026') === dateStr));
        syncStorage();
        renderPartnerDeliveries();
        showToast(`Reports for ${dateStr} deleted.`, 'success');
      }
    });

    container.appendChild(tr);
  });

  lucide.createIcons();
}

function renderAgencyDailyReports() {
  const container = document.getElementById('agency-reports-rows');
  if (!container) return;
  container.innerHTML = '';

  // Group deliveries by Date AND Shop
  const grouped = {};
  deliveries.forEach(del => {
    const dStr = del.date || 'May 30, 2026';
    const sName = del.shopName;
    const key = `${dStr}|${sName}`;
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(del);
  });

  // Sort keys: Date desc, Shop Name asc
  const sortedKeys = Object.keys(grouped).sort((a, b) => {
    const [dateA, shopA] = a.split('|');
    const [dateB, shopB] = b.split('|');
    const dateCompare = new Date(dateB) - new Date(dateA);
    if (dateCompare !== 0) return dateCompare;
    return shopA.localeCompare(shopB);
  });

  if (sortedKeys.length === 0) {
    container.innerHTML = `
      <tr>
        <td colspan="8" style="text-align: center; color: var(--text-muted); padding: 20px;">
          No operational records found.
        </td>
      </tr>
    `;
    return;
  }

  sortedKeys.forEach(key => {
    const [dateStr, shopName] = key.split('|');
    const dayOrders = grouped[key];
    const totalCount = dayOrders.length;
    const distanceCovered = dayOrders.reduce((sum, o) => sum + (o.distance || 0), 0);
    const deliveryFeesCollected = dayOrders.reduce((sum, o) => sum + (o.deliveryFee || 0), 0);
    
    // Commission percentage override
    const commissionRate = getDailyCommissionRate(dateStr, shopName);

    // Commission amount on subtotal
    const agencyCommission = dayOrders.reduce((sum, o) => {
      const sub = o.subtotal !== undefined ? o.subtotal : o.total;
      return sum + (sub * (commissionRate / 100));
    }, 0);

    const netMerchantPayouts = dayOrders.reduce((sum, o) => {
      const sub = o.subtotal !== undefined ? o.subtotal : o.total;
      const commission = sub * (commissionRate / 100);
      const payout = Math.max(0, o.total - (o.deliveryFee || 0) - commission);
      return sum + payout;
    }, 0);

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="font-weight: 600;">${dateStr}</td>
      <td style="font-weight: 600;">${shopName}</td>
      <td>${totalCount} Orders</td>
      <td>${distanceCovered.toFixed(1)} km</td>
      <td>₹${deliveryFeesCollected.toFixed(2)}</td>
      <td>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span>₹${agencyCommission.toFixed(2)} <span style="font-size:0.75rem; color:var(--text-muted);">(${commissionRate}%)</span></span>
          <button class="back-btn edit-comm-btn" style="padding: 2px 6px; font-size: 0.7rem; border-radius: 4px; display: inline-flex; align-items: center; gap: 2px;">
            <i data-lucide="edit-3" style="width:10px;height:10px;"></i> Edit
          </button>
        </div>
      </td>
      <td>₹${netMerchantPayouts.toFixed(2)}</td>
      <td>
        <button class="back-btn delete-report-btn" data-date="${dateStr}" style="padding: 6px 12px; border-color: rgba(239, 68, 68, 0.3); color: var(--error-color); font-size: 0.8rem; border-radius: var(--border-radius-sm);">
          <i data-lucide="trash-2" style="width:12px; height:12px; vertical-align:middle; margin-right:4px;"></i> Delete Report
        </button>
      </td>
    `;

    // Bind edit commission button
    const editCommBtn = tr.querySelector('.edit-comm-btn');
    editCommBtn.addEventListener('click', () => {
      const currentRate = getDailyCommissionRate(dateStr, shopName);
      const input = prompt(`Enter custom agency commission percentage (0-100) for "${shopName}" on ${dateStr}:`, currentRate);
      if (input === null) return;
      
      const newRate = parseFloat(input);
      if (isNaN(newRate) || newRate < 0 || newRate > 100) {
        showToast("Please enter a valid percentage between 0 and 100.", "error");
        return;
      }
      
      const commKey = `${dateStr}_${shopName}`;
      dailyCommissions[commKey] = newRate;
      localStorage.setItem('agency_daily_commissions', JSON.stringify(dailyCommissions));
      
      renderAgencyPortal();
      showToast(`Commission rate updated to ${newRate}% for "${shopName}" on ${dateStr}.`, "success");
    });

    // Bind delete button
    const deleteBtn = tr.querySelector('.delete-report-btn');
    deleteBtn.addEventListener('click', () => {
      if (confirm(`Are you sure you want to permanently delete all network operations records and reports for "${shopName}" on ${dateStr}?`)) {
        // Delete all orders globally for this shop on this day
        deliveries = deliveries.filter(d => !((d.date || 'May 30, 2026') === dateStr && d.shopName === shopName));
        syncStorage();
        renderAgencyPortal();
        showToast(`Reports for "${shopName}" on ${dateStr} deleted.`, 'success');
      }
    });

    container.appendChild(tr);
  });

  lucide.createIcons();
}

// --- SHOP COMMISSIONS CONFIGURATION PORTAL ---

function renderAgencyCommissionSettings() {
  const container = document.getElementById('agency-shop-commission-rows');
  if (!container) return;
  container.innerHTML = '';

  // Setup form fields on volume rules card
  const rulesEnabledCheckbox = document.getElementById('agency-rules-enabled');
  const t1LimitInput = document.getElementById('agency-tier1-limit');
  const t1RateInput = document.getElementById('agency-tier1-rate');
  const t2LimitInput = document.getElementById('agency-tier2-limit');
  const t2RateInput = document.getElementById('agency-tier2-rate');
  const t3RateInput = document.getElementById('agency-tier3-rate');

  if (rulesEnabledCheckbox) {
    rulesEnabledCheckbox.checked = tieredCommissionRules.enabled;
  }
  if (t1LimitInput) t1LimitInput.value = tieredCommissionRules.tier1Limit;
  if (t1RateInput) t1RateInput.value = tieredCommissionRules.tier1Rate;
  if (t2LimitInput) t2LimitInput.value = tieredCommissionRules.tier2Limit;
  if (t2RateInput) t2RateInput.value = tieredCommissionRules.tier2Rate;
  if (t3RateInput) t3RateInput.value = tieredCommissionRules.tier3Rate;

  // Render Shops table rows
  shops.forEach(shop => {
    const totalOrdersCount = deliveries.filter(d => d.shopName === shop.name).length;
    const isAutoMode = tieredCommissionRules.enabled;
    const calculationMode = isAutoMode ? '<span style="color:#06b6d4;font-weight:600;">Auto (Tiered)</span>' : 'Manual (Custom)';
    
    // Calculate total earnings from delivered orders (product price + delivery charge)
    const deliveredOrders = deliveries.filter(d => d.shopName === shop.name && d.status === 'Delivered');
    const totalEarnings = deliveredOrders.reduce((sum, d) => {
      const sub = d.subtotal !== undefined ? d.subtotal : d.total;
      const fee = d.deliveryFee || 0;
      return sum + sub + fee;
    }, 0);

    // Resolve current commission rate
    const currentRate = getShopCommissionRate(shop.name);

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${shop.name}</strong><br><small style="color:var(--text-muted);">${shop.id}</small></td>
      <td><strong>${totalOrdersCount} Orders</strong></td>
      <td><strong style="color: var(--success-color);">₹${totalEarnings.toFixed(2)}</strong></td>
      <td>${calculationMode}</td>
      <td><strong>${currentRate}%</strong></td>
      <td>
        <button class="back-btn configure-comm-btn" style="padding: 6px 12px; font-size: 0.8rem; border-radius: var(--border-radius-sm);" ${isAutoMode ? 'disabled' : ''}>
          <i data-lucide="edit-3" style="width:12px;height:12px;vertical-align:middle;margin-right:4px;"></i> Configure
        </button>
      </td>
    `;

    // Bind configuration override prompt
    const configureBtn = tr.querySelector('.configure-comm-btn');
    if (configureBtn) {
      configureBtn.addEventListener('click', () => {
        const input = prompt(`Enter custom agency commission percentage (0-100) for "${shop.name}":`, shop.commissionRate !== undefined ? shop.commissionRate : 20);
        if (input === null) return;
        
        const newRate = parseFloat(input);
        if (isNaN(newRate) || newRate < 0 || newRate > 100) {
          showToast("Please enter a valid percentage between 0 and 100.", "error");
          return;
        }

        shop.commissionRate = newRate;
        syncStorage();
        renderAgencyCommissionSettings();
        renderAgencyDailyReports();
        showToast(`Commission rate updated to ${newRate}% for "${shop.name}".`, "success");
      });
    }

    container.appendChild(tr);
  });

  lucide.createIcons();
}

// Bind Tier Rules Form submission
const agencyCommissionRulesForm = document.getElementById('agency-commission-rules-form');
if (agencyCommissionRulesForm) {
  agencyCommissionRulesForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const rulesEnabledCheckbox = document.getElementById('agency-rules-enabled');
    const t1Limit = parseInt(document.getElementById('agency-tier1-limit').value);
    const t1Rate = parseFloat(document.getElementById('agency-tier1-rate').value);
    const t2Limit = parseInt(document.getElementById('agency-tier2-limit').value);
    const t2Rate = parseFloat(document.getElementById('agency-tier2-rate').value);
    const t3Rate = parseFloat(document.getElementById('agency-tier3-rate').value);

    if (isNaN(t1Limit) || t1Limit <= 0 || isNaN(t1Rate) || t1Rate < 0 || t1Rate > 100 ||
        isNaN(t2Limit) || t2Limit <= 0 || isNaN(t2Rate) || t2Rate < 0 || t2Rate > 100 ||
        isNaN(t3Rate) || t3Rate < 0 || t3Rate > 100) {
      showToast("Please enter valid positive values for limits and rates (0-100%).", "error");
      return;
    }

    if (t1Limit >= t2Limit) {
      showToast("Tier 1 limit must be smaller than Tier 2 limit.", "error");
      return;
    }

    tieredCommissionRules.enabled = rulesEnabledCheckbox ? rulesEnabledCheckbox.checked : false;
    tieredCommissionRules.tier1Limit = t1Limit;
    tieredCommissionRules.tier1Rate = t1Rate;
    tieredCommissionRules.tier2Limit = t2Limit;
    tieredCommissionRules.tier2Rate = t2Rate;
    tieredCommissionRules.tier3Rate = t3Rate;

    syncStorage();
    renderAgencyCommissionSettings();
    renderAgencyDailyReports();
    showToast("Volume-based tiered commission rules updated successfully!", "success");
  });
}

// Bind check switch toggler directly to trigger redraws
const rulesEnabledCheckbox = document.getElementById('agency-rules-enabled');
if (rulesEnabledCheckbox) {
  rulesEnabledCheckbox.addEventListener('change', () => {
    tieredCommissionRules.enabled = rulesEnabledCheckbox.checked;
    syncStorage();
    renderAgencyCommissionSettings();
    renderAgencyDailyReports();
    showToast(`Auto-tiered commissions ${tieredCommissionRules.enabled ? 'Enabled' : 'Disabled'}.`, "info");
  });
}
