import { useState, useEffect, useRef, useCallback } from "react";
import { 
  getFirebaseAuth, 
  getFirebaseDb, 
  isInitialized, 
  initializeFirebase, 
  clearFirebaseConfig 
} from "./firebase";
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut 
} from "firebase/auth";
import { doc, onSnapshot, setDoc } from "firebase/firestore";


// ─── FULL QUEST DATABASE (100 levels, 4 quests each) ─────────────────────────
const ALL_QUESTS = {
  // ARC 1 — THE AWAKENING (L1-L10)
  1:  [
    { id:"l1_INT",  stat:"INT", xp:40,  text:"Install Python 3.x, VS Code, Git. Push 'Hello World' to GitHub." },
    { id:"l1_STR",  stat:"STR", xp:30,  text:"Baseline test: max pushups, plank hold, 1km run. Record everything." },
    { id:"l1_GLD",  stat:"GLD", xp:25,  text:"Track every rupee spent for 7 days using a spreadsheet." },
    { id:"l1_WIS",  stat:"WIS", xp:35,  text:"Pray all 5 Salah on time for 7 consecutive days." },
  ],
  2:  [
    { id:"l2_INT",  stat:"INT", xp:45,  text:"Python fundamentals: loops, functions, OOP. Solve 10 LeetCode Easy." },
    { id:"l2_STR",  stat:"STR", xp:30,  text:"Daily: 20 pushups, 20 squats, 30s plank. Walk 3km daily." },
    { id:"l2_GLD",  stat:"GLD", xp:30,  text:"Open savings account. Set auto-transfer of 10% salary on payday." },
    { id:"l2_WIS",  stat:"WIS", xp:35,  text:"Learn the full meaning of Al-Fatiha & surahs recited in prayer." },
  ],
  3:  [
    { id:"l3_INT",  stat:"INT", xp:50,  text:"Learn NumPy & Pandas. Clean & visualize a real Kaggle dataset. Push to GitHub." },
    { id:"l3_STR",  stat:"STR", xp:35,  text:"Progress to 30 pushups, 30 squats, 60s plank. Start Couch-to-5K program." },
    { id:"l3_GLD",  stat:"GLD", xp:35,  text:"Build 1-month emergency fund (1x monthly expenses fully saved)." },
    { id:"l3_WIS",  stat:"WIS", xp:50,  text:"Memorize Surah Al-Mulk (30 verses). Recite it every night before sleep." },
  ],
  4:  [
    { id:"l4_INT",  stat:"INT", xp:55,  text:"Buy ESP32 dev board. Blink an LED. Read a sensor. Document on GitHub." },
    { id:"l4_STR",  stat:"STR", xp:40,  text:"Add pull-up bar training (negatives if needed). Target: 1 strict pull-up." },
    { id:"l4_GLD",  stat:"GLD", xp:40,  text:"Read 'Let's Talk Money' by Monika Halan. Start first SIP of ₹500/month." },
    { id:"l4_WIS",  stat:"WIS", xp:40,  text:"Begin reading Quran with translation — 1 page per day minimum." },
  ],
  5:  [
    { id:"l5_INT",  stat:"INT", xp:55,  text:"Build a Python CLI tool solving a real personal problem (expense tracker, habit logger, etc.)." },
    { id:"l5_STR",  stat:"STR", xp:45,  text:"Join a gym. Learn Big 3 with empty bar: Squat, Bench, Deadlift. Form first." },
    { id:"l5_GLD",  stat:"GLD", xp:35,  text:"Eliminate all unnecessary subscriptions. Build optimized monthly budget." },
    { id:"l5_WIS",  stat:"WIS", xp:60,  text:"Quit one clear bad habit. Make sincere tawbah. Replace with a good deed." },
  ],
  6:  [
    { id:"l6_INT",  stat:"INT", xp:50,  text:"Learn Linux terminal & SSH. Set up Raspberry Pi in headless mode." },
    { id:"l6_STR",  stat:"STR", xp:50,  text:"Run 5km without stopping. Time it. This is your first real benchmark." },
    { id:"l6_GLD",  stat:"GLD", xp:40,  text:"Grow emergency fund to 2 months of expenses." },
    { id:"l6_WIS",  stat:"WIS", xp:45,  text:"Sleep early & wake for Fajr without alarm for 14 consecutive days." },
  ],
  7:  [
    { id:"l7_INT",  stat:"INT", xp:60,  text:"Complete Andrew Ng ML Specialization Course 1 (Weeks 1–4)." },
    { id:"l7_STR",  stat:"STR", xp:45,  text:"Establish 3x/week lifting routine. Proper form locked in for all lifts." },
    { id:"l7_GLD",  stat:"GLD", xp:35,  text:"Open Demat account. Understand how the stock market works fundamentally." },
    { id:"l7_WIS",  stat:"WIS", xp:55,  text:"Memorize the 99 Names of Allah (Al-Asma ul-Husna). Reflect on 3 daily." },
  ],
  8:  [
    { id:"l8_INT",  stat:"INT", xp:60,  text:"Build ML Linear Regression model on housing data. Deploy locally with Flask." },
    { id:"l8_STR",  stat:"STR", xp:55,  text:"Deadlift 0.5x BW. Bench 0.3x BW. Squat 0.5x BW. All with proper form." },
    { id:"l8_GLD",  stat:"GLD", xp:35,  text:"Read 'Rich Dad Poor Dad'. Document 10 key financial lessons." },
    { id:"l8_WIS",  stat:"WIS", xp:65,  text:"Fast Mondays & Thursdays (Sunnah fasting) for one full month." },
  ],
  9:  [
    { id:"l9_INT",  stat:"INT", xp:65,  text:"Build ESP32 weather station: 3 sensors, Python dashboard, data logged to CSV." },
    { id:"l9_STR",  stat:"STR", xp:55,  text:"Run 5km under 35 min. Achieve: 30 pushups + 5 pull-ups in single sets." },
    { id:"l9_GLD",  stat:"GLD", xp:40,  text:"Create personal balance sheet: assets, liabilities, net worth. Update quarterly." },
    { id:"l9_WIS",  stat:"WIS", xp:50,  text:"Give Sadaqah every week without fail — even ₹10. Build the habit." },
  ],
  10: [
    { id:"l10_INT", stat:"INT", xp:100, text:"🔴 BOSS TECH: Build full IoT Weather Station (ESP32 + Python dashboard). Push complete GitHub repo with README.", boss:true },
    { id:"l10_STR", stat:"STR", xp:100, text:"🔴 BOSS PHYSICAL: Complete Baseline Gauntlet — 50 pushups, 10 pull-ups, 5km under 32 min, DL 0.6x BW.", boss:true },
    { id:"l10_WIS", stat:"WIS", xp:100, text:"🔴 BOSS SPIRITUAL: 30 consecutive days of all 5 Salah on time. Surah Al-Mulk memorized. 1 bad habit permanently eliminated.", boss:true },
  ],
  // ARC 2 — THE FOUNDATION (L11-L20)
  11: [
    { id:"l11_INT", stat:"INT", xp:70,  text:"Complete Andrew Ng ML Specialization fully. Implement 3 algorithms from scratch." },
    { id:"l11_STR", stat:"STR", xp:55,  text:"Deadlift 0.75x BW. Bench 0.5x BW. Squat 0.75x BW." },
    { id:"l11_GLD", stat:"GLD", xp:50,  text:"Increase SIP to ₹2,000/month. Research 2 additional fund types." },
    { id:"l11_WIS", stat:"WIS", xp:55,  text:"Begin waking 15 min before Fajr for Dua & Dhikr. Plant the seed of Tahajjud." },
  ],
  12: [
    { id:"l12_INT", stat:"INT", xp:70,  text:"Learn OpenCV basics — face detection, edge detection, color tracking. Build a face-counter app." },
    { id:"l12_STR", stat:"STR", xp:55,  text:"Run 5km under 30 minutes. Start HIIT interval training 2x/week." },
    { id:"l12_GLD", stat:"GLD", xp:50,  text:"Learn freelancing basics. Create profiles on Upwork/Fiverr for Python/IoT skills." },
    { id:"l12_WIS", stat:"WIS", xp:60,  text:"Memorize Surah Ar-Rahman. Understand its meaning deeply." },
  ],
  13: [
    { id:"l13_INT", stat:"INT", xp:75,  text:"Deep Learning fundamentals: Neural Nets, Backpropagation. Complete fast.ai Course 1." },
    { id:"l13_STR", stat:"STR", xp:55,  text:"Research martial arts styles. Visit 3 local dojos. Choose ONE to commit to." },
    { id:"l13_GLD", stat:"GLD", xp:55,  text:"Land first freelance gig — even ₹500. First rupee earned outside salary." },
    { id:"l13_WIS", stat:"WIS", xp:65,  text:"Read one complete Seerah book (Life of Prophet ﷺ). Recommended: The Sealed Nectar." },
  ],
  14: [
    { id:"l14_INT", stat:"INT", xp:75,  text:"Build a CNN image classifier (plant disease / defect detection). Deploy with Streamlit." },
    { id:"l14_STR", stat:"STR", xp:60,  text:"Begin martial arts training — attend 2 classes/week minimum. White belt fundamentals." },
    { id:"l14_GLD", stat:"GLD", xp:55,  text:"Read 'The Millionaire Fastlane'. Map your assets vs liabilities." },
    { id:"l14_WIS", stat:"WIS", xp:55,  text:"Quit a second bad habit. Replace it with a Sunnah practice (miswak, right hand eating)." },
  ],
  15: [
    { id:"l15_INT", stat:"INT", xp:75,  text:"Learn PCB design basics with KiCad. Design a simple ESP32 breakout board." },
    { id:"l15_STR", stat:"STR", xp:65,  text:"Deadlift 1x bodyweight. This is a milestone. Record it on video." },
    { id:"l15_GLD", stat:"GLD", xp:55,  text:"Emergency fund reaches 4 months. SIPs diversified across 2-3 funds." },
    { id:"l15_WIS", stat:"WIS", xp:60,  text:"Attend Jumu'ah prayer every Friday without exception for 3 months straight." },
  ],
  16: [
    { id:"l16_INT", stat:"INT", xp:80,  text:"Introduction to ROS 2. Run turtlesim. Understand nodes, topics, and messages." },
    { id:"l16_STR", stat:"STR", xp:60,  text:"Achieve 15 strict pull-ups, 70 pushups in one set, 90s plank hold." },
    { id:"l16_GLD", stat:"GLD", xp:55,  text:"Start a technical blog on Hashnode or Medium. Write your first 3 posts." },
    { id:"l16_WIS", stat:"WIS", xp:60,  text:"Memorize Ayat-ul-Kursi, last 2 ayahs of Baqarah, and the 3 Quls with full meaning." },
  ],
  17: [
    { id:"l17_INT", stat:"INT", xp:80,  text:"Build a real-time object detection app with YOLOv8 on webcam input." },
    { id:"l17_STR", stat:"STR", xp:65,  text:"Run 7km without stopping. Begin 10km distance training." },
    { id:"l17_GLD", stat:"GLD", xp:55,  text:"Earn ₹10,000 total from freelancing or side income. Track every source." },
    { id:"l17_WIS", stat:"WIS", xp:60,  text:"Begin learning basic Arabic — alphabet and common Quranic words." },
  ],
  18: [
    { id:"l18_INT", stat:"INT", xp:80,  text:"Order & assemble your first custom PCB. Solder components. Test functionality." },
    { id:"l18_STR", stat:"STR", xp:65,  text:"3 months of consistent martial arts training completed. Know 5 techniques cold." },
    { id:"l18_GLD", stat:"GLD", xp:55,  text:"Learn basics of ITR filing and 80C deductions. File your own return." },
    { id:"l18_WIS", stat:"WIS", xp:65,  text:"Complete reading the entire Quran once with full translation." },
  ],
  19: [
    { id:"l19_INT", stat:"INT", xp:85,  text:"Build an ESP32-CAM project (surveillance cam or object tracker) with web viewer." },
    { id:"l19_STR", stat:"STR", xp:70,  text:"Run 10km for the first time. Any pace. Just finish. Document it." },
    { id:"l19_GLD", stat:"GLD", xp:55,  text:"Create a 5-year financial roadmap with milestones. Review quarterly." },
    { id:"l19_WIS", stat:"WIS", xp:55,  text:"Adopt Sunnah of truth-telling in all dealings for 30 consecutive days." },
  ],
  20: [
    { id:"l20_INT", stat:"INT", xp:110, text:"🔴 BOSS TECH: Build & deploy ESP32-CAM smart surveillance with real-time YOLOv8 detection and web dashboard.", boss:true },
    { id:"l20_STR", stat:"STR", xp:110, text:"🔴 BOSS PHYSICAL: Deadlift 1x BW. Complete 10km run. 3+ months unbroken martial arts streak.", boss:true },
    { id:"l20_WIS", stat:"WIS", xp:110, text:"🔴 BOSS SPIRITUAL: Full Quran read with translation. 2 bad habits replaced with Sunnah. Jumu'ah streak unbroken.", boss:true },
  ],
  // ARC 3 — THE SPECIALIZATION (L21-L30)
  21: [
    { id:"l21_INT", stat:"INT", xp:90,  text:"Deep dive into Reinforcement Learning. Complete David Silver's RL Course (DeepMind)." },
    { id:"l21_STR", stat:"STR", xp:70,  text:"Deadlift 1.2x BW. Bench 0.75x BW. Squat 1.2x BW." },
    { id:"l21_GLD", stat:"GLD", xp:65,  text:"Monthly side income reaches ₹15,000/month consistently." },
    { id:"l21_WIS", stat:"WIS", xp:70,  text:"Begin 2-rakat Tahajjud prayer, even 2-3 nights/week. The night prayer begins." },
  ],
  22: [
    { id:"l22_INT", stat:"INT", xp:90,  text:"Implement Q-Learning & DQN from scratch. Train agent on CartPole or LunarLander." },
    { id:"l22_STR", stat:"STR", xp:70,  text:"Run 10km under 60 minutes. You are now a runner." },
    { id:"l22_GLD", stat:"GLD", xp:65,  text:"Start a micro-SaaS or info-product based on your tech expertise. MVP stage." },
    { id:"l22_WIS", stat:"WIS", xp:70,  text:"Memorize Juz' Amma (30th Juz) fully — all the short Surahs." },
  ],
  23: [
    { id:"l23_INT", stat:"INT", xp:95,  text:"Build a 2WD robot chassis with motor drivers + ESP32/Arduino. Control via serial." },
    { id:"l23_STR", stat:"STR", xp:70,  text:"Martial arts: 6 months complete. Earn first belt or rank advancement." },
    { id:"l23_GLD", stat:"GLD", xp:65,  text:"Learn GST basics and business registration requirements in India." },
    { id:"l23_WIS", stat:"WIS", xp:70,  text:"Study a book on Aqeedah (Islamic Creed). Recommended: Kitab at-Tawheed summary." },
  ],
  24: [
    { id:"l24_INT", stat:"INT", xp:95,  text:"Learn ROS 2 intermediate — URDF models, TF2, Navigation Stack. Simulate in Gazebo." },
    { id:"l24_STR", stat:"STR", xp:70,  text:"Add mobility & flexibility work — 15 min daily yoga or dynamic stretching routine." },
    { id:"l24_GLD", stat:"GLD", xp:65,  text:"Open a PPF account. Contribute ₹500/month for long-term tax-free compounding." },
    { id:"l24_WIS", stat:"WIS", xp:70,  text:"Quit a third bad habit. Each elimination strengthens the soul." },
  ],
  25: [
    { id:"l25_INT", stat:"INT", xp:95,  text:"Implement SLAM basics. Understand LiDAR, odometry, mapping. Simulate in ROS 2." },
    { id:"l25_STR", stat:"STR", xp:75,  text:"Achieve: 20 strict pull-ups, 80 pushups, 2-minute plank." },
    { id:"l25_GLD", stat:"GLD", xp:65,  text:"Total investment portfolio crosses ₹2,00,000." },
    { id:"l25_WIS", stat:"WIS", xp:75,  text:"Begin calculating and paying Zakat if eligible. Use proper tools." },
  ],
  26: [
    { id:"l26_INT", stat:"INT", xp:95,  text:"Train DRL agent (PPO/SAC) to navigate simulated environment. Use Stable-Baselines3." },
    { id:"l26_STR", stat:"STR", xp:75,  text:"Add sprint intervals: 8x 400m repeats. Build explosive speed." },
    { id:"l26_GLD", stat:"GLD", xp:65,  text:"Launch first digital product (course, template, or tool). Even 1 sale counts." },
    { id:"l26_WIS", stat:"WIS", xp:70,  text:"Adopt Sunnah of lowering gaze, guarding tongue, controlling anger for 30 days." },
  ],
  27: [
    { id:"l27_INT", stat:"INT", xp:95,  text:"Design & fabricate a 4-layer PCB. Understand impedance, signal integrity, power planes." },
    { id:"l27_STR", stat:"STR", xp:75,  text:"Deadlift 1.4x BW. Your strength is entering intermediate territory." },
    { id:"l27_GLD", stat:"GLD", xp:65,  text:"Diversify: Start a gold SIP or add international index fund exposure." },
    { id:"l27_WIS", stat:"WIS", xp:70,  text:"Attend an Islamic course or lecture series (Bayyinah TV, SeekersGuidance)." },
  ],
  28: [
    { id:"l28_INT", stat:"INT", xp:95,  text:"Build a vision-guided robot arm (3-DOF min) — servo-controlled with camera input." },
    { id:"l28_STR", stat:"STR", xp:75,  text:"Run a timed 10km race. Target: under 58 minutes." },
    { id:"l28_GLD", stat:"GLD", xp:65,  text:"Monthly passive/side income reaches ₹25,000." },
    { id:"l28_WIS", stat:"WIS", xp:75,  text:"Fast the White Days (13th, 14th, 15th Hijri) for 3 consecutive months." },
  ],
  29: [
    { id:"l29_INT", stat:"INT", xp:95,  text:"Publish a 5-article technical blog series on your AI/Robotics journey. Build audience." },
    { id:"l29_STR", stat:"STR", xp:75,  text:"Martial arts sparring sessions begin. Controlled contact. Learn to take hits." },
    { id:"l29_GLD", stat:"GLD", xp:65,  text:"Create a 5-year financial roadmap with quarterly milestones. Review it." },
    { id:"l29_WIS", stat:"WIS", xp:70,  text:"Memorize 5 essential Duas for daily life: morning, evening, eating, travel, sleep." },
  ],
  30: [
    { id:"l30_INT", stat:"INT", xp:120, text:"🔴 BOSS TECH: Build robot that navigates a room autonomously using SLAM + RL pathfinding. Demo on video.", boss:true },
    { id:"l30_STR", stat:"STR", xp:120, text:"🔴 BOSS PHYSICAL: DL 1.4x BW. 10km under 58 min. First martial arts belt earned.", boss:true },
    { id:"l30_WIS", stat:"WIS", xp:120, text:"🔴 BOSS SPIRITUAL: Tahajjud practice established. Juz Amma fully memorized. 3 Sunnah practices adopted.", boss:true },
  ],
  // ARC 4 — THE MONETIZER (L31-L40)
  31: [
    { id:"l31_INT", stat:"INT", xp:100, text:"Master PyTorch. Implement ResNet, a GAN, and a basic Transformer from scratch." },
    { id:"l31_STR", stat:"STR", xp:80,  text:"Deadlift 1.5x BW. Bench 1x BW. Overhead Press 0.6x BW." },
    { id:"l31_GLD", stat:"GLD", xp:75,  text:"Register a legal entity — Sole Proprietorship or LLP. You are now a business." },
    { id:"l31_WIS", stat:"WIS", xp:80,  text:"Tahajjud increases to 4-5 nights/week. Minimum 2 rakats. Non-negotiable." },
  ],
  32: [
    { id:"l32_INT", stat:"INT", xp:100, text:"Learn MLOps: Docker, CI/CD for ML pipelines, model versioning with MLflow or W&B." },
    { id:"l32_STR", stat:"STR", xp:80,  text:"Run 10km under 55 minutes." },
    { id:"l32_GLD", stat:"GLD", xp:75,  text:"First AI/IoT product generates revenue. Even ₹1,000 counts. Document it." },
    { id:"l32_WIS", stat:"WIS", xp:75,  text:"Begin memorizing Surah Al-Baqarah — first 50 ayahs." },
  ],
  33: [
    { id:"l33_INT", stat:"INT", xp:100, text:"Build a multi-DOF robot arm with inverse kinematics. Control it via Python." },
    { id:"l33_STR", stat:"STR", xp:80,  text:"Martial arts: 1 year complete. Second belt or rank earned." },
    { id:"l33_GLD", stat:"GLD", xp:75,  text:"Monthly income (job + side) exceeds ₹80,000 total." },
    { id:"l33_WIS", stat:"WIS", xp:80,  text:"Study a book on Islamic Ethics (Akhlaq). Apply one principle per week." },
  ],
  34: [
    { id:"l34_INT", stat:"INT", xp:100, text:"Train a custom object detection model on your own dataset. Deploy on edge (Jetson/RPi)." },
    { id:"l34_STR", stat:"STR", xp:80,  text:"Complete a physical challenge: Tough Mudder, Spartan Sprint, or equivalent." },
    { id:"l34_GLD", stat:"GLD", xp:75,  text:"Investment portfolio crosses ₹5,00,000." },
    { id:"l34_WIS", stat:"WIS", xp:90,  text:"Perform Umrah (lesser pilgrimage). This is a life-changing milestone." },
  ],
  35: [
    { id:"l35_INT", stat:"INT", xp:100, text:"Design a product-grade PCB: power management, communication modules, production-ready." },
    { id:"l35_STR", stat:"STR", xp:80,  text:"Achieve 25 strict pull-ups. Begin muscle-up progression training." },
    { id:"l35_GLD", stat:"GLD", xp:75,  text:"Hire your first contractor or freelancer. Learn to delegate." },
    { id:"l35_WIS", stat:"WIS", xp:75,  text:"Quit fourth bad habit. Your nafs weakens. Your ruh strengthens." },
  ],
  36: [
    { id:"l36_INT", stat:"INT", xp:100, text:"Build an end-to-end AI product: problem → data → model → API → frontend → deployed." },
    { id:"l36_STR", stat:"STR", xp:80,  text:"Add swimming to training. Swim 500m continuous." },
    { id:"l36_GLD", stat:"GLD", xp:75,  text:"Build a sales funnel or automated lead gen for your product or service." },
    { id:"l36_WIS", stat:"WIS", xp:80,  text:"Teach someone else — lead a halaqah or mentor a younger Muslim." },
  ],
  37: [
    { id:"l37_INT", stat:"INT", xp:100, text:"Learn Embedded Linux. Cross-compile for ARM. Run ML inference on custom hardware." },
    { id:"l37_STR", stat:"STR", xp:85,  text:"Deadlift 1.6x BW. Your strength is now visibly above average." },
    { id:"l37_GLD", stat:"GLD", xp:75,  text:"Explore real estate basics: REITs or fractional real estate platforms." },
    { id:"l37_WIS", stat:"WIS", xp:80,  text:"Memorize Surah Al-Kahf. Recite it every Friday without fail." },
  ],
  38: [
    { id:"l38_INT", stat:"INT", xp:100, text:"Contribute to an open-source robotics or AI project. Get at least one PR merged." },
    { id:"l38_STR", stat:"STR", xp:85,  text:"Complete a half-marathon (21km). Training plan + race completion." },
    { id:"l38_GLD", stat:"GLD", xp:75,  text:"Total net worth crosses ₹10,00,000 (₹10 Lakh)." },
    { id:"l38_WIS", stat:"WIS", xp:80,  text:"Study lives of 10 Sahaba (Companions of the Prophet ﷺ). Draw one lesson each." },
  ],
  39: [
    { id:"l39_INT", stat:"INT", xp:100, text:"Build portfolio of 5 deployed projects. Professional README, demo videos, architecture docs." },
    { id:"l39_STR", stat:"STR", xp:85,  text:"Martial arts: comfortable sparring. Win your first friendly bout." },
    { id:"l39_GLD", stat:"GLD", xp:75,  text:"Monthly passive income (dividends, product sales, content) reaches ₹10,000." },
    { id:"l39_WIS", stat:"WIS", xp:80,  text:"Establish habit of daily morning/evening Adhkar — never skip again." },
  ],
  40: [
    { id:"l40_INT", stat:"INT", xp:130, text:"🔴 BOSS TECH: Build & launch a commercial AI-powered device or SaaS product. Real users. Real feedback.", boss:true },
    { id:"l40_STR", stat:"STR", xp:130, text:"🔴 BOSS PHYSICAL: DL 1.6x BW. Half-marathon completed. Obstacle race (Spartan/Mudder) finished.", boss:true },
    { id:"l40_WIS", stat:"WIS", xp:130, text:"🔴 BOSS SPIRITUAL: Umrah completed. Consistent Tahajjud. Actively teaching or mentoring others.", boss:true },
  ],
  // ARC 5 — THE ENGINEER (L41-L50)
  41: [
    { id:"l41_INT", stat:"INT", xp:110, text:"Master Transformer architecture. Implement GPT-2 scale model from scratch in PyTorch." },
    { id:"l41_STR", stat:"STR", xp:90,  text:"Deadlift 1.7x BW. Bench 1.1x BW. Squat 1.6x BW." },
    { id:"l41_GLD", stat:"GLD", xp:85,  text:"Monthly total income (job + business) exceeds ₹1,50,000." },
    { id:"l41_WIS", stat:"WIS", xp:85,  text:"Tahajjud becomes daily. Even 2 rakats. This is your private audience with Allah ﷻ." },
  ],
  42: [
    { id:"l42_INT", stat:"INT", xp:110, text:"Learn FPGA basics. Implement a simple neural network accelerator on an FPGA board." },
    { id:"l42_STR", stat:"STR", xp:90,  text:"Run 10km under 52 minutes. Speed is building noticeably." },
    { id:"l42_GLD", stat:"GLD", xp:85,  text:"Second income stream established (consulting, content, or product #2)." },
    { id:"l42_WIS", stat:"WIS", xp:85,  text:"Memorize Surah Yasin. Understand its deep thematic meaning." },
  ],
  43: [
    { id:"l43_INT", stat:"INT", xp:110, text:"Build a multi-robot system: 2+ robots communicating and coordinating via ROS 2." },
    { id:"l43_STR", stat:"STR", xp:90,  text:"Martial arts: 2+ years. Intermediate belt. Compete in first tournament." },
    { id:"l43_GLD", stat:"GLD", xp:85,  text:"Investment portfolio crosses ₹15,00,000 (₹15 Lakh)." },
    { id:"l43_WIS", stat:"WIS", xp:85,  text:"Begin studying Arabic grammar (Nahw/Sarf) to read Quran without translation aid." },
  ],
  44: [
    { id:"l44_INT", stat:"INT", xp:110, text:"Study RL for robotics: sim-to-real transfer, domain randomization. Implement demo." },
    { id:"l44_STR", stat:"STR", xp:90,  text:"First muscle-up achieved. Calisthenics skills are expanding." },
    { id:"l44_GLD", stat:"GLD", xp:85,  text:"Buy first physical investment asset (gold, land plot, or business vehicle)." },
    { id:"l44_WIS", stat:"WIS", xp:85,  text:"Quit fifth bad habit. Your character is transforming at the root level." },
  ],
  45: [
    { id:"l45_INT", stat:"INT", xp:110, text:"Design & build custom compute board (PCB with SoC/MCU) for edge AI inference." },
    { id:"l45_STR", stat:"STR", xp:90,  text:"Swim 1km continuous. Cycling: complete a 30km ride." },
    { id:"l45_GLD", stat:"GLD", xp:85,  text:"Hire a CA (Chartered Accountant). Professionalize your financial management." },
    { id:"l45_WIS", stat:"WIS", xp:90,  text:"Perform I'tikaf (spiritual retreat) for at least 3 days during Ramadan." },
  ],
  46: [
    { id:"l46_INT", stat:"INT", xp:110, text:"Publish a technical paper (arXiv or conference submission) on your robotics/AI work." },
    { id:"l46_STR", stat:"STR", xp:90,  text:"Complete a sprint triathlon (750m swim, 20km bike, 5km run)." },
    { id:"l46_GLD", stat:"GLD", xp:85,  text:"Monthly passive income exceeds ₹30,000." },
    { id:"l46_WIS", stat:"WIS", xp:85,  text:"Memorize Surah Al-Baqarah fully — 286 ayahs. A massive achievement." },
  ],
  47: [
    { id:"l47_INT", stat:"INT", xp:110, text:"Build a digital twin simulation environment for your physical robot." },
    { id:"l47_STR", stat:"STR", xp:90,  text:"Deadlift 1.8x BW. Bench 1.2x BW." },
    { id:"l47_GLD", stat:"GLD", xp:85,  text:"Net worth crosses ₹25,00,000 (₹25 Lakh)." },
    { id:"l47_WIS", stat:"WIS", xp:85,  text:"Study Fiqh (Islamic Jurisprudence) of one madhab. Understand Halal earnings deeply." },
  ],
  48: [
    { id:"l48_INT", stat:"INT", xp:110, text:"Learn BCI fundamentals — EEG signal processing, brain-computer interface basics." },
    { id:"l48_STR", stat:"STR", xp:90,  text:"Run 10km under 50 minutes. This is genuinely fast." },
    { id:"l48_GLD", stat:"GLD", xp:85,  text:"Establish monthly charity commitment — fixed amount to a meaningful cause." },
    { id:"l48_WIS", stat:"WIS", xp:85,  text:"Mentor 3+ people in their Deen journey. Your knowledge must flow outward." },
  ],
  49: [
    { id:"l49_INT", stat:"INT", xp:110, text:"Create an open-source project with 100+ GitHub stars. Build a community around it." },
    { id:"l49_STR", stat:"STR", xp:90,  text:"Martial arts tournament: Place top 3 or learn deeply from the loss." },
    { id:"l49_GLD", stat:"GLD", xp:85,  text:"Business #1 runs without your daily involvement for 2 full weeks — systems test." },
    { id:"l49_WIS", stat:"WIS", xp:85,  text:"Start planning Hajj seriously — savings target, date, preparation begins." },
  ],
  50: [
    { id:"l50_INT", stat:"INT", xp:140, text:"🔴 BOSS TECH: Build modular robotics platform with swappable AI modules. Open-source it. Paper submitted.", boss:true },
    { id:"l50_STR", stat:"STR", xp:140, text:"🔴 BOSS PHYSICAL: DL 1.8x BW. Sprint triathlon completed. Martial arts tournament entered.", boss:true },
    { id:"l50_WIS", stat:"WIS", xp:140, text:"🔴 BOSS SPIRITUAL: Daily Tahajjud locked. Surah Al-Baqarah fully memorized. I'tikaf completed.", boss:true },
  ],
  // ARC 6 — THE AUTHORITY (L51-L60)
  51: [
    { id:"l51_INT", stat:"INT", xp:120, text:"Master Multi-Agent RL. Train cooperative and competitive robot teams in simulation." },
    { id:"l51_STR", stat:"STR", xp:95,  text:"Deadlift 1.85x BW. Squat 1.7x BW. Bench 1.2x BW." },
    { id:"l51_GLD", stat:"GLD", xp:95,  text:"Net worth crosses ₹50,00,000 (₹50 Lakh)." },
    { id:"l51_WIS", stat:"WIS", xp:95,  text:"Begin Hifz (Quran memorization) program — structured, with a teacher or app." },
  ],
  52: [
    { id:"l52_INT", stat:"INT", xp:120, text:"Build a walking robot (quadruped or biped). Basic gait control implemented." },
    { id:"l52_STR", stat:"STR", xp:95,  text:"Run 10km under 48 minutes. Your engine is powerful." },
    { id:"l52_GLD", stat:"GLD", xp:95,  text:"Business #2 launched and generating initial revenue." },
    { id:"l52_WIS", stat:"WIS", xp:95,  text:"Memorize 5 Juz of Quran (cumulative including previous memorization)." },
  ],
  53: [
    { id:"l53_INT", stat:"INT", xp:120, text:"Design an ASIC or custom silicon concept for AI acceleration. Understand chip design flow." },
    { id:"l53_STR", stat:"STR", xp:95,  text:"Martial arts: Advanced belt. You can now teach beginners properly." },
    { id:"l53_GLD", stat:"GLD", xp:95,  text:"Monthly passive income exceeds ₹75,000." },
    { id:"l53_WIS", stat:"WIS", xp:95,  text:"Study Tafsir of Juz Amma in depth. Understand context and lessons of each Surah." },
  ],
  54: [
    { id:"l54_INT", stat:"INT", xp:120, text:"Implement a Vision-Language Model pipeline. Robot that follows natural language instructions." },
    { id:"l54_STR", stat:"STR", xp:95,  text:"Complete an Olympic distance triathlon (1.5km swim, 40km bike, 10km run)." },
    { id:"l54_GLD", stat:"GLD", xp:95,  text:"First real estate investment — property, REIT, or fractional real estate." },
    { id:"l54_WIS", stat:"WIS", xp:90,  text:"Quit sixth bad habit. The inner transformation is accelerating." },
  ],
  55: [
    { id:"l55_INT", stat:"INT", xp:120, text:"Speak at a tech conference or meetup. Present your robotics/AI work publicly." },
    { id:"l55_STR", stat:"STR", xp:95,  text:"Achieve: 30 strict pull-ups, 100 pushups, 15-second handstand hold." },
    { id:"l55_GLD", stat:"GLD", xp:95,  text:"Total monthly income exceeds ₹3,00,000 from all sources combined." },
    { id:"l55_WIS", stat:"WIS", xp:110, text:"Perform Hajj — the fifth pillar of Islam. A life-defining milestone." },
  ],
  56: [
    { id:"l56_INT", stat:"INT", xp:120, text:"Build a swarm robotics demo: 3+ small robots coordinating on a shared task." },
    { id:"l56_STR", stat:"STR", xp:95,  text:"Deadlift 1.9x BW. The 2x target is within striking distance." },
    { id:"l56_GLD", stat:"GLD", xp:95,  text:"Build a team: 3+ people working in or on your businesses." },
    { id:"l56_WIS", stat:"WIS", xp:95,  text:"Establish Qiyam-ul-Layl (extended night prayer) throughout Ramadan." },
  ],
  57: [
    { id:"l57_INT", stat:"INT", xp:120, text:"Study neuromorphic computing. Understand spiking neural networks and their applications." },
    { id:"l57_STR", stat:"STR", xp:95,  text:"Martial arts: Train consistently with fighters above your level." },
    { id:"l57_GLD", stat:"GLD", xp:95,  text:"Create a will and estate plan. You are building a legacy now." },
    { id:"l57_WIS", stat:"WIS", xp:95,  text:"Learn to give Khutbah (sermon). Speak about Islam publicly at least once." },
  ],
  58: [
    { id:"l58_INT", stat:"INT", xp:120, text:"File a provisional patent for one of your inventions. Protect your intellectual property." },
    { id:"l58_STR", stat:"STR", xp:95,  text:"Complete a full marathon (42.2km). Just finish. You'll cry. It's fine." },
    { id:"l58_GLD", stat:"GLD", xp:95,  text:"International income stream established (USD/EUR earning product or client)." },
    { id:"l58_WIS", stat:"WIS", xp:95,  text:"Hifz progress: 8 Juz cumulative. Maintain revision daily." },
  ],
  59: [
    { id:"l59_INT", stat:"INT", xp:120, text:"Build a complete AI Lab at home: compute cluster, workbench, full test equipment." },
    { id:"l59_STR", stat:"STR", xp:95,  text:"Bodyweight mastery: Muscle-ups, pistol squats, L-sits all achieved." },
    { id:"l59_GLD", stat:"GLD", xp:95,  text:"Net worth crosses ₹75 Lakh. Multiple asset classes active." },
    { id:"l59_WIS", stat:"WIS", xp:95,  text:"Establish local charity initiative or participate in organized dawah." },
  ],
  60: [
    { id:"l60_INT", stat:"INT", xp:150, text:"🔴 BOSS TECH: Launch a robotics product or research project that gains industry attention. Patent filed.", boss:true },
    { id:"l60_STR", stat:"STR", xp:150, text:"🔴 BOSS PHYSICAL: DL 1.9x BW. Full marathon completed. Olympic triathlon completed.", boss:true },
    { id:"l60_WIS", stat:"WIS", xp:150, text:"🔴 BOSS SPIRITUAL: Hajj completed. 8 Juz of Quran memorized. Publicly speaking on Islam.", boss:true },
  ],
  // ARC 7 — THE INNOVATOR (L61-L70)
  61: [
    { id:"l61_INT", stat:"INT", xp:130, text:"Develop a novel algorithm or approach in your AI/Robotics domain. Original research begins." },
    { id:"l61_STR", stat:"STR", xp:100, text:"Deadlift 1.95x BW. The 2x milestone is within one arc." },
    { id:"l61_GLD", stat:"GLD", xp:105, text:"Net worth crosses ₹1 Crore. Seven figures. Milestone of milestones." },
    { id:"l61_WIS", stat:"WIS", xp:100, text:"Hifz reaches 15 Juz. Halfway to becoming a Hafiz." },
  ],
  62: [
    { id:"l62_INT", stat:"INT", xp:130, text:"Build an advanced walking/running robot with dynamic balance control." },
    { id:"l62_STR", stat:"STR", xp:100, text:"Run 10km under 46 minutes. Elite amateur pace." },
    { id:"l62_GLD", stat:"GLD", xp:105, text:"Both businesses profitable without requiring your daily involvement." },
    { id:"l62_WIS", stat:"WIS", xp:100, text:"Study advanced Tafsir — Ibn Kathir for select key Surahs." },
  ],
  63: [
    { id:"l63_INT", stat:"INT", xp:130, text:"Implement a real BCI prototype: read EEG signals, classify mental states accurately." },
    { id:"l63_STR", stat:"STR", xp:100, text:"Martial arts: Advanced practitioner. Compete at regional level event." },
    { id:"l63_GLD", stat:"GLD", xp:105, text:"Monthly passive income exceeds ₹1,50,000." },
    { id:"l63_WIS", stat:"WIS", xp:100, text:"Quit seventh bad habit. Your character is approaching the Prophetic model." },
  ],
  64: [
    { id:"l64_INT", stat:"INT", xp:130, text:"Publish in a peer-reviewed conference (NeurIPS, ICRA, IROS, or equivalent)." },
    { id:"l64_STR", stat:"STR", xp:100, text:"Complete an ultramarathon (50km) OR Half-Ironman 70.3." },
    { id:"l64_GLD", stat:"GLD", xp:105, text:"Angel invest in or advise a startup. Give back to the ecosystem." },
    { id:"l64_WIS", stat:"WIS", xp:100, text:"Lead Taraweeh prayers in Ramadan using your memorized Juz." },
  ],
  65: [
    { id:"l65_INT", stat:"INT", xp:130, text:"Design a complete electronic gadget: idea → schematic → PCB → prototype → tested." },
    { id:"l65_STR", stat:"STR", xp:100, text:"Planche progression, front lever hold, and advanced calisthenics skills achieved." },
    { id:"l65_GLD", stat:"GLD", xp:105, text:"International real estate or business asset acquired." },
    { id:"l65_WIS", stat:"WIS", xp:100, text:"Study Islamic Finance in depth. Audit all businesses for Halal compliance." },
  ],
  66: [
    { id:"l66_INT", stat:"INT", xp:130, text:"Build an AI system that learns from human demonstration (imitation learning / LfD)." },
    { id:"l66_STR", stat:"STR", xp:100, text:"Swim 2km continuous. Multi-discipline endurance is formidable." },
    { id:"l66_GLD", stat:"GLD", xp:105, text:"Total monthly income from all sources exceeds ₹5,00,000." },
    { id:"l66_WIS", stat:"WIS", xp:100, text:"Perform a second Umrah with deeper knowledge, intention, and reflection." },
  ],
  67: [
    { id:"l67_INT", stat:"INT", xp:130, text:"Create a startup or formal research lab. Register entity. Recruit a team." },
    { id:"l67_STR", stat:"STR", xp:100, text:"Martial arts: Black belt or equivalent advanced rank within sight." },
    { id:"l67_GLD", stat:"GLD", xp:105, text:"Build a formal advisory board for your businesses." },
    { id:"l67_WIS", stat:"WIS", xp:100, text:"Establish ongoing Sadaqah Jariyah: a well, school seats, or recurring benefit." },
  ],
  68: [
    { id:"l68_INT", stat:"INT", xp:130, text:"File a full (non-provisional) patent on your core invention. IP is now protected." },
    { id:"l68_STR", stat:"STR", xp:110, text:"🏆 Deadlift 2x bodyweight ACHIEVED. A Level 100 goal completed early." },
    { id:"l68_GLD", stat:"GLD", xp:105, text:"Establish a charitable foundation or structured giving fund." },
    { id:"l68_WIS", stat:"WIS", xp:100, text:"Hifz reaches 20 Juz. The momentum is now unstoppable." },
  ],
  69: [
    { id:"l69_INT", stat:"INT", xp:130, text:"Develop a product that ships to 100+ customers. Real production. Real support." },
    { id:"l69_STR", stat:"STR", xp:100, text:"Run 10km under 45 minutes. This is fast by any standard." },
    { id:"l69_GLD", stat:"GLD", xp:105, text:"Passive income alone covers 100% of living expenses. Financial freedom achieved." },
    { id:"l69_WIS", stat:"WIS", xp:100, text:"Become a known positive force in your local Muslim community." },
  ],
  70: [
    { id:"l70_INT", stat:"INT", xp:160, text:"🔴 BOSS TECH: Launch hardware+AI product with 100+ customers. Patent granted. Peer-reviewed paper published.", boss:true },
    { id:"l70_STR", stat:"STR", xp:160, text:"🔴 BOSS PHYSICAL: DL 2x BW confirmed. Half-Ironman or Ultra completed. Regional martial arts competition.", boss:true },
    { id:"l70_WIS", stat:"WIS", xp:160, text:"🔴 BOSS SPIRITUAL: 20 Juz memorized. Leading Taraweeh prayers. Sadaqah Jariyah established.", boss:true },
  ],
  // ARC 8 — THE COMMANDER (L71-L80)
  71: [
    { id:"l71_INT", stat:"INT", xp:140, text:"Lead a research team (3+ people) on an advanced AI/Robotics project." },
    { id:"l71_STR", stat:"STR", xp:105, text:"Maintain 2x BW deadlift. New target: Squat 2x BW. Begin the grind." },
    { id:"l71_GLD", stat:"GLD", xp:115, text:"Net worth crosses ₹3 Crore." },
    { id:"l71_WIS", stat:"WIS", xp:110, text:"Hifz reaches 25 Juz. The finish line is visible." },
  ],
  72: [
    { id:"l72_INT", stat:"INT", xp:140, text:"Build a humanoid robot upper body OR advanced manipulation system." },
    { id:"l72_STR", stat:"STR", xp:105, text:"Run 10km under 43 minutes. Top 10% for your age group." },
    { id:"l72_GLD", stat:"GLD", xp:115, text:"Third business or major income stream established." },
    { id:"l72_WIS", stat:"WIS", xp:110, text:"Study 'Ihya Ulum al-Din' by Imam Ghazali (selected chapters)." },
  ],
  73: [
    { id:"l73_INT", stat:"INT", xp:140, text:"Develop an AI system with real-time multi-modal reasoning (vision + language + action)." },
    { id:"l73_STR", stat:"STR", xp:105, text:"Martial arts: Black belt / equivalent advanced rank ACHIEVED." },
    { id:"l73_GLD", stat:"GLD", xp:115, text:"Monthly passive income exceeds ₹3,00,000." },
    { id:"l73_WIS", stat:"WIS", xp:105, text:"Quit eighth bad habit. Prophetic character traits are becoming natural to you." },
  ],
  74: [
    { id:"l74_INT", stat:"INT", xp:140, text:"Create an internal R&D lab with dedicated compute, fabrication, and test capabilities." },
    { id:"l74_STR", stat:"STR", xp:105, text:"Complete a full Ironman (3.8km swim, 180km bike, 42km run) OR equivalent ultra." },
    { id:"l74_GLD", stat:"GLD", xp:115, text:"First international business entity or partnership established." },
    { id:"l74_WIS", stat:"WIS", xp:115, text:"Perform Hajj a second time with deeper knowledge and profound intention." },
  ],
  75: [
    { id:"l75_INT", stat:"INT", xp:140, text:"File 3+ patents total. Build a meaningful intellectual property portfolio." },
    { id:"l75_STR", stat:"STR", xp:105, text:"Training is now professionally periodized: strength, endurance, mobility, recovery." },
    { id:"l75_GLD", stat:"GLD", xp:115, text:"Build a personal board: lawyer, CA, financial advisor, business mentor." },
    { id:"l75_WIS", stat:"WIS", xp:110, text:"Teach Quran formally — even one student. Pass on the light of knowledge." },
  ],
  76: [
    { id:"l76_INT", stat:"INT", xp:140, text:"Collaborate with a university or research institution on a joint published project." },
    { id:"l76_STR", stat:"STR", xp:105, text:"You can fight, run, swim, lift, and move — a true all-domain athlete." },
    { id:"l76_GLD", stat:"GLD", xp:115, text:"Assets across 5+ classes: equity, real estate, gold, business equity, international." },
    { id:"l76_WIS", stat:"WIS", xp:110, text:"Hifz reaches 28 Juz. The final push begins." },
  ],
  77: [
    { id:"l77_INT", stat:"INT", xp:140, text:"Build an AI swarm system: autonomous agents coordinating complex real-world tasks." },
    { id:"l77_STR", stat:"STR", xp:105, text:"Compete at national-level martial arts tournament." },
    { id:"l77_GLD", stat:"GLD", xp:115, text:"Net worth crosses ₹5 Crore." },
    { id:"l77_WIS", stat:"WIS", xp:110, text:"Establish a regular Islamic study circle (Halaqah) that you lead or co-lead." },
  ],
  78: [
    { id:"l78_INT", stat:"INT", xp:140, text:"Keynote at a major tech conference. Your name draws attendees to sessions." },
    { id:"l78_STR", stat:"STR", xp:105, text:"Maintain peak fitness while running a company. The hardest physical feat." },
    { id:"l78_GLD", stat:"GLD", xp:115, text:"Your businesses employ 10+ people. You are creating livelihoods." },
    { id:"l78_WIS", stat:"WIS", xp:110, text:"Your charitable foundation impacts 100+ people annually." },
  ],
  79: [
    { id:"l79_INT", stat:"INT", xp:140, text:"Your lab/company's work is featured in major tech media (IEEE, TechCrunch, etc.)." },
    { id:"l79_STR", stat:"STR", xp:105, text:"5+ years of consistent training. Train 5+ days/week without breaking." },
    { id:"l79_GLD", stat:"GLD", xp:115, text:"Total annual income exceeds ₹50,00,000 from multiple sources." },
    { id:"l79_WIS", stat:"WIS", xp:110, text:"Study Maqasid al-Shariah (Objectives of Islamic Law). Apply to business decisions." },
  ],
  80: [
    { id:"l80_INT", stat:"INT", xp:170, text:"🔴 BOSS TECH: Your AI/Robotics company has team, IP portfolio, and media recognition. Real-world impact proven.", boss:true },
    { id:"l80_STR", stat:"STR", xp:170, text:"🔴 BOSS PHYSICAL: Black belt achieved. Full Ironman/Ultra completed. Peak fitness maintained for years.", boss:true },
    { id:"l80_WIS", stat:"WIS", xp:170, text:"🔴 BOSS SPIRITUAL: 28 Juz memorized. Second Hajj complete. Teaching Quran. Halaqah established.", boss:true },
  ],
  // ARC 9 — THE VISIONARY (L81-L90)
  81: [
    { id:"l81_INT", stat:"INT", xp:150, text:"Pioneer a new approach in embodied AI — something no one else is working on yet." },
    { id:"l81_STR", stat:"STR", xp:110, text:"All peak metrics maintained: 2x BW DL, sub-45 10km, black belt, triathlon-capable." },
    { id:"l81_GLD", stat:"GLD", xp:125, text:"Net worth crosses ₹10 Crore." },
    { id:"l81_WIS", stat:"WIS", xp:125, text:"🏆 HAFIZ STATUS ACHIEVED — All 30 Juz of Quran memorized. Allahu Akbar." },
  ],
  82: [
    { id:"l82_INT", stat:"INT", xp:150, text:"Build a robot that passes a complex autonomous real-world task benchmark." },
    { id:"l82_STR", stat:"STR", xp:110, text:"Full health optimization: VO2 max testing, blood panels, sleep tracking, recovery dialed." },
    { id:"l82_GLD", stat:"GLD", xp:125, text:"Annual passive income exceeds ₹60,00,000." },
    { id:"l82_WIS", stat:"WIS", xp:120, text:"Begin regular revision cycle to maintain Hifz — 1 Juz/day review schedule." },
  ],
  83: [
    { id:"l83_INT", stat:"INT", xp:150, text:"Advanced BCI integration: control a robot arm using classified neural signals." },
    { id:"l83_STR", stat:"STR", xp:110, text:"Martial arts mastery: You can teach, compete, and defend. Multiple styles explored." },
    { id:"l83_GLD", stat:"GLD", xp:125, text:"International assets and investments established in 2+ countries." },
    { id:"l83_WIS", stat:"WIS", xp:120, text:"Study Islamic counseling and conflict resolution. Become a source of community wisdom." },
  ],
  84: [
    { id:"l84_INT", stat:"INT", xp:150, text:"Your company/lab has raised funding or generates significant revenue from IP licensing." },
    { id:"l84_STR", stat:"STR", xp:110, text:"Complete a multi-day endurance event (stage race, ultra-marathon, bike tour)." },
    { id:"l84_GLD", stat:"GLD", xp:125, text:"Businesses run entirely without daily involvement. You are CEO, not operator." },
    { id:"l84_WIS", stat:"WIS", xp:125, text:"Perform Hajj with your family. Share this pillar with your loved ones." },
  ],
  85: [
    { id:"l85_INT", stat:"INT", xp:150, text:"10+ publications or patents to your name. You are a recognized researcher-inventor." },
    { id:"l85_STR", stat:"STR", xp:110, text:"Physical performance in top 5% of your age group nationally — verified." },
    { id:"l85_GLD", stat:"GLD", xp:125, text:"Establish a Waqf (Islamic endowment). This is the pinnacle of spiritual + financial legacy." },
    { id:"l85_WIS", stat:"WIS", xp:120, text:"Your Waqf serves the community continuously — mosque, school, well, or hospital." },
  ],
  86: [
    { id:"l86_INT", stat:"INT", xp:150, text:"Build a general-purpose robotic manipulation system. The holy grail of robotics." },
    { id:"l86_STR", stat:"STR", xp:110, text:"Train in a second martial art to complement your primary style." },
    { id:"l86_GLD", stat:"GLD", xp:125, text:"Net worth crosses ₹15 Crore. Generational wealth territory." },
    { id:"l86_WIS", stat:"WIS", xp:120, text:"You are known in your community as someone of exemplary Islamic character." },
  ],
  87: [
    { id:"l87_INT", stat:"INT", xp:150, text:"Collaborate with international institutions (MIT, Stanford, KAIST, or equivalent)." },
    { id:"l87_STR", stat:"STR", xp:110, text:"Peak aesthetic physique — visibly fit, strong, and capable. No lifestyle diseases." },
    { id:"l87_GLD", stat:"GLD", xp:125, text:"Angel invest in 3+ startups. Build the next generation of founders." },
    { id:"l87_WIS", stat:"WIS", xp:120, text:"Study comparative religion with humility. Strengthen your own faith through understanding." },
  ],
  88: [
    { id:"l88_INT", stat:"INT", xp:150, text:"Your technology is deployed in a real industry: manufacturing, healthcare, or agriculture." },
    { id:"l88_STR", stat:"STR", xp:110, text:"Night prayers are as natural as breathing. Body and soul are synchronized." },
    { id:"l88_GLD", stat:"GLD", xp:125, text:"Create a scholarship fund for engineering/tech students." },
    { id:"l88_WIS", stat:"WIS", xp:120, text:"Tahajjud + Witr prayers are as automatic as sleeping. Never missed." },
  ],
  89: [
    { id:"l89_INT", stat:"INT", xp:150, text:"You are invited to advise governments or major corporations on AI/Robotics policy." },
    { id:"l89_STR", stat:"STR", xp:110, text:"Your training routine is sustainable for decades. Longevity is the game now." },
    { id:"l89_GLD", stat:"GLD", xp:125, text:"Financial legacy fully structured: trust, will, Waqf, and succession plan complete." },
    { id:"l89_WIS", stat:"WIS", xp:120, text:"Raise your family on these principles. Your legacy is generational and living." },
  ],
  90: [
    { id:"l90_INT", stat:"INT", xp:180, text:"🔴 BOSS TECH: Technology deployed in real industry. International recognition. Government advisory role.", boss:true },
    { id:"l90_STR", stat:"STR", xp:180, text:"🔴 BOSS PHYSICAL: All peak metrics maintained for years. Multi-art martial artist. Multi-sport athlete.", boss:true },
    { id:"l90_WIS", stat:"WIS", xp:180, text:"🔴 BOSS SPIRITUAL: Hafiz. Waqf active. Hajj with family. Community pillar. Generational faith legacy.", boss:true },
  ],
  // ARC 10 — THE SOVEREIGN (L91-L100)
  91: [
    { id:"l91_INT", stat:"INT", xp:160, text:"Your lab/company is a top-50 global entity in AI/Robotics. Measured, documented." },
    { id:"l91_STR", stat:"STR", xp:115, text:"All physical benchmarks maintained: 2x BW DL, sub-45 10km, black belt, triathlon-ready." },
    { id:"l91_GLD", stat:"GLD", xp:135, text:"Net worth exceeds ₹25 Crore." },
    { id:"l91_WIS", stat:"WIS", xp:130, text:"Maintain Hifz with daily revision. The Quran lives permanently in your heart." },
  ],
  92: [
    { id:"l92_INT", stat:"INT", xp:160, text:"Build something that has never existed before. True invention at the frontier." },
    { id:"l92_STR", stat:"STR", xp:115, text:"Compete in a master's division athletic event. Age is irrelevant to your capacity." },
    { id:"l92_GLD", stat:"GLD", xp:135, text:"Your businesses collectively employ 50+ people." },
    { id:"l92_WIS", stat:"WIS", xp:130, text:"Perform Hajj as a true farewell — with the depth and gravity it deserves." },
  ],
  93: [
    { id:"l93_INT", stat:"INT", xp:160, text:"Your open-source contributions are used by 10,000+ developers and researchers globally." },
    { id:"l93_STR", stat:"STR", xp:115, text:"Your physical discipline visibly inspires others. Mentor young athletes." },
    { id:"l93_GLD", stat:"GLD", xp:135, text:"Annual charitable giving exceeds ₹25 Lakh." },
    { id:"l93_WIS", stat:"WIS", xp:130, text:"Your Waqf is self-sustaining and actively impacting hundreds of lives." },
  ],
  94: [
    { id:"l94_INT", stat:"INT", xp:160, text:"Keynote at the world's top conferences: NeurIPS, CES, TED. You are a thought leader." },
    { id:"l94_STR", stat:"STR", xp:115, text:"Complete the most challenging endurance event you have ever faced." },
    { id:"l94_GLD", stat:"GLD", xp:135, text:"Financial systems fully automated: investments, businesses, giving." },
    { id:"l94_WIS", stat:"WIS", xp:130, text:"You are a reference point for Islamic character and wisdom in your circle." },
  ],
  95: [
    { id:"l95_INT", stat:"INT", xp:160, text:"Establish an R&D fellowship or innovation grant for young engineers and inventors." },
    { id:"l95_STR", stat:"STR", xp:115, text:"Zero lifestyle diseases. Perfect health panels. Body has served decades of excellence." },
    { id:"l95_GLD", stat:"GLD", xp:135, text:"You have no need to work for money. You work exclusively for purpose and legacy." },
    { id:"l95_WIS", stat:"WIS", xp:130, text:"Daily: Fajr, Duha, Dhuhr, Asr, Maghrib, Isha, Tahajjud — all locked, all joyful." },
  ],
  96: [
    { id:"l96_INT", stat:"INT", xp:160, text:"Your products or technology improve lives at scale: healthcare, education, accessibility." },
    { id:"l96_STR", stat:"STR", xp:115, text:"Martial arts: Teaching lineage established. Your students carry forward your art." },
    { id:"l96_GLD", stat:"GLD", xp:135, text:"Generational wealth secured. Next generation educated, prepared, and values-driven." },
    { id:"l96_WIS", stat:"WIS", xp:130, text:"Teach your spiritual practices to the next generation. Living legacy." },
  ],
  97: [
    { id:"l97_INT", stat:"INT", xp:160, text:"Write a definitive book on your domain. Codify your knowledge for the next generation." },
    { id:"l97_STR", stat:"STR", xp:115, text:"Physical training is meditation. Every movement is intentional and purposeful." },
    { id:"l97_GLD", stat:"GLD", xp:135, text:"Your Waqf supports multiple community projects simultaneously and indefinitely." },
    { id:"l97_WIS", stat:"WIS", xp:130, text:"Write about your spiritual journey. Let it guide others who are just beginning." },
  ],
  98: [
    { id:"l98_INT", stat:"INT", xp:160, text:"Build a research institute or advanced lab that operates fully independently of you." },
    { id:"l98_STR", stat:"STR", xp:115, text:"You are fit enough to do anything, anywhere, at any time. True readiness." },
    { id:"l98_GLD", stat:"GLD", xp:135, text:"Assets across global markets: India, UAE, USA, EU — fully diversified." },
    { id:"l98_WIS", stat:"WIS", xp:130, text:"Your relationship with Allah ﷻ is the foundation of everything you have built." },
  ],
  99: [
    { id:"l99_INT", stat:"INT", xp:160, text:"Your name is synonymous with innovation and invention in your field. Globally." },
    { id:"l99_STR", stat:"STR", xp:115, text:"Peak physique, peak health, peak readiness. The body is the temple, perfectly maintained." },
    { id:"l99_GLD", stat:"GLD", xp:135, text:"Total financial independence. Money is a tool, not a master. You are free." },
    { id:"l99_WIS", stat:"WIS", xp:130, text:"Every action is an act of worship: work is ibadah, fitness is ibadah, giving is ibadah." },
  ],
  100: [
    { id:"l100_INT", stat:"INT", xp:200, text:"🔴 FINAL BOSS: World-recognized scientist-inventor. Research institute operational. Book published. Global impact.", boss:true },
    { id:"l100_STR", stat:"STR", xp:200, text:"🔴 FINAL BOSS: All physical goals achieved and maintained. Martial arts master. Multi-sport athlete. Teaching lineage.", boss:true },
    { id:"l100_GLD", stat:"GLD", xp:200, text:"🔴 FINAL BOSS: Net worth > ₹25Cr. Passive income covers all. Waqf sustaining communities. Legacy secured.", boss:true },
    { id:"l100_WIS", stat:"WIS", xp:200, text:"🔴 FINAL BOSS: Hafiz. Multiple Hajj. Waqf active. Community beacon. Family legacy of faith established.", boss:true },
  ],
};

