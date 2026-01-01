import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Comprehensive disease database with 100+ conditions
const DISEASE_DATABASE = [
  // Cardiovascular Diseases
  { id: 1, name: "Hypertension", category: "Cardiovascular", symptoms: ["Headache", "Shortness of breath", "Nosebleeds", "Chest pain", "Dizziness"], severity: "high", prevalence: "Very Common" },
  { id: 2, name: "Coronary Artery Disease", category: "Cardiovascular", symptoms: ["Chest pain", "Shortness of breath", "Fatigue", "Heart palpitations"], severity: "critical", prevalence: "Common" },
  { id: 3, name: "Heart Failure", category: "Cardiovascular", symptoms: ["Shortness of breath", "Fatigue", "Swelling in legs", "Rapid heartbeat", "Persistent cough"], severity: "critical", prevalence: "Common" },
  { id: 4, name: "Arrhythmia", category: "Cardiovascular", symptoms: ["Fluttering in chest", "Racing heartbeat", "Slow heartbeat", "Chest pain", "Dizziness"], severity: "high", prevalence: "Common" },
  { id: 5, name: "Stroke", category: "Cardiovascular", symptoms: ["Sudden numbness", "Confusion", "Trouble speaking", "Vision problems", "Severe headache"], severity: "critical", prevalence: "Common" },
  { id: 6, name: "Peripheral Artery Disease", category: "Cardiovascular", symptoms: ["Leg pain when walking", "Leg numbness", "Cold legs", "Slow healing sores"], severity: "high", prevalence: "Common" },
  { id: 7, name: "Deep Vein Thrombosis", category: "Cardiovascular", symptoms: ["Leg swelling", "Leg pain", "Red skin", "Warmth in leg"], severity: "high", prevalence: "Common" },
  { id: 8, name: "Atrial Fibrillation", category: "Cardiovascular", symptoms: ["Heart palpitations", "Fatigue", "Dizziness", "Shortness of breath", "Chest pain"], severity: "high", prevalence: "Common" },
  
  // Respiratory Diseases
  { id: 9, name: "Asthma", category: "Respiratory", symptoms: ["Wheezing", "Shortness of breath", "Chest tightness", "Coughing"], severity: "moderate", prevalence: "Very Common" },
  { id: 10, name: "COPD", category: "Respiratory", symptoms: ["Chronic cough", "Shortness of breath", "Wheezing", "Chest tightness", "Frequent respiratory infections"], severity: "high", prevalence: "Common" },
  { id: 11, name: "Pneumonia", category: "Respiratory", symptoms: ["Cough with phlegm", "Fever", "Chills", "Shortness of breath", "Chest pain"], severity: "high", prevalence: "Common" },
  { id: 12, name: "Bronchitis", category: "Respiratory", symptoms: ["Cough", "Mucus production", "Fatigue", "Shortness of breath", "Chest discomfort"], severity: "moderate", prevalence: "Very Common" },
  { id: 13, name: "Tuberculosis", category: "Respiratory", symptoms: ["Persistent cough", "Coughing blood", "Night sweats", "Fever", "Weight loss"], severity: "critical", prevalence: "Moderate" },
  { id: 14, name: "Pulmonary Fibrosis", category: "Respiratory", symptoms: ["Shortness of breath", "Dry cough", "Fatigue", "Weight loss", "Aching muscles"], severity: "high", prevalence: "Rare" },
  { id: 15, name: "Sleep Apnea", category: "Respiratory", symptoms: ["Loud snoring", "Gasping during sleep", "Morning headache", "Daytime sleepiness", "Difficulty concentrating"], severity: "moderate", prevalence: "Very Common" },
  
  // Metabolic Disorders
  { id: 16, name: "Type 2 Diabetes", category: "Metabolic", symptoms: ["Increased thirst", "Frequent urination", "Hunger", "Fatigue", "Blurred vision"], severity: "high", prevalence: "Very Common" },
  { id: 17, name: "Type 1 Diabetes", category: "Metabolic", symptoms: ["Extreme thirst", "Frequent urination", "Extreme hunger", "Weight loss", "Irritability"], severity: "high", prevalence: "Moderate" },
  { id: 18, name: "Hyperthyroidism", category: "Metabolic", symptoms: ["Weight loss", "Rapid heartbeat", "Nervousness", "Tremors", "Increased sweating"], severity: "moderate", prevalence: "Common" },
  { id: 19, name: "Hypothyroidism", category: "Metabolic", symptoms: ["Fatigue", "Weight gain", "Cold sensitivity", "Dry skin", "Depression"], severity: "moderate", prevalence: "Common" },
  { id: 20, name: "Obesity", category: "Metabolic", symptoms: ["Excess body fat", "Shortness of breath", "Increased sweating", "Joint pain", "Fatigue"], severity: "high", prevalence: "Very Common" },
  { id: 21, name: "Metabolic Syndrome", category: "Metabolic", symptoms: ["Large waist circumference", "High blood pressure", "High blood sugar", "High triglycerides"], severity: "high", prevalence: "Very Common" },
  
  // Neurological Disorders
  { id: 22, name: "Migraine", category: "Neurological", symptoms: ["Severe headache", "Nausea", "Light sensitivity", "Sound sensitivity", "Visual disturbances"], severity: "moderate", prevalence: "Very Common" },
  { id: 23, name: "Alzheimer's Disease", category: "Neurological", symptoms: ["Memory loss", "Confusion", "Difficulty with tasks", "Mood changes", "Disorientation"], severity: "critical", prevalence: "Common" },
  { id: 24, name: "Parkinson's Disease", category: "Neurological", symptoms: ["Tremors", "Slow movement", "Rigid muscles", "Impaired balance", "Speech changes"], severity: "critical", prevalence: "Moderate" },
  { id: 25, name: "Epilepsy", category: "Neurological", symptoms: ["Seizures", "Temporary confusion", "Staring spells", "Uncontrollable movements", "Loss of consciousness"], severity: "high", prevalence: "Common" },
  { id: 26, name: "Multiple Sclerosis", category: "Neurological", symptoms: ["Numbness", "Tingling", "Weakness", "Vision problems", "Fatigue"], severity: "high", prevalence: "Moderate" },
  { id: 27, name: "Neuropathy", category: "Neurological", symptoms: ["Numbness", "Tingling", "Burning pain", "Muscle weakness", "Sensitivity to touch"], severity: "moderate", prevalence: "Common" },
  { id: 28, name: "Tension Headache", category: "Neurological", symptoms: ["Dull head pain", "Pressure around forehead", "Tenderness on scalp", "Neck pain"], severity: "low", prevalence: "Very Common" },
  
  // Mental Health
  { id: 29, name: "Depression", category: "Mental Health", symptoms: ["Persistent sadness", "Loss of interest", "Fatigue", "Sleep changes", "Appetite changes", "Difficulty concentrating"], severity: "high", prevalence: "Very Common" },
  { id: 30, name: "Anxiety Disorder", category: "Mental Health", symptoms: ["Excessive worry", "Restlessness", "Fatigue", "Difficulty concentrating", "Irritability", "Sleep problems"], severity: "moderate", prevalence: "Very Common" },
  { id: 31, name: "Bipolar Disorder", category: "Mental Health", symptoms: ["Mood swings", "High energy periods", "Low energy periods", "Sleep changes", "Racing thoughts"], severity: "high", prevalence: "Common" },
  { id: 32, name: "PTSD", category: "Mental Health", symptoms: ["Flashbacks", "Nightmares", "Severe anxiety", "Uncontrollable thoughts", "Avoidance"], severity: "high", prevalence: "Common" },
  { id: 33, name: "OCD", category: "Mental Health", symptoms: ["Obsessive thoughts", "Compulsive behaviors", "Fear of contamination", "Need for symmetry", "Unwanted thoughts"], severity: "moderate", prevalence: "Common" },
  { id: 34, name: "Panic Disorder", category: "Mental Health", symptoms: ["Sudden panic attacks", "Racing heart", "Sweating", "Trembling", "Fear of losing control"], severity: "moderate", prevalence: "Common" },
  { id: 35, name: "Schizophrenia", category: "Mental Health", symptoms: ["Hallucinations", "Delusions", "Disorganized thinking", "Lack of motivation", "Social withdrawal"], severity: "critical", prevalence: "Moderate" },
  { id: 36, name: "ADHD", category: "Mental Health", symptoms: ["Difficulty focusing", "Hyperactivity", "Impulsiveness", "Disorganization", "Poor time management"], severity: "moderate", prevalence: "Very Common" },
  
  // Digestive Disorders
  { id: 37, name: "GERD", category: "Digestive", symptoms: ["Heartburn", "Acid reflux", "Difficulty swallowing", "Chest pain", "Regurgitation"], severity: "moderate", prevalence: "Very Common" },
  { id: 38, name: "Irritable Bowel Syndrome", category: "Digestive", symptoms: ["Abdominal pain", "Bloating", "Diarrhea", "Constipation", "Gas"], severity: "moderate", prevalence: "Very Common" },
  { id: 39, name: "Crohn's Disease", category: "Digestive", symptoms: ["Diarrhea", "Abdominal pain", "Weight loss", "Fatigue", "Blood in stool"], severity: "high", prevalence: "Moderate" },
  { id: 40, name: "Ulcerative Colitis", category: "Digestive", symptoms: ["Diarrhea with blood", "Abdominal pain", "Rectal bleeding", "Weight loss", "Fatigue"], severity: "high", prevalence: "Moderate" },
  { id: 41, name: "Celiac Disease", category: "Digestive", symptoms: ["Diarrhea", "Bloating", "Weight loss", "Fatigue", "Anemia"], severity: "moderate", prevalence: "Common" },
  { id: 42, name: "Gastritis", category: "Digestive", symptoms: ["Upper abdominal pain", "Nausea", "Vomiting", "Bloating", "Loss of appetite"], severity: "moderate", prevalence: "Very Common" },
  { id: 43, name: "Peptic Ulcer", category: "Digestive", symptoms: ["Burning stomach pain", "Bloating", "Heartburn", "Nausea", "Intolerance to fatty foods"], severity: "moderate", prevalence: "Common" },
  { id: 44, name: "Gallstones", category: "Digestive", symptoms: ["Sudden intense pain", "Back pain", "Right shoulder pain", "Nausea", "Vomiting"], severity: "moderate", prevalence: "Common" },
  { id: 45, name: "Pancreatitis", category: "Digestive", symptoms: ["Upper abdominal pain", "Pain radiating to back", "Nausea", "Vomiting", "Fever"], severity: "high", prevalence: "Moderate" },
  { id: 46, name: "Hepatitis B", category: "Digestive", symptoms: ["Fatigue", "Nausea", "Abdominal pain", "Jaundice", "Dark urine"], severity: "high", prevalence: "Common" },
  { id: 47, name: "Hepatitis C", category: "Digestive", symptoms: ["Fatigue", "Nausea", "Poor appetite", "Muscle aches", "Jaundice"], severity: "high", prevalence: "Common" },
  { id: 48, name: "Cirrhosis", category: "Digestive", symptoms: ["Fatigue", "Easy bruising", "Jaundice", "Itchy skin", "Fluid buildup"], severity: "critical", prevalence: "Moderate" },
  
  // Musculoskeletal
  { id: 49, name: "Osteoarthritis", category: "Musculoskeletal", symptoms: ["Joint pain", "Stiffness", "Swelling", "Reduced flexibility", "Bone spurs"], severity: "moderate", prevalence: "Very Common" },
  { id: 50, name: "Rheumatoid Arthritis", category: "Musculoskeletal", symptoms: ["Joint swelling", "Joint pain", "Joint stiffness", "Fatigue", "Fever"], severity: "high", prevalence: "Common" },
  { id: 51, name: "Osteoporosis", category: "Musculoskeletal", symptoms: ["Back pain", "Loss of height", "Stooped posture", "Bone fractures", "Brittle bones"], severity: "moderate", prevalence: "Very Common" },
  { id: 52, name: "Fibromyalgia", category: "Musculoskeletal", symptoms: ["Widespread pain", "Fatigue", "Sleep problems", "Memory issues", "Mood issues"], severity: "moderate", prevalence: "Common" },
  { id: 53, name: "Gout", category: "Musculoskeletal", symptoms: ["Intense joint pain", "Swelling", "Redness", "Tenderness", "Limited range of motion"], severity: "moderate", prevalence: "Common" },
  { id: 54, name: "Lupus", category: "Musculoskeletal", symptoms: ["Fatigue", "Joint pain", "Skin rash", "Fever", "Photosensitivity"], severity: "high", prevalence: "Moderate" },
  { id: 55, name: "Sciatica", category: "Musculoskeletal", symptoms: ["Lower back pain", "Hip pain", "Leg pain", "Numbness", "Weakness"], severity: "moderate", prevalence: "Common" },
  { id: 56, name: "Herniated Disc", category: "Musculoskeletal", symptoms: ["Arm or leg pain", "Numbness", "Tingling", "Weakness", "Muscle spasms"], severity: "moderate", prevalence: "Common" },
  { id: 57, name: "Carpal Tunnel Syndrome", category: "Musculoskeletal", symptoms: ["Hand numbness", "Tingling", "Weakness", "Pain in hand", "Dropping objects"], severity: "low", prevalence: "Very Common" },
  { id: 58, name: "Tennis Elbow", category: "Musculoskeletal", symptoms: ["Pain on outer elbow", "Weak grip", "Pain when gripping", "Stiffness"], severity: "low", prevalence: "Common" },
  
  // Skin Conditions
  { id: 59, name: "Eczema", category: "Dermatological", symptoms: ["Itchy skin", "Red patches", "Dry skin", "Scaly patches", "Skin inflammation"], severity: "low", prevalence: "Very Common" },
  { id: 60, name: "Psoriasis", category: "Dermatological", symptoms: ["Red patches with scales", "Dry cracked skin", "Itching", "Burning", "Thickened nails"], severity: "moderate", prevalence: "Common" },
  { id: 61, name: "Acne", category: "Dermatological", symptoms: ["Pimples", "Blackheads", "Whiteheads", "Oily skin", "Scarring"], severity: "low", prevalence: "Very Common" },
  { id: 62, name: "Rosacea", category: "Dermatological", symptoms: ["Facial redness", "Visible blood vessels", "Swollen bumps", "Eye problems", "Enlarged nose"], severity: "low", prevalence: "Common" },
  { id: 63, name: "Melanoma", category: "Dermatological", symptoms: ["New skin growth", "Change in mole", "Asymmetrical mole", "Uneven borders", "Multiple colors"], severity: "critical", prevalence: "Moderate" },
  { id: 64, name: "Vitiligo", category: "Dermatological", symptoms: ["White patches on skin", "Premature hair graying", "Loss of color in mouth", "Loss of color in eyes"], severity: "low", prevalence: "Moderate" },
  { id: 65, name: "Hives", category: "Dermatological", symptoms: ["Raised welts", "Itching", "Red or skin-colored bumps", "Swelling", "Burning sensation"], severity: "low", prevalence: "Very Common" },
  
  // Urological
  { id: 66, name: "Urinary Tract Infection", category: "Urological", symptoms: ["Burning urination", "Frequent urination", "Cloudy urine", "Strong urine odor", "Pelvic pain"], severity: "moderate", prevalence: "Very Common" },
  { id: 67, name: "Kidney Stones", category: "Urological", symptoms: ["Severe pain", "Blood in urine", "Nausea", "Vomiting", "Frequent urination"], severity: "high", prevalence: "Common" },
  { id: 68, name: "Chronic Kidney Disease", category: "Urological", symptoms: ["Fatigue", "Swelling in ankles", "Decreased urination", "Shortness of breath", "Confusion"], severity: "critical", prevalence: "Common" },
  { id: 69, name: "Enlarged Prostate", category: "Urological", symptoms: ["Frequent urination", "Weak urine stream", "Difficulty starting urination", "Incomplete bladder emptying"], severity: "moderate", prevalence: "Very Common" },
  { id: 70, name: "Overactive Bladder", category: "Urological", symptoms: ["Sudden urge to urinate", "Frequent urination", "Incontinence", "Nocturia"], severity: "low", prevalence: "Common" },
  
  // Infectious Diseases
  { id: 71, name: "Influenza", category: "Infectious", symptoms: ["Fever", "Cough", "Sore throat", "Body aches", "Fatigue", "Chills"], severity: "moderate", prevalence: "Very Common" },
  { id: 72, name: "COVID-19", category: "Infectious", symptoms: ["Fever", "Cough", "Shortness of breath", "Fatigue", "Loss of taste or smell", "Body aches"], severity: "high", prevalence: "Very Common" },
  { id: 73, name: "Common Cold", category: "Infectious", symptoms: ["Runny nose", "Sore throat", "Cough", "Congestion", "Sneezing", "Mild headache"], severity: "low", prevalence: "Very Common" },
  { id: 74, name: "Strep Throat", category: "Infectious", symptoms: ["Severe sore throat", "Fever", "Swollen lymph nodes", "Red tonsils", "Difficulty swallowing"], severity: "moderate", prevalence: "Common" },
  { id: 75, name: "Chickenpox", category: "Infectious", symptoms: ["Itchy rash", "Fever", "Fatigue", "Loss of appetite", "Headache"], severity: "moderate", prevalence: "Common" },
  { id: 76, name: "Shingles", category: "Infectious", symptoms: ["Painful rash", "Blisters", "Burning sensation", "Numbness", "Fever"], severity: "moderate", prevalence: "Common" },
  { id: 77, name: "Mononucleosis", category: "Infectious", symptoms: ["Extreme fatigue", "Sore throat", "Fever", "Swollen lymph nodes", "Headache"], severity: "moderate", prevalence: "Common" },
  { id: 78, name: "Lyme Disease", category: "Infectious", symptoms: ["Bull's-eye rash", "Fever", "Chills", "Fatigue", "Joint pain"], severity: "high", prevalence: "Moderate" },
  { id: 79, name: "Malaria", category: "Infectious", symptoms: ["High fever", "Chills", "Sweating", "Headache", "Nausea", "Body aches"], severity: "critical", prevalence: "Moderate" },
  { id: 80, name: "Dengue Fever", category: "Infectious", symptoms: ["High fever", "Severe headache", "Eye pain", "Joint pain", "Rash", "Mild bleeding"], severity: "high", prevalence: "Moderate" },
  
  // Endocrine
  { id: 81, name: "Cushing's Syndrome", category: "Endocrine", symptoms: ["Weight gain", "Round face", "Thin skin", "Slow healing", "Muscle weakness"], severity: "high", prevalence: "Rare" },
  { id: 82, name: "Addison's Disease", category: "Endocrine", symptoms: ["Fatigue", "Weight loss", "Low blood pressure", "Darkening of skin", "Salt craving"], severity: "high", prevalence: "Rare" },
  { id: 83, name: "Polycystic Ovary Syndrome", category: "Endocrine", symptoms: ["Irregular periods", "Excess hair growth", "Acne", "Weight gain", "Infertility"], severity: "moderate", prevalence: "Common" },
  { id: 84, name: "Hashimoto's Thyroiditis", category: "Endocrine", symptoms: ["Fatigue", "Weight gain", "Cold sensitivity", "Joint pain", "Depression"], severity: "moderate", prevalence: "Common" },
  { id: 85, name: "Graves' Disease", category: "Endocrine", symptoms: ["Anxiety", "Weight loss", "Tremors", "Heat sensitivity", "Bulging eyes"], severity: "high", prevalence: "Moderate" },
  
  // Eye Conditions
  { id: 86, name: "Glaucoma", category: "Ophthalmological", symptoms: ["Gradual vision loss", "Tunnel vision", "Eye pain", "Nausea", "Halos around lights"], severity: "high", prevalence: "Common" },
  { id: 87, name: "Cataracts", category: "Ophthalmological", symptoms: ["Clouded vision", "Difficulty at night", "Light sensitivity", "Fading colors", "Double vision"], severity: "moderate", prevalence: "Very Common" },
  { id: 88, name: "Macular Degeneration", category: "Ophthalmological", symptoms: ["Blurred central vision", "Dark spots", "Distorted vision", "Difficulty recognizing faces"], severity: "high", prevalence: "Common" },
  { id: 89, name: "Dry Eye Syndrome", category: "Ophthalmological", symptoms: ["Stinging eyes", "Burning sensation", "Light sensitivity", "Eye fatigue", "Blurred vision"], severity: "low", prevalence: "Very Common" },
  { id: 90, name: "Conjunctivitis", category: "Ophthalmological", symptoms: ["Red eyes", "Itchy eyes", "Discharge", "Tearing", "Crusty eyelids"], severity: "low", prevalence: "Very Common" },
  
  // Ear, Nose, Throat
  { id: 91, name: "Sinusitis", category: "ENT", symptoms: ["Facial pain", "Nasal congestion", "Thick nasal discharge", "Reduced smell", "Cough"], severity: "low", prevalence: "Very Common" },
  { id: 92, name: "Tinnitus", category: "ENT", symptoms: ["Ringing in ears", "Buzzing", "Clicking", "Hissing", "Roaring sounds"], severity: "low", prevalence: "Very Common" },
  { id: 93, name: "Hearing Loss", category: "ENT", symptoms: ["Muffled speech", "Difficulty understanding words", "Asking others to repeat", "Turning up volume", "Withdrawal from conversations"], severity: "moderate", prevalence: "Common" },
  { id: 94, name: "Vertigo", category: "ENT", symptoms: ["Spinning sensation", "Balance problems", "Nausea", "Vomiting", "Nystagmus"], severity: "moderate", prevalence: "Common" },
  { id: 95, name: "Tonsillitis", category: "ENT", symptoms: ["Sore throat", "Difficulty swallowing", "Red swollen tonsils", "Fever", "Bad breath"], severity: "moderate", prevalence: "Very Common" },
  
  // Cancer Types
  { id: 96, name: "Breast Cancer", category: "Oncological", symptoms: ["Breast lump", "Nipple discharge", "Breast pain", "Skin changes", "Nipple retraction"], severity: "critical", prevalence: "Common" },
  { id: 97, name: "Lung Cancer", category: "Oncological", symptoms: ["Persistent cough", "Coughing blood", "Chest pain", "Hoarseness", "Weight loss"], severity: "critical", prevalence: "Common" },
  { id: 98, name: "Colorectal Cancer", category: "Oncological", symptoms: ["Change in bowel habits", "Blood in stool", "Abdominal discomfort", "Weakness", "Weight loss"], severity: "critical", prevalence: "Common" },
  { id: 99, name: "Prostate Cancer", category: "Oncological", symptoms: ["Difficulty urinating", "Blood in urine", "Blood in semen", "Bone pain", "Erectile dysfunction"], severity: "critical", prevalence: "Common" },
  { id: 100, name: "Leukemia", category: "Oncological", symptoms: ["Fatigue", "Fever", "Frequent infections", "Easy bruising", "Bone pain"], severity: "critical", prevalence: "Moderate" },
  
  // Additional conditions
  { id: 101, name: "Anemia", category: "Hematological", symptoms: ["Fatigue", "Weakness", "Pale skin", "Shortness of breath", "Dizziness", "Cold hands"], severity: "moderate", prevalence: "Very Common" },
  { id: 102, name: "Allergic Rhinitis", category: "Immunological", symptoms: ["Sneezing", "Runny nose", "Itchy eyes", "Congestion", "Watery eyes"], severity: "low", prevalence: "Very Common" },
  { id: 103, name: "Food Allergies", category: "Immunological", symptoms: ["Hives", "Swelling", "Abdominal pain", "Difficulty breathing", "Anaphylaxis"], severity: "high", prevalence: "Common" },
  { id: 104, name: "Insomnia", category: "Sleep", symptoms: ["Difficulty falling asleep", "Waking up during night", "Early morning awakening", "Daytime tiredness", "Irritability"], severity: "moderate", prevalence: "Very Common" },
  { id: 105, name: "Restless Leg Syndrome", category: "Neurological", symptoms: ["Urge to move legs", "Uncomfortable sensations", "Worsening at night", "Relief with movement"], severity: "low", prevalence: "Common" },
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, category } = await req.json();

    let results = [...DISEASE_DATABASE];

    // Filter by category if provided
    if (category && category !== "all") {
      results = results.filter(d => d.category.toLowerCase() === category.toLowerCase());
    }

    // Search by name or symptoms if query provided
    if (query) {
      const searchTerm = query.toLowerCase();
      results = results.filter(d => 
        d.name.toLowerCase().includes(searchTerm) ||
        d.symptoms.some(s => s.toLowerCase().includes(searchTerm)) ||
        d.category.toLowerCase().includes(searchTerm)
      );
    }

    return new Response(JSON.stringify({ 
      diseases: results,
      total: results.length,
      categories: [...new Set(DISEASE_DATABASE.map(d => d.category))]
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error in search-disease:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
