
// ===================== DATA — Bhopal-only farmers =====================
const products = [
  {id:1, name:"Fresh Tomatoes (Tamatar)", farmer:"Ramesh Patel", loc:"Berasia, Bhopal", cat:"vegetables", emoji:"🍅", price:32, mandiPrice:45, unit:"kg", fresh:true, organic:false, bg:"#fff5f5"},
  {id:2, name:"Desi Aam (Mango)", farmer:"Suresh Verma", loc:"Phanda, Bhopal", cat:"fruits", emoji:"🥭", price:120, mandiPrice:160, unit:"kg", fresh:true, organic:true, bg:"#fffbf0"},
  {id:3, name:"Organic Palak (Spinach)", farmer:"Kavita Sharma", loc:"Ratibad, Bhopal", cat:"vegetables", emoji:"🥬", price:28, mandiPrice:40, unit:"bundle", fresh:true, organic:true, bg:"#f0fff4"},
  {id:4, name:"Sharbati Gehu (Wheat)", farmer:"Gurpreet Jat", loc:"Hoshangabad Rd, Bhopal", cat:"grains", emoji:"🌾", price:30, mandiPrice:42, unit:"kg", fresh:false, organic:false, bg:"#fffef5"},
  {id:5, name:"Kele (Bananas)", farmer:"Mohan Yadav", loc:"Mandideep, Bhopal", cat:"fruits", emoji:"🍌", price:38, mandiPrice:52, unit:"dozen", fresh:true, organic:false, bg:"#fffef0"},
  {id:6, name:"Hari Mirch (Green Chillies)", farmer:"Bala Krishnan", loc:"Misrod, Bhopal", cat:"vegetables", emoji:"🌶️", price:55, mandiPrice:75, unit:"kg", fresh:true, organic:false, bg:"#fff5f0"},
  {id:7, name:"Desi Ghee", farmer:"Aarti Devi", loc:"Berasia, Bhopal", cat:"dairy", emoji:"🧈", price:480, mandiPrice:600, unit:"kg", fresh:true, organic:true, bg:"#fffcf0"},
  {id:8, name:"Aloo (Potato)", farmer:"Dinesh Verma", loc:"Vidisha Rd, Bhopal", cat:"vegetables", emoji:"🥔", price:18, mandiPrice:28, unit:"kg", fresh:true, organic:false, bg:"#faf5ef"},
  {id:9, name:"Tarbooj (Watermelon)", farmer:"Ravi Kumar", loc:"Obaidullaganj, Bhopal", cat:"fruits", emoji:"🍉", price:20, mandiPrice:30, unit:"kg", fresh:true, organic:false, bg:"#fff5f8"},
  {id:10, name:"Pyaz (Red Onion)", farmer:"Mahesh Patidar", loc:"Sehore Rd, Bhopal", cat:"vegetables", emoji:"🧅", price:22, mandiPrice:35, unit:"kg", fresh:true, organic:false, bg:"#fff8f5"},
  {id:11, name:"Dhaniya (Fresh Coriander)", farmer:"Priya Nair", loc:"Fanda, Bhopal", cat:"herbs", emoji:"🌿", price:20, mandiPrice:30, unit:"bundle", fresh:true, organic:true, bg:"#f0fff7"},
  {id:12, name:"Makka (Maize)", farmer:"Rajendra Jat", loc:"Raisen Rd, Bhopal", cat:"grains", emoji:"🌽", price:22, mandiPrice:32, unit:"kg", fresh:false, organic:false, bg:"#fffaf5"},
];

let cart = [];
let myListings = [];
let orders = [];
let activeCategory = 'all';
let selectedPayment = 'cod';
let isHindi = false;

