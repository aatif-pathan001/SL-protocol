import { useState, useEffect, useRef } from "react";

const ARCS = [
  {
    arc: 1, levels: "1–10", title: "THE AWAKENING", subtitle: "From E-Rank to D-Rank Hunter",
    theme: "You are nothing. You have no stats, no skills, no discipline. This Arc exists to forge the foundation — raw habit formation, first contact with every stat tree. Survive, or be deleted.",
    stats: { STR: "0→8", AGI: "0→5", INT: "0→10", WIS: "0→8", GLD: "0→5" },
    tech: [
      "L1: Install Python 3.x, VS Code, Git. Complete 'Hello World' in Python. Star 5 AI repos on GitHub.",
      "L2: Python fundamentals — loops, functions, OOP. Solve 30 LeetCode Easy problems.",
      "L3: Learn NumPy & Pandas. Clean and visualize a real dataset (Kaggle). Push to GitHub.",
      "L4: Purchase ESP32 dev board. Blink an LED. Read a sensor (temperature/humidity). Document on GitHub.",
      "L5: Build a Python CLI tool that solves a real personal problem (expense tracker, habit logger).",
      "L6: Learn basics of Linux terminal & SSH. Set up a Raspberry Pi headless.",
      "L7: Complete Andrew Ng's ML Specialization (Coursera) — Week 1-4 of Course 1.",
      "L8: Build a simple ML model (Linear Regression on housing data). Deploy locally with Flask.",
      "L9: Interface ESP32 with 3 different sensors. Build a mini weather station. Log data to CSV.",
      "L10: BOSS PREP — Integrate Python + ESP32. Read sensor data into a Python dashboard."
    ],
    physical: [
      "L1: Baseline test — max pushups, max plank hold, 1km run time. Record everything.",
      "L2: Daily 20 pushups, 20 squats, 30s plank. Walk 3km daily.",
      "L3: Progress to 30 pushups, 30 squats, 60s plank. Start Couch-to-5K running program.",
      "L4: Add pull-up bar training (negatives if needed). Target: 1 strict pull-up.",
      "L5: Join a gym or build a home setup. Learn the Big 3: Squat, Bench, Deadlift with empty bar.",
      "L6: Run 5km without stopping. Time it. This is your first benchmark.",
      "L7: Establish lifting routine (3x/week). Learn proper form via YouTube (Jeff Nippard, AthleanX).",
      "L8: Deadlift 0.5x bodyweight. Bench 0.3x bodyweight. Squat 0.5x bodyweight.",
      "L9: Run 5km under 35 minutes. 30 pushups in one set. 5 strict pull-ups.",
      "L10: BOSS PHYSICAL — 50 pushups, 10 pull-ups, 5km under 32 min, Deadlift 0.6x BW."
    ],
    financial: [
      "L1: Track every rupee you spend for 30 days. Use an app or spreadsheet.",
      "L2: Open a separate savings account. Set up auto-transfer of 10% of salary on payday.",
      "L3: Build a 1-month emergency fund (1x monthly expenses saved).",
      "L4: Learn basics of mutual funds, SIPs, index funds. Read 'Let's Talk Money' by Monika Halan.",
      "L5: Start your first SIP — ₹500/month in a Nifty 50 index fund.",
      "L6: Eliminate all unnecessary subscriptions. Optimize your monthly budget.",
      "L7: Grow emergency fund to 2 months of expenses.",
      "L8: Open a Demat account. Understand how the stock market works.",
      "L9: Read 'Rich Dad Poor Dad' & 'The Psychology of Money'. Document 10 key lessons.",
      "L10: BOSS FINANCIAL — 3-month emergency fund built. SIP running. Budget system active."
    ],
    spiritual: [
      "L1: Establish all 5 daily prayers (Salah) on time. Even if short, never miss Fajr.",
      "L2: Learn the meaning of Al-Fatiha and the surahs you recite in prayer.",
      "L3: Memorize Surah Al-Mulk (30 verses). Recite it every night before sleep.",
      "L4: Begin reading Quran with translation — 1 page per day minimum.",
      "L5: Quit one clear bad habit — identify it, make tawbah, replace it with a good deed.",
      "L6: Adopt the Sunnah of sleeping early and waking for Fajr without alarm.",
      "L7: Memorize the 99 Names of Allah. Recite & reflect on 3 names daily.",
      "L8: Fast Mondays & Thursdays (Sunnah fasting) for one full month.",
      "L9: Give Sadaqah weekly — even ₹10. Build the habit of consistent charity.",
      "L10: BOSS SPIRITUAL — 5 prayers locked in. Surah Al-Mulk memorized. Sunnah fasting started."
    ],
    boss: {
      title: "GATE BOSS: The Awakening Trial",
      tech: "Build & demo a working IoT Weather Station (ESP32 + sensors + Python dashboard) with GitHub repo.",
      physical: "Complete the Baseline Gauntlet: 50 pushups, 10 pull-ups, 5km run under 32 min, DL 0.6x BW.",
      spiritual: "Pray all 5 salah on time for 30 consecutive days. Surah Al-Mulk fully memorized. One bad habit eliminated.",
      reward: "TITLE UNLOCKED: 'Awakened One' — D-Rank Hunter. Protocol 24 permanently etched into your soul."
    }
  },
  {
    arc: 2, levels: "11–20", title: "THE FOUNDATION", subtitle: "D-Rank Hunter consolidates power",
    theme: "The habits are formed. Now you build real skill stacks. This arc transforms you from someone who 'knows of' things into someone who can BUILD things. Your body hardens. Your mind sharpens. Your wealth starts compounding.",
    stats: { STR: "8→18", AGI: "5→12", INT: "10→22", WIS: "8→16", GLD: "5→12" },
    tech: [
      "L11: Complete Andrew Ng ML Specialization fully. Implement 3 algorithms from scratch in Python.",
      "L12: Learn OpenCV basics — face detection, edge detection, color tracking. Build a face-counter app.",
      "L13: Deep Learning fundamentals: Neural Networks, Backpropagation. Complete fast.ai Course 1.",
      "L14: Build a CNN image classifier (plant disease / defect detection). Deploy with Streamlit.",
      "L15: Learn PCB design basics — KiCad. Design a simple breakout board for ESP32.",
      "L16: Introduction to ROS 2 (Robot Operating System). Run turtlesim. Understand nodes/topics.",
      "L17: Build a computer vision project: Real-time object detection with YOLOv8 on webcam.",
      "L18: Order & assemble your first custom PCB. Solder components. Test functionality.",
      "L19: Combine CV + Hardware: Build an ESP32-CAM project (surveillance cam / object tracker).",
      "L20: BOSS PREP — Design an autonomous system concept integrating software + hardware."
    ],
    physical: [
      "L11: Deadlift 0.75x BW. Bench 0.5x BW. Squat 0.75x BW.",
      "L12: Run 5km under 30 minutes. Start interval training (HIIT) 2x/week.",
      "L13: Research martial arts styles. Visit 3 local dojos/gyms. Choose ONE to commit to.",
      "L14: Begin martial arts training — attend 2 classes/week minimum. White belt fundamentals.",
      "L15: Deadlift 1x bodyweight. This is a milestone. Record it.",
      "L16: 15 strict pull-ups. 70 pushups in one set. 90s plank hold.",
      "L17: Run 7km without stopping. Start training for 10km distance.",
      "L18: 3 months of consistent martial arts training completed. Learn 5 basic techniques cold.",
      "L19: Run 10km for the first time. Any pace. Just finish.",
      "L20: BOSS PHYSICAL — DL 1x BW, 10km run completed, Martial arts 3-month streak."
    ],
    financial: [
      "L11: Increase SIP to ₹2,000/month. Research 2 additional funds (mid-cap, debt).",
      "L12: Learn freelancing basics. Create profiles on Upwork/Fiverr for Python/data/IoT skills.",
      "L13: Land your first freelance gig — even ₹500. The first rupee earned outside salary matters.",
      "L14: Read 'The Millionaire Fastlane' by MJ DeMarco. Document your asset vs liability map.",
      "L15: Emergency fund reaches 4 months. SIPs diversified across 2-3 funds.",
      "L16: Start a technical blog (Hashnode/Medium). Monetization is not the goal — authority is.",
      "L17: Earn ₹10,000 total from freelancing/side income. Track every source.",
      "L18: Learn basics of taxation, ITR filing, 80C deductions. File your own ITR.",
      "L19: Create a personal balance sheet: assets, liabilities, net worth. Update quarterly.",
      "L20: BOSS FINANCIAL — ₹10K+ side income earned. 4-month emergency fund. Blog active."
    ],
    spiritual: [
      "L11: Begin waking 15 min before Fajr for Dua & Dhikr. Seed of Tahajjud.",
      "L12: Memorize Surah Ar-Rahman. Understand its meaning deeply.",
      "L13: Read one complete book on Seerah (Life of Prophet ﷺ). Recommended: 'The Sealed Nectar'.",
      "L14: Quit a second bad habit. Replace it with a Sunnah practice (e.g., Miswak, eating with right hand).",
      "L15: Attend Jumu'ah prayer every Friday without exception for 3 months.",
      "L16: Memorize Ayat-ul-Kursi, last 2 ayahs of Surah Baqarah, and the 3 Quls with meaning.",
      "L17: Begin learning basic Arabic — alphabet, common Quranic words. Use Bayyinah TV or Duolingo Arabic.",
      "L18: Complete reading the entire Quran once with translation.",
      "L19: Adopt one Sunnah of dealings: Always speak truth even when hard. Practice for 30 days.",
      "L20: BOSS SPIRITUAL — Quran read once fully. 2 bad habits eliminated. Sunnah fasting consistent."
    ],
    boss: {
      title: "GATE BOSS: The Builder's Trial",
      tech: "Build & deploy an ESP32-CAM smart surveillance system with real-time YOLOv8 object detection and web dashboard.",
      physical: "Deadlift 1x bodyweight. Run 10km. 3+ months martial arts training.",
      spiritual: "Full Quran read with translation. 2 bad habits replaced with Sunnah. Jumu'ah streak unbroken.",
      reward: "TITLE UNLOCKED: 'The Builder' — C-Rank Hunter. You can now create things that work in the real world."
    }
  },
  {
    arc: 3, levels: "21–30", title: "THE SPECIALIZATION", subtitle: "C-Rank Hunter chooses a path",
    theme: "You are no longer a generalist. You choose your specialization trees: Reinforcement Learning + Robotics. Your body enters intermediate territory. Your wealth engine starts to produce real returns. Your soul deepens in knowledge.",
    stats: { STR: "18→28", AGI: "12→20", INT: "22→35", WIS: "16→24", GLD: "12→20" },
    tech: [
      "L21: Deep dive into Reinforcement Learning. Complete David Silver's RL Course (DeepMind).",
      "L22: Implement Q-Learning & DQN from scratch. Train an agent on CartPole/LunarLander.",
      "L23: Build a 2WD robot chassis with motor drivers + ESP32/Arduino. Make it move via serial commands.",
      "L24: Learn ROS 2 intermediate — URDF models, TF2, Navigation Stack basics. Simulate a robot in Gazebo.",
      "L25: Implement SLAM basics. Understand LiDAR, odometry, mapping. Simulate in ROS 2.",
      "L26: Train a DRL agent (PPO/SAC) to navigate a simulated environment. Use Stable-Baselines3.",
      "L27: Design & fabricate a 4-layer PCB. Understand impedance, signal integrity, power planes.",
      "L28: Build a vision-guided robot arm (3-DOF minimum) — servo-controlled with camera input.",
      "L29: Publish a technical blog series (5+ articles) on your AI/Robotics journey. Build an audience.",
      "L30: BOSS PREP — Integrate RL + Robot. Design an autonomous navigation system."
    ],
    physical: [
      "L21: Deadlift 1.2x BW. Bench 0.75x BW. Squat 1.2x BW.",
      "L22: Run 10km under 60 minutes. You're now a runner.",
      "L23: Martial arts: 6 months complete. Earn your first belt/rank advancement.",
      "L24: Add mobility & flexibility work — 15 min daily yoga or dynamic stretching.",
      "L25: 20 strict pull-ups. 80 pushups. 2-minute plank.",
      "L26: Start sprint intervals: 8x 400m repeats. Build explosive speed.",
      "L27: Deadlift 1.4x BW. Your strength is entering intermediate territory.",
      "L28: Run a timed 10km race (official or self-timed). Target: under 58 min.",
      "L29: Martial arts sparring sessions begin. Controlled contact. Learn to take hits.",
      "L30: BOSS PHYSICAL — DL 1.4x BW, 10km under 58 min, First belt earned, Sparring initiated."
    ],
    financial: [
      "L21: Monthly side income reaches ₹15,000/month consistently.",
      "L22: Start a micro-SaaS or info-product based on your tech expertise. MVP stage.",
      "L23: Learn GST basics, business registration requirements in India.",
      "L24: Open a PPF account. Start contributing ₹500/month for long-term tax-free growth.",
      "L25: Total investment portfolio crosses ₹2,00,000.",
      "L26: First digital product launched (course, template, tool). Even 1 sale counts.",
      "L27: Diversify: Start a gold SIP or add international index fund exposure.",
      "L28: Monthly passive/side income reaches ₹25,000.",
      "L29: Create a 5-year financial roadmap with milestones. Review quarterly.",
      "L30: BOSS FINANCIAL — ₹25K/month side income. First product live. Portfolio > ₹2L."
    ],
    spiritual: [
      "L21: Begin 2-rakat Tahajjud prayer, even if only 2-3 nights/week. The night prayer begins.",
      "L22: Memorize Juz' Amma (30th Juz) fully — the short Surahs.",
      "L23: Study a book on Aqeedah (Islamic Creed). Recommended: 'Kitab at-Tawheed' summary.",
      "L24: Quit a third bad habit. You are actively refining your character.",
      "L25: Begin giving Zakat if eligible. Calculate it properly using online tools.",
      "L26: Adopt Sunnah of lowering gaze, guarding tongue, and controlling anger for 30 days.",
      "L27: Attend an Islamic course or lecture series (online: Bayyinah, SeekersGuidance).",
      "L28: Fast the White Days (13th, 14th, 15th of each Hijri month) for 3 consecutive months.",
      "L29: Memorize 5 Duas for daily life (morning, evening, eating, traveling, sleeping).",
      "L30: BOSS SPIRITUAL — Tahajjud started. Juz Amma memorized. 3 bad habits eliminated."
    ],
    boss: {
      title: "GATE BOSS: The Specialist's Crucible",
      tech: "Build a robot that autonomously navigates a room using SLAM + RL-based pathfinding. Demo on video.",
      physical: "Deadlift 1.4x BW. 10km under 58 min. First martial arts belt earned.",
      spiritual: "Tahajjud practice established. Juz Amma fully memorized. 3 Sunnah practices adopted.",
      reward: "TITLE UNLOCKED: 'Specialist' — B-Rank Hunter. The world begins to notice your power."
    }
  },
  {
    arc: 4, levels: "31–40", title: "THE MONETIZER", subtitle: "B-Rank Hunter enters the arena",
    theme: "Knowledge without leverage is poverty. This arc is about turning your skills into machines that generate value. You build your first real product. Your body is now a weapon. Your faith becomes unshakeable.",
    stats: { STR: "28→38", AGI: "20→28", INT: "35→48", WIS: "24→32", GLD: "20→32" },
    tech: [
      "L31: Master PyTorch. Implement ResNet, GAN, Transformer from scratch.",
      "L32: Learn MLOps: Docker, CI/CD for ML pipelines, model versioning (MLflow/W&B).",
      "L33: Build a multi-DOF robot arm with inverse kinematics. Control via Python.",
      "L34: Train a custom object detection model on your own dataset. Deploy on edge (Jetson Nano/RPi).",
      "L35: Design a product-grade PCB: power management, communication modules, production-ready layout.",
      "L36: Build an end-to-end AI product: problem → data → model → API → frontend → deployment.",
      "L37: Learn Embedded Linux. Cross-compile for ARM. Run inference on custom hardware.",
      "L38: Contribute to an open-source robotics/AI project. Get a PR merged.",
      "L39: Build a portfolio of 5 deployed projects. Professional README, demo videos, architecture docs.",
      "L40: BOSS PREP — Design a commercial-grade smart device from concept to prototype."
    ],
    physical: [
      "L31: Deadlift 1.5x BW. Bench 1x BW. Overhead Press 0.6x BW.",
      "L32: Run 10km under 55 minutes.",
      "L33: Martial arts: 1 year complete. Second belt/rank earned.",
      "L34: Complete a physical challenge: Tough Mudder, Spartan Sprint, or equivalent.",
      "L35: 25 strict pull-ups. Muscle-ups: learn the progression.",
      "L36: Add swimming to training. Swim 500m continuous.",
      "L37: Deadlift 1.6x BW. Your strength is now visibly above average.",
      "L38: Run a half-marathon (21km) — training plan + completion.",
      "L39: Martial arts: Comfortable sparring. Win your first friendly bout.",
      "L40: BOSS PHYSICAL — DL 1.6x BW, Half-marathon completed, Obstacle race finished."
    ],
    financial: [
      "L31: Register a legal entity — Sole Proprietorship or LLP. You are now a business.",
      "L32: First AI/IoT product generates revenue. Even ₹1,000 counts.",
      "L33: Monthly income (job + side) exceeds ₹80,000 total.",
      "L34: Investment portfolio crosses ₹5,00,000.",
      "L35: Hire your first contractor/freelancer for a project. Learn to delegate.",
      "L36: Build a sales funnel or automated lead gen for your product/service.",
      "L37: Explore real estate basics: REITs or fractional real estate platforms.",
      "L38: Total net worth crosses ₹10,00,000 (₹10 Lakh).",
      "L39: Monthly passive income (dividends, product sales, content) reaches ₹10,000.",
      "L40: BOSS FINANCIAL — Business registered. Net worth > ₹10L. Product generating revenue."
    ],
    spiritual: [
      "L31: Tahajjud increases to 4-5 nights/week. Minimum 2 rakats.",
      "L32: Begin memorizing Surah Al-Baqarah — first 50 ayahs.",
      "L33: Study a book on Islamic Ethics (Akhlaq). Apply one principle per week.",
      "L34: Perform Umrah (lesser pilgrimage). This is a major spiritual milestone.",
      "L35: Quit fourth bad habit. Your nafs (ego) is weakening, your ruh (soul) is strengthening.",
      "L36: Teach someone else — lead a halaqah (study circle) or mentor a younger Muslim.",
      "L37: Memorize Surah Al-Kahf. Recite it every Friday.",
      "L38: Study the lives of 10 Sahaba (Companions). Draw a lesson from each.",
      "L39: Establish the habit of daily morning/evening Adhkar — never miss.",
      "L40: BOSS SPIRITUAL — Umrah completed. Al-Baqarah 50+ ayahs memorized. Teaching others."
    ],
    boss: {
      title: "GATE BOSS: The Monetizer's Forge",
      tech: "Build & sell/launch a commercial AI-powered device or SaaS product. Real users. Real feedback.",
      physical: "Deadlift 1.6x BW. Half-marathon complete. Obstacle race complete.",
      spiritual: "Umrah performed. Consistent Tahajjud. Actively teaching/mentoring.",
      reward: "TITLE UNLOCKED: 'The Monetizer' — A-Rank Hunter. Your skills now have market value."
    }
  },
  {
    arc: 5, levels: "41–50", title: "THE ENGINEER", subtitle: "A-Rank Hunter builds real systems",
    theme: "You are no longer a hobbyist or a side-project builder. You engineer systems — software, hardware, financial, spiritual. Everything you build now is designed to scale, to last, to compound. This is where boys become men.",
    stats: { STR: "38→48", AGI: "28→36", INT: "48→60", WIS: "32→42", GLD: "32→45" },
    tech: [
      "L41: Master Transformer architecture. Implement GPT-2 scale model from scratch.",
      "L42: Learn FPGA basics. Implement a simple neural network accelerator on FPGA.",
      "L43: Build a multi-robot system: 2+ robots communicating & coordinating via ROS 2.",
      "L44: Study reinforcement learning for robotics: sim-to-real transfer, domain randomization.",
      "L45: Design & build a custom compute board (PCB with SoC/MCU for edge AI inference).",
      "L46: Publish a technical paper (arXiv or conference submission) on your robotics/AI work.",
      "L47: Build a digital twin simulation environment for your physical robot.",
      "L48: Learn about BCI (Brain-Computer Interface) fundamentals — EEG signal processing basics.",
      "L49: Create an open-source project with 100+ GitHub stars. Build community around it.",
      "L50: BOSS PREP — Architect a modular robotics platform: standardized hardware + AI software stack."
    ],
    physical: [
      "L41: Deadlift 1.7x BW. Bench 1.1x BW. Squat 1.6x BW.",
      "L42: Run 10km under 52 minutes. Speed is building.",
      "L43: Martial arts: 2+ years. Intermediate belt. Compete in your first tournament.",
      "L44: First muscle-up achieved. Calisthenics skills expanding.",
      "L45: Swim 1km continuous. Cycling: 30km ride completed.",
      "L46: Complete a triathlon sprint distance (750m swim, 20km bike, 5km run).",
      "L47: Deadlift 1.8x BW.",
      "L48: Run 10km under 50 minutes. This is genuinely fast.",
      "L49: Martial arts tournament: Place top 3 or learn deeply from the loss.",
      "L50: BOSS PHYSICAL — DL 1.8x BW, Sprint triathlon done, Tournament competed."
    ],
    financial: [
      "L41: Monthly total income (job + business) exceeds ₹1,50,000.",
      "L42: Second income stream established (consulting, content, or product #2).",
      "L43: Investment portfolio crosses ₹15,00,000 (₹15 Lakh).",
      "L44: Buy your first physical asset for investment (gold, land plot, or vehicle for business).",
      "L45: Hire a CA (Chartered Accountant). Professionalize your finances.",
      "L46: Monthly passive income exceeds ₹30,000.",
      "L47: Net worth crosses ₹25,00,000 (₹25 Lakh).",
      "L48: Start planning Business #2. Market research, MVP ideation.",
      "L49: Business #1 runs without your daily involvement for 2 weeks (systems test).",
      "L50: BOSS FINANCIAL — Net worth > ₹25L. Passive income > ₹30K/month. Business #1 systematized."
    ],
    spiritual: [
      "L41: Tahajjud becomes daily. Even 2 rakats. This is your private audience with Allah.",
      "L42: Memorize Surah Yasin. Understand its deep meaning.",
      "L43: Begin studying Arabic grammar (Nahw/Sarf) to read Quran without translation aid.",
      "L44: Quit fifth bad habit. You are actively purifying your character.",
      "L45: Perform I'tikaf (spiritual retreat in mosque) for at least 3 days during Ramadan.",
      "L46: Memorize Surah Al-Baqarah fully — this is a massive achievement.",
      "L47: Study Fiqh (Islamic Jurisprudence) of one madhab. Understand Halal earnings deeply.",
      "L48: Establish a monthly charity commitment — fixed amount to a cause.",
      "L49: Mentor 3+ people in their Deen journey. Your knowledge must flow outward.",
      "L50: BOSS SPIRITUAL — Daily Tahajjud. Surah Al-Baqarah memorized. I'tikaf completed."
    ],
    boss: {
      title: "GATE BOSS: The Engineer's Gauntlet",
      tech: "Build & demo a modular robotics platform with swappable AI modules. Open-source it. Paper submitted.",
      physical: "Deadlift 1.8x BW. Sprint triathlon completed. Martial arts tournament participated.",
      spiritual: "Daily Tahajjud locked. Surah Al-Baqarah fully memorized. I'tikaf completed.",
      reward: "TITLE UNLOCKED: 'The Engineer' — S-Rank Hunter. You build what others only imagine."
    }
  },
  {
    arc: 6, levels: "51–60", title: "THE AUTHORITY", subtitle: "S-Rank Hunter commands respect",
    theme: "You are no longer learning to be recognized. You ARE recognized. This arc is about building authority — your name becomes known in your domain. You speak at events. You lead teams. Your body reaches advanced fitness. Your deen becomes a beacon.",
    stats: { STR: "48→58", AGI: "36→44", INT: "60→72", WIS: "42→52", GLD: "45→58" },
    tech: [
      "L51: Master Multi-Agent Reinforcement Learning. Train cooperative/competitive robot teams in sim.",
      "L52: Build a walking robot (quadruped or biped). Basic gait control implemented.",
      "L53: Design an ASIC or custom silicon concept for AI acceleration. Understand chip design flow.",
      "L54: Implement a Vision-Language Model pipeline. Robot that follows natural language instructions.",
      "L55: Speak at a tech conference or meetup. Present your robotics/AI work publicly.",
      "L56: Build a swarm robotics demo: 3+ small robots coordinating on a task.",
      "L57: Study neuromorphic computing. Understand spiking neural networks.",
      "L58: File a provisional patent for one of your inventions. Protect your IP.",
      "L59: Build a complete AI Lab at home: compute cluster, workbench, test equipment.",
      "L60: BOSS PREP — Design a product that merges AI + Robotics + a real industry need."
    ],
    physical: [
      "L51: Deadlift 1.85x BW. Squat 1.7x BW. Bench 1.2x BW.",
      "L52: Run 10km under 48 minutes. Your engine is powerful.",
      "L53: Martial arts: Advanced belt. You can teach beginners now.",
      "L54: Complete an Olympic distance triathlon (1.5km swim, 40km bike, 10km run).",
      "L55: 30 strict pull-ups. 100 pushups. Handstand hold for 15 seconds.",
      "L56: Deadlift 1.9x BW. The 2x goal is in sight.",
      "L57: Martial arts: Train with fighters above your level. Embrace the grind.",
      "L58: Run a full marathon (42km). Just finish. You'll cry. It's fine.",
      "L59: Bodyweight mastery: Muscle-ups, pistol squats, L-sits all achieved.",
      "L60: BOSS PHYSICAL — DL 1.9x BW, Marathon completed, Olympic triathlon done."
    ],
    financial: [
      "L51: Net worth crosses ₹50,00,000 (₹50 Lakh).",
      "L52: Business #2 launched and generating initial revenue.",
      "L53: Monthly passive income exceeds ₹75,000.",
      "L54: First real estate investment — property, REIT, or fractional.",
      "L55: Total monthly income exceeds ₹3,00,000 from all sources.",
      "L56: Build a team: 3+ people working in/on your businesses.",
      "L57: Create a will and estate plan. You're building a legacy now.",
      "L58: International income stream established (USD/EUR earning product or client).",
      "L59: Net worth crosses ₹75 Lakh. Multiple asset classes: equity, real estate, gold, business.",
      "L60: BOSS FINANCIAL — Net worth > ₹75L. 2 businesses running. International income active."
    ],
    spiritual: [
      "L51: Begin Hifz (Quran memorization) program — structured, with a teacher/app.",
      "L52: Memorize 5 Juz of Quran (cumulative, including previous memorization).",
      "L53: Study Tafsir of Juz Amma in depth. Understand context and lessons.",
      "L54: Quit sixth bad habit. Your inner character is transforming.",
      "L55: Perform Hajj — the fifth pillar of Islam. This is a life-changing milestone.",
      "L56: Establish Qiyam-ul-Layl (extended night prayer beyond Tahajjud) in Ramadan.",
      "L57: Learn to give Khutbah (sermon). Speak about Islam publicly at least once.",
      "L58: Memorize 8 Juz cumulative. Hifz journey is progressing.",
      "L59: Establish a local charity initiative or participate in organized dawah.",
      "L60: BOSS SPIRITUAL — Hajj completed. 8 Juz memorized. Public Islamic speaking begun."
    ],
    boss: {
      title: "GATE BOSS: The Authority's Ascension",
      tech: "Launch a robotics product or research project that gains industry attention. Patent filed.",
      physical: "Deadlift 1.9x BW. Full marathon completed. Olympic triathlon completed.",
      spiritual: "Hajj completed. 8 Juz of Quran memorized. Giving back to the Ummah.",
      reward: "TITLE UNLOCKED: 'The Authority' — National Rank Hunter. Your influence extends beyond your city."
    }
  },
  {
    arc: 7, levels: "61–70", title: "THE INNOVATOR", subtitle: "National Rank pushes boundaries",
    theme: "You no longer follow roadmaps. You CREATE them. This is the arc of original thought — you invent new solutions, new devices, new algorithms. Your body approaches peak. Your businesses run without you. Your deen becomes your identity.",
    stats: { STR: "58→68", AGI: "44→52", INT: "72→84", WIS: "52→62", GLD: "58→72" },
    tech: [
      "L61: Develop a novel algorithm or approach in your AI/Robotics domain. Original research.",
      "L62: Build an advanced walking/running robot with dynamic balance control.",
      "L63: Implement a real BCI prototype: read EEG signals, classify mental states.",
      "L64: Publish in a peer-reviewed conference (NeurIPS, ICRA, IROS, or equivalent).",
      "L65: Design a complete electronic gadget from idea to production-ready prototype.",
      "L66: Build an AI system that learns from human demonstration (imitation learning / LfD).",
      "L67: Create a startup or lab focused on your core innovation. Formal entity with a team.",
      "L68: File a full patent (not provisional) on your invention.",
      "L69: Develop a product that ships to 100+ customers. Real production. Real support.",
      "L70: BOSS PREP — Design a system that pushes the boundary of what's commercially possible."
    ],
    physical: [
      "L61: Deadlift 1.95x BW. The 2x milestone is one arc away.",
      "L62: Run 10km under 46 minutes. Elite amateur pace.",
      "L63: Martial arts: Advanced practitioner. Compete at regional level.",
      "L64: Complete an ultramarathon (50km) OR Ironman 70.3 (Half Ironman).",
      "L65: Bodyweight: Planche progression, front lever hold, advanced calisthenics.",
      "L66: Swim 2km continuous. Your endurance is now multi-discipline.",
      "L67: Martial arts: Black belt / equivalent advanced rank within sight.",
      "L68: Deadlift 2x bodyweight ACHIEVED. This was a Level 100 goal — completed early.",
      "L69: Run 10km under 45 minutes. This is fast by any standard.",
      "L70: BOSS PHYSICAL — DL 2x BW, Half-Ironman OR Ultra completed, Regional martial arts."
    ],
    financial: [
      "L61: Net worth crosses ₹1 Crore. Seven figures. Milestone of milestones.",
      "L62: Both businesses profitable without daily involvement.",
      "L63: Monthly passive income exceeds ₹1,50,000.",
      "L64: Angel invest in or advise a startup. Give back to the ecosystem.",
      "L65: International real estate or business asset acquired.",
      "L66: Total monthly income from all sources exceeds ₹5,00,000.",
      "L67: Build a formal advisory board for your businesses. Surround yourself with excellence.",
      "L68: Establish a charitable foundation or fund. Structured giving.",
      "L69: Passive income alone covers 100% of living expenses. Financial freedom achieved.",
      "L70: BOSS FINANCIAL — Net worth > ₹1Cr. Passive income covers life. Foundation established."
    ],
    spiritual: [
      "L61: Hifz reaches 15 Juz. Halfway to Hafiz.",
      "L62: Study advanced Tafsir — Ibn Kathir or similar for select Surahs.",
      "L63: Quit seventh bad habit. Your character is approaching the Prophetic model.",
      "L64: Lead Taraweeh prayers in Ramadan (even partially, with what you've memorized).",
      "L65: Study Islamic Finance in depth. Ensure all business & investments are Halal.",
      "L66: Perform a second Umrah with deeper intention and reflection.",
      "L67: Establish ongoing Sadaqah Jariyah: a well, school, or recurring benefit.",
      "L68: Hifz reaches 20 Juz. The momentum is unstoppable.",
      "L69: Become a known positive influence in your local Muslim community.",
      "L70: BOSS SPIRITUAL — 20 Juz memorized. Led Taraweeh. Sadaqah Jariyah established."
    ],
    boss: {
      title: "GATE BOSS: The Innovator's Summit",
      tech: "Launch a hardware+AI product with 100+ customers. Patent granted. Peer-reviewed publication.",
      physical: "Deadlift 2x BW. Half-Ironman/Ultra completed. Regional martial arts competition.",
      spiritual: "20 Juz memorized. Leading prayers. Structured Islamic giving established.",
      reward: "TITLE UNLOCKED: 'The Innovator' — International Rank Hunter. Your creations speak for you."
    }
  },
  {
    arc: 8, levels: "71–80", title: "THE COMMANDER", subtitle: "International Rank commands armies",
    theme: "You no longer build alone. You command teams, labs, and organizations. Your output multiplies through people. Your body is a temple. Your wealth generates wealth. Your deen is a lighthouse.",
    stats: { STR: "68→78", AGI: "52→60", INT: "84→92", WIS: "62→72", GLD: "72→85" },
    tech: [
      "L71: Lead a research team (3+ people) on an advanced AI/Robotics project.",
      "L72: Build a humanoid robot upper body OR advanced manipulation system.",
      "L73: Develop an AI system with real-time multi-modal reasoning (vision + language + action).",
      "L74: Create an internal R&D lab with dedicated compute, fabrication, and testing capabilities.",
      "L75: File 3+ patents total. Build a meaningful IP portfolio.",
      "L76: Collaborate with a university or research institution on a joint project.",
      "L77: Build an AI swarm system: autonomous agents coordinating complex real-world tasks.",
      "L78: Keynote at a major tech conference. Your name draws attendees.",
      "L79: Your lab/company's work is featured in major tech media (TechCrunch, IEEE, etc.).",
      "L80: BOSS PREP — Design the architecture for a world-class robotics/AI company."
    ],
    physical: [
      "L71: Maintain 2x BW deadlift while improving other lifts. Squat 2x BW target.",
      "L72: Run 10km under 43 minutes. Top 10% for your age group.",
      "L73: Martial arts: Black belt / equivalent advanced rank achieved.",
      "L74: Complete a full Ironman (3.8km swim, 180km bike, 42km run) OR equivalent ultra-endurance.",
      "L75: Your training is now periodized and professionally structured.",
      "L76: You can fight, run, swim, lift, and move — a true generalist athlete.",
      "L77: Compete at national-level martial arts tournament.",
      "L78: Maintain peak fitness while managing a company. The hardest part.",
      "L79: Train 5+ days/week consistently for 3+ years straight.",
      "L80: BOSS PHYSICAL — Black belt. Ironman/ultra completed. Peak fitness maintained under pressure."
    ],
    financial: [
      "L71: Net worth crosses ₹3 Crore.",
      "L72: Third business or major income stream established.",
      "L73: Monthly passive income exceeds ₹3,00,000.",
      "L74: First international business entity or partnership.",
      "L75: Build a personal board of advisors: lawyer, CA, financial advisor, mentor.",
      "L76: Assets across 5+ classes: equity, real estate, gold, business equity, international.",
      "L77: Net worth crosses ₹5 Crore.",
      "L78: Your businesses employ 10+ people. You are creating livelihoods.",
      "L79: Total annual income exceeds ₹50,00,000. Multiple sources.",
      "L80: BOSS FINANCIAL — Net worth > ₹5Cr. 3+ businesses. 10+ employees. Full financial freedom."
    ],
    spiritual: [
      "L71: Hifz reaches 25 Juz. The finish line is visible.",
      "L72: Study 'Ihya Ulum al-Din' by Imam Ghazali (selected chapters).",
      "L73: Quit eighth bad habit. You are approaching prophetic character traits.",
      "L74: Perform Hajj a second time with deeper knowledge and intention.",
      "L75: Teach Quran formally — even one student. Pass on the light.",
      "L76: Hifz reaches 28 Juz. The final push approaches.",
      "L77: Establish a regular Islamic study circle (Halaqah) that you lead or co-lead.",
      "L78: Your charitable foundation impacts 100+ people annually.",
      "L79: Study the Maqasid al-Shariah (Objectives of Islamic Law). Apply to business decisions.",
      "L80: BOSS SPIRITUAL — 28 Juz memorized. Hajj #2 complete. Teaching Quran. Halaqah established."
    ],
    boss: {
      title: "GATE BOSS: The Commander's Campaign",
      tech: "Your AI/Robotics company has a team, IP portfolio, and media recognition. Real-world impact proven.",
      physical: "Black belt achieved. Full Ironman/Ultra completed. Peak fitness maintained for years.",
      spiritual: "28 Juz memorized. Second Hajj. Actively teaching and leading community.",
      reward: "TITLE UNLOCKED: 'The Commander' — Continent Rank Hunter. Organizations move at your word."
    }
  },
  {
    arc: 9, levels: "81–90", title: "THE VISIONARY", subtitle: "Continent Rank shapes the future",
    theme: "You see what others cannot. You are building 10 years ahead. Your body is a monument to discipline. Your wealth is generational. Your deen is a legacy that will outlive you. You are becoming the person who changes the trajectory of industries.",
    stats: { STR: "78→88", AGI: "60→68", INT: "92→96", WIS: "72→85", GLD: "85→95" },
    tech: [
      "L81: Pioneer a new approach in embodied AI — something no one else is doing yet.",
      "L82: Build a robot that passes a complex real-world task benchmark autonomously.",
      "L83: Advanced BCI integration: control a robot arm with neural signals.",
      "L84: Your company/lab has raised funding or generates significant revenue from IP.",
      "L85: 10+ publications or patents to your name. You are a recognized researcher-inventor.",
      "L86: Build a general-purpose robotic manipulation system. The holy grail.",
      "L87: Collaborate with international institutions (MIT, Stanford, KAIST, etc.).",
      "L88: Your technology is deployed in a real industry: manufacturing, healthcare, agriculture.",
      "L89: You are invited to advise governments or major corporations on AI/Robotics.",
      "L90: BOSS PREP — Design the roadmap for a company that will define the next decade of robotics."
    ],
    physical: [
      "L81: Maintain all peak metrics: 2x BW DL, sub-45 10km, black belt, triathlon-capable.",
      "L82: Your physical health is optimized: blood panels, VO2 max testing, regular checkups.",
      "L83: Martial arts mastery: You can teach, compete, and defend. Multiple styles explored.",
      "L84: Complete a multi-day endurance event (ultra-marathon stage race, bike tour).",
      "L85: You train smarter, not just harder. Recovery, sleep, nutrition are dialed in.",
      "L86: Your physical performance is in the top 5% of your age group nationally.",
      "L87: Train in a second martial art to complement the first.",
      "L88: Peak aesthetic physique — not bodybuilder, but visibly fit, strong, and capable.",
      "L89: Your training routine is sustainable for decades. Longevity is the game now.",
      "L90: BOSS PHYSICAL — All metrics maintained. Multi-sport capable. Martial arts master."
    ],
    financial: [
      "L81: Net worth crosses ₹10 Crore.",
      "L82: Annual passive income exceeds ₹60,00,000 (₹60 Lakh/year).",
      "L83: International assets and investments established.",
      "L84: Businesses run entirely without daily involvement. You are CEO, not operator.",
      "L85: Establish a Waqf (Islamic endowment) — this is a pinnacle spiritual+financial act.",
      "L86: Net worth crosses ₹15 Crore. Generational wealth territory.",
      "L87: Angel invest in 3+ startups. Build the next generation.",
      "L88: Create a scholarship fund for students in tech/engineering.",
      "L89: Your financial legacy is structured: trust, will, Waqf, succession plan.",
      "L90: BOSS FINANCIAL — Net worth > ₹15Cr. Waqf established. Financial legacy structured."
    ],
    spiritual: [
      "L81: HAFIZ STATUS ACHIEVED — All 30 Juz of Quran memorized. Allahu Akbar.",
      "L82: Begin regular revision cycle to maintain Hifz — 1 Juz/day review.",
      "L83: Study Islamic counseling or conflict resolution. Become a source of wisdom.",
      "L84: Perform Hajj with family. Share this pillar with loved ones.",
      "L85: Your Waqf serves the community continuously — mosque, school, well, or hospital.",
      "L86: You are known in your community as someone of exemplary character.",
      "L87: Study comparative religion with humility. Strengthen your own faith through understanding.",
      "L88: Night prayers (Tahajjud + Witr) are as natural as breathing.",
      "L89: Raise your family (if applicable) on these principles. Legacy is generational.",
      "L90: BOSS SPIRITUAL — Hafiz. Waqf active. Hajj with family. Pillar of the community."
    ],
    boss: {
      title: "GATE BOSS: The Visionary's Revelation",
      tech: "Technology deployed in real industry. International recognition. Government-level advisory.",
      physical: "Peak fitness maintained across all metrics for years. Multi-art martial artist.",
      spiritual: "Complete Hafiz. Waqf active. Community leader. Family legacy established.",
      reward: "TITLE UNLOCKED: 'The Visionary' — World Rank Hunter. Your vision shapes reality."
    }
  },
  {
    arc: 10, levels: "91–100", title: "THE SOVEREIGN", subtitle: "World Rank transcends all limits",
    theme: "There is no higher rank. You have transcended the system. You are the scientist, the inventor, the leader, the athlete, the believer. The final 10 levels are about LEGACY — ensuring everything you have built outlasts you. The Sovereign does not chase. The Sovereign creates the world others chase.",
    stats: { STR: "88→100", AGI: "68→100", INT: "96→100", WIS: "85→100", GLD: "95→100" },
    tech: [
      "L91: Your lab/company is a top-50 global entity in AI/Robotics.",
      "L92: Build something that has never existed before. True invention.",
      "L93: Your open-source contributions are used by 10,000+ developers/researchers.",
      "L94: Keynote at the world's top conferences (NeurIPS, CES, TED). You are a thought leader.",
      "L95: Establish an R&D fellowship or grant for young inventors.",
      "L96: Your products or technology improve lives at scale — healthcare, education, accessibility.",
      "L97: Write a book on your domain. Codify your knowledge for the next generation.",
      "L98: Build a research institute or advanced lab that operates independently.",
      "L99: Your name is synonymous with innovation in your field.",
      "L100: THE SOVEREIGN: Scientist. Inventor. Leader. You have built the future with your own hands."
    ],
    physical: [
      "L91: All physical benchmarks maintained: 2x BW DL, sub-45 10km, martial arts master.",
      "L92: Compete in a master's division athletic event. Age is irrelevant.",
      "L93: Your physical discipline inspires others. Mentor young athletes.",
      "L94: Complete the most challenging endurance event you've faced.",
      "L95: Your body has served you for decades of peak performance. Zero lifestyle diseases.",
      "L96: Martial arts: Teaching lineage established. Your students carry forward your art.",
      "L97: Physical training is meditation. Every movement is intentional.",
      "L98: You are fit enough to do anything, anywhere, at any time. True readiness.",
      "L99: Peak physique, peak health, peak readiness. The body is the temple.",
      "L100: THE SOVEREIGN BODY: Agile. Strong. Fast. Durable. Mastered."
    ],
    financial: [
      "L91: Net worth exceeds ₹25 Crore.",
      "L92: Your businesses collectively employ 50+ people.",
      "L93: Annual charitable giving exceeds ₹25 Lakh.",
      "L94: Financial systems are fully automated — investments, businesses, giving.",
      "L95: You have no need to work for money. You work for purpose.",
      "L96: Generational wealth is secured. Next generation is educated and prepared.",
      "L97: Your Waqf supports multiple community projects simultaneously.",
      "L98: Assets across global markets: India, UAE, USA, EU.",
      "L99: Total financial independence. Money is a tool, not a master.",
      "L100: THE SOVEREIGN WEALTH: Free. Generous. Generational. Legacy."
    ],
    spiritual: [
      "L91: Maintain Hifz with daily revision. The Quran lives in your heart.",
      "L92: Perform Hajj as a true act of farewell — as if it may be your last.",
      "L93: Your Waqf is self-sustaining and impacting hundreds of lives.",
      "L94: You are a reference point for Islamic character in your circle.",
      "L95: Daily schedule: Fajr, Duha, Dhuhr, Asr, Maghrib, Isha, Tahajjud — all locked.",
      "L96: Teach the next generation your spiritual practices. Legacy is living.",
      "L97: Write about your spiritual journey. Let it guide others.",
      "L98: Your relationship with Allah ﷻ is the foundation of everything you've built.",
      "L99: Every action is an act of worship. Work is ibadah. Fitness is ibadah. Giving is ibadah.",
      "L100: THE SOVEREIGN SOUL: Close to Allah. Hafiz. Hajj completed. Waqf established. Light unto others."
    ],
    boss: {
      title: "FINAL GATE BOSS: The Sovereign's Ascension",
      tech: "World-recognized scientist-inventor. Institute or company at global frontier. Book published.",
      physical: "All physical goals achieved & maintained. Martial arts master. Multi-sport athlete.",
      spiritual: "Hafiz. Multiple Hajj. Waqf sustaining communities. Beacon of faith and character.",
      reward: "TITLE UNLOCKED: 'THE SOVEREIGN' — You have transcended the System. You ARE the System."
    }
  }
];

