const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const Millet = require('./models/Millet');
const HealthMapping = require('./models/HealthMapping');
const User = require('./models/User');
const Expert = require('./models/Expert');
const Recipe = require('./models/Recipe');
const connectDB = require('./config/db');

dotenv.config();

const milletsData = [
  {
    name: "Finger Millet",
    localNames: ["Ragi", "Mandua", "Kezhvaragu", "Ragulu"],
    description: "Known for its high calcium and iron content. Ideal for bone health and anemia.",
    nutrients: { protein: 7.3, fiber: 11.18, iron: 3.9, calcium: 344, gi: 54, gl: 15, carbs: 72, calories: 336 },
    conditions: ["diabetes", "anemia"],
    states: ["Karnataka", "Tamil Nadu", "Uttarakhand"],
    season: "Aug-Oct",
    forms: ["porridge", "flour", "whole grain", "sprouts", "flakes"],
    benefits: ["Bone health", "Anti-aging", "Diabetic friendly"],
    cautions: ["High intake may not suit kidney stone patients due to oxalates"]
  },
  {
    name: "Pearl Millet",
    localNames: ["Bajra", "Sajjalu", "Kambu"],
    description: "Rich in iron, magnesium, and resistant starch. Good for hypertension.",
    nutrients: { protein: 11.6, fiber: 1.2, iron: 8.0, calcium: 42, gi: 55, gl: 13, carbs: 67, calories: 361 },
    conditions: ["hypertension", "diabetes"],
    states: ["Rajasthan", "Gujarat", "Maharashtra", "Karnataka"],
    season: "Sep-Nov",
    forms: ["flour", "whole grain", "flakes"],
    benefits: ["Heart health", "Relieves constipation", "Energy booster"],
    cautions: []
  },
  {
    name: "Foxtail Millet",
    localNames: ["Kangni", "Thinai", "Korralu"],
    description: "High in protein and fiber, lowest in glycemic index among major millets.",
    nutrients: { protein: 12.3, fiber: 8, iron: 2.8, calcium: 31, gi: 50.5, gl: 11, carbs: 60, calories: 331 },
    conditions: ["diabetes", "pcod"],
    states: ["Andhra Pradesh", "Karnataka", "Tamil Nadu"],
    season: "Sep-Dec",
    forms: ["whole grain", "flour"],
    benefits: ["Regulates blood sugar", "Hormonal balance", "Nervous system health"],
    cautions: []
  },
  {
    name: "Sorghum",
    localNames: ["Jowar", "Cholam", "Jonna"],
    description: "Globally popular gluten-free grain, excellent source of antioxidants.",
    nutrients: { protein: 10.4, fiber: 1.6, iron: 4.1, calcium: 25, gi: 62, gl: 14, carbs: 70, calories: 349 },
    conditions: ["pcod", "hypertension", "thyroid"],
    states: ["Maharashtra", "Karnataka", "Rajasthan", "Gujarat"],
    season: "Oct-Dec",
    forms: ["flour", "flakes", "whole grain"],
    benefits: ["Digestive health", "Immunity", "Gluten-free"],
    cautions: ["Consume in moderation for thyroid issues"]
  },
  {
    name: "Barnyard Millet",
    localNames: ["Sanwa", "Kuthiraivali", "Oodalu"],
    description: "Extremely low calories and high in dietary fiber. Excellent for weight loss.",
    nutrients: { protein: 6.2, fiber: 9.8, iron: 5.0, calcium: 20, gi: 41, gl: 8, carbs: 65, calories: 307 },
    conditions: ["obesity", "diabetes"],
    states: ["Uttarakhand", "Tamil Nadu"],
    season: "Sep-Nov",
    forms: ["whole grain", "flour"],
    benefits: ["Weight management", "Low calorie", "Low GI"],
    cautions: []
  },
  {
    name: "Little Millet",
    localNames: ["Kutki", "Samai", "Saamai"],
    description: "Rich in B-vitamins and minerals. Has a smaller grain size and cooks fast.",
    nutrients: { protein: 9.7, fiber: 7.6, iron: 9.3, calcium: 17, gi: 52, gl: 10, carbs: 60, calories: 329 },
    conditions: ["diabetes", "obesity"],
    states: ["Madhya Pradesh", "Bihar", "Tamil Nadu"],
    season: "Aug-Oct",
    forms: ["whole grain", "flakes"],
    benefits: ["Detoxification", "Thyroid health", "Rapid digestion"],
    cautions: []
  },
  {
    name: "Kodo Millet",
    localNames: ["Kodon", "Varagu", "Arikelu"],
    description: "High in antioxidants and polyphenols. Helps managing blood sugar and joint pains.",
    nutrients: { protein: 8.3, fiber: 9.0, iron: 0.5, calcium: 27, gi: 49, gl: 9, carbs: 65, calories: 353 },
    conditions: ["diabetes", "joint pain"],
    states: ["Madhya Pradesh", "Andhra Pradesh", "Bihar"],
    season: "Oct-Nov",
    forms: ["whole grain"],
    benefits: ["Heals wounds", "Blood purifier", "Anti-diabetic"],
    cautions: []
  },
  {
    name: "Browntop Millet",
    localNames: ["Korale", "Andu Korralu"],
    description: "Desiccative properties, high in iron, handles arid weather. Rarest among millets.",
    nutrients: { protein: 11.5, fiber: 12.5, iron: 7.7, calcium: 28, gi: 48, gl: 10, carbs: 71, calories: 338 },
    conditions: ["anemia", "diabetes"],
    states: ["Karnataka", "Andhra Pradesh"],
    season: "Aug-Oct",
    forms: ["whole grain"],
    benefits: ["Resolves GI issues", "Rich in iron", "Gluten free"],
    cautions: []
  }
];