// ===================== RENDER PRODUCTS =====================
function renderProducts(list) {
  const grid = document.getElementById('productGrid');
  if(!list.length) {
    grid.innerHTML = '<div class="empty-state"><div class="empty-icon">🔍</div><p>No products found</p></div>';
    return;
  }
  grid.innerHTML = list.map((p,i) => {
    const savePct = Math.round(((p.mandiPrice - p.price) / p.mandiPrice) * 100);
    return `
    <div class="product-card fade-up" style="animation-delay:${i*0.05}s">
      <div class="product-img" style="background:${p.bg}">
        <span>${p.emoji}</span>
        ${p.fresh ? '<span class="fresh-badge">Just Harvested</span>' : ''}
        ${p.organic ? '<span class="organic-badge">🌿 Organic</span>' : ''}
      </div>
      <div class="product-body">
        <div class="product-name">${p.name}</div>
        <div class="product-farmer"><span class="farmer-dot"></span>${p.farmer} · ${p.loc}</div>
        <!-- Mandi vs KhetSe price comparison -->
        <div class="price-compare">
          <span class="mandi-label">Mandi:</span>
          <span class="mandi-price">₹${p.mandiPrice}/${p.unit}</span>
          <span class="save-chip">Save ${savePct}%</span>
        </div>
        <div class="product-footer">
          <div>
            <div class="product-price">₹${p.price} <span class="product-unit">/ ${p.unit}</span></div>
            <div class="farmer-price-label">✅ KhetSe Farmer Price</div>
          </div>
          <button class="add-btn" id="btn-${p.id}" onclick="instaAdd(${p.id})">+</button>
          <div class="insta-cart-ctrl" id="ctrl-${p.id}">
            <button class="insta-minus" onclick="instaChange(${p.id},-1)">−</button>
            <span class="insta-qty" id="qty-${p.id}">1</span>
            <button class="insta-plus" onclick="instaChange(${p.id},1)">+</button>
          </div>
        </div>
      </div>
    </div>`;
  }).join('');
  // Re-apply cart visual state after re-render
  setTimeout(syncCartStateToCards, 0);
}

function filterCategory(cat, el) {
  activeCategory = cat;
  document.querySelectorAll('.cat-card').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  applyFilters();
}

function filterSearch(val) { applyFilters(); }

function applyFilters() {
  const search = document.getElementById('searchInput').value.toLowerCase();
  let list = products;
  if(activeCategory !== 'all') list = list.filter(p => p.cat === activeCategory);
  if(search) list = list.filter(p => p.name.toLowerCase().includes(search) || p.farmer.toLowerCase().includes(search));
  renderProducts(list);
}

// ===================== INSTAMART-STYLE CART =====================
function instaAdd(id) {
  const product = [...products, ...myListings].find(p => p.id === id);
  if(!product) return;
  // Add 1 unit to cart directly
  const existing = cart.find(c => c.id === id);
  if(existing) { existing.qty++; }
  else { cart.push({...product, qty: 1}); }
  updateCartUI();
  // Switch button to inline control
  const btn = document.getElementById('btn-'+id);
  const ctrl = document.getElementById('ctrl-'+id);
  const qtyEl = document.getElementById('qty-'+id);
  if(btn) btn.style.display = 'none';
  if(ctrl) ctrl.classList.add('visible');
  if(qtyEl) qtyEl.textContent = cart.find(c=>c.id===id)?.qty || 1;
  showToast(`${product.emoji} Added to cart!`);
}

function instaChange(id, delta) {
  const item = cart.find(c => c.id === id);
  if(!item) return;
  item.qty += delta;
  if(item.qty <= 0) {
    cart = cart.filter(c => c.id !== id);
    const btn = document.getElementById('btn-'+id);
    const ctrl = document.getElementById('ctrl-'+id);
    if(btn) btn.style.display = '';
    if(ctrl) ctrl.classList.remove('visible');
  } else {
    const qtyEl = document.getElementById('qty-'+id);
    if(qtyEl) qtyEl.textContent = item.qty;
  }
  updateCartUI();
}

// After any renderProducts call, re-apply cart visual state to cards
function syncCartStateToCards() {
  cart.forEach(item => {
    const btn = document.getElementById('btn-'+item.id);
    const ctrl = document.getElementById('ctrl-'+item.id);
    const qtyEl = document.getElementById('qty-'+item.id);
    if(btn) btn.style.display = 'none';
    if(ctrl) ctrl.classList.add('visible');
    if(qtyEl) qtyEl.textContent = item.qty;
  });
}

// ===================== CART — with quantity selection modal =====================
let pendingProductId = null;
let selectedQtyAmount = 1;

