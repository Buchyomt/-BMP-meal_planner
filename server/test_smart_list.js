import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API_URL = 'http://localhost:5000/api';
let token = '';

// Helper to log in and get token
async function login() {
  try {
    console.log('🔑 Attempting login...');
    // Replace with a valid user in your DB or use a test one
    const res = await axios.post(`${API_URL}/auth/login`, {
      email: 'testuser@example.com',
      password: 'password123'
    });
    token = res.data.token;
    console.log('✅ Logged in successfully!');
  } catch (error) {
    console.log('❌ Login failed. Trying signup...');
    try {
      const res = await axios.post(`${API_URL}/auth/signup`, {
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'password123'
      });
      token = res.data.token;
      console.log('✅ Registered and logged in!');
    } catch (regError) {
      console.error('❌ Authentication failed completely:', regError.response?.data || regError.message);
      process.exit(1);
    }
  }
}

async function runTest() {
  await login();

  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  try {
    // 1. Add "Rice" to Pantry
    console.log('🌾 Adding "Rice" to Pantry...');
    await axios.post(`${API_URL}/pantry`, {
      name: 'Rice',
      quantity: '2',
      unit: 'kg'
    }, authHeader);

    // 2. Add a Meal Plan for tomorrow that needs "Rice" and "Chicken"
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    console.log('📅 Adding "Chicken and Rice" Meal Plan...');
    await axios.post(`${API_URL}/meals`, {
      date: tomorrow,
      mealType: 'dinner',
      recipeName: 'Chicken and Rice',
      recipeId: null, // Custom recipe simulation
      image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=500'
    }, authHeader);

    // 3. Create a Custom Recipe for "Chicken and Rice"
    console.log('🍲 Creating Recipe definition...');
    await axios.post(`${API_URL}/recipes`, {
      title: 'Chicken and Rice',
      ingredients: ['1 lb Chicken Breast', '2 cups Rice', '1 Onion'],
      instructions: ['Cook chicken', 'Add rice']
    }, authHeader);

    // 4. TEST THE SMART GENERATOR
    console.log('\n🚀 TESTING SMART GENERATOR...');
    const res = await axios.get(`${API_URL}/shopping-list/generate`, authHeader);
    
    console.log('\n--- RESULTS ---');
    console.log('Message:', res.data.message);
    console.log('Suggested Items:');
    res.data.suggestions.forEach(item => {
      console.log(` - [ ] ${item.name}`);
    });
    
    console.log('\n✅ TEST COMPLETE');
    console.log('Note: "Rice" should NOT be in the suggestions because it was in the pantry!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

runTest();
