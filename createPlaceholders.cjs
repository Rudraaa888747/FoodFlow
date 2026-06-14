const fs = require('fs');
const path = require('path');

const files = {
  // Layouts
  'src/layouts/CustomerLayout.jsx': `import React from 'react';\nimport { Outlet } from 'react-router-dom';\nexport default function CustomerLayout() { return (<div><h2>Customer Layout</h2><Outlet /></div>); }`,
  'src/layouts/DeliveryLayout.jsx': `import React from 'react';\nimport { Outlet } from 'react-router-dom';\nexport default function DeliveryLayout() { return (<div><h2>Delivery Layout</h2><Outlet /></div>); }`,
  'src/layouts/RestaurantLayout.jsx': `import React from 'react';\nimport { Outlet } from 'react-router-dom';\nexport default function RestaurantLayout() { return (<div><h2>Restaurant Layout</h2><Outlet /></div>); }`,
  'src/layouts/AdminLayout.jsx': `import React from 'react';\nimport { Outlet } from 'react-router-dom';\nexport default function AdminLayout() { return (<div><h2>Admin Layout</h2><Outlet /></div>); }`,
  
  // Customer Pages
  'src/pages/customer/Home.jsx': `import React from 'react';\nexport default function Home() { return (<div>Customer Home</div>); }`,
  'src/pages/customer/Search.jsx': `import React from 'react';\nexport default function Search() { return (<div>Search</div>); }`,
  'src/pages/customer/RestaurantDetails.jsx': `import React from 'react';\nexport default function RestaurantDetails() { return (<div>RestaurantDetails</div>); }`,
  'src/pages/customer/Cart.jsx': `import React from 'react';\nexport default function Cart() { return (<div>Cart</div>); }`,
  'src/pages/customer/Checkout.jsx': `import React from 'react';\nexport default function Checkout() { return (<div>Checkout</div>); }`,
  'src/pages/customer/OrderTracking.jsx': `import React from 'react';\nexport default function OrderTracking() { return (<div>OrderTracking</div>); }`,
  'src/pages/customer/Profile.jsx': `import React from 'react';\nexport default function Profile() { return (<div>Profile</div>); }`,

  // Other Portals
  'src/pages/delivery/DeliveryDashboard.jsx': `import React from 'react';\nexport default function DeliveryDashboard() { return (<div>DeliveryDashboard</div>); }`,
  'src/pages/restaurant/RestaurantDashboard.jsx': `import React from 'react';\nexport default function RestaurantDashboard() { return (<div>RestaurantDashboard</div>); }`,
  'src/pages/admin/AdminDashboard.jsx': `import React from 'react';\nexport default function AdminDashboard() { return (<div>AdminDashboard</div>); }`,
};

Object.entries(files).forEach(([filePath, content]) => {
  const fullPath = path.join(__dirname, filePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
});

console.log('Placeholders created successfully.');