function addToCart(id) {
  const product = [...products, ...myListings].find(p => p.id === id);
  if(!product) return;
  // Open quantity modal
  pendingProductId = id;
  selectedQtyAmount = 1;

  // Build quantity options based on unit
  const unit = product.unit || 'kg';
  let qtySteps;
  if(unit === 'bundle') {
    qtySteps = [
      {label:'1 bundle', val:1}, {label:'2 bundles', val:2},
      {label:'3 bundles', val:3}, {label:'5 bundles', val:5},
      {label:'10 bundles', val:10}, {label:'Custom…', val:'custom'}
    ];
  } else if(unit === 'dozen') {
    qtySteps = [
      {label:'1 dozen', val:1}, {label:'2 dozen', val:2},
      {label:'3 dozen', val:3}, {label:'5 dozen', val:5},
      {label:'10 dozen', val:10}, {label:'Custom…', val:'custom'}
    ];
  } else {
    qtySteps = [
      {label:'1 kg', val:1}, {label:'2 kg', val:2},
      {label:'3 kg', val:3}, {label:'5 kg', val:5},
      {label:'10 kg', val:10}, {label:'Custom…', val:'custom'}
    ];
  }

  document.getElementById('qtyModalEmoji').textContent = product.emoji;
  document.getElementById('qtyModalTitle').textContent = product.name;
  document.getElementById('qtyModalPrice').textContent = `₹${product.price} / ${unit}`;

  document.getElementById('qtyOptions').innerHTML = qtySteps.map((step, i) => `
    <div class="qty-option ${i===0?'selected':''}"
         onclick="selectQtyOption(this, ${step.val === 'custom' ? "'custom'" : step.val}, ${product.price}, '${unit}')">
      ${step.label}
      <span class="qty-sub">${step.val === 'custom' ? 'Enter amount' : '₹' + (product.price * step.val).toLocaleString('en-IN')}</span>
    </div>
  `).join('');

  document.getElementById('qtyModalOverlay').classList.add('open');
}

function selectQtyOption(el, val, price, unit) {
  document.querySelectorAll('.qty-option').forEach(o => o.classList.remove('selected'));
  el.classList.add('selected');
  if(val === 'custom') {
    const custom = prompt(`Enter quantity in ${unit}:`);
    const parsed = parseInt(custom);
    if(!parsed || parsed < 1) { showToast('Invalid quantity'); return; }
    selectedQtyAmount = parsed;
    el.childNodes[0].textContent = `${parsed} ${unit}`;
    el.querySelector('.qty-sub').textContent = '₹' + (price * parsed).toLocaleString('en-IN');
  } else {
    selectedQtyAmount = val;
  }
}

function closeQtyModal() {
  document.getElementById('qtyModalOverlay').classList.remove('open');
  pendingProductId = null;
}

function confirmAddToCart() {
  const id = pendingProductId;
  if(!id) return;
  closeQtyModal();
  const product = [...products, ...myListings].find(p => p.id === id);
  if(!product) return;
  const existing = cart.find(c => c.id === id);
  if(existing) { existing.qty += selectedQtyAmount; }
  else { cart.push({...product, qty: selectedQtyAmount}); }
  updateCartUI();
  showToast(`${product.emoji} ${product.name} (${selectedQtyAmount} ${product.unit}) added!`);
  const btn = document.getElementById('btn-'+id);
  if(btn) { btn.textContent='✓'; btn.classList.add('added'); }
}

