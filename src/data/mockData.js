// src/data/mockData.js

const AHMEDABAD_LOCATIONS = [
  "Vastrapur",
  "Navrangpura",
  "Satellite",
  "Prahlad Nagar",
  "Bodakdev",
  "Thaltej",
  "SG Highway",
  "Bopal",
  "Maninagar",
  "Paldi"
];

const RESTAURANT_NAMES = [
  { name: "The Gujarati Thali Co.", type: "Gujarati", isMultiCuisine: false, banner: "/images/banners/gujarati-banner.webp" },
  { name: "Punjab Da Dhaba", type: "Punjabi", isMultiCuisine: false, banner: "/images/banners/punjabi-banner.webp" },
  { name: "South Express", type: "South Indian", isMultiCuisine: false, banner: "/images/banners/south-indian-banner.webp" },
  { name: "Delhi Belly", type: "North Indian", isMultiCuisine: false, banner: "/images/banners/north-indian-banner.webp" },
  { name: "Dragon Wok", type: "Chinese", isMultiCuisine: false, banner: "/images/banners/chinese-banner.webp" },
  { name: "Woodfire Pizzeria", type: "Pizza", isMultiCuisine: false, banner: "/images/banners/pizza-banner.webp" },
  { name: "Burger Bros", type: "Burgers", isMultiCuisine: false, banner: "/images/banners/burgers-banner.webp" },
  { name: "Manek Chowk Bites", type: "Street Food", isMultiCuisine: false, banner: "/images/banners/street-food-banner.webp" },
  { name: "The Roastery Cafe", type: "Cafe", isMultiCuisine: false, banner: "/images/banners/cafe-banner.webp" },
  { name: "Global Fusion", type: "Multi", isMultiCuisine: true, banner: "/images/banners/desserts-banner.webp" }
];

// Helper to generate realistic stats
const getRating = () => (4.0 + Math.random() * 0.9).toFixed(1);
const getPrepTime = (min, max) => `${Math.floor(min + Math.random() * (max - min))} mins`;
const isBestseller = () => Math.random() > 0.6;

