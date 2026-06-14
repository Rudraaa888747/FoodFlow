const fs = require('fs');
const path = require('path');
const https = require('https');
const sharp = require('sharp');

const IMAGE_DATA = {
  "gujarati": {
    "dhokla": "https://upload.wikimedia.org/wikipedia/commons/6/65/Dhokla_on_Gujrart.jpg",
    "dal-dhokli": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Dal_Dhokali.jpg/960px-Dal_Dhokali.jpg",
    "thali": "https://upload.wikimedia.org/wikipedia/commons/4/49/Vegetarian_Curry.jpeg",
    "jalebi": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Basavanagudi_Kadalekai_Parishe_%282025%29_Bangalore_%2886%29.jpg/960px-Basavanagudi_Kadalekai_Parishe_%282025%29_Bangalore_%2886%29.jpg",
    "khaman": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/SPECIAL_SURATI_KHAMAN.jpg/960px-SPECIAL_SURATI_KHAMAN.jpg",
    "thepla": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Thepla_main.jpg/960px-Thepla_main.jpg"
  },
  "punjabi": {
    "paneer-butter-masala": "https://upload.wikimedia.org/wikipedia/commons/5/5c/Paneer_Makhani_Veggie.jpeg",
    "dal-makhani": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Punjabi_style_Dal_Makhani.jpg/960px-Punjabi_style_Dal_Makhani.jpg",
    "butter-chicken": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Butter_Chicken_%26_Butter_Naan_-_Home_-_Chandigarh_-_India_-_0006.jpg/960px-Butter_Chicken_%26_Butter_Naan_-_Home_-_Chandigarh_-_India_-_0006.jpg",
    "garlic-naan": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Annapurna_Naan.jpg/960px-Annapurna_Naan.jpg",
    "kulcha": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Chole_Kulcha_Meal_-_Order_Food_Online_in_Mumbai_%2831013272937%29.jpg/960px-Chole_Kulcha_Meal_-_Order_Food_Online_in_Mumbai_%2831013272937%29.jpg",
    "lassi": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Salt_lassi.jpg/960px-Salt_lassi.jpg"
  },
  "cafe": {
    "cappuccino": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Cappuccino_in_original.jpg/960px-Cappuccino_in_original.jpg",
    "latte": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Caffe_Latte_at_Pulse_Cafe.jpg/960px-Caffe_Latte_at_Pulse_Cafe.jpg",
    "espresso": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Tazzina_di_caff%C3%A8_a_Ventimiglia.jpg/960px-Tazzina_di_caff%C3%A8_a_Ventimiglia.jpg",
    "croissant": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Croissant-Petr_Kratochvil.jpg/960px-Croissant-Petr_Kratochvil.jpg",
    "muffin": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/02116jfMuffins_in_Philippinesfvf_02.jpg/960px-02116jfMuffins_in_Philippinesfvf_02.jpg",
    "brownie": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Chocolatebrownie.JPG/960px-Chocolatebrownie.JPG"
  },
  "pizza": {
    "margherita": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Pizza_Margherita_stu_spivack.jpg/960px-Pizza_Margherita_stu_spivack.jpg",
    "garlic-bread": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Garlicbread.jpg/960px-Garlicbread.jpg",
    "pasta": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/%28Pasta%29_by_David_Adam_Kess_%28pic.2%29.jpg/960px-%28Pasta%29_by_David_Adam_Kess_%28pic.2%29.jpg",
    "coke": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Coca_Cola_Flasche_-_Original_Taste.jpg/960px-Coca_Cola_Flasche_-_Original_Taste.jpg"
  },
  "south-indian": {
    "masala-dosa": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Rameshwaram_Cafe_Dosa.jpg/960px-Rameshwaram_Cafe_Dosa.jpg",
    "idli": "https://upload.wikimedia.org/wikipedia/commons/1/11/Idli_Sambar.JPG",
    "vada": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Medu_Vadas.JPG/960px-Medu_Vadas.JPG",
    "filter-coffee": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Filter-Coffee.jpg/960px-Filter-Coffee.jpg"
  },
  "north-indian": {
    "rajma": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Rajma_Masala_%2832081557778%29.jpg/960px-Rajma_Masala_%2832081557778%29.jpg",
    "palak-paneer": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Palakpaneer_Rayagada_Odisha_0009.jpg/960px-Palakpaneer_Rayagada_Odisha_0009.jpg",
    "gulab-jamun": "https://upload.wikimedia.org/wikipedia/commons/c/c1/Gulab-jamun-wallpaper-1.jpg"
  },
  "chinese": {
    "manchurian": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Chicken_Manchurian_%28Hyderabad_Style%29_%2811960049916%29.jpg/960px-Chicken_Manchurian_%28Hyderabad_Style%29_%2811960049916%29.jpg",
    "fried-rice": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Koh_Mak%2C_Thailand%2C_Fried_rice_with_seafood%2C_Thai_fried_rice.jpg/960px-Koh_Mak%2C_Thailand%2C_Fried_rice_with_seafood%2C_Thai_fried_rice.jpg",
    "momos": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Momo_nepal.jpg/960px-Momo_nepal.jpg"
  },
  "burgers": {
    "burger": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/RedDot_Burger.jpg/960px-RedDot_Burger.jpg",
    "fries": "https://upload.wikimedia.org/wikipedia/commons/8/83/French_Fries.JPG"
  },
  "street-food": {
    "vada-pav": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Vada_Pav-Indian_street_food.JPG/960px-Vada_Pav-Indian_street_food.JPG",
    "pav-bhaji": "https://upload.wikimedia.org/wikipedia/commons/4/4a/Bambayya_Pav_bhaji.jpg",
    "samosa": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Samosas%2C_snack_food_at_Wikipedia%27s_16th_Birthday_celebration_in_Chittagong_%2801%29.jpg/960px-Samosas%2C_snack_food_at_Wikipedia%27s_16th_Birthday_celebration_in_Chittagong_%2801%29.jpg",
    "pani-puri": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Golgappa_Pani_Puri_India.jpg/960px-Golgappa_Pani_Puri_India.jpg"
  },
  "desserts": {
    "cheesecake": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Baked_cheesecake_with_raspberries_and_blueberries.jpg/960px-Baked_cheesecake_with_raspberries_and_blueberries.jpg",
    "macaron": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/VanillaMacaron.jpg/960px-VanillaMacaron.jpg"
  },
  "banners": {
    "gujarati-banner": "https://upload.wikimedia.org/wikipedia/commons/4/49/Vegetarian_Curry.jpeg",
    "punjabi-banner": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Butter_Chicken_%26_Butter_Naan_-_Home_-_Chandigarh_-_India_-_0006.jpg/960px-Butter_Chicken_%26_Butter_Naan_-_Home_-_Chandigarh_-_India_-_0006.jpg",
    "cafe-banner": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Cappuccino_in_original.jpg/960px-Cappuccino_in_original.jpg",
    "pizza-banner": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Pizza_Margherita_stu_spivack.jpg/960px-Pizza_Margherita_stu_spivack.jpg",
    "south-indian-banner": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Rameshwaram_Cafe_Dosa.jpg/960px-Rameshwaram_Cafe_Dosa.jpg",
    "north-indian-banner": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Rajma_Masala_%2832081557778%29.jpg/960px-Rajma_Masala_%2832081557778%29.jpg",
    "chinese-banner": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Koh_Mak%2C_Thailand%2C_Fried_rice_with_seafood%2C_Thai_fried_rice.jpg/960px-Koh_Mak%2C_Thailand%2C_Fried_rice_with_seafood%2C_Thai_fried_rice.jpg",
    "burgers-banner": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/RedDot_Burger.jpg/960px-RedDot_Burger.jpg",
    "street-food-banner": "https://upload.wikimedia.org/wikipedia/commons/4/4a/Bambayya_Pav_bhaji.jpg",
    "desserts-banner": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Baked_cheesecake_with_raspberries_and_blueberries.jpg/960px-Baked_cheesecake_with_raspberries_and_blueberries.jpg"
  }
};