function updateCartUI() {
  document.getElementById('cartCount').textContent = cart.reduce((s,i)=>s+i.qty,0);
  const items = document.getElementById('cartItems');
  const paySection = document.getElementById('paymentSection');

  if(!cart.length) {
    items.innerHTML = '<div class="empty-state"><div class="empty-icon">🛒</div><p>Your cart is empty</p></div>';
    document.getElementById('cartSummary').innerHTML = '';
    document.getElementById('checkoutTotal').textContent = '';
    if(paySection) paySection.style.display = 'none';
    return;
  }

  items.innerHTML = cart.map(item => `
    <div class="cart-item">
      <span class="cart-item-emoji">${item.emoji}</span>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">₹${item.price} / ${item.unit}</div>
      </div>
      <div class="qty-ctrl">
        <button class="qty-btn" onclick="changeQty(${item.id},-1)">−</button>
        <span class="qty-num">${item.qty}</span>
        <button class="qty-btn" onclick="changeQty(${item.id},1)">+</button>
      </div>
      <button class="remove-item" onclick="removeItem(${item.id})">🗑</button>
    </div>
  `).join('');

  // FIXED: correct total calculation
  const subtotal = cart.reduce((s,i) => s + (i.price * i.qty), 0);
  const delivery = 30; // flat delivery within Bhopal
  const total = subtotal + delivery;

  document.getElementById('cartSummary').innerHTML = `
    <div class="cart-row"><span>Subtotal (${cart.reduce((s,i)=>s+i.qty,0)} items)</span><span>₹${subtotal.toLocaleString('en-IN')}</span></div>
    <div class="cart-row"><span>Delivery (within Bhopal)</span><span>₹${delivery}</span></div>
    <div class="cart-row"><span style="color:#888;font-size:.78rem">Middlemen cost</span><span style="color:var(--sprout);font-size:.78rem">₹0 saved!</span></div>
    <div class="cart-row total"><span>Total Payable</span><span>₹${total.toLocaleString('en-IN')}</span></div>
  `;
  document.getElementById('checkoutTotal').textContent = ` — ₹${total.toLocaleString('en-IN')}`;
  if(paySection) paySection.style.display = 'block';
}

function changeQty(id, delta) {
  const item = cart.find(c => c.id === id);
  if(!item) return;
  item.qty += delta;
  if(item.qty <= 0) {
    cart = cart.filter(c => c.id !== id);
    // reset inline card control
    const btn = document.getElementById('btn-'+id);
    const ctrl = document.getElementById('ctrl-'+id);
    if(btn) btn.style.display = '';
    if(ctrl) ctrl.classList.remove('visible');
  } else {
    const qtyEl = document.getElementById('qty-'+id);
    if(qtyEl) qtyEl.textContent = item.qty;
  }
  updateCartUI();
}

function removeItem(id) {
  cart = cart.filter(c => c.id !== id);
  const btn = document.getElementById('btn-'+id);
  const ctrl = document.getElementById('ctrl-'+id);
  if(btn) btn.style.display = '';
  if(ctrl) ctrl.classList.remove('visible');
  updateCartUI();
}

function selectPayment(type) {
  selectedPayment = type;
  document.querySelectorAll('.pay-opt').forEach(el => el.classList.remove('selected'));
  document.getElementById('pay-'+type).classList.add('selected');
}

function toggleCart() {
  document.getElementById('cartOverlay').classList.toggle('open');
  document.getElementById('cartPanel').classList.toggle('open');
}

function checkout() {
  if(!cart.length) { showToast('Your cart is empty!'); return; }
  const subtotal = cart.reduce((s,i) => s + (i.price * i.qty), 0);
  const total = subtotal + 30;
  orders.push({
    id: 'KS' + Date.now().toString().slice(-5),
    date: new Date().toLocaleDateString('en-IN'),
    items: [...cart],
    total,
    status: 'processing',
    payment: selectedPayment
  });
  cart = [];
  // reset all inline card controls
  document.querySelectorAll('.add-btn').forEach(btn => { btn.style.display = ''; });
  document.querySelectorAll('.insta-cart-ctrl').forEach(ctrl => ctrl.classList.remove('visible'));
  updateCartUI();
  toggleCart();
  document.getElementById('modalOverlay').classList.add('open');
  updateDashboard();
  renderOrders();
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  showPage('orders');
}

// ===================== FARMER =====================
const catEmojis = {Vegetables:'🍅',Fruits:'🍎',Grains:'🌾',Dairy:'🥛',Herbs:'🌿'};