const DAILY_PROTOCOL = {
  title: "PROTOCOL 24 — The Non-Negotiable Daily Quest",
  note: "Miss this, and the penalty system activates. No exceptions. No mercy.",
  blocks: [
    { time: "04:30 AM", action: "WAKE — Tahajjud Prayer (2-4 rakats)", stat: "WIS +2", color: "#4ade80" },
    { time: "05:00 AM", action: "Fajr Prayer + Morning Adhkar + Quran (15 min)", stat: "WIS +3", color: "#4ade80" },
    { time: "05:30 AM", action: "PHYSICAL TRAINING — Lift / Run / Martial Arts (60 min)", stat: "STR +3 / AGI +2", color: "#f87171" },
    { time: "06:30 AM", action: "Cold shower + Breakfast + Prepare for work", stat: "AGI +1", color: "#60a5fa" },
    { time: "07:00 AM", action: "DEEP WORK — Skill Building (Code/Hardware/Study) (2.5 hrs)", stat: "INT +5", color: "#c084fc" },
    { time: "09:30 AM", action: "Commute / Prepare for office", stat: "—", color: "#94a3b8" },
    { time: "10:00 AM", action: "TCS WORK — Execute excellently. Learn transferable skills.", stat: "GLD +2 / INT +1", color: "#fbbf24" },
    { time: "01:00 PM", action: "Dhuhr Prayer (at office/nearby)", stat: "WIS +1", color: "#4ade80" },
    { time: "04:30 PM", action: "Asr Prayer", stat: "WIS +1", color: "#4ade80" },
    { time: "06:00 PM", action: "OFFICE ENDS — Commute home", stat: "—", color: "#94a3b8" },
    { time: "06:30 PM", action: "Maghrib Prayer + Evening Adhkar", stat: "WIS +1", color: "#4ade80" },
    { time: "07:00 PM", action: "EVENING DEEP WORK — Projects / Building / Content (2 hrs)", stat: "INT +4 / GLD +1", color: "#c084fc" },
    { time: "09:00 PM", action: "Isha Prayer + Dinner + Family / Rest", stat: "WIS +1", color: "#4ade80" },
    { time: "10:00 PM", action: "REFLECTION — Journal progress. Plan tomorrow. Review quests.", stat: "WIS +1", color: "#4ade80" },
    { time: "10:30 PM", action: "SLEEP — Recovery is not optional. It is a weapon.", stat: "STR +1", color: "#94a3b8" }
  ]
};