// ─── ARC DATA ────────────────────────────────────────────────────────────────
const ARC_DATA = [
  { arc:1, title:"THE AWAKENING",      sub:"E-Rank Awakens",            theme:"Forge the foundation. Build habits. First contact with every stat tree. Survive." },
  { arc:2, title:"THE FOUNDATION",     sub:"D-Rank Consolidates",       theme:"Transform from someone who 'knows of' things to someone who can BUILD them." },
  { arc:3, title:"THE SPECIALIZATION", sub:"C-Rank Chooses a Path",     theme:"You choose your trees: RL + Robotics. Everything compounds now." },
  { arc:4, title:"THE MONETIZER",      sub:"B-Rank Enters the Arena",   theme:"Turn your skills into machines that generate value. First real product." },
  { arc:5, title:"THE ENGINEER",       sub:"A-Rank Builds Systems",     theme:"You engineer systems designed to scale, last, and compound. Boys become men." },
  { arc:6, title:"THE AUTHORITY",      sub:"S-Rank Commands Respect",   theme:"You ARE recognized. Speak at events. Lead teams. Your name matters." },
  { arc:7, title:"THE INNOVATOR",      sub:"National Rank Pushes Limits",theme:"You no longer follow roadmaps. You CREATE them. Original thought begins." },
  { arc:8, title:"THE COMMANDER",      sub:"International Rank",        theme:"You command teams, labs, and organizations. Output multiplies through people." },
  { arc:9, title:"THE VISIONARY",      sub:"Continent Rank",            theme:"You see what others cannot. Building 10 years ahead. Legacy is forming." },
  { arc:10,title:"THE SOVEREIGN",      sub:"World Rank — No Higher",    theme:"There is no higher rank. You have transcended. You ARE the System." },
];