function listProduct() {
  const name = document.getElementById('f-name').value.trim();
  const cat = document.getElementById('f-cat').value;
  const price = parseInt(document.getElementById('f-price').value);
  const qty = parseInt(document.getElementById('f-qty').value);
  const farmer = document.getElementById('f-farmer').value.trim();
  const loc = document.getElementById('f-loc').value;
  const organic = document.getElementById('f-organic').value === 'yes';

  if(!name||!price||!qty||!farmer) { showToast('Please fill all required fields!'); return; }
  if(price < 1 || qty < 1) { showToast('Price and quantity must be greater than 0!'); return; }

  const mandiPrice = Math.round(price * 1.35); // mandi is ~35% higher
  const newProduct = {
    id: Date.now(), name, cat:cat.toLowerCase(),
    emoji: catEmojis[cat]||'🌾', price, mandiPrice,
    unit:'kg', fresh:true, organic, farmer, loc, bg:'#f5fff5', qty
  };
  myListings.push(newProduct);
  products.push(newProduct);
  renderMyListings();
  renderProducts(products);
  showToast(`✅ ${name} listed successfully!`);
  ['f-name','f-price','f-qty','f-farmer','f-desc'].forEach(id => document.getElementById(id).value='');
}

function renderMyListings() {
  const el = document.getElementById('myListings');
  if(!myListings.length) {
    el.innerHTML = '<div class="empty-state"><div class="empty-icon">📋</div><p>No listings yet. Add your first produce above!</p></div>';
    return;
  }
  el.innerHTML = myListings.map(l => `
    <div class="listing-item">
      <span class="listing-emoji">${l.emoji}</span>
      <div class="listing-info">
        <div class="listing-name">${l.name}</div>
        <div class="listing-meta">📍 ${l.loc} · ${l.qty} kg available ${l.organic?'· 🌿 Organic':''}</div>
      </div>
      <div style="text-align:right">
        <div class="listing-price">₹${l.price}/kg</div>
        <span class="listing-status">● Active</span>
      </div>
    </div>
  `).join('');
}

// ===================== AI GUIDANCE =====================
function showAiTab(tab, el) {
  document.querySelectorAll('.ai-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  ['crops','fertilizer','pesticide','water','ask'].forEach(t => {
    const el = document.getElementById('ai-'+t);
    if(el) el.style.display = t===tab?'block':'none';
  });
}

const aiKnowledge = {
  keywords: {
    'tomato|tamatar': "🍅 Tomatoes need watering every 3-4 days in summer. Apply neem oil spray every 15 days for pest control. Use vermicompost 2 tonnes/acre before planting. Harvest starts 60-70 days after transplanting.",
    'wheat|gehu|gehun': "🌾 Wheat needs 4-6 irrigations total. First irrigation at 21 days (CRI stage) is critical. Apply 120kg DAP + 60kg urea/acre in 2 splits. Harvest in March-April.",
    'onion|pyaz': "🧅 Onion needs watering every 7-8 days. Stop irrigation 10 days before harvest. Apply 60kg nitrogen/acre in 3 splits. Harvest when tops fall over naturally.",
    'water|paani|irrigation|sinchai': "💧 Best time to water: early morning (6-8am) or evening (5-7pm). Midday watering wastes 30-40% to evaporation. Drip irrigation saves 40-50% water vs flood irrigation.",
    'fertilizer|khad|urvarak': "🌿 Best organic fertilizer: Jeevamrit (cow dung + cow urine + jaggery). Apply every 15 days. Vermicompost (2-3 tonnes/acre) improves soil health long-term. Available at KVK Bhopal.",
    'pest|kide|bimari': "🛡️ Use neem oil spray (5ml/litre) for organic pest control. Apply every 10-15 days. For serious infestations, call Bhopal Krishi helpline: 1800-180-1551 (free).",
    'season|rabi|kharif|fasal': "📅 Rabi (winter Oct-Mar): Wheat, Onion, Potato, Palak, Tomato. Kharif (monsoon Jun-Sep): Maize, Soybean, Rice, Groundnut. Best cash crops for Bhopal: Wheat + Tomato.",
    'organic|jaivik': "🌿 For organic certification in MP, contact MPCOF (MP Certified Organic Federation). Organic produce gets 20-30% price premium on KhetSe. Start with neem oil + jeevamrit.",
  },
  default: "🤖 Great question! For best results in Bhopal's black soil climate: focus on wheat, tomato, onion, and leafy vegetables. Use organic methods for premium KhetSe pricing. Call KVK Bhopal (1800-180-1551) for field-specific advice."
};