const RESTAURANT_TEMPLATES = {
  "Gujarati": {
    "Thalis": [
      { name: "Gujarati Thali (Unlimited)", price: 349, veg: true, desc: "Authentic full meal with rotli, dal, shaak, farsan, and sweet.", img: "thali", spicyLevel: 1, addons: [{name: "Extra Ghee", price: 20}] },
      { name: "Kathiyawadi Thali", price: 399, veg: true, desc: "Spicy and robust flavors straight from Saurashtra.", img: "thali", spicyLevel: 2, addons: [{name: "Extra Bajra Rotla", price: 30}] }
    ],
    "Farsan & Snacks": [
      { name: "Khaman Dhokla", price: 99, veg: true, desc: "Soft, spongy steamed savory cake topped with mustard seeds.", img: "khaman", spicyLevel: 1, addons: [{name: "Green Chutney", price: 10}] },
      { name: "Fafda Jalebi", price: 199, veg: true, desc: "Classic Sunday morning breakfast combo. Sweet and savory.", img: "jalebi", spicyLevel: 0, addons: [{name: "Extra Papaya Sambharo", price: 15}] },
      { name: "Thepla (4 pcs)", price: 120, veg: true, desc: "Spiced flatbread made from wheat flour and fenugreek leaves.", img: "thepla", spicyLevel: 1, addons: [{name: "Curd", price: 20}] }
    ],
    "Mains": [
      { name: "Dal Dhokli", price: 199, veg: true, desc: "Wheat flour dumplings simmered in spiced tuvar dal.", img: "dal-dhokli", spicyLevel: 2, addons: [{name: "Extra Ghee", price: 20}] },
      { name: "Khandvi", price: 149, veg: true, desc: "Yellow, tightly rolled bite-sized pieces made of gram flour.", img: "dhokla", spicyLevel: 1, addons: [] }
    ]
  },
  "Punjabi": {
    "Mains": [
      { name: "Paneer Butter Masala", price: 299, veg: true, desc: "Rich and creamy curry made with paneer, spices, onions, and tomatoes.", img: "paneer-butter-masala", spicyLevel: 2, addons: [{name: "Extra Butter", price: 30}, {name: "Cheese", price: 40}] },
      { name: "Dal Makhani", price: 249, veg: true, desc: "Whole black lentils and red kidney beans cooked slowly with butter.", img: "dal-makhani", spicyLevel: 1, addons: [{name: "Extra Cream", price: 25}] },
      { name: "Butter Chicken", price: 399, veg: false, desc: "Tender chicken cooked in a rich tomato and butter gravy.", img: "butter-chicken", spicyLevel: 2, addons: [{name: "Extra Chicken Pieces", price: 80}] }
    ],
    "Breads": [
      { name: "Garlic Naan", price: 89, veg: true, desc: "Soft leavened bread topped with garlic and butter.", img: "garlic-naan", spicyLevel: 0, addons: [{name: "Extra Butter", price: 20}] },
      { name: "Amritsari Kulcha", price: 129, veg: true, desc: "Crispy stuffed flatbread served with chole.", img: "kulcha", spicyLevel: 2, addons: [{name: "Extra Butter", price: 20}] }
    ],
    "Beverages": [
      { name: "Patiala Lassi", price: 110, veg: true, desc: "Thick and creamy yogurt-based drink topped with malai.", img: "lassi", spicyLevel: 0, addons: [{name: "Extra Malai", price: 20}] }
    ]
  },
  "South Indian": {
    "Dosas": [
      { name: "Masala Dosa", price: 149, veg: true, desc: "Crispy crepe made from rice and lentils, stuffed with potato masala.", img: "masala-dosa", spicyLevel: 2, addons: [{name: "Extra Sambar", price: 20}, {name: "Cheese", price: 40}] },
      { name: "Mysore Masala Dosa", price: 179, veg: true, desc: "Spicy red chutney spread inside the dosa with potato filling.", img: "masala-dosa", spicyLevel: 3, addons: [{name: "Extra Butter", price: 20}] }
    ],
    "Classics": [
      { name: "Idli Sambar", price: 119, veg: true, desc: "Steamed rice cakes served with lentil soup and coconut chutney.", img: "idli", spicyLevel: 1, addons: [{name: "Extra Chutney", price: 10}] },
      { name: "Medu Vada", price: 129, veg: true, desc: "Crispy savory donut made from black gram.", img: "vada", spicyLevel: 1, addons: [{name: "Extra Sambar", price: 20}] }
    ],
    "Beverages": [
      { name: "Filter Coffee", price: 79, veg: true, desc: "Authentic South Indian strong coffee.", img: "filter-coffee", spicyLevel: 0, addons: [{name: "Extra Strong", price: 10}] }
    ]
  },
  "North Indian": {
    "Mains": [
      { name: "Rajma Chawal", price: 199, veg: true, desc: "Kidney beans in a thick gravy served with rice.", img: "rajma", spicyLevel: 2, addons: [{name: "Papad", price: 15}] },
      { name: "Palak Paneer", price: 279, veg: true, desc: "Paneer cubes in a smooth spinach gravy.", img: "palak-paneer", spicyLevel: 2, addons: [{name: "Extra Paneer", price: 50}] }
    ],
    "Breads": [
      { name: "Aloo Paratha", price: 129, veg: true, desc: "Whole wheat flatbread stuffed with spiced potatoes.", img: "rajma", spicyLevel: 2, addons: [{name: "Curd", price: 30}, {name: "Butter", price: 20}] }
    ],
    "Desserts": [
      { name: "Gulab Jamun", price: 99, veg: true, desc: "Fried milk dumplings soaked in sugar syrup.", img: "gulab-jamun", spicyLevel: 0, addons: [{name: "Vanilla Ice Cream", price: 40}] }
    ]
  },
  "Chinese": {
    "Noodles & Rice": [
      { name: "Hakka Noodles", price: 199, veg: true, desc: "Stir-fried noodles with vegetables and soy sauce.", img: "fried-rice", spicyLevel: 1, addons: [{name: "Extra Veggies", price: 30}] },
      { name: "Chicken Fried Rice", price: 279, veg: false, desc: "Wok-tossed rice with chicken chunks, egg, and veggies.", img: "fried-rice", spicyLevel: 1, addons: [{name: "Extra Chicken", price: 60}] }
    ],
    "Starters": [
      { name: "Veg Manchurian Dry", price: 179, veg: true, desc: "Deep-fried vegetable balls in a spicy soy sauce.", img: "manchurian", spicyLevel: 2, addons: [{name: "Extra Spicy", price: 10}] },
      { name: "Momos (Veg/Chicken)", price: 149, veg: true, desc: "Steamed dumplings served with spicy chutney.", img: "momos", spicyLevel: 2, addons: [{name: "Extra Chutney", price: 10}] }
    ]
  },
  "Pizza": {
    "Pizzas": [
      { name: "Margherita Pizza", price: 249, veg: true, desc: "Classic delight with 100% real mozzarella cheese.", img: "margherita", spicyLevel: 0, addons: [{name: "Extra Cheese", price: 50}, {name: "Olives", price: 30}] },
      { name: "Farmhouse Pizza", price: 349, veg: true, desc: "Onion, capsicum, tomato, and mushroom.", img: "margherita", spicyLevel: 1, addons: [{name: "Cheese Burst", price: 80}] }
    ],
    "Sides": [
      { name: "Garlic Breadsticks", price: 129, veg: true, desc: "Baked garlic breadsticks served with cheese dip.", img: "garlic-bread", spicyLevel: 0, addons: [{name: "Extra Cheese Dip", price: 30}] },
      { name: "White Sauce Pasta", price: 249, veg: true, desc: "Creamy white sauce pasta with exotic veggies.", img: "pasta", spicyLevel: 1, addons: [{name: "Extra Cheese", price: 40}] }
    ],
    "Beverages": [
      { name: "Coca-Cola (500ml)", price: 60, veg: true, desc: "Chilled Coca-Cola.", img: "coke", spicyLevel: 0, addons: [] }
    ]
  },
  "Burgers": {
    "Burgers": [
      { name: "Classic Veg Burger", price: 149, veg: true, desc: "Crispy potato patty with fresh veggies and mayo.", img: "burger", spicyLevel: 1, addons: [{ name: "Extra Cheese", price: 30 }, { name: "Spicy Mayo", price: 15 }] },
      { name: "Monster Tower Burger", price: 349, veg: false, desc: "A massive burger loaded with everything.", img: "burger", spicyLevel: 2, addons: [{ name: "Extra Cheese", price: 30 }, { name: "Onion Rings inside", price: 40 }] }
    ],
    "Sides": [
      { name: "Peri Peri Fries", price: 179, veg: true, desc: "Crispy fries tossed in spicy peri peri seasoning.", img: "fries", spicyLevel: 3, addons: [{ name: "Cheese Dip", price: 40 }] },
      { name: "Classic French Fries", price: 129, veg: true, desc: "Golden, crispy, and perfectly salted.", img: "fries", spicyLevel: 0, addons: [{ name: "Extra Dip", price: 20 }] }
    ]
  },
  "Street Food": {
    "Chaat": [
      { name: "Pani Puri (1 Plate)", price: 49, veg: true, desc: "Crispy puris served with spicy mint water and sweet chutney.", img: "pani-puri", spicyLevel: 3, addons: [{name: "Extra Puri", price: 10}] },
      { name: "Samosa Chaat", price: 99, veg: true, desc: "Crushed samosas topped with chole, yogurt, and chutneys.", img: "samosa", spicyLevel: 2, addons: [{name: "Extra Dahi", price: 15}] }
    ],
    "Mumbai Specials": [
      { name: "Vada Pav", price: 29, veg: true, desc: "Spicy potato fritter stuffed in a soft bun with dry garlic chutney.", img: "vada-pav", spicyLevel: 3, addons: [{name: "Cheese", price: 20}] },
      { name: "Pav Bhaji", price: 149, veg: true, desc: "Spicy mixed vegetable mash served with buttered buns.", img: "pav-bhaji", spicyLevel: 2, addons: [{name: "Extra Pav (2 pcs)", price: 30}, {name: "Extra Butter", price: 20}] }
    ]
  },
  "Cafe": {
    "Coffee": [
      { name: "Classic Cappuccino", price: 149, veg: true, desc: "Espresso with steamed milk and a deep layer of foam.", img: "cappuccino", spicyLevel: 0, addons: [{ name: "Extra Espresso Shot", price: 40 }, { name: "Oat Milk", price: 50 }] },
      { name: "Caffe Latte", price: 169, veg: true, desc: "Rich espresso balanced with steamed milk and a light layer of foam.", img: "latte", spicyLevel: 0, addons: [{ name: "Hazelnut Syrup", price: 30 }] },
      { name: "Espresso Shot", price: 99, veg: true, desc: "A strong, concentrated shot of coffee.", img: "espresso", spicyLevel: 0, addons: [] },
      { name: "Americano", price: 129, veg: true, desc: "Espresso shots topped with hot water create a light layer of crema.", img: "latte", spicyLevel: 0, addons: [] }
    ],
    "Bakery": [
      { name: "Butter Croissant", price: 119, veg: true, desc: "Flaky, buttery French pastry.", img: "croissant", spicyLevel: 0, addons: [{ name: "Butter & Jam", price: 25 }] },
      { name: "Blueberry Muffin", price: 119, veg: true, desc: "Freshly baked warm muffin bursting with blueberries.", img: "muffin", spicyLevel: 0, addons: [] },
      { name: "Chocolate Brownie", price: 139, veg: true, desc: "Gooey, rich chocolate brownie.", img: "brownie", spicyLevel: 0, addons: [{ name: "Vanilla Ice Cream", price: 40 }] }
    ]
  },
  "Desserts": {
    "Cakes & Pastries": [
      { name: "New York Cheesecake", price: 249, veg: true, desc: "Creamy vanilla cheesecake on a graham cracker crust.", img: "cheesecake", spicyLevel: 0, addons: [{name: "Strawberry Compote", price: 40}] },
      { name: "Chocolate Truffle Cake (Slice)", price: 149, veg: true, desc: "Rich and dense chocolate cake.", img: "macaron", spicyLevel: 0, addons: [{name: "Extra Chocolate Sauce", price: 20}] }
    ],
    "Sweets": [
      { name: "Macarons (Box of 3)", price: 249, veg: true, desc: "Assorted French almond meringue cookies.", img: "macaron", spicyLevel: 0, addons: [{name: "Gift Box Packaging", price: 30}] }
    ]
  },
  "Multi": {
    "Asian Flavors": [
      { name: "Sushi Platter", price: 599, veg: false, desc: "Assorted fresh sushi rolls with soy and wasabi.", img: "momos", spicyLevel: 1, addons: [{name: "Extra Wasabi", price: 20}] },
      { name: "Steamed Dim Sums", price: 249, veg: true, desc: "Delicate dumplings filled with exotic veggies.", img: "momos", spicyLevel: 1, addons: [] }
    ],
    "Continental": [
      { name: "Woodfired Margherita", price: 399, veg: true, desc: "Authentic Italian thin crust pizza.", img: "margherita", spicyLevel: 0, addons: [{name: "Extra Cheese", price: 50}] },
      { name: "Creamy Alfredo Pasta", price: 349, veg: true, desc: "Penne tossed in a rich, creamy cheese sauce.", img: "pasta", spicyLevel: 0, addons: [] },
      { name: "Gourmet Veg Burger", price: 299, veg: true, desc: "Premium veggie patty with truffle mayo.", img: "burger", spicyLevel: 1, addons: [{name: "Fries", price: 99}] }
    ],
    "Global Desserts": [
      { name: "New York Cheesecake", price: 299, veg: true, desc: "Classic baked cheesecake.", img: "cheesecake", spicyLevel: 0, addons: [] }
    ]
  }
};

