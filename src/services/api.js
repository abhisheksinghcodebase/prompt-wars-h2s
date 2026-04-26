import indiaData from '@/data/india.json';
import usaData from '@/data/usa.json';

const DATA_MAP = {
  'IN': indiaData,
  'US': usaData,
  'India': indiaData,
  'United States': usaData,
};

// ── Get election data for a country ────────────────────────────────────────
export function getElectionData(countryKey) {
  return DATA_MAP[countryKey] || indiaData;
}

// ── Check eligibility ───────────────────────────────────────────────────────
export function checkEligibility(age, countryCode) {
  const data = getElectionData(countryCode);
  const minAge = data.eligibility.minAge;
  const eligible = age >= minAge;
  return {
    eligible,
    minAge,
    message: eligible
      ? `✅ You are eligible to vote in ${data.country}! You must register if you haven't already.`
      : `❌ You must be at least ${minAge} years old to vote in ${data.country}. You can pre-register when you turn ${minAge - 1} in some states.`,
    nextSteps: eligible ? data.registrationSteps : [],
  };
}

// ── Build personalized timeline ─────────────────────────────────────────────
export function buildTimeline(countryCode, electionDate) {
  const data = getElectionData(countryCode);
  const base = electionDate ? new Date(electionDate) : new Date();

  return data.timeline.map(item => {
    const date = new Date(base);
    date.setDate(date.getDate() + item.daysFromElection);
    return {
      ...item,
      computedDate: date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      isPast: date < new Date(),
      isCurrent: item.id === 'voting',
    };
  });
}

// ── Get FAQs ────────────────────────────────────────────────────────────────
export function getFAQs(countryCode) {
  const data = getElectionData(countryCode);
  return data.faqs || [];
}

// ── Get registration steps ──────────────────────────────────────────────────
export function getRegistrationSteps(countryCode) {
  const data = getElectionData(countryCode);
  return data.registrationSteps || [];
}

// ── AI Chat Logic (Demo Mode) ───────────────────────────────────────────────
const DEMO_RESPONSES = {
  'how to vote': `Great question! Here's how to vote in India:\n\n**1. Check your registration** — Are you on the voter list?\n**2. Find your polling booth** — Use the ECI Voter Helpline app or call **1950**\n**3. Carry valid ID** — Voter ID, Aadhaar, Passport, or any government photo ID\n**4. Head to your booth** — On polling day (7 AM – 6 PM)\n**5. Press the EVM button** — Next to your chosen candidate's name/symbol\n**6. Get the ink mark** — Indelible ink on your finger as proof!\n\nWould you like help with **voter registration** or finding your **nearest polling station?**`,
  'register': `To register as a voter in India, here's your step-by-step guide:\n\n**📋 Fill Form 6** online at [voters.eci.gov.in](https://voters.eci.gov.in)\n\n**📎 Documents needed:**\n- Age proof (Birth certificate / School leaving cert)\n- Address proof (Aadhaar / Utility bill)\n- Passport-size photo\n\n**⏱️ Timeline:** Applications processed in 4–6 weeks\n\n**📱 Tip:** Download the **Voter Helpline App** for the easiest experience!\n\nHow old are you? I can check if you're eligible right away! 🎯`,
  'eligible': `To vote in India, you must:\n\n✅ **Age:** 18 years or older\n✅ **Citizenship:** Indian citizen\n✅ **Residency:** Ordinary resident of your constituency\n\nIf you meet all three, you can register! Tell me your age and I'll check instantly.`,
  'deadline': `**Important Indian Election Deadlines:**\n\n📅 **Voter Roll Freeze:** ~45 days before election\n📋 **Last Registration Date:** Check your state ECI notification\n📮 **Postal Ballot Application:** 5 days before notification\n\n🔔 I'd recommend adding these to your calendar! Want me to help you set a reminder?`,
  'polling station': `To find your nearest polling station:\n\n**📱 Options:**\n1. **ECI Voter Helpline App** (Android/iOS)\n2. **Call 1950** (National Voter Helpline)\n3. **Visit** [electoralsearch.eci.gov.in](https://electoralsearch.eci.gov.in)\n4. **Check the Map tab** in this assistant — it shows stations near you!\n\nWant me to open the map for you? 🗺️`,
  'default': `I'm ElectIQ, your personal election guide! 🗳️\n\nI can help you with:\n- **How to vote** and what to bring\n- **Voter registration** step-by-step\n- **Checking eligibility** based on your age\n- **Finding polling stations** near you\n- **Election timelines** and deadlines\n- **FAQs** about the voting process\n\nWhat would you like to know? Just ask in plain language! 😊`,
};

export function getDemoResponse(message) {
  const lower = message.toLowerCase();
  if (lower.includes('register') || lower.includes('registration')) return DEMO_RESPONSES['register'];
  if (lower.includes('eligible') || lower.includes('eligib') || lower.includes('qualify')) return DEMO_RESPONSES['eligible'];
  if (lower.includes('deadline') || lower.includes('last date')) return DEMO_RESPONSES['deadline'];
  if (lower.includes('polling station') || lower.includes('where to vote') || lower.includes('booth')) return DEMO_RESPONSES['polling station'];
  if (lower.includes('how to vote') || lower.includes('how do i vote') || lower.includes('voting process')) return DEMO_RESPONSES['how to vote'];
  return DEMO_RESPONSES['default'];
}

// ── Call Gemini API ─────────────────────────────────────────────────────────
export async function callGeminiChat(messages, systemPrompt) {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    // Simulate API delay
    await new Promise(r => setTimeout(r, 1000 + Math.random() * 500));
    return getDemoResponse(messages[messages.length - 1]?.content || '');
  }

  try {
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const history = messages.slice(0, -1).map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));

    const chat = model.startChat({
      history,
      generationConfig: { maxOutputTokens: 800, temperature: 0.7 },
      systemInstruction: systemPrompt,
    });

    const result = await chat.sendMessage(messages[messages.length - 1].content);
    return result.response.text();
  } catch (err) {
    console.error('Gemini API error:', err);
    return getDemoResponse(messages[messages.length - 1]?.content || '');
  }
}

// ── Translate Text ──────────────────────────────────────────────────────────
export async function translateText(text, targetLang) {
  if (targetLang === 'en') return text;
  const apiKey = process.env.NEXT_PUBLIC_TRANSLATE_API_KEY;
  if (!apiKey || apiKey === 'your_translate_api_key') return text;

  try {
    const res = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: text, target: targetLang }),
      }
    );
    const data = await res.json();
    return data.data?.translations?.[0]?.translatedText || text;
  } catch {
    return text;
  }
}

// ── Generate Google Calendar URL ────────────────────────────────────────────
export function generateCalendarURL(event) {
  const base = 'https://www.google.com/calendar/render?action=TEMPLATE';
  const startDate = event.date.replace(/-/g, '');
  const endDate = startDate;
  const params = new URLSearchParams({
    text: event.title,
    dates: `${startDate}/${endDate}`,
    details: event.description,
    location: event.location || '',
  });
  return `${base}&${params.toString()}`;
}
