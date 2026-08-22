// sw.js - Morning Alarm (6 AM), Static GK (1:45 Interval), Universal Festivals & Backend Lock-Screen Push

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// =========================================================================
// 1. BACKEND WEB PUSH NOTIFICATION (Phone lock hone par ye trigger karega)
// =========================================================================
self.addEventListener('push', (event) => {
  let payload = {
    title: 'Study Session Complete! 🏆',
    body: 'Aapka target study session poora ho gaya hai! Next target set karein.'
  };

  if (event.data) {
    try {
      payload = event.data.json();
    } catch (e) {
      payload.body = event.data.text();
    }
  }

  const options = {
    body: payload.body,
    icon: 'https://cdn-icons-png.flaticon.com/512/3281/3281329.png',
    badge: 'https://cdn-icons-png.flaticon.com/512/3281/3281329.png',
    vibrate: [800, 400, 800, 400, 800],
    tag: 'study-timer-complete',
    renotify: true,
    requireInteraction: true
  };

  event.waitUntil(
    self.registration.showNotification(payload.title, options)
  );
});

// =========================================================================
// 2. NOTIFICATION CLICK HANDLER
// =========================================================================
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow('/');
    })
  );
});

// =========================================================================
// 3. FOREGROUND CLIENT MESSAGE LISTENER
// =========================================================================
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'TRIGGER_SESSION_NOTIFICATION') {
    const { title, body } = event.data;
    self.registration.showNotification(title, {
      body: body,
      icon: 'https://cdn-icons-png.flaticon.com/512/3281/3281329.png',
      badge: 'https://cdn-icons-png.flaticon.com/512/3281/3281329.png',
      vibrate: [500, 250, 500, 250, 500],
      tag: 'study-timer-complete',
      renotify: true,
      requireInteraction: true
    });
  }

  if (event.data && event.data.type === 'SCHEDULE_MORNING_ALARM') {
    setupBackgroundCrons();
  }
});

// =========================================================================
// 4. BACKGROUND TIMERS & STATIC GK / FESTIVALS MATRIX
// =========================================================================
function setupBackgroundCrons() {
  // 1. Morning Alarm Cron (6:00 AM Daily)
  setInterval(() => {
    const now = new Date();
    if (now.getHours() === 6 && now.getMinutes() === 0) {
      self.registration.showNotification("🌅 Good Morning, Satyam Bhaiya! Uth jaiye!", {
        body: "Subah ke 6 baj gaye hain! Aaj ka naya study target poora karne ke liye taiyar ho jaiye! 🚀",
        icon: 'https://cdn-icons-png.flaticon.com/512/3281/3281329.png',
        badge: 'https://cdn-icons-png.flaticon.com/512/3281/3281329.png',
        vibrate: [800, 400, 800, 400, 800],
        tag: 'good-morning-alarm',
        renotify: true,
        requireInteraction: true
      });
    }
  }, 60000); // Check every minute

  // 2. Static GK & Festivals 1:45 Hours (105 Minutes) Interval
  setInterval(() => {
    triggerBackgroundStaticGKAndFestivals();
  }, 105 * 60 * 1000);
}