const RANKS = {"E":"#94a3b8","D":"#4ade80","C":"#60a5fa","B":"#c084fc","A":"#fb923c","S":"#fbbf24","S+":"#f59e0b","SS":"#ff6b00","SSS":"#ff2200","NAT":"#ff00ff","SOVEREIGN":"#00e5ff"};
const RANK_AT = (l) => l<=5?"E":l<=10?"E":l<=15?"D":l<=20?"D":l<=25?"C":l<=30?"C":l<=35?"B":l<=40?"B":l<=45?"A":l<=50?"A":l<=55?"S":l<=60?"S":l<=65?"S+":l<=70?"S+":l<=75?"SS":l<=80?"SS":l<=85?"SSS":l<=90?"SSS":l<=95?"NAT":l<=99?"NAT":"SOVEREIGN";
const STAT_CFG = {
  STR:{color:"#ef4444",icon:"⚔️",full:"Strength"},
  AGI:{color:"#f97316",icon:"⚡",full:"Agility"},
  INT:{color:"#8b5cf6",icon:"🧠",full:"Intelligence"},
  WIS:{color:"#22c55e",icon:"🌙",full:"Wisdom"},
  GLD:{color:"#eab308",icon:"💰",full:"Wealth"},
};

const INIT_LINES = [
  "","  ▌ SCANNING PLAYER...","","  Name ............. AATIF",
  "  Age .............. 24","  Location ......... Ahmedabad, India",
  "  Profession ....... ML Engineer @ TCS",
  "  Class ............ TECHNOMANCER","  Current Rank ..... E","",
  "  ▌ ANALYZING POTENTIAL...",
  "","  STR  ░░░░░░░░░░  0",
  "  AGI  ░░░░░░░░░░  0","  INT  ░░░░░░░░░░  0",
  "  WIS  ░░░░░░░░░░  0","  GLD  ░░░░░░░░░░  0","",
  "  Result: ██████████  EXTRAORDINARY","  Class Path: TECHNOMANCER → SOVEREIGN",
  "  Target:  LEVEL 100","",
  "  ▌ LOADING QUEST LOG (100 LEVELS)...",
  "  [████████████████████]  COMPLETE","",
  "  ▌ ARMING PENALTY ENGINE...",
  "  [████████████████████]  ARMED","",
  "  ══════════════════════════════════",
  "    SYSTEM INITIALIZATION COMPLETE",
  "  ══════════════════════════════════","",
  "  The System does not negotiate.",
  "  The System does not forgive.",
  "  The System rewards the relentless.","",
  "  Rise, Player. Or be forgotten.","",
  "  ▌ [ PRESS  ▶  BEGIN  ]",
];