function askAI() {
  const q = document.getElementById('aiQuestion').value.trim();
  if(!q) return;
  const responseEl = document.getElementById('aiResponse');
  responseEl.className = 'ai-response-box show';
  responseEl.innerHTML = '<span class="ai-loading">🤖 Thinking...</span>';

  setTimeout(() => {
    const lower = q.toLowerCase();
    let answer = aiKnowledge.default;
    for(const [pattern, response] of Object.entries(aiKnowledge.keywords)) {
      if(new RegExp(pattern).test(lower)) { answer = response; break; }
    }
    responseEl.innerHTML = `<strong>🤖 KhetSe AI:</strong><br><br>${answer}`;
  }, 800);
}

function quickAsk(q) {
  document.getElementById('aiQuestion').value = q;
  askAI();
}

// ===================== ORDERS =====================
function renderOrders() {
  const el = document.getElementById('ordersList');
  const allOrders = [
    {id:'KS10482', date:'20 Apr 2025', items:[
      {emoji:'🍅',name:'Fresh Tomatoes',qty:2,price:32},
      {emoji:'🥬',name:'Organic Palak',qty:1,price:28}
    ], total:122, status:'delivered', payment:'cod'},
    {id:'KS10391', date:'18 Apr 2025', items:[
      {emoji:'🥭',name:'Desi Aam',qty:1,price:120}
    ], total:150, status:'transit', payment:'upi'},
    ...orders
  ];

  if(!allOrders.length) {
    el.innerHTML = '<div class="empty-state"><div class="empty-icon">📦</div><p>No orders yet. Start shopping!</p></div>';
    return;
  }

  el.innerHTML = allOrders.map(order => `
    <div class="order-card">
      <div class="order-header">
        <div>
          <div class="order-id"># ${order.id}</div>
          <div class="order-date">📅 ${order.date} · ${order.payment==='upi'?'📱 UPI':'💵 Cash on Delivery'}</div>
        </div>
        <span class="order-status status-${order.status}">
          ${order.status==='delivered'?'✅ Delivered':order.status==='transit'?'🚚 In Transit':'⏳ Processing'}
        </span>
      </div>
      ${order.status==='transit'?`
      <div class="track-steps">
        <div class="track-step done"><div class="step-circle">✓</div><div class="step-label">Ordered</div></div>
        <div class="track-step done"><div class="step-circle">✓</div><div class="step-label">Packed</div></div>
        <div class="track-step current"><div class="step-circle">🚚</div><div class="step-label">In Transit</div></div>
        <div class="track-step"><div class="step-circle">4</div><div class="step-label">Delivered</div></div>
      </div>`:''}
      ${order.status==='processing'?`
      <div class="track-steps">
        <div class="track-step current"><div class="step-circle">1</div><div class="step-label">Ordered</div></div>
        <div class="track-step"><div class="step-circle">2</div><div class="step-label">Packed</div></div>
        <div class="track-step"><div class="step-circle">3</div><div class="step-label">In Transit</div></div>
        <div class="track-step"><div class="step-circle">4</div><div class="step-label">Delivered</div></div>
      </div>`:''}
      <div class="order-items">
        ${order.items.map(item=>`
          <div class="order-item">
            <span class="order-item-emoji">${item.emoji}</span>
            <span class="order-item-name">${item.name}</span>
            <span class="order-item-qty">×${item.qty}</span>
            <span class="order-item-price">₹${item.price * item.qty}</span>
          </div>
        `).join('')}
      </div>
      <div class="order-footer">
        <div class="order-total">Total Paid: ₹${order.total.toLocaleString('en-IN')}</div>
        <button class="track-btn">Track Order 📍</button>
      </div>
    </div>
  `).join('');
}