function triggerBackgroundStaticGKAndFestivals() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const dateKey = `${month}-${day}`;
  const fullDateKey = `${year}-${month}-${day}`;

  // Major Hindu / Islamic / National Festivals Matrix (2026-2027)
  const majorFestivals = {
    "2026-2-16": { title: "✨ Maha Shivratri 🔱", body: "Mahashivratri ki hardik shubhkamnayein! Har har Mahadev!" },
    "2026-3-3": { title: "🎨 Holi Festival of Colors 🌸", body: "Rangon ke tyohar Holi ki hardik shubhkamnayein! Safalta ke rango se jeevan bhare." },
    "2026-3-31": { title: "🌙 Eid-ul-Fitr", body: "Eid Mubarak! Aapke jeevan me khushiyan aur barkat aaye." },
    "2026-8-12": { title: "🦚 Shri Krishna Janmashtami", body: "Janmashtami ki shubhkamnayein! Karm karo, phal ki chinta mat karo." },
    "2026-8-28": { title: "🧵 Raksha Bandhan", body: "Raksha Bandhan ki hardik shubhkamnayein! Bhai-behen ke prem ka pawan parw." },
    "2026-10-20": { title: "🏹 Vijayadashami (Dussehra)", body: "Dussehra ki shubhkamnayein! Burai par achhai ki jeet ho." },
    "2026-11-8": { title: "🪔 Deepawali (Diwali)", body: "Deepawali ki hardik shubhkamnayein! Gyan aur roshni ka deep jalta rahe." },
    "2026-11-10": { title: "🎇 Bhai Dooj", body: "Bhai Dooj ki hardik shubhkamnayein!" },
    // 2027 Major Dates
    "2027-3-6": { title: "✨ Maha Shivratri 🔱", body: "Mahashivratri ki hardik shubhkamnayein! Har har Mahadev!" },
    "2027-3-22": { title: "🎨 Holi Festival of Colors 🌸", body: "Holi ki hardik shubhkamnayein!" },
    "2027-8-31": { title: "🦚 Shri Krishna Janmashtami", body: "Janmashtami ki shubhkamnayein!" },
    "2027-10-29": { title: "🪔 Deepawali (Diwali)", body: "Deepawali ki hardik shubhkamnayein!" }
  };

  // Complete Static GK Days Database
  const staticGKDays = {
    "1-1": { title: "1 January — अंग्रेजी नववर्ष / ग्लोबल फैमिली डे", body: "Naye saal ki shubhkamnayein! Global Family Day ki hardik badhai." },
    "1-4": { title: "4 January — विश्व ब्रेल दिवस", body: "World Braille Day." },
    "1-5": { title: "5 January — राष्ट्रीय पक्षी दिवस", body: "National Bird Day." },
    "1-6": { title: "6 January — विश्व युद्ध अनाथ दिवस", body: "World War Orphans Day." },
    "1-9": { title: "9 January — प्रवासी भारतीय दिवस", body: "Pravasi Bharatiya Divas." },
    "1-10": { title: "10 January — विश्व हिंदी दिवस", body: "Vishva Hindi Diwas." },
    "1-11": { title: "11 January — लाल बहादुर शास्त्री पुण्यतिथि", body: "Lal Bahadur Shastri Punyatithi." },
    "1-12": { title: "12 January — राष्ट्रीय युवा दिवस", body: "National Youth Day (Swami Vivekananda Jayanti)." },
    "1-15": { title: "15 January — भारतीय सेना दिवस / 🎂 Happy Birthday Admin's Sweetheart", body: "Indian Army Day! Aur sath hi 🎂 Happy Birthday Admin's Sweetheart! 🎉" },
    "1-16": { title: "16 January — राष्ट्रीय स्टार्टअप दिवस", body: "National Startup Day." },
    "1-23": { title: "23 January — नेताजी सुभाषचंद्र बोस जयंती", body: "Netaji Subhash Chandra Bose Jayanti." },
    "1-24": { title: "24 January — राष्ट्रीय बालिका दिवस", body: "National Girl Child Day." },
    "1-25": { title: "25 January — राष्ट्रीय मतदाता दिवस / अंतर्राष्ट्रीय पर्यटन दिवस", body: "National Voters Day & Tourism Day." },
    "1-26": { title: "26 January — अंतर्राष्ट्रीय सीमा शुल्क दिवस", body: "International Customs Day." },
    "1-27": { title: "27 January — अंतर्राष्ट्रीय होलोकॉस्ट दिवस", body: "Holocaust Remembrance Day." },
    "1-28": { title: "28 January — लाला लाजपत राय जयंती / डेटा प्रोटेक्शन दिवस", body: "Lala Lajpat Rai Jayanti & Data Protection Day." },
    "1-30": { title: "30 January — शहीद दिवस / कुष्ठ उन्मूलन दिवस", body: "Martyrs' Day & Leprosy Elimination Day." },
    "1-31": { title: "31 January — अंतर्राष्ट्रीय ज़ेब्रा दिवस", body: "International Zebra Day." },
    "2-1": { title: "1 February — भारतीय तटरक्षक दिवस", body: "Indian Coast Guard Day." },
    "2-2": { title: "2 February — विश्व आर्द्रभूमि दिवस", body: "World Wetlands Day." },
    "2-4": { title: "4 February — विश्व कैंसर दिवस", body: "World Cancer Day." },
    "2-6": { title: "6 February — महिला जननांग विकृति के प्रति शून्य सहिष्णुता दिवस", body: "Zero Tolerance to FGM Day." },
    "2-8": { title: "8 February — सुरक्षित इंटरनेट दिवस", body: "Safer Internet Day." },
    "2-10": { title: "10 February — राष्ट्रीय कृमिनाशक दिवस / विश्व दलहन दिवस", body: "National Deworming Day & World Pulses Day." },
    "2-11": { title: "11 February — बीमारों का विश्व दिवस / अंतर्राष्ट्रीय महिला एवं बालिका विज्ञान दिवस", body: "World Day of the Sick & Women in Science Day." },
    "2-21": { title: "21 February — अंतर्राष्ट्रीय मातृभाषा दिवस", body: "International Mother Language Day." },
    "2-22": { title: "22 February — विश्व चिंतन दिवस", body: "World Thinking Day." },
    "2-24": { title: "24 February — केंद्रीय उत्पाद शुल्क दिवस", body: "Central Excise Day." },
    "2-27": { title: "27 February — विश्व NGO दिवस", body: "World NGO Day." },
    "2-28": { title: "28 February — राष्ट्रीय विज्ञान दिवस", body: "National Science Day (C.V. Raman)." },
    "3-1": { title: "1 March — शून्य भेदभाव दिवस", body: "Zero Discrimination Day." },
    "3-3": { title: "3 March — विश्व वन्यजीव दिवस", body: "World Wildlife Day." },
    "3-4": { title: "4 March — राष्ट्रीय सुरक्षा दिवस", body: "National Security Day." },
    "3-8": { title: "8 March — अंतर्राष्ट्रीय महिला दिवस", body: "International Women's Day!" },
    "3-10": { title: "10 March — CISF स्थापना दिवस", body: "CISF Raising Day." },
    "3-14": { title: "14 March — पाई दिवस", body: "Pi Day." },
    "3-15": { title: "15 March — विश्व उपभोक्ता अधिकार दिवस", body: "World Consumer Rights Day." },
    "3-16": { title: "16 March — राष्ट्रीय टीकाकरण दिवस", body: "National Vaccination Day." },
    "3-20": { title: "20 March — अंतर्राष्ट्रीय प्रसन्नता दिवस / विश्व गौरैया दिवस", body: "Day of Happiness & World Sparrow Day." },
    "3-21": { title: "21 March — विश्व वानिकी दिवस", body: "World Forestry Day." },
    "3-22": { title: "22 March — विश्व जल दिवस", body: "World Water Day - Jal hi jeevan hai." },
    "3-23": { title: "23 March — विश्व मौसम विज्ञान दिवस", body: "World Meteorological Day." },
    "3-24": { title: "24 March — विश्व क्षय रोग दिवस", body: "World TB Day." },
    "4-1": { title: "1 April — ओडिशा स्थापना दिवस / अप्रैल फूल दिवस", body: "Utkal Divas & Fools' Day." },
    "4-2": { title: "2 April — विश्व ऑटिज़्म जागरूकता दिवस", body: "World Autism Awareness Day." },
    "4-17": { title: "17 April — विश्व हीमोफीलिया दिवस", body: "World Hemophilia Day." },
    "4-18": { title: "18 April — विश्व धरोहर दिवस", body: "World Heritage Day." },
    "4-21": { title: "21 April — राष्ट्रीय सिविल सेवा दिवस", body: "Civil Services Day." },
    "4-22": { title: "22 April — विश्व पृथ्वी दिवस", body: "World Earth Day." },
    "4-24": { title: "24 April — राष्ट्रीय पंचायती राज दिवस", body: "Panchayati Raj Day." },
    "4-25": { title: "25 April — विश्व मलेरिया दिवस", body: "World Malaria Day." },
    "4-26": { title: "26 April — विश्व बौद्धिक संपदा दिवस", body: "Intellectual Property Day." },
    "4-28": { title: "28 April — कार्यस्थल पर सुरक्षा एवं स्वास्थ्य दिवस", body: "Safety and Health at Work Day." },
    "5-1": { title: "1 मई — अंतर्राष्ट्रीय मजदूर दिवस / महाराष्ट्र / गुजरात दिवस", body: "Labour Day & Foundation Day." },
    "5-3": { title: "3 May — प्रेस स्वतंत्रता दिवस", body: "Press Freedom Day." },
    "5-7": { title: "7 May — विश्व एथलेटिक्स दिवस", body: "World Athletics Day." },
    "5-8": { title: "8 May — विश्व रेड क्रॉस दिवस / विश्व थैलेसीमिया दिवस", body: "World Red Cross & Thalassemia Day." },
    "5-9": { title: "9 May — रवींद्रनाथ टैगोर जयंती", body: "Rabindranath Tagore Jayanti." },
    "5-11": { title: "11 May — राष्ट्रीय प्रौद्योगिकी दिवस", body: "National Technology Day." },
    "5-12": { title: "12 May — अंतर्राष्ट्रीय नर्स दिवस", body: "International Nurses Day." },
    "5-17": { title: "17 May — विश्व दूरसंचार दिवस / उच्च रक्तचाप दिवस", body: "Telecom & Hypertension Day." },
    "5-18": { title: "18 May — अंतर्राष्ट्रीय संग्रहालय दिवस", body: "International Museum Day." },
    "5-21": { title: "21 May — राष्ट्रीय आतंकवाद विरोधी दिवस / चाय दिवस", body: "Anti-Terrorism Day & Tea Day." },
    "5-22": { title: "22 May — अंतर्राष्ट्रीय जैव विविधता दिवस", body: "Biological Diversity Day." },
    "5-25": { title: "25 May — थायरॉयड दिवस", body: "World Thyroid Day." },
    "5-31": { title: "31 May — धूम्रपान निषेध दिवस", body: "World No Tobacco Day." },
    "6-1": { title: "1 June — विश्व दुग्ध दिवस", body: "World Milk Day." },
    "6-2": { title: "2 June — तेलंगाना स्थापना दिवस", body: "Telangana Formation Day." },
    "6-3": { title: "3 June — विश्व साइकिल दिवस", body: "World Bicycle Day." },
    "6-5": { title: "5 June — विश्व पर्यावरण दिवस", body: "World Environment Day." },
    "6-7": { title: "7 June — विश्व खाद्य सुरक्षा दिवस", body: "World Food Safety Day." },
    "6-8": { title: "8 June — विश्व महासागर दिवस", body: "World Oceans Day." },
    "6-12": { title: "12 June — बाल श्रम निषेध दिवस", body: "Anti-Child Labour Day." },
    "6-14": { title: "14 June — विश्व रक्तदाता दिवस", body: "World Blood Donor Day." },
    "6-20": { title: "20 June — विश्व शरणार्थी दिवस", body: "World Refugee Day." },
    "6-21": { title: "21 June — अंतर्राष्ट्रीय योग दिवस", body: "International Yoga Day." },
    "6-23": { title: "23 June — अंतर्राष्ट्रीय ओलंपिक दिवस", body: "International Olympic Day." },
    "6-27": { title: "27 June — MSME दिवस", body: "MSME Day." },
    "6-29": { title: "29 June — राष्ट्रीय सांख्यिकी दिवस", body: "National Statistics Day." },
    "7-1": { title: "1 July — राष्ट्रीय चिकित्सक दिवस / CA दिवस", body: "Doctors' Day & CA Day." },
    "7-11": { title: "11 July — विश्व जनसंख्या दिवस", body: "World Population Day." },
    "7-19": { title: "19 July — 🎂 Happy Birthday Admin (Satyam Bhaiya)", body: "🎉 Special Day: Happy Birthday to our Admin Satyam Bhaiya! 🎂" },
    "7-26": { title: "26 July — कारगिल विजय दिवस", body: "Kargil Vijay Day." },
    "7-28": { title: "28 July — विश्व हेपेटाइटिस दिवस / प्रकृति संरक्षण दिवस", body: "Hepatitis & Nature Conservation Day." },
    "7-29": { title: "29 July — अंतर्राष्ट्रीय बाघ दिवस", body: "International Tiger Day." },
    "8-6": { title: "6 August — हिरोशिमा दिवस", body: "Hiroshima Day." },
    "8-7": { title: "7 August — राष्ट्रीय हथकरघा दिवस / जेवलिन दिवस", body: "Handloom & Javelin Throw Day." },
    "8-9": { title: "9 August — नागासाकी दिवस", body: "Nagasaki Day." },
    "8-12": { title: "12 August — अंतर्राष्ट्रीय युवा दिवस / हाथी दिवस", body: "International Youth Day & World Elephant Day." },
    "8-13": { title: "13 August — विश्व अंगदान दिवस", body: "World Organ Donation Day." },
    "8-15": { title: "15 August — भारत का स्वतंत्रता दिवस", body: "🇮🇳 Swatantrata Diwas ki hardik shubhkamnayein!" },
    "8-19": { title: "19 August — विश्व फोटोग्राफी दिवस / मानवीय दिवस", body: "Photography & Humanitarian Day." },
    "8-20": { title: "20 August — सद्भावना दिवस", body: "Sadbhavana Diwas." },
    "8-26": { title: "26 August — महिला समानता दिवस", body: "Women's Equality Day." },
    "8-29": { title: "29 August — राष्ट्रीय खेल दिवस", body: "National Sports Day." },
    "9-5": { title: "5 September — शिक्षक दिवस", body: "Happy Teachers' Day!" },
    "9-8": { title: "8 September — अंतर्राष्ट्रीय साक्षरता दिवस", body: "International Literacy Day." },
    "9-14": { title: "14 September — हिंदी दिवस", body: "Hindi Divas ki hardik shubhkamnayein!" },
    "9-15": { title: "15 September — अभियंता दिवस", body: "Engineer's Day." },
    "9-16": { title: "16 September — विश्व ओज़ोन दिवस", body: "World Ozone Day." },
    "9-21": { title: "21 September — अंतर्राष्ट्रीय शांति दिवस", body: "International Day of Peace." },
    "9-27": { title: "27 September — विश्व पर्यटन दिवस", body: "World Tourism Day." },
    "10-1": { title: "1 October — अंतर्राष्ट्रीय वृद्धजन दिवस", body: "International Day of Older Persons." },
    "10-2": { title: "2 October — गांधी जयंती / अंतर्राष्ट्रीय अहिंसा दिवस", body: "Mahatma Gandhi & Lal Bahadur Shastri Jayanti." },
    "10-5": { title: "5 October — विश्व शिक्षक दिवस", body: "World Teachers' Day." },
    "10-8": { title: "8 October — भारतीय वायु सेना दिवस", body: "Indian Air Force Day." },
    "10-9": { title: "9 October — विश्व डाक दिवस", body: "World Post Day." },
    "10-10": { title: "10 October — विश्व मानसिक स्वास्थ्य दिवस", body: "World Mental Health Day." },
    "10-11": { title: "11 October — अंतर्राष्ट्रीय बालिका दिवस", body: "International Girl Child Day." },
    "10-24": { title: "24 October — संयुक्त राष्ट्र दिवस", body: "United Nations Day." },
    "10-31": { title: "31 October — राष्ट्रीय एकता दिवस", body: "National Unity Day." },
    "11-7": { title: "7 November — राष्ट्रीय कैंसर जागरूकता दिवस", body: "National Cancer Awareness Day." },
    "11-11": { title: "11 November — राष्ट्रीय शिक्षा दिवस", body: "National Education Day." },
    "11-14": { title: "14 November — बाल दिवस / विश्व मधुमेह दिवस", body: "Children's Day & World Diabetes Day." },
    "11-19": { title: "19 November — अंतर्राष्ट्रीय पुरुष दिवस", body: "International Men's Day." },
    "11-26": { title: "26 November — भारत का संविधान दिवस", body: "Constitution Day of India." },
    "12-1": { title: "1 December — विश्व एड्स दिवस", body: "World AIDS Day." },
    "12-2": { title: "2 December — राष्ट्रीय प्रदूषण नियंत्रण दिवस / कंप्यूटर साक्षरता दिवस", body: "Pollution Control & Computer Literacy Day." },
    "12-3": { title: "3 December — विश्व विकलांग दिवस", body: "World Disability Day." },
    "12-4": { title: "4 December — भारतीय नौसेना दिवस", body: "Indian Navy Day." },
    "12-5": { title: "5 December — विश्व मृदा दिवस", body: "World Soil Day." },
    "12-7": { title: "7 December — सशस्त्र सेना ध्वज दिवस", body: "Armed Forces Flag Day." },
    "12-10": { title: "10 December — मानवाधिकार दिवस", body: "Human Rights Day." },
    "12-16": { title: "16 December — विजय दिवस", body: "Vijay Diwas." },
    "12-22": { title: "22 December — राष्ट्रीय गणित दिवस", body: "National Mathematics Day." },
    "12-23": { title: "23 December — किसान दिवस", body: "Kisan Diwas." },
    "12-24": { title: "24 December — राष्ट्रीय उपभोक्ता अधिकार दिवस", body: "Consumer Rights Day." },
    "12-25": { title: "25 December — सुशासन दिवस", body: "Good Governance Day." },
    "12-26": { title: "26 December — वीर बाल दिवस", body: "Veer Baal Diwas." }
  };

  // Check Festival first, then Static GK
  let activeEvent = majorFestivals[fullDateKey] || staticGKDays[dateKey];

  if (activeEvent) {
    self.registration.showNotification(`🎉 ${activeEvent.title}`, {
      body: activeEvent.body,
      icon: 'https://cdn-icons-png.flaticon.com/512/3281/3281329.png',
      badge: 'https://cdn-icons-png.flaticon.com/512/3281/3281329.png',
      vibrate: [400, 200, 400],
      tag: 'festival-gk-reminder',
      renotify: true,
      requireInteraction: true
    });
  }
}