const PENALTIES = [
  { trigger:"Miss any daily prayer",         penalty:"50 Burpees immediately.",             icon:"🕌", color:"#22c55e" },
  { trigger:"Skip Physical Training",        penalty:"200 Squats before sleep.",            icon:"⚔️", color:"#ef4444" },
  { trigger:"Miss Deep Work block",          penalty:"48hr social media ban.",              icon:"🧠", color:"#8b5cf6" },
  { trigger:"Miss Quran recitation",         penalty:"Double recitation + ₹100 charity.",  icon:"📖", color:"#22c55e" },
  { trigger:"3+ missed quests in a week",    penalty:"7-day full social media ban.",        icon:"💀", color:"#ff4444" },
  { trigger:"Boss Raid failure",             penalty:"LEVEL RESET -3 levels. Public post.", icon:"☠️", color:"#ff0000" },
];

// ─── GAME STATE ───────────────────────────────────────────────────────────────
const INIT_STATE = {
  screen: "boot",
  level: 1,
  xp: 0,
  totalXP: 0,
  stats: { STR:0, AGI:0, INT:0, WIS:0, GLD:0 },
  completedQuests: {},
  completedLevels: [],
  penalties: 0,
  log: [],
  updatedAt: 0,
};

function computeXPRequired(level) {
  return Math.floor(100 + (level-1)*22 + Math.pow(level-1,1.35)*10);
}