// ===================== DASHBOARD =====================
function updateDashboard() {
  const totalOrders = 24 + orders.length;
  const totalRevenue = orders.reduce((s,o)=>s+o.total,0) + 8420;
  document.getElementById('d-orders').textContent = totalOrders;
  document.getElementById('d-revenue').textContent = '₹' + totalRevenue.toLocaleString('en-IN');

  const top = [
    {emoji:'🍅', name:'Fresh Tomatoes', sold:340, revenue:'₹10,880'},
    {emoji:'🌾', name:'Sharbati Gehu', sold:280, revenue:'₹8,400'},
    {emoji:'🧅', name:'Pyaz', sold:220, revenue:'₹4,840'},
    {emoji:'🧈', name:'Desi Ghee', sold:12, revenue:'₹5,760'},
  ];
  document.getElementById('topProducts').innerHTML = top.map((t,i) => `
    <div style="display:flex;align-items:center;gap:12px;padding:11px 0;border-bottom:1px solid #f5f5f5">
      <span style="font-size:1.4rem">${t.emoji}</span>
      <div style="flex:1">
        <div style="font-weight:700;font-size:.9rem">${t.name}</div>
        <div style="font-size:.78rem;color:#aaa">${t.sold} kg sold</div>
      </div>
      <div style="font-weight:700;color:var(--earth)">${t.revenue}</div>
    </div>
  `).join('');

  const prices = [
    {item:'Tamatar (Tomato)', mandi:'₹45/kg', platform:'₹32/kg', saving:'29%'},
    {item:'Aam (Mango)', mandi:'₹160/kg', platform:'₹120/kg', saving:'25%'},
    {item:'Palak (Spinach)', mandi:'₹40/bundle', platform:'₹28/bundle', saving:'30%'},
    {item:'Desi Ghee', mandi:'₹600/kg', platform:'₹480/kg', saving:'20%'},
  ];
  document.getElementById('priceReport').innerHTML = prices.map(p=>`
    <div style="background:var(--mist);border-radius:10px;padding:12px 16px;display:flex;align-items:center;gap:14px;flex-wrap:wrap">
      <div style="flex:1;min-width:120px;font-weight:600;font-size:.88rem">${p.item}</div>
      <div style="font-size:.8rem;color:#999">Mandi: <strong style="color:var(--rust)">${p.mandi}</strong></div>
      <div style="font-size:.8rem;color:#999">KhetSe: <strong style="color:var(--leaf)">${p.platform}</strong></div>
      <div style="background:var(--sprout);color:white;padding:3px 9px;border-radius:50px;font-size:.72rem;font-weight:700;white-space:nowrap">Save ${p.saving}</div>
    </div>
  `).join('');
}

// ===================== LANGUAGE TOGGLE =====================
const translations = {
  en: { market:'Market', farmer:'Farmer', orders:'Orders', stats:'Stats' },
  hi: { market:'बाज़ार', farmer:'किसान', orders:'ऑर्डर', stats:'आँकड़े' }
};
function toggleLang() {
  isHindi = !isHindi;
  const lang = isHindi ? 'hi' : 'en';
  const labels = document.querySelectorAll('.tab-label');
  const keys = ['market','farmer','orders','stats'];
  labels.forEach((el, i) => { el.textContent = translations[lang][keys[i]]; });
  document.querySelector('.lang-btn .lang-text').textContent = isHindi ? 'English' : 'हिंदी';
  showToast(isHindi ? 'भाषा बदली: हिंदी' : 'Language: English');
}

// ===================== VOICE INPUT =====================
function toggleVoice() {
  const btn = document.getElementById('voiceBtn');
  if(!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    showToast('Voice search not supported in this browser');
    return;
  }
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SR();
  recognition.lang = isHindi ? 'hi-IN' : 'en-IN';
  recognition.onstart = () => { btn.textContent='🔴'; btn.classList.add('listening'); };
  recognition.onresult = (e) => {
    const transcript = e.results[0][0].transcript;
    document.getElementById('searchInput').value = transcript;
    filterSearch(transcript);
    showPage('home');
    showToast(`Searching: "${transcript}"`);
  };
  recognition.onend = () => { btn.textContent='🎙️'; btn.classList.remove('listening'); };
  recognition.onerror = () => { btn.textContent='🎙️'; btn.classList.remove('listening'); showToast('Voice search error. Try again.'); };
  recognition.start();
}

// ===================== LOGIN SYSTEM =====================
let currentUser = null;
let selectedRole = 'consumer';
let passVisible = false;

