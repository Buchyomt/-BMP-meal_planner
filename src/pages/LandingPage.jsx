import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart2, 
  ShoppingBag, 
  Calendar, 
  ArrowRight, 
  CheckCircle, 
  Zap, 
  Shield, 
  Heart,
  ChevronDown,
  Layout,
  Target,
  Users,
  Award,
  Sparkles,
  LogIn,
  UserPlus
} from 'lucide-react';
import './LandingPage.css';

// Importing assets
import heroImg from '../assets/images/hero.png';
import mealEgusi from '../assets/images/meal_egusi.png';
import mealAkara from '../assets/images/meal_akara.png';
import mealBeans from '../assets/images/meal_beans.png';
import stepShopping from '../assets/images/step_shopping.png';
import stepMealPlan from '../assets/images/step_mealplan.png';

const LandingPage = () => {
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isYearly, setIsYearly] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Savings Calculator State
  const [householdSize, setHouseholdSize] = useState(4);
  const [currentSpend, setCurrentSpend] = useState(80000); // ₦80k default

  useEffect(() => {
    const loggedIn = localStorage.getItem('bmp_isLoggedIn') === 'true';
    let user = null;
    try {
      const storedUser = localStorage.getItem('bmp_currentUser');
      user = storedUser ? JSON.parse(storedUser) : null;
    } catch (e) {
      console.warn('Error parsing user from localStorage', e);
    }
    setIsLoggedIn(loggedIn);
    setCurrentUser(user);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('bmp_isLoggedIn');
    localStorage.removeItem('bmp_currentUser');
    setIsLoggedIn(false);
    setCurrentUser(null);
  };

  const calculateSavings = () => {
    const savingsRate = 0.25; // Estimate 25% savings with BMP
    return Math.round(currentSpend * savingsRate).toLocaleString();
  };

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const featureCards = [
    {
      icon: <Zap className="feat-icon" style={{color: '#10B981'}} />,
      title: "AI Meal Generation",
      description: "Our AI creates personalized weekly meal plans based on your budget, dietary preferences, and household size."
    },
    {
      icon: <Target className="feat-icon" style={{color: '#3B82F6'}} />,
      title: "Budget Tracking in ₦",
      description: "Set your weekly or monthly budget in Naira and watch your spending in real-time. Get alerts when you are close."
    },
    {
      icon: <ShoppingBag className="feat-icon" style={{color: '#F59E0B'}} />,
      title: "Smart Shopping Lists",
      description: "Auto-generated shopping lists organized by category with local market prices. Check off items as you go."
    },
    {
      icon: <Heart className="feat-icon" style={{color: '#EF4444'}} />,
      title: "Nutrition Insights",
      description: "Get detailed breakdowns of your caloric and macronutrient intake to stay healthy while saving money."
    },
    {
      icon: <Layout className="feat-icon" style={{color: '#8B5CF6'}} />,
      title: "Recipe Database",
      description: "Access a library of authentic Nigerian recipes with step-by-step instructions and ingredient lists."
    },
    {
      icon: <Users className="feat-icon" style={{color: '#EC4899'}} />,
      title: "Family Profiles",
      description: "Manage multiple household members with different dietary needs and preferences all in one place."
    }
  ];

  const mealFavorites = [
    { name: "Jollof Rice & Fish", price: "₦1,200", img: heroImg, tags: ["Protein", "Carbs", "Vitamins"] },
    { name: "Egusi Soup & Fufu", price: "₦1,800", img: mealEgusi, tags: ["Protein", "Fats", "Vitamins"] },
    { name: "Akara & Pap", price: "₦850", img: mealAkara, tags: ["Protein", "Carbs", "Fiber"] },
    { name: "Beans & Plantain", price: "₦1,000", img: mealBeans, tags: ["Protein", "Fiber", "Carbs"] }
  ];

  return (
    <div className="landing-container">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="nav-logo">
          <div className="logo-box">
            <Zap size={20} fill="white" />
          </div>
          <span>BMP</span>
        </div>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#pricing">Pricing</a>
          <a href="#testimonials">Testimonials</a>
        </div>
        <div className="nav-actions">
          <button className="btn-login" onClick={() => navigate('/login')}>Log In</button>
          <button className="btn-get-started" onClick={() => navigate('/signup')}>Get Started Free</button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero-wrapper">
        <div className="hero-content">
          <div className="ai-badge">
            <Zap size={14} /> <span>AI-Powered Meal Planning</span>
          </div>
          <h1>Eat Well on a <span className="green">Budget</span> in Nigeria</h1>
          <p>
            Plan nutritious, delicious Nigerian meals that fit your budget. 
            Our AI generates personalized weekly meal plans, shopping lists, and tracks your spending — all in Naira.
          </p>
          <div className="hero-btns">
            <button className="btn-main" onClick={() => navigate('/signup')}>
              Start Planning for Free <ArrowRight size={18} />
            </button>
            <button className="btn-outline">Watch Demo</button>
          </div>
          <div className="hero-social-proof">
            <div className="proof-item">
              <span>12,000+</span>
              <span>Nigerian families</span>
            </div>
            <div className="proof-item">
              <span>4.9/5</span>
              <span>Rating</span>
            </div>
            <div className="proof-item">
              <span>₦8,500</span>
              <span>avg. saved/week</span>
            </div>
          </div>
        </div>
        
        <div className="hero-visual">
          <div className="hero-img-container">
            <img src={heroImg} alt="Delicious Nigerian Jollof" />
            <div className="floating-card card-budget">
              <span className="label">Today's Budget</span>
              <span className="value">₦2,850</span>
            </div>
            <div className="floating-card card-meals">
              <span className="label">Meals Planned</span>
              <span className="value">21 this week</span>
            </div>
          </div>
        </div>
      </header>

      {/* Trusted Section */}
      <section className="trusted-section">
        <h3>Trusted by families across Nigeria</h3>
        <div className="trusted-logos">
          <span><Users size={18} /> Lagos Families</span>
          <span><Award size={18} /> University Students</span>
          <span><Heart size={18} /> Health Coaches</span>
          <span><Shield size={18} /> Working Professionals</span>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="section-wrapper">
        <div className="centered-head">
          <span className="section-badge">Features</span>
          <h2>Everything You Need to Eat Smart</h2>
          <p>From AI-generated meal plans to automated shopping lists, BMP handles the hard work so you can focus on enjoying great food.</p>
        </div>
        <div className="feature-grid">
          {featureCards.map((feat, i) => (
            <div key={i} className="feature-card">
              <div className="icon-wrapper">
                {feat.icon}
              </div>
              <h3>{feat.title}</h3>
              <p>{feat.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Savings Estimator */}
      <section className="section-wrapper savings-section">
        <div className="calculator-container">
          <div className="calc-content">
            <span className="section-badge">Calculator</span>
            <h2>Estimate Your Monthly Savings</h2>
            <p>Nigerian households save an average of 25% on food costs using BMP's bulk-buy and meal planning tools.</p>
            
            <div className="calculator-controls">
              <div className="control-group">
                <label>Household Size: <strong>{householdSize} People</strong></label>
                <input 
                  type="range" 
                  min="1" 
                  max="12" 
                  value={householdSize} 
                  onChange={(e) => setHouseholdSize(parseInt(e.target.value))} 
                />
              </div>
              <div className="control-group">
                <label>Weekly Food Spend: <strong>₦{currentSpend.toLocaleString()}</strong></label>
                <input 
                  type="range" 
                  min="10000" 
                  max="250000" 
                  step="5000" 
                  value={currentSpend} 
                  onChange={(e) => setCurrentSpend(parseInt(e.target.value))} 
                />
              </div>
            </div>
          </div>
          
          <div className="calc-result-card">
            <div className="result-header">Potential Monthly Savings</div>
            <div className="result-value">₦{calculateSavings()}</div>
            <p>That's ₦{(parseInt(calculateSavings().replace(/,/g, '')) * 12).toLocaleString()} per year!</p>
            <div className="result-bar">
              <div className="result-progress" style={{ width: '25%' }}></div>
            </div>
            <button className="btn-main full-width" onClick={() => navigate('/signup')}>
              Start Saving Now
            </button>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="section-wrapper" style={{background: '#F9FAFB'}}>
        <div className="centered-head">
          <span className="section-badge">How It Works</span>
          <h2>Three Steps to Smarter Meals</h2>
          <p>Get started in minutes. Our AI does the heavy lifting so you can enjoy delicious, affordable meals every day.</p>
        </div>
        <div className="steps-grid">
          <div className="step-item">
            <div className="step-number">1</div>
            <h3>Set Your Budget</h3>
            <p>Enter your weekly or monthly food budget in Naira. Choose from presets or customize for your household size.</p>
            <div className="step-img">
              <img src={stepShopping} alt="Shopping" />
            </div>
          </div>
          <div className="step-item">
            <div className="step-number">2</div>
            <h3>Get Your Meal Plan</h3>
            <p>Our AI generates a complete weekly plan with breakfast, lunch, dinner, and snacks — all featuring authentic dishes you love.</p>
            <div className="step-img">
              <img src={stepMealPlan} alt="Meal Plan" />
            </div>
          </div>
          <div className="step-item">
            <div className="step-number">3</div>
            <h3>Shop & Cook</h3>
            <p>Use your auto-generated shopping list at the market, follow easy recipes, and enjoy nutritious meals within budget.</p>
            <div className="step-img">
              <img src={mealBeans} alt="Shop & Cook" />
            </div>
          </div>
        </div>
      </section>

      {/* Nigerian Favorites */}
      <section className="section-wrapper">
        <div className="centered-head">
          <span className="section-badge">Nigerian Favorites</span>
          <h2>Meals Your Family Will Love</h2>
          <p>From Jollof Rice to Egusi Soup, our AI plans meals using the dishes you already know and love — at prices that make sense.</p>
        </div>
        <div className="meals-grid">
          {mealFavorites.map((meal, i) => (
            <div key={i} className="meal-card">
              <span className="price-tag">{meal.price}</span>
              <div className="meal-img-box">
                <img src={meal.img} alt={meal.name} />
              </div>
              <div className="meal-info">
                <h4>{meal.name}</h4>
                <p>Authentic Nigerian dish optimized for your budget.</p>
                <div className="tag-list">
                  {meal.tags.map((tag, j) => <span key={j}>{tag}</span>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="section-wrapper">
        <div className="centered-head">
          <h2>A Plan for Every Household</h2>
          <p>Simple, transparent pricing to help you save more on every meal.</p>
          
          <div className="pricing-toggle">
            <span className={!isYearly ? 'active' : ''}>Monthly</span>
            <div className={`toggle-switch ${isYearly ? 'yearly' : ''}`} onClick={() => setIsYearly(!isYearly)}>
              <div className="toggle-knob"></div>
            </div>
            <span className={isYearly ? 'active' : ''}>Annually <span className="save-badge">Save 20%</span></span>
          </div>
        </div>
        <div className="pricing-grid">
          <div className="price-card">
            <h4 className="price-tier">Free</h4>
            <div className="price-value">₦0<span>/mo</span></div>
            <p className="price-desc">Perfect for trying out automated meal planning.</p>
            <ul className="price-features">
              <li><CheckCircle size={16} /> 1 AI Meal Plan / week</li>
              <li><CheckCircle size={16} /> Basic Shopping Lists</li>
              <li><CheckCircle size={16} /> Recipe Database access</li>
              <li><CheckCircle size={16} /> Manual Budget Tracking</li>
            </ul>
            <button className="btn-price">Current Plan</button>
          </div>
          <div className="price-card featured">
            <div className="popular-badge">Most Popular</div>
            <h4 className="price-tier">Pro</h4>
            <div className="price-value">
              {isYearly ? `₦${(2500 * 0.8 * 12).toLocaleString()}` : '₦2,500'}
              <span>/{isYearly ? 'yr' : 'mo'}</span>
            </div>
            <p className="price-desc">Complete automation for power users and planners.</p>
            <ul className="price-features">
              <li><CheckCircle size={16} /> Unlimited AI Meal Plans</li>
              <li><CheckCircle size={16} /> Automated Price Tracking</li>
              <li><CheckCircle size={16} /> Nutritional Insights</li>
              <li><CheckCircle size={16} /> PDF Shopping List Export</li>
              <li><CheckCircle size={16} /> Advanced Filter Toggles</li>
            </ul>
            <button className="btn-price" onClick={() => navigate('/signup')}>Start Pro Trial</button>
          </div>
          <div className="price-card">
            <h4 className="price-tier">Family</h4>
            <div className="price-value">
              {isYearly ? `₦${(5000 * 0.8 * 12).toLocaleString()}` : '₦5,000'}
              <span>/{isYearly ? 'yr' : 'mo'}</span>
            </div>
            <p className="price-desc">The ultimate solution for large households.</p>
            <ul className="price-features">
              <li><CheckCircle size={16} /> Everything in Pro</li>
              <li><CheckCircle size={16} /> Up to 5 Shared Accounts</li>
              <li><CheckCircle size={16} /> Multi-Market Comparison</li>
              <li><CheckCircle size={16} /> Bulk Buy Optimization</li>
              <li><Sparkles size={16} /> Priority Support</li>
            </ul>
            <button className="btn-price" onClick={() => navigate('/signup')}>Upgrade Family</button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="section-wrapper" style={{background: '#ffffff'}}>
        <div className="centered-head">
          <span className="section-badge">Testimonials</span>
          <h2>Trusted by Thousands of Families</h2>
          <p>Join over 12,000 Nigerians already saving money and eating better with BMP.</p>
        </div>
        <div className="testimonials-grid">
          {[
            {
              text: "BMP helped me save ₦15,000 last month on my grocery shopping. The AI-generated lists are amazingly accurate!",
              name: "Chioma Okoro",
              role: "Mother of 3, Lagos",
              initials: "CO"
            },
            {
              text: "As a university student, I struggled to manage my allowance. Now I eat better and never run out of food money.",
              name: "Tunde Yusuf",
              role: "Student, Ibadan",
              initials: "TY"
            },
            {
              text: "I love the nutritional insights! I can finally track my macros while still enjoying our authentic Nigerian dishes.",
              name: "Amaka Eze",
              role: "Fitness Coach, Abuja",
              initials: "AE"
            }
          ].map((item, i) => (
            <div key={i} className="testimonial-card">
              <p className="testimonial-text">"{item.text}"</p>
              <div className="testimonial-user">
                <div className="user-avatar">{item.initials}</div>
                <div className="user-info">
                  <h5>{item.name}</h5>
                  <span>{item.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-wrapper" style={{background: '#F9FAFB'}}>
        <div className="centered-head">
          <span className="section-badge">FAQ</span>
          <h2>Frequently Asked Questions</h2>
        </div>
        <div className="faq-container">
          {[
            {
              q: "Is BMP really free to start?",
              a: "Yes! Our Free plan gives you 1 meal plan per week, basic shopping lists, and budget tracking at no cost. Upgrade anytime for more features."
            },
            {
              q: "Does BMP use real Nigerian market prices?",
              a: "Yes, we regularly update our price database with current market prices from major Nigerian cities including Lagos, Abuja, Port Harcourt, and more."
            },
            {
              q: "Can I customize meals for dietary restrictions?",
              a: "Absolutely! BMP supports dietary preferences including High-Protein, Vegan, Low-Carb, and Traditional Nigerian diets. You can also set specific allergies."
            },
            {
              q: "How does the AI generate meal plans?",
              a: "Our AI considers your budget, household size, dietary preferences, and nutritional needs to create balanced meal plans using authentic Nigerian recipes."
            }
          ].map((item, i) => (
            <div key={i} className="faq-item">
              <div className="faq-question" onClick={() => toggleFaq(i)}>
                {item.q}
                <ChevronDown size={20} style={{transform: activeFaq === i ? 'rotate(180deg)' : 'none', transition: '0.3s'}} />
              </div>
              {activeFaq === i && <div className="faq-answer">{item.a}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* Final Call to Action Section */}
      <section id="auth" className="conversion-section">
        <div className="conversion-inner">
          {isLoggedIn ? (
            <div className="welcome-back-card">
              <div className="avatar-circle">
                {currentUser?.name?.charAt(0) || 'U'}
              </div>
              <h2>Welcome Back, {currentUser?.name?.split(' ')[0] || 'User'}!</h2>
              <p>You're logged in. Ready to check your budget or generate a new meal plan?</p>
              <div className="welcome-btns">
                <button className="btn-main lg" onClick={() => navigate('/login')}>
                  Log In to BMP
                </button>
                <button className="btn-outline lg" onClick={() => navigate('/signup')}>Create Free Account</button>
              </div>
              <button 
                className="btn-text-link" 
                style={{marginTop: '1.5rem'}} 
                onClick={handleLogout}
              >
                Not you? Log out
              </button>
            </div>
          ) : (
            <div className="auth-card-wrapper" style={{textAlign: 'center'}}>
              <div className="auth-header">
                <h2>Ready to Start Saving?</h2>
                <p>Join over 12,000 Nigerian families making the switch to smarter internal budget meal planning.</p>
              </div>

              <div className="conversion-btns" style={{marginTop: '2rem'}}>
                <button className="btn-main lg" onClick={() => navigate('/login')}>
                  <LogIn size={20} /> Log In
                </button>
                <button className="btn-outline lg" onClick={() => navigate('/signup')}>
                   <UserPlus size={20} /> Get Started Free
                </button>
              </div>
              <div className="no-card" style={{marginTop: '1.5rem'}}>No credit card required • Start in 60 seconds</div>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-main">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="nav-logo" style={{marginBottom: '1rem'}}>
              <div className="logo-box"><Zap size={18} fill="white" /></div>
              <span>BMP</span>
            </div>
            <p>Helping Nigerian families eat well on any budget with AI-powered meal planning.</p>
            <div className="social-icons">
              <a href="#"><Users size={20} /></a>
              <a href="#"><Heart size={20} /></a>
              <a href="#"><Shield size={20} /></a>
            </div>
          </div>
          <div className="footer-col">
            <h4>Product</h4>
            <ul>
              <li><a href="#">Features</a></li>
              <li><a href="#">Pricing</a></li>
              <li><a href="#">Recipes</a></li>
              <li><a href="#">Mobile App</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <ul>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Support</h4>
            <ul>
              <li><a href="#">Help Center</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Community</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Budget Meal Planner. All rights reserved.</p>
          <p>Made with ❤️ in Nigeria</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

