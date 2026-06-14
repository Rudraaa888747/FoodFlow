import { io } from 'socket.io-client';
import fs from 'fs';
import path from 'path';

const SERVER_URL = 'http://localhost:5173';

const runTests = async () => {
  console.log('--- STARTING SECURITY TESTS ---');
  let token = null;

  // TEST 1: Auth & Bcrypt Check
  const testEmail = `test_${Date.now()}@example.com`;
  const testPassword = 'securepassword123';
  
  await new Promise((resolve) => {
    const socket = io(SERVER_URL);
    socket.on('connect', () => {
      console.log('1. Connected to server for Registration.');
      socket.emit('register', { name: 'Test User', email: testEmail, password: testPassword }, (res) => {
        console.log('Registration Response:', res.success ? 'SUCCESS' : 'FAILED');
        token = res.token;
        socket.disconnect();
        resolve();
      });
    });
  });

  await new Promise(r => setTimeout(r, 1000));
  const dbPath = path.join(process.cwd(), 'server', 'db.json');
  const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  const savedUser = dbData.users.find(u => u.email === testEmail);
  console.log('2. Password in DB:', savedUser.password.startsWith('$2a$') || savedUser.password.startsWith('$2b$') ? 'BCRYPT HASH VERIFIED' : 'FAILED (Plaintext)');
  console.log('2.1 Initial Wallet Balance:', savedUser.walletBalance === 0 ? 'CORRECT (0)' : `FAILED (${savedUser.walletBalance})`);

  // Login Test
  await new Promise((resolve) => {
    const socket = io(SERVER_URL);
    socket.on('connect', () => {
      console.log('3. Connecting for Login...');
      socket.emit('login', { email: testEmail, password: testPassword }, (res) => {
        console.log('Login Response:', res.success ? 'SUCCESS' : 'FAILED');
        socket.disconnect();
        resolve();
      });
    });
  });

  // TEST 2 & 3: Wallet 0 and Tampering Test
  await new Promise((resolve) => {
    const socket = io(SERVER_URL, { auth: { token } });
    socket.on('connect', () => {
      console.log('4. Connecting as authenticated user for ordering...');
      
      const fakeOrder = {
        restaurantId: 'rest-2',
        restaurantName: 'Punjab Da Dhaba',
        items: [
          {
            originalId: 'r2-i1', // Paneer Butter Masala (real price: 299)
            name: 'Paneer Butter Masala',
            price: 1, // MALICIOUS PRICE!
            quantity: 1,
          }
        ],
        discount: 0,
        tip: 0,
        paymentMethod: 'wallet'
      };

      socket.emit('placeOrder', fakeOrder, (res) => {
        console.log('Place Order with Wallet 0 & Fake Price Response:', res);
        
        if (!res.success && res.error.includes('Insufficient funds')) {
          console.log('TEST PASSED: Wallet correctly rejected the order due to insufficient funds.');
        } else {
          console.log('TEST FAILED: Order was not rejected properly.');
        }
        
        socket.disconnect();
        resolve();
      });
    });
  });

  console.log('--- SECURITY TESTS COMPLETE ---');
  process.exit(0);
};

runTests();