function selectLoginRole(role) {
  // Deselect all role rows
  document.querySelectorAll('.role-row').forEach(r => r.classList.remove('selected'));
  const fields = document.getElementById('loginFields');
  const signupNote = document.getElementById('loginSignupNote');

  if(!role) {
    // Back to role selection
    fields.style.display = 'none';
    if(signupNote) signupNote.style.display = '';
    return;
  }

  selectedRole = role;
  // Highlight selected role row
  const rowEl = document.getElementById('role-row-' + role);
  if(rowEl) rowEl.classList.add('selected');

  // Show credential fields
  fields.style.display = 'block';
  if(signupNote) signupNote.style.display = 'none';

  // Clear previous errors
  const errEl = document.getElementById('loginError');
  if(errEl) errEl.style.display = 'none';
  const emailEl = document.getElementById('lf-email');
  const passEl = document.getElementById('lf-pass');
  if(emailEl) { emailEl.value = ''; emailEl.focus(); }
  if(passEl) passEl.value = '';

  // Update button label
  const btnText = document.getElementById('loginBtnText');
  if(btnText) btnText.textContent = role === 'farmer' ? '🌾 Sign In as Farmer →' : '🛍️ Sign In as Consumer →';
}

function togglePassVis() {
  passVisible = !passVisible;
  const passEl = document.getElementById('lf-pass');
  const btn = document.getElementById('passToggleBtn');
  if(passEl) passEl.type = passVisible ? 'text' : 'password';
  if(btn) btn.textContent = passVisible ? '🙈' : '👁️';
}

function doLogin() {
  const email = (document.getElementById('lf-email').value || '').trim();
  const pass = (document.getElementById('lf-pass').value || '').trim();
  const errEl = document.getElementById('loginError');

  // Validation
  if(!email) {
    showLoginError('Please enter your email or mobile number.');
    document.getElementById('lf-email').focus();
    return;
  }
  if(!pass) {
    showLoginError('Please enter your password.');
    document.getElementById('lf-pass').focus();
    return;
  }
  if(pass.length < 4) {
    showLoginError('Password must be at least 4 characters.');
    document.getElementById('lf-pass').focus();
    return;
  }

  // Hide error, proceed with login
  if(errEl) errEl.style.display = 'none';
  quickLogin(selectedRole, email);
}

function showLoginError(msg) {
  const errEl = document.getElementById('loginError');
  if(errEl) { errEl.textContent = '⚠️ ' + msg; errEl.style.display = 'block'; }
}

function quickLogin(role, identifier) {
  selectedRole = role;
  currentUser = { name: identifier || role, role };
  const btn = document.getElementById('loginNavBtn');
  btn.innerHTML = `<span>${role === 'farmer' ? '🌾' : '👤'}</span><span class="login-btn-text">${role === 'farmer' ? 'Farmer' : 'Me'}</span>`;
  btn.classList.add('logged-in');
  btn.onclick = handleLogout;
  showToast(`✅ Welcome! Logged in as ${role === 'farmer' ? 'Farmer' : 'Consumer'}`);
  if(role === 'farmer') showPage('farmer');
  else showPage('home');
}

function selectRole(role) { selectLoginRole(role); }

function handleLogin() {
  doLogin();
}

function handleLogout() {
  currentUser = null;
  const btn = document.getElementById('loginNavBtn');
  btn.innerHTML = `<span>👤</span><span class="login-btn-text">Login</span>`;
  btn.classList.remove('logged-in');
  btn.onclick = showLoginPage;
  showToast('Logged out successfully');
  showLoginPage();
}

function showLoginPage() {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('page-login').classList.add('active');
  // Reset login form state
  selectLoginRole(null);
  document.querySelectorAll('.role-row').forEach(r => r.classList.remove('selected'));
}

// ===================== UTILS =====================
function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('page-'+name).classList.add('active');
  const tabs = document.querySelectorAll('.nav-tab');
  const pages = ['home','farmer','orders','dashboard'];
  const idx = pages.indexOf(name);
  if(idx !== -1) tabs[idx].classList.add('active');
  if(name==='orders') renderOrders();
  if(name==='dashboard') updateDashboard();
  if(name==='home') setTimeout(syncCartStateToCards, 0);
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'), 2800);
}


// ===================== INIT =====================
renderProducts(products);
renderMyListings();
renderOrders();
updateDashboard();
// Show login page first
showLoginPage();