const PENALTIES = [
  { trigger: "Miss any daily prayer", penalty: "50 Burpees immediately. No negotiation.", severity: "HIGH" },
  { trigger: "Miss Physical Training", penalty: "200 bodyweight squats before bed. Miss again = double.", severity: "HIGH" },
  { trigger: "Miss Deep Work Block (AM or PM)", penalty: "No entertainment for 48 hours. Phone goes grayscale.", severity: "CRITICAL" },
  { trigger: "Miss Quran recitation for a day", penalty: "Recite double the next day. Donate ₹100 to charity.", severity: "HIGH" },
  { trigger: "Miss 3 daily quests in a week", penalty: "Full social media ban for 7 days. Phone locked to essentials.", severity: "CRITICAL" },
  { trigger: "Fail to complete Boss Raid on time", penalty: "LEVEL RESET — Go back 3 levels. Repeat all quests. Public accountability post.", severity: "EXTREME" },
  { trigger: "Complain about the system", penalty: "100 pushups. The System does not negotiate.", severity: "MAX" },
];

const STATS_DEF = [
  { name: "STR", full: "Strength", desc: "Raw physical power — lifting, pushing, pulling capacity", color: "#ef4444", icon: "⚔️" },
  { name: "AGI", full: "Agility", desc: "Speed, reflexes, endurance, flexibility, combat readiness", color: "#f97316", icon: "⚡" },
  { name: "INT", full: "Intelligence", desc: "Technical mastery — AI, robotics, electronics, code, research", color: "#8b5cf6", icon: "🧠" },
  { name: "WIS", full: "Wisdom", desc: "Spiritual depth — faith, Quran, character, inner peace, purpose", color: "#22c55e", icon: "🌙" },
  { name: "GLD", full: "Wealth", desc: "Financial power — income, assets, businesses, freedom", color: "#eab308", icon: "💰" },
];