function generateMockData() {
  const restaurants = [];
  
  for (let i = 0; i < RESTAURANT_NAMES.length; i++) {
    const baseRest = RESTAURANT_NAMES[i];
    const categoryName = baseRest.type;
    const template = RESTAURANT_TEMPLATES[categoryName] || RESTAURANT_TEMPLATES["Cafe"];
    
    const menuItems = [];
    let itemIdCounter = 1;
    
    // STRICT CUISINE RULE
    // If multi-cuisine, we pull from multiple templates.
    // If single cuisine, we strictly pull ONLY from its designated template.
    const templatesToUse = baseRest.isMultiCuisine 
        ? [RESTAURANT_TEMPLATES["Multi"] || RESTAURANT_TEMPLATES["Cafe"]] 
        : [RESTAURANT_TEMPLATES[categoryName] || RESTAURANT_TEMPLATES["Cafe"]];
    
    templatesToUse.forEach((template, tIdx) => {
      const templateCuisine = baseRest.isMultiCuisine ? "Multi" : categoryName;
      
      for (const [subCategory, items] of Object.entries(template)) {
        items.forEach(item => {
          let folderName = templateCuisine.toLowerCase().replace(/ /g, "-");
          
          // Helper to map Multi-cuisine items to their actual image folders since we reuse images
          if (baseRest.isMultiCuisine) {
            if (item.img === "momos") folderName = "chinese";
            if (item.img === "margherita" || item.img === "pasta") folderName = "pizza";
            if (item.img === "burger") folderName = "burgers";
            if (item.img === "cheesecake") folderName = "desserts";
          }
          
          const imagePath = `/images/menu/${folderName}/${item.img}.webp`;

          menuItems.push({
            id: `r${i+1}-i${itemIdCounter}`,
            name: item.name,
            description: item.desc,
            price: item.price,
            veg: item.veg,
            category: subCategory, 
            image: imagePath,
            bestseller: isBestseller(),
            spicyLevel: item.spicyLevel,
            preparationTime: getPrepTime(15, 35),
            rating: getRating(),
            addons: item.addons
          });
          itemIdCounter++;
        });
      }
    });

    restaurants.push({
      id: `rest-${i+1}`,
      name: baseRest.name,
      cuisine: [categoryName],
      coverImage: baseRest.banner,
      logo: `https://ui-avatars.com/api/?name=${encodeURIComponent(baseRest.name)}&background=random&color=fff&size=128`,
      location: AHMEDABAD_LOCATIONS[i],
      distance: (1 + Math.random() * 5).toFixed(1) + " km",
      deliveryTime: Math.floor(20 + Math.random() * 25) + " mins",
      rating: (4.0 + Math.random() * 0.9).toFixed(1),
      reviewsCount: Math.floor(100 + Math.random() * 900),
      description: `The best ${categoryName} food in Ahmedabad. Premium quality ingredients and authentic taste.`,
      menu: menuItems
    });
  }
  
  return restaurants;
}

export const mockRestaurants = generateMockData();

export const initMockDatabase = () => {
  localStorage.setItem('foodflow_restaurants', JSON.stringify(mockRestaurants));
  
  if (!localStorage.getItem('foodflow_wallet')) {
    localStorage.setItem('foodflow_wallet', '1500'); 
  }
  if (!localStorage.getItem('foodflow_orders')) {
    localStorage.setItem('foodflow_orders', JSON.stringify([]));
  }
};