function reducer(state, action) {
  const ts = new Date().toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"});
  switch(action.type) {
    case "LOAD_STATE": {
      return {
        ...state,
        ...action.payload,
      };
    }
    case "START": return { ...state, screen:"game", updatedAt: Date.now() };
    case "TOGGLE_QUEST": {
      const { qid, xp, stat, done } = action;
      const newQuests = { ...state.completedQuests };
      const newStats = { ...state.stats };
      let dxp = 0;
      if (done) {
        // uncomplete
        delete newQuests[qid];
        newStats[stat] = Math.max(0, newStats[stat] - Math.ceil(xp/15));
        if (stat === "STR") newStats.AGI = Math.max(0, newStats.AGI - 1);
        dxp = -xp;
      } else {
        // complete
        newQuests[qid] = true;
        newStats[stat] = newStats[stat] + Math.ceil(xp/15);
        if (stat === "STR") newStats.AGI = newStats.AGI + 1;
        dxp = xp;
      }
      const msg = done ? `Quest undone. -${xp} XP` : `Quest complete! +${xp} XP | ${stat} increased`;
      return {
        ...state,
        completedQuests: newQuests,
        stats: newStats,
        xp: Math.max(0, state.xp + dxp),
        totalXP: Math.max(0, state.totalXP + dxp),
        log: [...state.log.slice(-49), { msg, color: done?"#555":"#4ade80", ts }],
        updatedAt: Date.now(),
      };
    }
    case "LEVEL_UP": {
      return { ...state, screen:"levelup", completedLevels:[...state.completedLevels, state.level],
        log:[...state.log.slice(-49),{msg:`⚡ LEVEL ${state.level} CLEARED.`,color:"#00e5ff",ts}],
        updatedAt: Date.now(),
      };
    }
    case "ADVANCE": {
      const next = state.level + 1;
      if (next > 100) return { ...state, screen:"win", updatedAt: Date.now() };
      return { ...state, screen:"game", level:next, xp:0,
        log:[...state.log.slice(-49),{msg:`Level ${next} quest log activated.`,color:"#fbbf24",ts}],
        updatedAt: Date.now(),
      };
    }
    case "PENALTY": {
      return { ...state, penalties: state.penalties+1,
        log:[...state.log.slice(-49),{msg:`⚠ PENALTY: ${action.label}`,color:"#ff4444",ts}],
        updatedAt: Date.now(),
      };
    }
    default: return state;
  }
}


// ─── COMPONENTS ───────────────────────────────────────────────────────────────
function SBar({ stat, value, size="md" }) {
  const c = STAT_CFG[stat];
  const max = Math.max(value+15, 30);
  const pct = Math.min((value/max)*100,100);
  const h = size==="sm"?4:7;
  return (
    <div style={{display:"flex",alignItems:"center",gap:7}}>
      <span style={{fontFamily:"monospace",fontSize:size==="sm"?9:11,color:c.color,minWidth:size==="sm"?28:34,fontWeight:700}}>{stat}</span>
      <div style={{flex:1,height:h,background:"#ffffff0a",borderRadius:h,overflow:"hidden"}}>
        <div style={{height:"100%",width:`${pct}%`,background:`linear-gradient(90deg,${c.color}66,${c.color})`,transition:"width 0.5s ease",boxShadow:`0 0 6px ${c.color}44`}}/>
      </div>
      <span style={{fontFamily:"monospace",fontSize:size==="sm"?9:10,color:"#666",minWidth:24,textAlign:"right"}}>{value}</span>
    </div>
  );
}