const downloadImage = (url) => new Promise((resolve, reject) => {
  https.get(url, { headers: { 'User-Agent': 'FoodFlowBuilder/1.0 (admin@foodflow.local)' } }, (res) => {
    if (res.statusCode !== 200) {
      if(res.statusCode === 301 || res.statusCode === 302) {
         return downloadImage(res.headers.location).then(resolve).catch(reject);
      }
      return reject(new Error(`Status Code: ${res.statusCode} for ${url}`));
    }
    const data = [];
    res.on('data', chunk => data.push(chunk));
    res.on('end', () => resolve(Buffer.concat(data)));
  }).on('error', reject);
});

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function run() {
  for (const [folder, items] of Object.entries(IMAGE_DATA)) {
    const dir = path.join(__dirname, 'public', 'images', folder === 'banners' ? 'banners' : `menu/${folder}`);
    fs.mkdirSync(dir, { recursive: true });
    
    for (const [name, url] of Object.entries(items)) {
      const filePath = path.join(dir, `${name}.webp`);
      if (fs.existsSync(filePath)) {
        console.log(`Skipping ${name}`);
        continue;
      }
      try {
        console.log(`Downloading ${name}...`);
        const buffer = await downloadImage(url);
        let s = sharp(buffer);
        if(folder === 'banners') {
           s = s.resize(1200, 400, {fit: 'cover'});
        } else {
           s = s.resize(800, 800, {fit: 'cover'});
        }
        await s.webp({ quality: 80 }).toFile(path.join(dir, `${name}.webp`));
        console.log(`Saved ${dir}/${name}.webp`);
        } catch (e) {
          console.error('Failed ' + name + ': ' + e.message);
        }
        await sleep(4000);
      }
    }
  }

run();