const healthMappingsData = [
  {
    condition: "diabetes",
    recommendedMillets: ["finger millet", "foxtail millet", "little millet"],
    avoidMillets: ["white rice", "refined wheat"],
    quantityGuidelines: { light: "40-50g/day", moderate: "60-80g/day", intensive: "80-100g/day" },
    forms: ["porridge", "whole grain"],
    timing: { morning: true, afternoon: true, evening: false },
    rationale: "Low Glycemic Index (GI 50-54) prevents sudden sugar spikes. High fiber delays digestion.",
    relatedLabValues: ["fastingBloodSugar", "postprandialSugar"]
  },
  {
    condition: "anemia",
    recommendedMillets: ["finger millet", "browntop millet"],
    avoidMillets: [],
    quantityGuidelines: { light: "50g/day", moderate: "80g/day", intensive: "100g/day" },
    forms: ["sprouts", "porridge"],
    timing: { morning: true, afternoon: false, evening: false },
    rationale: "Finger millet has highest iron content (3.9mg/100g). Sprouting increases bioavailability of iron.",
    relatedLabValues: ["hemoglobin"]
  },
  {
    condition: "obesity",
    recommendedMillets: ["barnyard millet", "little millet"],
    avoidMillets: ["finger millet (excess)"],
    quantityGuidelines: { light: "40g/day", moderate: "60g/day", intensive: "80g/day" },
    forms: ["whole grain"],
    timing: { morning: false, afternoon: true, evening: true },
    rationale: "Barnyard millet has the lowest calories (307 kcal/100g) and provides high satiety to prevent overeating.",
    relatedLabValues: []
  },
  {
    condition: "pcod",
    recommendedMillets: ["foxtail millet", "sorghum"],
    avoidMillets: ["maida", "sugar"],
    quantityGuidelines: { light: "40g/day", moderate: "60g/day", intensive: "80g/day" },
    forms: ["whole grain", "flour"],
    timing: { morning: true, afternoon: true, evening: false },
    rationale: "Helps regulate insulin resistance, which is at the root of PCOD, balancing hormones effectively.",
    relatedLabValues: []
  },
  {
    condition: "hypertension",
    recommendedMillets: ["pearl millet", "sorghum"],
    avoidMillets: [],
    quantityGuidelines: { light: "50g/day", moderate: "70g/day", intensive: "100g/day" },
    forms: ["flour", "porridge"],
    timing: { morning: true, afternoon: true, evening: false },
    rationale: "Rich in magnesium which helps relax blood vessels and lower blood pressure.",
    relatedLabValues: []
  },
  {
    condition: "celiac",
    recommendedMillets: ["foxtail millet", "barnyard millet", "sorghum", "finger millet"],
    avoidMillets: ["wheat", "barley", "rye"],
    quantityGuidelines: { light: "60g/day", moderate: "100g/day", intensive: "150g/day" },
    forms: ["flour", "flakes", "whole grain"],
    timing: { morning: true, afternoon: true, evening: true },
    rationale: "All millets are naturally gluten-free and prevent autoimmune reactions in celiac sprue.",
    relatedLabValues: []
  },
  {
    condition: "thyroid",
    recommendedMillets: ["sorghum", "finger millet"],
    avoidMillets: ["pearl millet (excess)"],
    quantityGuidelines: { light: "40g/day", moderate: "50g/day", intensive: "60g/day" },
    forms: ["whole grain"],
    timing: { morning: false, afternoon: true, evening: false },
    rationale: "Sorghum can be consumed in moderation while avoiding pearl millet which may be slightly goitrogenic.",
    relatedLabValues: []
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();
    
    // Clear existing
    await Millet.deleteMany();
    await HealthMapping.deleteMany();
    await User.deleteMany();
    await Expert.deleteMany();
    await Recipe.deleteMany();
    
    // Seed Millets
    await Millet.insertMany(milletsData);
    
    // Seed HealthMappings
    await HealthMapping.insertMany(healthMappingsData);
    
    // Seed Admin
    const salt = await bcrypt.genSalt(12);
    const adminPassword = await bcrypt.hash('Admin@1234', salt);
    await User.create({
      name: "Super Admin",
      email: "admin@milletverse.com",
      password: adminPassword,
      role: "admin",
      onboardingComplete: true
    });
    
    // Seed Experts
    const expertPassword = await bcrypt.hash('Expert@1234', salt);
    const expert1 = await Expert.create({
      name: "Dr. Anjali Desai",
      email: "anjali@milletverse.com",
      password: expertPassword,
      credentials: "PhD Nutrition, RD",
      specialty: "Diabetic Diet Management",
      bio: "15 years experience integrating traditional grains into clinical nutrition.",
      approvedStatus: true
    });
    
    const expert2 = await Expert.create({
      name: "Chef Rohan Das",
      email: "rohan@milletverse.com",
      password: expertPassword,
      credentials: "Culinary Institute of India Graduate",
      specialty: "Organic & Millet Baking",
      bio: "Developing innovative and delicious ways to eat healthy ancient grains.",
      approvedStatus: true
    });

    const expert3 = await Expert.create({
      name: "Dr. Sanjay Gupta",
      email: "sanjay@milletverse.com",
      password: expertPassword,
      credentials: "MD Endocrinology",
      specialty: "Metabolic Syndrome Reversal",
      bio: "Focusing on preventive healthcare using dietary interventions.",
      approvedStatus: true
    });

    // Seed Recipes
    await Recipe.create([
      {
        title: "Ragi Dosa",
        milletType: "Finger Millet",
        ingredients: [
          { name: "Ragi flour", quantity: "1 cup" },
          { name: "Rice flour", quantity: "1/4 cup" },
          { name: "Water", quantity: "2 cups" }
        ],
        steps: ["Mix flours and salt.", "Add water slowly to form thin batter.", "Pour on hot griddle."],
        tags: ["Breakfast", "Gluten-Free"],
        cookTime: 15,
        difficulty: "easy",
        healthLabels: ["diabetes-friendly", "iron-rich", "gluten-free"],
        nutritionalBreakdown: { calories: 150, protein: 4, carbs: 32, fiber: 5, iron: 1.5 },
        createdBy: expert1._id,
        creatorModel: 'Expert',
        isExpertRecipe: true,
        approvedStatus: true,
        preparationNotes: "Ferment for 2 hours for best crunch."
      },
      {
        title: "Foxtail Millet Pulao",
        milletType: "Foxtail Millet",
        ingredients: [
          { name: "Foxtail millet", quantity: "1 cup" },
          { name: "Mixed veggies", quantity: "1 cup" },
          { name: "Spices", quantity: "to taste" }
        ],
        steps: ["Wash and soak millet for 30 min.", "Sauté veggies and spices.", "Add millet and 2 cups water, cook till fluffy."],
        tags: ["Lunch", "Vegan"],
        cookTime: 25,
        difficulty: "medium",
        healthLabels: ["pcod-friendly", "weight-management", "gluten-free"],
        nutritionalBreakdown: { calories: 210, protein: 6, carbs: 40, fiber: 8, iron: 1.2 },
        createdBy: expert2._id,
        creatorModel: 'Expert',
        isExpertRecipe: true,
        approvedStatus: true,
        preparationNotes: "Do not overcook to avoid mushiness."
      }
    ]);

    console.log('Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error with data import: ${error}`);
    process.exit(1);
  }
};

seedDatabase();