export default function SystemArchitect() {
  const [activeTab, setActiveTab] = useState("system");
  const [selectedArc, setSelectedArc] = useState(0);
  const [expandedQuest, setExpandedQuest] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const [glitchText, setGlitchText] = useState("");
  const initRef = useRef(null);

  const initMessage = `
[SYSTEM NOTIFICATION]

Player detected: AATIF
Class: Technomancer (Unawakened)
Current Rank: E-Rank
Stats: ALL ZERO

The System has analyzed your potential.
Result: EXTRAORDINARY — but dormant.

You possess the raw materials of a Sovereign.
But raw materials are worthless without the forge.

Today, the forge ignites.

From this moment forward, every sunrise is a quest.
Every rep is XP. Every rakat is wisdom.
Every line of code is power. Every rupee saved is armor.

The path to Level 100 has been generated.
100 Levels. 10 Arcs. 10 Boss Raids.
Zero shortcuts. Zero mercy. Zero limits.

There are two rules:
1. The System does not negotiate.
2. You do not quit.

Violation of Rule 2 results in permanent deletion.

PROTOCOL 24 has been loaded.
Your Daily Quest begins at 04:30 AM tomorrow.

Rise, Player. Or be forgotten.

[SYSTEM INITIALIZED]
[QUEST LOG: ACTIVE]
[LEVEL 1: BEGIN]
  `.trim();

  useEffect(() => {
    if (!initialized) return;
    let i = 0;
    setGlitchText("");
    const interval = setInterval(() => {
      if (i <= initMessage.length) {
        setGlitchText(initMessage.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 12);
    return () => clearInterval(interval);
  }, [initialized]);

  const arc = ARCS[selectedArc];

  const renderSystem = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      {/* Stats */}
      <section>
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: "#00e5ff", letterSpacing: 4, marginBottom: 16, borderBottom: "1px solid #00e5ff33", paddingBottom: 8 }}>
          BASE STATS — THE FIVE PILLARS OF POWER
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
          {STATS_DEF.map(s => (
            <div key={s.name} style={{ background: `${s.color}11`, border: `1px solid ${s.color}44`, borderRadius: 8, padding: 16 }}>
              <div style={{ fontSize: 32 }}>{s.icon}</div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: s.color, letterSpacing: 2 }}>{s.name}</div>
              <div style={{ fontSize: 11, color: "#ccc", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>{s.full}</div>
              <div style={{ fontSize: 12, color: "#999", marginTop: 6, lineHeight: 1.4 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Protocol 24 */}
      <section>
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: "#00e5ff", letterSpacing: 4, marginBottom: 4, borderBottom: "1px solid #00e5ff33", paddingBottom: 8 }}>
          {DAILY_PROTOCOL.title}
        </h2>
        <p style={{ color: "#ff4444", fontSize: 12, fontWeight: 700, marginBottom: 16, letterSpacing: 1 }}>{DAILY_PROTOCOL.note}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {DAILY_PROTOCOL.blocks.map((b, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 12px", background: i % 2 === 0 ? "#0a0a1a" : "#0d0d22", borderLeft: `3px solid ${b.color}`, borderRadius: 4 }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: b.color, minWidth: 72, fontWeight: 700 }}>{b.time}</span>
              <span style={{ flex: 1, fontSize: 13, color: "#e0e0e0" }}>{b.action}</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#888", minWidth: 80, textAlign: "right" }}>{b.stat}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Penalties */}
      <section>
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: "#ff2244", letterSpacing: 4, marginBottom: 16, borderBottom: "1px solid #ff224433", paddingBottom: 8 }}>
          PENALTY SYSTEM — THE SYSTEM DOES NOT FORGIVE
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {PENALTIES.map((p, i) => (
            <div key={i} style={{ background: "#1a0a0a", border: "1px solid #ff222233", borderRadius: 6, padding: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <span style={{ fontSize: 13, color: "#ff6666", fontWeight: 700 }}>{p.trigger}</span>
                <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", padding: "2px 8px", borderRadius: 4, background: p.severity === "EXTREME" || p.severity === "MAX" ? "#ff000033" : "#ff440022", color: p.severity === "EXTREME" || p.severity === "MAX" ? "#ff4444" : "#ff8844" }}>
                  {p.severity}
                </span>
              </div>
              <div style={{ fontSize: 12, color: "#ccc" }}>{p.penalty}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  const questCategories = [
    { key: "tech", title: "TECH QUESTS (INT)", color: "#8b5cf6", icon: "🧠" },
    { key: "physical", title: "PHYSICAL QUESTS (STR/AGI)", color: "#ef4444", icon: "⚔️" },
    { key: "financial", title: "FINANCIAL QUESTS (GLD)", color: "#eab308", icon: "💰" },
    { key: "spiritual", title: "SPIRITUAL QUESTS (WIS)", color: "#22c55e", icon: "🌙" },
  ];

  const renderArcs = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Arc selector */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {ARCS.map((a, i) => (
          <button key={i} onClick={() => { setSelectedArc(i); setExpandedQuest(null); }}
            style={{ padding: "6px 14px", borderRadius: 6, border: selectedArc === i ? "2px solid #00e5ff" : "1px solid #333", background: selectedArc === i ? "#00e5ff15" : "#111", color: selectedArc === i ? "#00e5ff" : "#888", fontFamily: "'Bebas Neue', sans-serif", fontSize: 14, letterSpacing: 2, cursor: "pointer", transition: "all 0.2s" }}>
            ARC {a.arc}
          </button>
        ))}
      </div>

      {/* Arc header */}
      <div style={{ background: "linear-gradient(135deg, #00e5ff08, #8b5cf608)", border: "1px solid #00e5ff22", borderRadius: 12, padding: 24 }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#00e5ff88", letterSpacing: 2 }}>LEVELS {arc.levels}</div>
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, color: "#fff", letterSpacing: 4, margin: "4px 0" }}>
          ARC {arc.arc}: {arc.title}
        </h2>
        <div style={{ fontSize: 14, color: "#00e5ff", fontStyle: "italic", marginBottom: 12 }}>{arc.subtitle}</div>
        <p style={{ fontSize: 13, color: "#bbb", lineHeight: 1.6 }}>{arc.theme}</p>
        <div style={{ display: "flex", gap: 12, marginTop: 16, flexWrap: "wrap" }}>
          {Object.entries(arc.stats).map(([k, v]) => {
            const def = STATS_DEF.find(s => s.name === k);
            return (
              <span key={k} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, padding: "4px 10px", borderRadius: 4, background: `${def?.color}22`, color: def?.color, border: `1px solid ${def?.color}44` }}>
                {k}: {v}
              </span>
            );
          })}
        </div>
      </div>

      {/* Quest categories */}
      {questCategories.map(cat => (
        <div key={cat.key}>
          <button onClick={() => setExpandedQuest(expandedQuest === cat.key ? null : cat.key)}
            style={{ width: "100%", textAlign: "left", padding: "12px 16px", background: expandedQuest === cat.key ? `${cat.color}15` : "#0a0a18", border: `1px solid ${cat.color}33`, borderRadius: 8, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "all 0.2s" }}>
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: cat.color, letterSpacing: 3 }}>
              {cat.icon} {cat.title}
            </span>
            <span style={{ color: cat.color, fontSize: 18, transform: expandedQuest === cat.key ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▼</span>
          </button>
          {expandedQuest === cat.key && (
            <div style={{ border: `1px solid ${cat.color}22`, borderTop: "none", borderRadius: "0 0 8px 8px", padding: 16, background: "#05050f" }}>
              {arc[cat.key].map((quest, i) => (
                <div key={i} style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: i < arc[cat.key].length - 1 ? "1px solid #ffffff08" : "none" }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: cat.color, minWidth: 20, paddingTop: 2 }}>{String(i + 1).padStart(2, '0')}</span>
                  <span style={{ fontSize: 13, color: "#ccc", lineHeight: 1.5 }}>{quest}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Boss Raid */}
      <div style={{ background: "linear-gradient(135deg, #ff000008, #ff440008)", border: "2px solid #ff222244", borderRadius: 12, padding: 24, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 12, right: 16, fontFamily: "'Bebas Neue', sans-serif", fontSize: 48, color: "#ff000008", letterSpacing: 4 }}>BOSS</div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#ff4444", letterSpacing: 3, marginBottom: 4 }}>⚠ GATE DETECTED</div>
        <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, color: "#ff4444", letterSpacing: 3, marginBottom: 16 }}>{arc.boss.title}</h3>
        {[
          { label: "TECH CHALLENGE", text: arc.boss.tech, color: "#8b5cf6" },
          { label: "PHYSICAL CHALLENGE", text: arc.boss.physical, color: "#ef4444" },
          { label: "SPIRITUAL CHALLENGE", text: arc.boss.spiritual, color: "#22c55e" },
        ].map(ch => (
          <div key={ch.label} style={{ marginBottom: 12, paddingLeft: 12, borderLeft: `2px solid ${ch.color}` }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: ch.color, letterSpacing: 2, marginBottom: 2 }}>{ch.label}</div>
            <div style={{ fontSize: 13, color: "#ddd", lineHeight: 1.5 }}>{ch.text}</div>
          </div>
        ))}
        <div style={{ marginTop: 16, padding: 12, background: "#ffd70011", border: "1px solid #ffd70033", borderRadius: 6 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#ffd700", letterSpacing: 2 }}>REWARD</div>
          <div style={{ fontSize: 14, color: "#ffd700", fontWeight: 700, marginTop: 4 }}>{arc.boss.reward}</div>
        </div>
      </div>
    </div>
  );

  const renderInit = () => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 500, textAlign: "center", gap: 24 }}>
      {!initialized ? (
        <>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 48, color: "#00e5ff", letterSpacing: 6, animation: "pulse 2s ease-in-out infinite" }}>
            SYSTEM READY
          </div>
          <div style={{ fontSize: 14, color: "#888", maxWidth: 400, lineHeight: 1.6 }}>
            Player AATIF has been detected. The System Architect has designed a 100-Level progression path to transform an E-Rank Hunter into The Sovereign.
          </div>
          <button onClick={() => setInitialized(true)}
            style={{ padding: "16px 48px", background: "linear-gradient(135deg, #00e5ff, #0066ff)", border: "none", borderRadius: 8, fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: "#000", letterSpacing: 4, cursor: "pointer", transition: "all 0.3s", boxShadow: "0 0 30px #00e5ff33" }}>
            INITIALIZE SYSTEM
          </button>
        </>
      ) : (
        <pre style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: "#00e5ff", textAlign: "left", lineHeight: 1.7, maxWidth: 600, whiteSpace: "pre-wrap", padding: 24, background: "#00e5ff05", border: "1px solid #00e5ff22", borderRadius: 12 }}>
          {glitchText}<span style={{ animation: "blink 0.8s infinite" }}>▊</span>
        </pre>
      )}
    </div>
  );

  const tabs = [
    { key: "system", label: "CORE SYSTEM" },
    { key: "arcs", label: "10 ARCS (L1–L100)" },
    { key: "init", label: "INITIALIZE" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#050510", color: "#e0e0e0", fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=JetBrains+Mono:wght@400;700&display=swap');
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes scanline { 0% { top: -100%; } 100% { top: 100%; } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0a0a1a; }
        ::-webkit-scrollbar-thumb { background: #00e5ff33; border-radius: 3px; }
        button { font-family: inherit; }
      `}</style>

      {/* Header */}
      <div style={{ borderBottom: "1px solid #00e5ff22", padding: "16px 24px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "linear-gradient(90deg, #00e5ff05, transparent, #8b5cf605)" }} />
        <div style={{ position: "relative" }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#00e5ff66", letterSpacing: 3, marginBottom: 4 }}>SYSTEM ARCHITECT v1.0 — SOLO LEVELING PROTOCOL</div>
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 42, color: "#fff", letterSpacing: 6, lineHeight: 1 }}>
            <span style={{ color: "#00e5ff" }}>PLAYER:</span> AATIF
          </h1>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#888", marginTop: 4, letterSpacing: 1 }}>
            CLASS: TECHNOMANCER &nbsp;|&nbsp; RANK: E &nbsp;|&nbsp; TARGET: SOVEREIGN (LEVEL 100)
          </div>
        </div>
      </div>

      {/* Tab navigation */}
      <div style={{ display: "flex", borderBottom: "1px solid #ffffff11", padding: "0 24px" }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            style={{ padding: "12px 24px", background: "none", border: "none", borderBottom: activeTab === t.key ? "2px solid #00e5ff" : "2px solid transparent", color: activeTab === t.key ? "#00e5ff" : "#666", fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, letterSpacing: 3, cursor: "pointer", transition: "all 0.2s" }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
        {activeTab === "system" && renderSystem()}
        {activeTab === "arcs" && renderArcs()}
        {activeTab === "init" && renderInit()}
      </div>

      {/* Footer */}
      <div style={{ textAlign: "center", padding: 24, borderTop: "1px solid #ffffff08" }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#333", letterSpacing: 2 }}>
          THE SYSTEM DOES NOT NEGOTIATE. THE SYSTEM DOES NOT FORGIVE. THE SYSTEM REWARDS THE RELENTLESS.
        </div>
      </div>
    </div>
  );
}