// ─── BOOT SCREEN ─────────────────────────────────────────────────────────────
function BootScreen({ onStart }) {
  const [lines, setLines] = useState([]);
  const [done, setDone] = useState(false);
  const [li, setLi] = useState(0);
  const [ci, setCi] = useState(0);
  useEffect(() => {
    if (li >= INIT_LINES.length) { setDone(true); return; }
    const line = INIT_LINES[li];
    if (ci < line.length) {
      const t = setTimeout(() => setCi(c=>c+1), 14);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => { setLines(l=>[...l, line]); setLi(i=>i+1); setCi(0); }, line===""?60:45);
      return () => clearTimeout(t);
    }
  }, [li, ci]);

  const current = li < INIT_LINES.length ? INIT_LINES[li].slice(0, ci) : "";

  return (
    <div style={{minHeight:"100vh",background:"#020209",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{width:"100%",maxWidth:520,background:"#040412",border:"1px solid #00e5ff1a",borderRadius:6,padding:"28px 32px",minHeight:400}}>
        <div style={{color:"#00e5ff33",fontFamily:"monospace",fontSize:9,letterSpacing:3,marginBottom:16}}>SYSTEM ARCHITECT v1.0 — SOLO LEVELING PROTOCOL</div>
        <pre style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,lineHeight:1.9,whiteSpace:"pre-wrap",margin:0}}>
          {lines.map((ln,i)=>{
            const isBright = ln.includes("COMPLETE")||ln.includes("ARMED")||ln.includes("EXTRAORDINARY");
            const isWarn = ln.includes("Rise")||ln.includes("relentless")||ln.includes("forgive")||ln.includes("negotiate");
            const isSep = ln.includes("═");
            const isBegin = ln.includes("BEGIN");
            return <span key={i} style={{display:"block",color:isBegin?"#ffd700":isSep?"#fff":isBright?"#4ade80":isWarn?"#ff6666":"#00e5ff88",fontWeight:isSep||isBright?"700":"400"}}>{ln||"\u00A0"}</span>;
          })}
          {li < INIT_LINES.length && <span style={{color:"#00e5ff88"}}>{current}<span style={{animation:"blink .6s step-end infinite"}}>█</span></span>}
        </pre>
        {done && (
          <div style={{marginTop:28,textAlign:"center"}}>
            <button onClick={onStart} style={{padding:"13px 52px",background:"transparent",border:"2px solid #00e5ff",color:"#00e5ff",fontFamily:"monospace",fontSize:14,letterSpacing:4,cursor:"pointer",boxShadow:"0 0 20px #00e5ff33",animation:"glow 1.4s ease-in-out infinite"}}>
              ▶ BEGIN
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── LEVEL UP SCREEN ──────────────────────────────────────────────────────────
function LevelUpScreen({ level, isBoss, arcName, onContinue }) {
  const [vis, setVis] = useState(false);
  useEffect(()=>{ const t=setTimeout(()=>setVis(true),60); return ()=>clearTimeout(t); },[]);
  const rank = RANK_AT(level);
  const rc = RANKS[rank]||"#00e5ff";
  return (
    <div style={{minHeight:"100vh",background:"#020209",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{textAlign:"center",maxWidth:440,opacity:vis?1:0,transform:vis?"translateY(0)":"translateY(24px)",transition:"all .55s cubic-bezier(.4,0,.2,1)"}}>
        {isBoss ? (
          <>
            <div style={{fontSize:52,marginBottom:8}}>⚔️</div>
            <div style={{fontFamily:"monospace",fontSize:10,color:"#ff444499",letterSpacing:4,marginBottom:6}}>GATE CLEARED</div>
            <div style={{fontFamily:"'Bebas Neue','Impact',sans-serif",fontSize:44,color:"#ffd700",letterSpacing:6,lineHeight:1,marginBottom:4,textShadow:"0 0 28px #ffd70066"}}>ARC COMPLETE</div>
            <div style={{fontSize:14,color:"#ffd70077",marginBottom:20}}>{arcName}</div>
          </>
        ) : (
          <>
            <div style={{fontFamily:"monospace",fontSize:10,color:"#00e5ff66",letterSpacing:4,marginBottom:6}}>QUEST LOG CLEARED</div>
            <div style={{fontFamily:"'Bebas Neue','Impact',sans-serif",fontSize:60,color:"#00e5ff",letterSpacing:6,lineHeight:1,textShadow:"0 0 36px #00e5ff55",marginBottom:4}}>LEVEL UP</div>
            <div style={{fontFamily:"'Bebas Neue','Impact',sans-serif",fontSize:32,color:"#fff",letterSpacing:4,marginBottom:4}}>LEVEL {level}</div>
          </>
        )}
        <div style={{display:"inline-block",padding:"4px 18px",background:`${rc}18`,border:`1px solid ${rc}44`,borderRadius:4,marginBottom:24}}>
          <span style={{fontFamily:"monospace",fontSize:12,color:rc,fontWeight:700,letterSpacing:2}}>{rank}-RANK HUNTER</span>
        </div>
        <div>
          <button onClick={onContinue} style={{padding:"12px 44px",background:isBoss?"linear-gradient(135deg,#ffd700,#ff8c00)":"linear-gradient(135deg,#0055ff,#00e5ff)",border:"none",borderRadius:6,fontFamily:"monospace",fontSize:13,color:"#000",fontWeight:700,letterSpacing:3,cursor:"pointer"}}>
            {isBoss ? "ENTER NEXT ARC ▶" : "CONTINUE ▶"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── WIN SCREEN ───────────────────────────────────────────────────────────────
function WinScreen({ totalXP }) {
  return (
    <div style={{minHeight:"100vh",background:"#020209",display:"flex",alignItems:"center",justifyContent:"center",textAlign:"center",padding:20}}>
      <div>
        <div style={{fontSize:72,marginBottom:12}}>👑</div>
        <div style={{fontFamily:"'Bebas Neue','Impact',sans-serif",fontSize:56,color:"#00e5ff",letterSpacing:8,textShadow:"0 0 60px #00e5ff88",marginBottom:8}}>THE SOVEREIGN</div>
        <div style={{fontFamily:"monospace",fontSize:13,color:"#555",maxWidth:400,margin:"0 auto",lineHeight:2}}>
          You have transcended the System.<br/>You ARE the System.<br/><br/>
          Total XP: <span style={{color:"#fbbf24"}}>{totalXP.toLocaleString()}</span><br/>
          All 100 Levels Cleared.
        </div>
      </div>
    </div>
  );
}

// ─── MAIN GAME ────────────────────────────────────────────────────────────────
function GameScreen({ state, dispatch, user, syncing, onOpenSyncModal }) {
  const [tab, setTab] = useState("quests");
  const [penModal, setPenModal] = useState(false);
  const [logOpen, setLogOpen] = useState(false);

  const lvl = state.level;
  const quests = ALL_QUESTS[lvl] || [];
  const arc = Math.ceil(lvl / 10);
  const arcData = ARC_DATA[arc-1];
  const rank = RANK_AT(lvl);
  const rc = RANKS[rank] || "#00e5ff";
  const isBoss = lvl % 10 === 0;
  const xpReq = computeXPRequired(lvl);
  const xpPct = Math.min((state.xp / xpReq) * 100, 100);
  const doneCount = quests.filter(q => state.completedQuests[q.id]).length;
  const allDone = doneCount === quests.length && quests.length > 0;
  const arcLevels = Array.from({length:10},(_,i)=>(arc-1)*10+i+1);

  return (
    <div style={{minHeight:"100vh",background:"#020209",color:"#e0e0e0",fontFamily:"sans-serif",display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <div style={{background:"#040412",borderBottom:"1px solid #00e5ff15",padding:"10px 18px",display:"flex",alignItems:"center",gap:14,flexWrap:"wrap",flexShrink:0}}>
        <div>
          <div style={{fontFamily:"monospace",fontSize:8,color:"#00e5ff44",letterSpacing:2}}>PLAYER</div>
          <div style={{fontFamily:"monospace",fontSize:22,color:"#fff",fontWeight:900,letterSpacing:3,lineHeight:1}}>AATIF</div>
        </div>
        <div style={{width:1,height:32,background:"#ffffff0f"}}/>
        <div>
          <div style={{fontFamily:"monospace",fontSize:8,color:"#00e5ff44",letterSpacing:2}}>LEVEL</div>
          <div style={{fontFamily:"monospace",fontSize:30,color:"#00e5ff",fontWeight:900,letterSpacing:2,lineHeight:1}}>{lvl}</div>
        </div>
        <div style={{padding:"3px 10px",background:`${rc}15`,border:`1px solid ${rc}33`,borderRadius:4}}>
          <div style={{fontFamily:"monospace",fontSize:8,color:`${rc}88`,letterSpacing:2}}>RANK</div>
          <div style={{fontFamily:"monospace",fontSize:17,color:rc,fontWeight:900,letterSpacing:2,lineHeight:1}}>{rank}</div>
        </div>
        <div style={{flex:1,minWidth:140}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
            <span style={{fontFamily:"monospace",fontSize:8,color:"#00e5ff44"}}>XP</span>
            <span style={{fontFamily:"monospace",fontSize:8,color:"#00e5ff44"}}>{state.xp} / {xpReq}</span>
          </div>
          <div style={{height:5,background:"#ffffff08",borderRadius:3,overflow:"hidden"}}>
            <div style={{height:"100%",width:`${xpPct}%`,background:"linear-gradient(90deg,#0055ff,#00e5ff)",transition:"width .7s ease"}}/>
          </div>
        </div>
        <div style={{display:"flex",gap:6,marginLeft:"auto",alignItems:"center"}}>
          {isBoss && <div style={{padding:"3px 8px",background:"#ff000018",border:"1px solid #ff333333",borderRadius:4,fontFamily:"monospace",fontSize:8,color:"#ff4444"}}>⚠ BOSS</div>}
          
          {/* Cloud Sync Status Badge */}
          <button 
            onClick={onOpenSyncModal} 
            style={{
              padding:"4px 10px",
              background: user ? "rgba(0, 229, 255, 0.08)" : "rgba(255, 255, 255, 0.04)",
              border: user ? "1px solid rgba(0, 229, 255, 0.3)" : "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius:4,
              color: user ? "#00e5ff" : "#888",
              fontFamily:"monospace",
              fontSize:8,
              cursor:"pointer",
              display:"flex",
              alignItems:"center",
              gap:4,
              transition:"all 0.2s"
            }}
          >
            <span style={{fontSize: 10}}>{syncing ? "⏳" : user ? "☁️" : "☁️❌"}</span>
            <span>{syncing ? "SYNCING..." : user ? "CLOUD SYNC" : "CONNECT SYNC"}</span>
          </button>

          <button onClick={()=>setLogOpen(!logOpen)} style={{padding:"4px 10px",background:"#ffffff08",border:"1px solid #ffffff15",borderRadius:4,color:"#666",fontFamily:"monospace",fontSize:8,cursor:"pointer"}}>LOG</button>
          <button onClick={()=>setPenModal(true)} style={{padding:"4px 10px",background:"#ff00000a",border:"1px solid #ff222222",borderRadius:4,color:"#ff5555",fontFamily:"monospace",fontSize:8,cursor:"pointer"}}>PENALTY</button>
        </div>
      </div>


      <div style={{background:isBoss?"#0d0005":"#02020d",borderBottom:"1px solid #ffffff08",padding:"7px 18px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
        <div>
          <span style={{fontFamily:"monospace",fontSize:8,color:"#ffffff22"}}>ARC {arc} — </span>
          <span style={{fontFamily:"monospace",fontSize:13,color:isBoss?"#ff4444":"#00e5ff77",fontWeight:700,letterSpacing:2}}>{arcData?.title}</span>
        </div>
        <div style={{display:"flex",gap:3}}>
          {arcLevels.map(al=>{
            const done=state.completedLevels.includes(al);
            const cur=al===lvl;
            const boss=al%10===0;
            return <div key={al} style={{width:boss?12:8,height:7,borderRadius:2,background:done?"#00e5ff":cur?(boss?"#ff222244":"#00e5ff22"):"#ffffff0a",border:cur?`1px solid ${boss?"#ff4444":"#00e5ff"}`:"none"}}/>;
          })}
        </div>
      </div>

      <div style={{display:"flex",flex:1,overflow:"hidden"}}>
        <div style={{width:165,flexShrink:0,background:"#030310",borderRight:"1px solid #ffffff08",padding:14,display:"flex",flexDirection:"column",gap:13,overflowY:"auto"}}>
          <div>
            <div style={{fontFamily:"monospace",fontSize:8,color:"#ffffff22",letterSpacing:2,marginBottom:9}}>BASE STATS</div>
            {Object.keys(state.stats).map(k=><SBar key={k} stat={k} value={state.stats[k]} size="sm"/>)}
          </div>
          <div style={{borderTop:"1px solid #ffffff08",paddingTop:11}}>
            <div style={{fontFamily:"monospace",fontSize:8,color:"#ffffff22",letterSpacing:2,marginBottom:4}}>TOTAL XP</div>
            <div style={{fontFamily:"monospace",fontSize:22,color:"#fbbf24",fontWeight:900}}>{state.totalXP.toLocaleString()}</div>
          </div>
          <div style={{borderTop:"1px solid #ffffff08",paddingTop:11}}>
            <div style={{fontFamily:"monospace",fontSize:8,color:"#ffffff22",letterSpacing:2,marginBottom:4}}>LEVELS CLEARED</div>
            <div style={{fontFamily:"monospace",fontSize:22,color:"#4ade80",fontWeight:900}}>{state.completedLevels.length} <span style={{fontSize:11,color:"#ffffff22",fontWeight:400}}>/ 100</span></div>
          </div>
          <div style={{borderTop:"1px solid #ffffff08",paddingTop:11}}>
            <div style={{fontFamily:"monospace",fontSize:8,color:"#ffffff22",letterSpacing:2,marginBottom:6}}>QUESTS</div>
            <div style={{height:5,background:"#ffffff08",borderRadius:3,overflow:"hidden",marginBottom:4}}>
              <div style={{height:"100%",width:quests.length?`${(doneCount/quests.length)*100}%`:"0%",background:allDone?"#4ade80":"#00e5ff",transition:"width .4s"}}/>
            </div>
            <div style={{fontFamily:"monospace",fontSize:9,color:"#555"}}>{doneCount}/{quests.length}</div>
          </div>
          {state.penalties>0 && (
            <div style={{borderTop:"1px solid #ff222218",paddingTop:11}}>
              <div style={{fontFamily:"monospace",fontSize:8,color:"#ff333344",letterSpacing:2,marginBottom:4}}>PENALTIES</div>
              <div style={{fontFamily:"monospace",fontSize:20,color:"#ff4444",fontWeight:900}}>{state.penalties}</div>
            </div>
          )}
        </div>

        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
          <div style={{display:"flex",borderBottom:"1px solid #ffffff08",background:"#030310",flexShrink:0}}>
            {["quests","protocol","map"].map(t=>(
              <button key={t} onClick={()=>setTab(t)} style={{padding:"9px 18px",background:"none",border:"none",borderBottom:tab===t?"2px solid #00e5ff":"2px solid transparent",color:tab===t?"#00e5ff":"#444",fontFamily:"monospace",fontSize:10,letterSpacing:2,cursor:"pointer",textTransform:"uppercase"}}>
                {t}
              </button>
            ))}
          </div>

          <div style={{flex:1,overflowY:"auto",padding:18}}>
            {tab==="quests" && (
              <div style={{maxWidth:660}}>
                <div style={{marginBottom:16}}>
                  <div style={{fontFamily:"monospace",fontSize:24,color:isBoss?"#ff4444":"#fff",fontWeight:900,letterSpacing:3,lineHeight:1}}>
                    {isBoss ? "⚔ BOSS RAID" : `LEVEL ${lvl}`}
                  </div>
                  {isBoss && <div style={{fontFamily:"monospace",fontSize:9,color:"#ff444466",letterSpacing:2,marginTop:4}}>ALL QUESTS REQUIRED — NO EXCEPTIONS</div>}
                  {arcData && <div style={{fontFamily:"monospace",fontSize:10,color:"#ffffff20",marginTop:6,lineHeight:1.5}}>{arcData.theme}</div>}
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:9}}>
                  {quests.map(q=>{
                    const done=!!state.completedQuests[q.id];
                    const cfg=STAT_CFG[q.stat];
                    return (
                      <div key={q.id} onClick={()=>dispatch({type:"TOGGLE_QUEST",qid:q.id,xp:q.xp,stat:q.stat,done})}
                        style={{padding:14,background:done?`${cfg.color}08`:(q.boss?"#1a000a":"#08080f"),border:`1px solid ${done?cfg.color+"33":q.boss?"#ff222233":"#ffffff0d"}`,borderRadius:7,cursor:"pointer",display:"flex",gap:12,alignItems:"flex-start",transition:"border .18s",opacity:done?.78:1}}>
                        <div style={{width:20,height:20,borderRadius:4,border:`2px solid ${done?cfg.color:"#ffffff18"}`,background:done?`${cfg.color}25`:"transparent",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",marginTop:1}}>
                          {done && <span style={{color:cfg.color,fontSize:12,fontWeight:700}}>✓</span>}
                        </div>
                        <div style={{flex:1}}>
                          <div style={{display:"flex",gap:7,alignItems:"center",marginBottom:5,flexWrap:"wrap"}}>
                            <span style={{fontFamily:"monospace",fontSize:9,padding:"1px 6px",background:`${cfg.color}18`,color:cfg.color,borderRadius:3}}>{cfg.icon} {q.stat}</span>
                            <span style={{fontFamily:"monospace",fontSize:9,color:"#fbbf2455"}}>+{q.xp} XP</span>
                            {q.boss && <span style={{fontFamily:"monospace",fontSize:9,color:"#ff444466"}}>BOSS QUEST</span>}
                          </div>
                          <div style={{fontSize:13,color:done?"#444":"#ccc",lineHeight:1.5,textDecoration:done?"line-through":"none"}}>{q.text}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div style={{marginTop:20}}>
                  {allDone ? (
                    <button onClick={()=>dispatch({type:"LEVEL_UP"})} style={{width:"100%",padding:"15px",background:isBoss?"linear-gradient(135deg,#aa2200,#ff2200)":"linear-gradient(135deg,#0044cc,#00e5ff)",border:"none",borderRadius:7,fontFamily:"monospace",fontSize:18,color:"#fff",fontWeight:900,letterSpacing:4,cursor:"pointer"}}>
                      {isBoss ? "⚔ CLAIM BOSS REWARD ⚔" : "▶ LEVEL UP"}
                    </button>
                  ) : (
                    <div style={{padding:"15px",background:"#08080f",border:"1px solid #ffffff09",borderRadius:7,fontFamily:"monospace",fontSize:11,color:"#333",textAlign:"center",letterSpacing:2}}>
                      {quests.length - doneCount} QUEST{quests.length-doneCount!==1?"S":""} REMAINING TO LEVEL UP
                    </div>
                  )}
                </div>
              </div>
            )}

            {tab==="protocol" && (
              <div style={{maxWidth:660}}>
                <div style={{fontFamily:"monospace",fontSize:22,color:"#00e5ff",fontWeight:900,letterSpacing:4,marginBottom:3}}>PROTOCOL 24</div>
                <div style={{fontFamily:"monospace",fontSize:9,color:"#ff4444aa",letterSpacing:2,marginBottom:16}}>NON-NEGOTIABLE DAILY QUEST — DEVIATION TRIGGERS PENALTY ENGINE</div>
                {[
                  {t:"04:30",l:"WAKE — Tahajjud (2-4 rakats)",c:"#22c55e"},
                  {t:"05:00",l:"Fajr Prayer + Morning Adhkar + Quran 15 min",c:"#22c55e"},
                  {t:"05:30",l:"PHYSICAL TRAINING — Lift / Run / Martial Arts (60 min)",c:"#ef4444"},
                  {t:"06:30",l:"Cold shower + Breakfast + Prep for work",c:"#f97316"},
                  {t:"07:00",l:"DEEP WORK — Code / Hardware / Study (2.5 hrs)",c:"#8b5cf6"},
                  {t:"09:30",l:"Commute to office",c:"#333333"},
                  {t:"10:00",l:"TCS WORK — Execute with excellence.",c:"#eab308"},
                  {t:"13:00",l:"Dhuhr Prayer",c:"#22c55e"},
                  {t:"16:30",l:"Asr Prayer",c:"#22c55e"},
                  {t:"18:00",l:"Office ends — Commute home",c:"#333333"},
                  {t:"18:30",l:"Maghrib Prayer + Evening Adhkar",c:"#22c55e"},
                  {t:"19:00",l:"EVENING DEEP WORK — Build / Create / Ship (2 hrs)",c:"#8b5cf6"},
                  {t:"21:00",l:"Isha Prayer + Dinner + Rest",c:"#22c55e"},
                  {t:"22:00",l:"REFLECTION — Journal. Plan tomorrow.",c:"#22c55e"},
                  {t:"22:30",l:"SLEEP — Recovery is a weapon, not a reward.",c:"#60a5fa"},
                ].map((b,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 10px",background:i%2===0?"#08080f":"#050510",borderLeft:`3px solid ${b.c}22`}}>
                    <span style={{fontFamily:"monospace",fontSize:10,color:b.c,minWidth:42,fontWeight:700}}>{b.t}</span>
                    <span style={{flex:1,fontSize:12,color:b.c==="#333333"?"#3a3a3a":"#bbb"}}>{b.l}</span>
                  </div>
                ))}
                <div style={{marginTop:18,padding:14,background:"#0d0005",border:"1px solid #ff222218",borderRadius:7}}>
                  <div style={{fontFamily:"monospace",fontSize:9,color:"#ff4444aa",letterSpacing:2,marginBottom:10}}>PENALTY ENGINE — MISS = CONSEQUENCE</div>
                  {PENALTIES.map((p,i)=>(
                    <div key={i} style={{display:"flex",gap:9,padding:"7px 0",borderBottom:i<PENALTIES.length-1?"1px solid #ffffff05":"none"}}>
                      <span style={{fontSize:14}}>{p.icon}</span>
                      <div>
                        <div style={{fontSize:11,color:"#ff7777",fontWeight:600}}>{p.trigger}</div>
                        <div style={{fontSize:10,color:"#444"}}>→ {p.penalty}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab==="map" && (
              <div style={{maxWidth:660}}>
                <div style={{fontFamily:"monospace",fontSize:22,color:"#00e5ff",fontWeight:900,letterSpacing:4,marginBottom:3}}>WORLD MAP</div>
                <div style={{fontFamily:"monospace",fontSize:9,color:"#ffffff18",marginBottom:16}}>10 ARCS · 10 BOSS RAIDS · ONE DESTINATION: THE SOVEREIGN</div>
                <div style={{display:"flex",flexDirection:"column",gap:9}}>
                  {ARC_DATA.map((ad,ai)=>{
                    const levels=Array.from({length:10},(_,i)=>ai*10+i+1);
                    const cleared=levels.every(l=>state.completedLevels.includes(l));
                    const active=levels.includes(lvl);
                    return (
                      <div key={ai} style={{background:active?"#000a16":cleared?"#000a07":"#07070e",border:`1px solid ${active?"#00e5ff22":cleared?"#22c55e18":"#ffffff07"}`,borderRadius:7,padding:12}}>
                        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                          <div>
                            <span style={{fontFamily:"monospace",fontSize:8,color:cleared?"#22c55e44":active?"#00e5ff44":"#ffffff15"}}>ARC {ai+1} · L{ai*10+1}–{ai*10+10} — </span>
                            <span style={{fontFamily:"monospace",fontSize:12,color:cleared?"#22c55e":active?"#00e5ff":"#ffffff22",fontWeight:700,letterSpacing:2}}>{ad.title}</span>
                          </div>
                          {cleared && <span style={{fontFamily:"monospace",fontSize:8,color:"#22c55e"}}>✓ CLEARED</span>}
                          {active && !cleared && <span style={{fontFamily:"monospace",fontSize:8,color:"#00e5ff"}}>▶ ACTIVE</span>}
                        </div>
                        <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>
                          {levels.map(lv=>{
                            const d=state.completedLevels.includes(lv);
                            const c=lv===lvl;
                            const b=lv%10===0;
                            return <div key={lv} title={`L${lv}${b?" BOSS":""}`} style={{width:b?26:20,height:18,borderRadius:3,background:d?(b?"#ffd700":"#00e5ff"):c?(b?"#ff330022":"#00e5ff18"):"#ffffff07",border:c?`1px solid ${b?"#ff4444":"#00e5ff"}`:"none",transition:"all .3s",display:"flex",alignItems:"center",justifyContent:"center"}}>
                              {b&&<span style={{fontSize:7,color:d?"#000":c?"#ff4444":"#ffffff18"}}>⚔</span>}
                            </div>;
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {logOpen && (
        <div style={{position:"fixed",right:0,top:0,bottom:0,width:255,background:"#030310",borderLeft:"1px solid #ffffff0a",padding:14,overflowY:"auto",zIndex:50}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
            <span style={{fontFamily:"monospace",fontSize:9,color:"#00e5ff55",letterSpacing:2}}>ACTIVITY LOG</span>
            <button onClick={()=>setLogOpen(false)} style={{background:"none",border:"none",color:"#666",cursor:"pointer",fontSize:14}}>✕</button>
          </div>
          {[...state.log].reverse().map((e,i)=>(
            <div key={i} style={{fontFamily:"monospace",fontSize:9,color:e.color||"#444",padding:"4px 0",borderBottom:"1px solid #ffffff04",lineHeight:1.5}}>
              <span style={{color:"#ffffff15"}}>[{e.ts}] </span>{e.msg}
            </div>
          ))}
          {state.log.length===0 && <div style={{fontFamily:"monospace",fontSize:9,color:"#333"}}>No activity yet.</div>}
        </div>
      )}

      {penModal && (
        <div style={{position:"fixed",inset:0,background:"#000000bb",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100,padding:20}}>
          <div style={{background:"#0a0a18",border:"2px solid #ff222233",borderRadius:10,padding:22,maxWidth:400,width:"100%"}}>
            <div style={{fontFamily:"monospace",fontSize:20,color:"#ff4444",fontWeight:900,letterSpacing:3,marginBottom:4}}>PENALTY ENGINE</div>
            <div style={{fontFamily:"monospace",fontSize:9,color:"#ff444444",marginBottom:14}}>Which quest did you fail? Accept the consequence.</div>
            <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:14}}>
              {PENALTIES.map((p,i)=>(
                <button key={i} onClick={()=>{dispatch({type:"PENALTY",label:p.trigger});setPenModal(false);}} style={{padding:"9px 12px",background:"#0a000f",border:"1px solid #ff22220d",borderRadius:5,cursor:"pointer",textAlign:"left",display:"flex",gap:9,alignItems:"center"}}>
                  <span style={{fontSize:14}}>{p.icon}</span>
                  <div>
                    <div style={{fontSize:11,color:"#ff7777",fontWeight:600}}>{p.trigger}</div>
                    <div style={{fontSize:10,color:"#444"}}>→ {p.penalty}</div>
                  </div>
                </button>
              ))}
            </div>
            <button onClick={()=>setPenModal(false)} style={{width:"100%",padding:"9px",background:"none",border:"1px solid #ffffff15",borderRadius:5,color:"#555",fontFamily:"monospace",fontSize:10,cursor:"pointer",letterSpacing:2}}>CANCEL</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem("sl_player_state");
      if (saved) {
        return { ...INIT_STATE, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.error("Failed to load initial state from localStorage", e);
    }
    return INIT_STATE;
  });

  const dispatch = useCallback(action => setState(prev => reducer(prev, action)), []);
  const isBoss = state.level % 10 === 0;
  const arcData = ARC_DATA[Math.ceil(state.level/10)-1];

  // Firebase Sync State
  const [user, setUser] = useState(null);
  const [firebaseInitialized, setFirebaseInitialized] = useState(isInitialized());
  const [firebaseError, setFirebaseError] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [conflictData, setConflictData] = useState(null);
  const [syncModalOpen, setSyncModalOpen] = useState(false);

  // Authentication Fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authMode, setAuthMode] = useState("login"); // "login" | "register"
  const [configInput, setConfigInput] = useState("");

  const lastCloudUpdatedAt = useRef(0);
  const unsubFirestore = useRef(null);

  // Save state to localStorage
  useEffect(() => {
    localStorage.setItem("sl_player_state", JSON.stringify(state));
  }, [state]);

  // Auth State Listener
  useEffect(() => {
    if (!firebaseInitialized) return;
    
    try {
      const auth = getFirebaseAuth();
      if (!auth) return;
      
      const unsubAuth = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        if (!currentUser) {
          if (unsubFirestore.current) {
            unsubFirestore.current();
            unsubFirestore.current = null;
          }
        }
      });
      
      return () => unsubAuth();
    } catch (err) {
      console.error("Error setting up auth listener:", err);
    }
  }, [firebaseInitialized]);

  // Firestore Sync Listener
  useEffect(() => {
    if (!firebaseInitialized || !user) {
      if (unsubFirestore.current) {
        unsubFirestore.current();
        unsubFirestore.current = null;
      }
      return;
    }

    try {
      const db = getFirebaseDb();
      if (!db) return;

      const docRef = doc(db, "users", user.uid);
      setSyncing(true);

      unsubFirestore.current = onSnapshot(docRef, (docSnap) => {
        setSyncing(false);
        if (docSnap.exists()) {
          const cloudState = docSnap.data();
          const cloudUpdatedAt = cloudState.updatedAt || 0;
          const localSaved = JSON.parse(localStorage.getItem("sl_player_state") || "{}");
          const localUpdatedAt = localSaved.updatedAt || 0;

          lastCloudUpdatedAt.current = cloudUpdatedAt;

          if (cloudUpdatedAt > localUpdatedAt) {
            // Cloud is newer
            const localQuestsCount = Object.keys(localSaved.completedQuests || {}).length;
            const cloudQuestsCount = Object.keys(cloudState.completedQuests || {}).length;

            if (localUpdatedAt > 0 && 
                (localSaved.level !== cloudState.level || localQuestsCount !== cloudQuestsCount) && 
                !localStorage.getItem(`sl_sync_resolved_${user.uid}`)) {
              setConflictData(cloudState);
            } else {
              dispatch({ type: "LOAD_STATE", payload: cloudState });
              localStorage.setItem("sl_player_state", JSON.stringify(cloudState));
            }
          } else if (localUpdatedAt > cloudUpdatedAt) {
            // Local is newer
            setDoc(docRef, { ...localSaved, updatedAt: localUpdatedAt }, { merge: true })
              .catch(err => console.error("Auto Sync upload failed:", err));
          }
        } else {
          // Cloud doc does not exist, initialize with local state
          const localSaved = JSON.parse(localStorage.getItem("sl_player_state") || "{}");
          const now = Date.now();
          setDoc(docRef, { ...localSaved, updatedAt: now }, { merge: true })
            .then(() => {
              lastCloudUpdatedAt.current = now;
              dispatch({ type: "LOAD_STATE", payload: { updatedAt: now } });
            })
            .catch(err => console.error("Cloud document seed failed:", err));
        }
      }, (err) => {
        console.error("Firestore snapshot error:", err);
        setSyncing(false);
      });

      return () => {
        if (unsubFirestore.current) {
          unsubFirestore.current();
          unsubFirestore.current = null;
        }
      };
    } catch (err) {
      console.error("Error setting up Firestore listener:", err);
      setSyncing(false);
    }
  }, [firebaseInitialized, user]);

  // Sync Local State Changes to Firestore
  useEffect(() => {
    if (!firebaseInitialized || !user || !state.updatedAt) return;

    if (state.updatedAt > lastCloudUpdatedAt.current) {
      const db = getFirebaseDb();
      if (!db) return;

      const docRef = doc(db, "users", user.uid);
      setSyncing(true);

      setDoc(docRef, state, { merge: true })
        .then(() => {
          lastCloudUpdatedAt.current = state.updatedAt;
          setSyncing(false);
        })
        .catch(err => {
          console.error("Failed to upload state to Firestore:", err);
          setSyncing(false);
        });
    }
  }, [state, user, firebaseInitialized]);

  // Conflict Resolvers
  const handleKeepLocal = async () => {
    if (!user) return;
    const db = getFirebaseDb();
    if (!db) return;
    const docRef = doc(db, "users", user.uid);
    const now = Date.now();
    const localStateWithTime = { ...state, updatedAt: now };

    setSyncing(true);
    try {
      await setDoc(docRef, localStateWithTime, { merge: true });
      lastCloudUpdatedAt.current = now;
      dispatch({ type: "LOAD_STATE", payload: { updatedAt: now } });
      localStorage.setItem(`sl_sync_resolved_${user.uid}`, "true");
      setConflictData(null);
    } catch (err) {
      console.error("Keep local failed:", err);
    } finally {
      setSyncing(false);
    }
  };

  const handleUseCloud = () => {
    if (!conflictData || !user) return;
    dispatch({ type: "LOAD_STATE", payload: conflictData });
    lastCloudUpdatedAt.current = conflictData.updatedAt || 0;
    localStorage.setItem("sl_player_state", JSON.stringify(conflictData));
    localStorage.setItem(`sl_sync_resolved_${user.uid}`, "true");
    setConflictData(null);
  };

  const handleMergeStates = async () => {
    if (!user || !conflictData) return;
    const db = getFirebaseDb();
    if (!db) return;
    const docRef = doc(db, "users", user.uid);

    const mergedQuests = { ...state.completedQuests, ...conflictData.completedQuests };
    const mergedLevels = Array.from(new Set([...state.completedLevels, ...(conflictData.completedLevels || [])]));

    const mergedStats = {};
    const statsKeys = ["STR", "AGI", "INT", "WIS", "GLD"];
    statsKeys.forEach(k => {
      mergedStats[k] = Math.max(state.stats[k] || 0, conflictData.stats?.[k] || 0);
    });

    const mergedLevel = Math.max(state.level, conflictData.level);
    let mergedXP = 0;
    if (state.level > conflictData.level) {
      mergedXP = state.xp;
    } else if (conflictData.level > state.level) {
      mergedXP = conflictData.xp;
    } else {
      mergedXP = Math.max(state.xp, conflictData.xp);
    }

    const mergedTotalXP = Math.max(state.totalXP, conflictData.totalXP || 0);
    const mergedPenalties = Math.max(state.penalties, conflictData.penalties || 0);
    const mergedLog = [...state.log, ...(conflictData.log || [])].slice(-50);

    const now = Date.now();
    const mergedState = {
      ...state,
      level: mergedLevel,
      xp: mergedXP,
      totalXP: mergedTotalXP,
      stats: mergedStats,
      completedQuests: mergedQuests,
      completedLevels: mergedLevels,
      penalties: mergedPenalties,
      log: mergedLog,
      updatedAt: now
    };

    setSyncing(true);
    try {
      await setDoc(docRef, mergedState, { merge: true });
      lastCloudUpdatedAt.current = now;
      dispatch({ type: "LOAD_STATE", payload: mergedState });
      localStorage.setItem("sl_player_state", JSON.stringify(mergedState));
      localStorage.setItem(`sl_sync_resolved_${user.uid}`, "true");
      setConflictData(null);
    } catch (err) {
      console.error("Merge states failed:", err);
    } finally {
      setSyncing(false);
    }
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setFirebaseError(null);
    setSyncing(true);
    try {
      const auth = getFirebaseAuth();
      if (!auth) throw new Error("Firebase Auth is not initialized");

      if (authMode === "login") {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      setEmail("");
      setPassword("");
    } catch (err) {
      console.error("Auth action failed:", err);
      let errMsg = err.message;
      if (err.code === "auth/invalid-credential") errMsg = "Invalid email or password.";
      else if (err.code === "auth/email-already-in-use") errMsg = "Email is already linked to a player.";
      else if (err.code === "auth/weak-password") errMsg = "Password must be at least 6 characters.";
      setFirebaseError(errMsg);
    } finally {
      setSyncing(false);
    }
  };

  const handleSignOut = async () => {
    setFirebaseError(null);
    setSyncing(true);
    try {
      const auth = getFirebaseAuth();
      if (auth) {
        if (user) {
          localStorage.removeItem(`sl_sync_resolved_${user.uid}`);
        }
        await signOut(auth);
      }
    } catch (err) {
      console.error("Sign out failed:", err);
      setFirebaseError(err.message);
    } finally {
      setSyncing(false);
    }
  };

  const handleConfigSubmit = (e) => {
    e.preventDefault();
    setFirebaseError(null);
    try {
      let rawInput = configInput.trim();
      
      // 1. If it contains a variable declaration, extract only the object literal portion.
      // Otherwise, extract the first curly-braces block if there is one.
      let jsonStr = rawInput;
      const configObjMatch = rawInput.match(/(?:const|let|var)?\s*(?:firebaseConfig|config)\s*=\s*(\{[\s\S]*?\})/);
      if (configObjMatch) {
        jsonStr = configObjMatch[1];
      } else {
        const braceMatch = rawInput.match(/(\{[\s\S]*\})/);
        if (braceMatch) {
          jsonStr = braceMatch[1];
        }
      }

      // 2. Remove JavaScript comments (both single-line // and multi-line /* ... */)
      jsonStr = jsonStr.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '$1');

      // 3. Wrap unquoted keys in double quotes
      jsonStr = jsonStr.replace(/([{,]\s*)(\w+)\s*:/g, '$1"$2":');

      // 4. Convert single-quoted values to double-quoted values
      jsonStr = jsonStr.replace(/'([^'\\]*(?:\\.[^'\\]*)*)'/g, '"$1"');

      // 5. Strip trailing commas
      jsonStr = jsonStr.replace(/,\s*([}\]])/g, '$1');

      const config = JSON.parse(jsonStr);
      const res = initializeFirebase(config);
      if (res.initialized) {
        setFirebaseInitialized(true);
        setFirebaseError(null);
        setConfigInput("");
      } else {
        setFirebaseError(res.error || "Failed to initialize Firebase with the config provided.");
      }
    } catch (err) {
      console.error("Config parsing error", err);
      setFirebaseError("Failed to parse config. Please ensure you are pasting a valid configuration object (either as a JSON object, JavaScript object, or the script snippet from the Firebase console).");
    }
  };

  const handleClearConfig = () => {
    clearFirebaseConfig();
    setFirebaseInitialized(false);
    setUser(null);
    setFirebaseError(null);
  };

  return (
    <>
      <style>{`
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes glow{0%,100%{opacity:1}50%{opacity:.6}}
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:#0a0a1a}
        ::-webkit-scrollbar-thumb{background:#00e5ff18;border-radius:2px}
        button:hover{filter:brightness(1.15)}
      `}</style>
      {state.screen==="boot"    && <BootScreen onStart={()=>dispatch({type:"START"})}/>}
      {state.screen==="game"    && (
        <GameScreen 
          state={state} 
          dispatch={dispatch} 
          user={user}
          syncing={syncing}
          onOpenSyncModal={() => setSyncModalOpen(true)}
        />
      )}
      {state.screen==="levelup" && <LevelUpScreen level={state.level} isBoss={isBoss} arcName={arcData?.title} onContinue={()=>dispatch({type:"ADVANCE"})}/>}
      {state.screen==="win"     && <WinScreen totalXP={state.totalXP}/>}

      {/* Sync Management Modal */}
      {syncModalOpen && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:150,padding:20,backdropFilter:"blur(5px)"}}>
          <div style={{background:"#040412",border:"1px solid #00e5ff33",borderRadius:8,padding:28,maxWidth:440,width:"100%",boxShadow:"0 0 30px rgba(0,229,255,0.15)"}}>
            
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <div>
                <span style={{fontFamily:"monospace",fontSize:9,color:"#00e5ff55",letterSpacing:2}}>SYSTEM LINK</span>
                <h3 style={{fontFamily:"monospace",fontSize:20,color:"#fff",fontWeight:900,letterSpacing:2}}>CLOUD GATE</h3>
              </div>
              <button onClick={() => setSyncModalOpen(false)} style={{background:"none",border:"none",color:"#666",cursor:"pointer",fontSize:18}}>✕</button>
            </div>

            {/* Error Message */}
            {firebaseError && (
              <div style={{padding:10,background:"rgba(255,34,34,0.1)",border:"1px solid rgba(255,34,34,0.3)",borderRadius:5,color:"#ff5555",fontSize:11,fontFamily:"monospace",lineHeight:1.4,marginBottom:16}}>
                ⚠ {firebaseError}
              </div>
            )}

            {/* Content based on configuration and Auth status */}
            {!firebaseInitialized ? (
              // 1. Firebase Config Setup
              <form onSubmit={handleConfigSubmit}>
                <div style={{fontSize:12,color:"#aaa",lineHeight:1.6,fontFamily:"monospace",marginBottom:14}}>
                  Firebase is not configured. Please paste your Firebase Web App configuration JSON or script snippet to activate the Cloud Gate:
                </div>
                <textarea
                  value={configInput}
                  onChange={(e) => setConfigInput(e.target.value)}
                  placeholder='{"apiKey": "AIzaSy...", "authDomain": "...", "projectId": "...", ...}'
                  style={{width:"100%",height:110,background:"#02020a",border:"1px solid #ffffff15",borderRadius:5,padding:10,color:"#00e5ff",fontFamily:"monospace",fontSize:10,resize:"none",marginBottom:16,outline:"none"}}
                  required
                />
                <button type="submit" style={{width:"100%",padding:"12px",background:"linear-gradient(135deg,#0055ff,#00e5ff)",border:"none",borderRadius:6,fontFamily:"monospace",fontSize:12,color:"#000",fontWeight:700,letterSpacing:2,cursor:"pointer"}}>
                  INITIALIZE GATE
                </button>
                <div style={{fontSize:9,color:"#444",marginTop:10,textAlign:"center",fontFamily:"monospace"}}>
                  Credentials can also be set via .env files for local hosting.
                </div>
              </form>
            ) : !user ? (
              // 2. Authentication Form
              <form onSubmit={handleAuthSubmit}>
                <div style={{fontSize:12,color:"#aaa",lineHeight:1.6,fontFamily:"monospace",marginBottom:16}}>
                  Firebase activated. Establish a system link to synchronize your player state across all platforms.
                </div>
                
                <div style={{marginBottom:12}}>
                  <label style={{display:"block",fontFamily:"monospace",fontSize:9,color:"#00e5ff88",marginBottom:4}}>PLAYER EMAIL</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{width:"100%",padding:10,background:"#02020a",border:"1px solid #ffffff15",borderRadius:5,color:"#fff",fontSize:12,outline:"none"}}
                    required
                  />
                </div>

                <div style={{marginBottom:18}}>
                  <label style={{display:"block",fontFamily:"monospace",fontSize:9,color:"#00e5ff88",marginBottom:4}}>ACCESS KEY (PASSWORD)</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{width:"100%",padding:10,background:"#02020a",border:"1px solid #ffffff15",borderRadius:5,color:"#fff",fontSize:12,outline:"none"}}
                    required
                  />
                </div>

                <div style={{display:"flex",gap:10,marginBottom:18}}>
                  <button 
                    type="submit" 
                    onClick={() => setAuthMode("login")}
                    style={{flex:1,padding:"11px",background:authMode==="login"?"#00e5ff":"transparent",border:authMode==="login"?"none":"1px solid rgba(0,229,255,0.3)",borderRadius:5,fontFamily:"monospace",fontSize:11,color:authMode==="login"?"#000":"#00e5ff",fontWeight:700,cursor:"pointer",letterSpacing:1}}
                  >
                    LOG IN
                  </button>
                  <button 
                    type="submit" 
                    onClick={() => setAuthMode("register")}
                    style={{flex:1,padding:"11px",background:authMode==="register"?"#00e5ff":"transparent",border:authMode==="register"?"none":"1px solid rgba(0,229,255,0.3)",borderRadius:5,fontFamily:"monospace",fontSize:11,color:authMode==="register"?"#000":"#00e5ff",fontWeight:700,cursor:"pointer",letterSpacing:1}}
                  >
                    CREATE LINK
                  </button>
                </div>

                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",borderTop:"1px solid #ffffff0a",paddingTop:14}}>
                  <button type="button" onClick={handleClearConfig} style={{background:"none",border:"none",color:"#555",fontFamily:"monospace",fontSize:9,cursor:"pointer",textDecoration:"underline"}}>
                    Clear Firebase Settings
                  </button>
                </div>
              </form>
            ) : (
              // 3. Synced / Logged In State
              <div>
                <div style={{padding:"14px",background:"rgba(0,229,255,0.04)",border:"1px solid rgba(0,229,255,0.15)",borderRadius:6,marginBottom:20}}>
                  <div style={{fontFamily:"monospace",fontSize:9,color:"#00e5ff88",marginBottom:2}}>STATUS</div>
                  <div style={{fontFamily:"monospace",fontSize:14,color:"#4ade80",fontWeight:700,display:"flex",alignItems:"center",gap:6}}>
                    ● LINKED TO CLOUD
                  </div>
                  
                  <div style={{fontFamily:"monospace",fontSize:9,color:"#00e5ff88",marginTop:12,marginBottom:2}}>ACTIVE PLAYER</div>
                  <div style={{fontFamily:"monospace",fontSize:12,color:"#fff",wordBreak:"break-all"}}>{user.email}</div>
                  
                  <div style={{fontFamily:"monospace",fontSize:9,color:"#00e5ff88",marginTop:12,marginBottom:2}}>LAST CLOUD SYNC</div>
                  <div style={{fontFamily:"monospace",fontSize:11,color:"#aaa"}}>
                    {state.updatedAt ? new Date(state.updatedAt).toLocaleString("en-IN") : "Never"}
                  </div>
                </div>

                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  <button onClick={handleSignOut} style={{width:"100%",padding:"11px",background:"#ff444415",border:"1px solid #ff444433",borderRadius:6,color:"#ff4444",fontFamily:"monospace",fontSize:11,fontWeight:700,letterSpacing:2,cursor:"pointer"}}>
                    SEVER SYSTEM LINK (LOGOUT)
                  </button>
                  <button onClick={handleClearConfig} style={{width:"100%",padding:"9px",background:"none",border:"none",color:"#444",fontFamily:"monospace",fontSize:9,cursor:"pointer",textDecoration:"underline"}}>
                    Modify Configuration settings
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Conflict Resolver Modal */}
      {conflictData && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.92)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,padding:20,backdropFilter:"blur(8px)"}}>
          <div style={{background:"#060618",border:"1px solid rgba(255,215,0,0.3)",borderRadius:8,padding:28,maxWidth:480,width:"100%",boxShadow:"0 0 40px rgba(255,215,0,0.1)"}}>
            <div style={{fontFamily:"monospace",fontSize:22,color:"#ffd700",fontWeight:900,letterSpacing:2,marginBottom:8}}>SYNC CONFLICT DETECTED</div>
            <div style={{fontFamily:"monospace",fontSize:11,color:"#888",lineHeight:1.6,marginBottom:20}}>
              The System has found differing player progress on this device and the Cloud. Select a resolution path:
            </div>
            
            <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:24}}>
              {/* Local Data Card */}
              <div style={{padding:12,background:"rgba(0,229,255,0.03)",border:"1px solid rgba(0,229,255,0.15)",borderRadius:6}}>
                <div style={{fontFamily:"monospace",fontSize:11,color:"#00e5ff",fontWeight:700,marginBottom:4}}>LOCAL STATE (THIS DEVICE)</div>
                <div style={{fontSize:10,color:"#ccc",fontFamily:"monospace",lineHeight:1.4}}>
                  Level {state.level} | XP {state.xp} / {computeXPRequired(state.level)}<br/>
                  Stats: STR {state.stats?.STR || 0} | INT {state.stats?.INT || 0} | WIS {state.stats?.WIS || 0}<br/>
                  Completed Quests: {Object.keys(state.completedQuests || {}).length}<br/>
                  Last Active: {state.updatedAt ? new Date(state.updatedAt).toLocaleString("en-IN") : "Unknown"}
                </div>
              </div>
              
              {/* Cloud Data Card */}
              <div style={{padding:12,background:"rgba(251,191,36,0.03)",border:"1px solid rgba(251,191,36,0.15)",borderRadius:6}}>
                <div style={{fontFamily:"monospace",fontSize:11,color:"#fbbf24",fontWeight:700,marginBottom:4}}>CLOUD STATE (REMOTE GATE)</div>
                <div style={{fontSize:10,color:"#ccc",fontFamily:"monospace",lineHeight:1.4}}>
                  Level {conflictData.level} | XP {conflictData.xp} / {computeXPRequired(conflictData.level)}<br/>
                  Stats: STR {conflictData.stats?.STR || 0} | INT {conflictData.stats?.INT || 0} | WIS {conflictData.stats?.WIS || 0}<br/>
                  Completed Quests: {Object.keys(conflictData.completedQuests || {}).length}<br/>
                  Last Active: {conflictData.updatedAt ? new Date(conflictData.updatedAt).toLocaleString("en-IN") : "Unknown"}
                </div>
              </div>
            </div>
            
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              <button onClick={handleKeepLocal} style={{padding:"12px",background:"#00e5ff",border:"none",borderRadius:6,fontFamily:"monospace",fontSize:11,color:"#000",fontWeight:700,cursor:"pointer",letterSpacing:1}}>
                OVERWRITE CLOUD WITH LOCAL DATA
              </button>
              <button onClick={handleUseCloud} style={{padding:"12px",background:"#fbbf24",border:"none",borderRadius:6,fontFamily:"monospace",fontSize:11,color:"#000",fontWeight:700,cursor:"pointer",letterSpacing:1}}>
                OVERWRITE LOCAL WITH CLOUD DATA
              </button>
              <button onClick={handleMergeStates} style={{padding:"12px",background:"#4ade80",border:"none",borderRadius:6,fontFamily:"monospace",fontSize:11,color:"#000",fontWeight:700,cursor:"pointer",letterSpacing:1}}>
                MERGE AND INTEGRATE BOTH RECORDS
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

