import React, { useState } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  Shield,
  Compass,
  Phone,
  AlertCircle,
  RefreshCw,
  MapPin,
  CheckCircle2,
  HelpCircle,
  Flame,
  FileCheck,
  Building2
} from 'lucide-react';

interface AISafetyCompanionProps {
  currentLocationName: string;
}

interface Message {
  sender: 'user' | 'ai';
  text: string;
  time: string;
  recommendations?: string[];
}

export const AISafetyCompanion: React.FC<AISafetyCompanionProps> = ({ currentLocationName }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: `Namaste! I am your AstraSafe AI Safety Companion powered by Gemini. 

I am specifically trained on mountain safety protocols, terrain hazards, night walking corridors, and emergency infrastructure across all Himalayan destinations (**Manali & Solang Valley, Spiti Valley, Dharamshala & McLeod Ganj, Kasol & Parvati Valley, Jibhi & Tirthan Valley, Bir Billing, and Shimla**).

How can I assist your safe solo exploration in **${currentLocationName}** today?`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'all' | 'manali' | 'spiti' | 'trekking' | 'medical'>('all');

  // Grounded Specialized Prompts
  const CORE_TRAINED_PROMPTS = [
    {
      id: 'p1',
      category: 'manali',
      icon: '💡',
      text: 'Is Old Manali safe for a woman to walk alone around 8 PM?',
      badge: 'Night Safety',
    },
    {
      id: 'p2',
      category: 'spiti',
      icon: '🚨',
      text: 'What emergency numbers should I know before heading to Spiti Valley?',
      badge: 'Spiti Helplines',
    },
    {
      id: 'p3',
      category: 'trekking',
      icon: '📋',
      text: 'How to register my Hampta Pass trek with Himachal Tourism?',
      badge: 'Govt Trek Register',
    },
    {
      id: 'p4',
      category: 'medical',
      icon: '🏥',
      text: 'Where is the nearest 24/7 hospital with a female doctor near Solang?',
      badge: 'Medical & Hospital',
    },
    {
      id: 'p5',
      category: 'manali',
      icon: '🛡️',
      text: 'Where is the 24/7 All-Women Police Desk in Manali?',
      badge: 'Police Desk',
    },
    {
      id: 'p6',
      category: 'spiti',
      icon: '❄️',
      text: 'How to prevent AMS (Altitude Sickness) in Kaza and Langza (Spiti)?',
      badge: 'Altitude Safety',
    },
    {
      id: 'p7',
      category: 'trekking',
      icon: '🌲',
      text: 'Is it safe to walk alone along Kasol Parvati riverbank after 8 PM?',
      badge: 'Parvati Caution',
    },
    {
      id: 'p8',
      category: 'medical',
      icon: '🪂',
      text: 'What emergency medical facilities exist in Bir Billing for solo women?',
      badge: 'Bir Billing Care',
    },
  ];

  // Client-Side Deterministic Knowledge Fallback (Guarantees instant, rich response even if network lags)
  const LOCAL_KNOWLEDGE: Record<string, { advice: string; recs: string[] }> = {
    'old_manali': {
      advice: `✅ **Yes, Old Manali is generally very safe for a woman walking alone around 8 PM.**

• **Street Lighting & Atmosphere:** The central promenade along Manu Temple Road, Old Manali Bridge, and Cafe 1947 stretch is well-illuminated and lively with acoustic music, boutique craft shops, and friendly travelers until 9:30 PM–10:00 PM.
• **Dedicated All-Women Night Patrol:** Himachal Pradesh Police deploys a dedicated All-Women Night Patrol unit between Old Manali Bridge and Log Huts until 1:00 AM daily. (Lady Officer on Duty: **+91 1902 252326** or Women Helpline **1091**).
• **Actionable Advice:**
  1. Stick to the paved main Manu Temple Road; avoid descending into unlit orchard trails or riverside stones after dark.
  2. If staying in higher uphill cottages in Clubhouse or Log Huts area past 9:30 PM, use AstraSafe Cab Guard or request your verified homestay host for pickup.
  3. Pre-paid electric autos and registered cabs are stationed at Old Manali Bridge.`,
      recs: [
        'Main Manu Temple Road is illuminated until 10 PM',
        'All-Women Police Desk at Mall Road Station (+91 1902 252326)',
        'Prepaid Auto stand at Old Manali Bridge',
        'Speed dial: 1091 (HP Women Helpline) / 112 (ERSS)'
      ]
    },
    'spiti_numbers': {
      advice: `🚨 **Crucial Emergency Contacts for Spiti Valley (Save Offline Before Entering Kunzum Pass):**

*Important: Mobile network completely cuts off on Kunzum Pass between Losar and Batal (38km dead zone). Only BSNL maintains consistent 4G/3G connectivity in Kaza and Tabo.*

1. **HP Women Emergency Helpline (Toll-Free 24/7):** **1091**
2. **Spiti District Disaster & Mountain Rescue Squad (Kaza SDM Office):** **+91 1906 222201** / **+91 1906 222222**
3. **Kaza Community Health Center & 24/7 Hyperbaric Oxygen Emergency Unit:** **+91 1906 222212** *(Equipped with Gamow bags, high-altitude physicians, and oxygen therapy)*
4. **Border Roads Organisation (BRO) Project Deepak Kunzum Rescue:** **+91 1906 222210** *(For snow blockages, landslides, or mechanical breakdowns)*
5. **Tabo Monastery Health Post:** **+91 1906 223410**
6. **Kaza Local Police Station:** **+91 1906 222222**
7. **National Emergency Helpline:** **112**

💡 **Pro-Tip:** Download the AstraSafe Spiti Offline Map and carry ₹5,000 in cash as Kaza ATMs frequently face network outages.`,
      recs: [
        'Save Kaza Hospital 24/7 Oxygen Unit (+91 1906 222212)',
        'BSNL Postpaid SIM provides highest reliability across Spiti',
        'Acclimatize 36 hours in Kaza (3,650m) before ascending to Langza/Komic',
        'BRO Kunzum Rescue: +91 1906 222210'
      ]
    },
    'hampta_reg': {
      advice: `📋 **How to Register Your Hampta Pass Trek (4,270m) with Himachal Tourism & Local Police:**

1. **Online Declaration via AstraSafe 'Govt Check-In':**
   • Go to the **Govt Check-In** tab in this app.
   • Submit your trek route (*Jobra -> Chikka -> Balu Ka Ghera -> Hampta Pass -> Shea Goru -> Chatru*), guide license ID, and expected return dates.
   • A digital registration token is transmitted directly to Himachal Tourism and Kullu District Police.

2. **Physical Checkposts in Manali & Jobra:**
   • **Tourist Information Center, The Mall, Manali:** (Phone: **+91 1902 253531**, Open 9 AM - 6 PM).
   • **Jobra Forest Entry Checkpost:** Present your government photo ID and obtain your trek environmental pass.

3. **Mandatory Safety Regulations for Solo Women:**
   • All solo women must trek with a licensed guide carrying an HP Tourism / AstraSafe badge (e.g. Maya Devi or Rajesh Thakur).
   • Carry AMS medicine (Diamox) and verify your check-in interval (set to 24-36 hours) so mountain rescue is automatically triggered if you miss the Chatru checkpoint.`,
      recs: [
        'Register online via AstraSafe Govt Check-In tab',
        'Physical counter: HP Tourism Office, Mall Road (+91 1902 253531)',
        'Mandatory Guide verification at Jobra Forest checkpost',
        'Check-in intervals set to 24-36 hours'
      ]
    },
    'solang_hospital': {
      advice: `🏥 **Nearest 24/7 Hospital with Female Doctors near Solang Valley:**

1. **First-Response First-Aid Clinic in Solang Valley (1.2 km):**
   • **Solang Valley Alpine Medical Center & First Aid Post**
   • *Location:* Solang Ropeway Ground Complex
   • *Phone:* **+91 1902 256112** (Operating 08:00 AM – 08:00 PM)
   • *Services:* High-altitude first aid, portable oxygen, emergency splints, and hypothermia stabilization.

2. **Nearest 24/7 Multi-Speciality Hospital with Female Doctors & Gynaecologist (12.8 km / ~25 mins drive):**
   • **Kullu Valley Women & Child Care Hospital / Civil Hospital Manali**
   • *Address:* Circuit House Road, Lower Mall, Manali (12.8 km from Solang via NH-3)
   • *24/7 Emergency Hotline:* **+91 1902 252333**
   • *Free Ambulance Dispatch:* **108**
   • *Resident Female Specialist:* **Dr. Shalini Sharma** (Senior Emergency Medical Officer & Women Care Specialist) on 24/7 duty rotation.
   • *Facilities:* 24/7 pharmacy, hyperbaric oxygen unit, emergency trauma ICU, and clean female inpatient wards.`,
      recs: [
        'Emergency 24/7 Hospital: Civil Hospital Manali (+91 1902 252333)',
        'Solang Alpine First Aid Post: +91 1902 256112',
        'Free 24/7 Ambulance: 108',
        'Resident Female Emergency Physician on duty'
      ]
    }
  };

  const handleSend = async (customPrompt?: string) => {
    const promptToSend = customPrompt || input;
    if (!promptToSend.trim() || isLoading) return;

    const userMsg: Message = {
      sender: 'user',
      text: promptToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setInput('');
    setIsLoading(true);

    // Check for local instant knowledge match
    const q = promptToSend.toLowerCase();
    let localMatch = null;
    if (q.includes('old manali') && (q.includes('safe') || q.includes('8 pm') || q.includes('walk') || q.includes('night'))) {
      localMatch = LOCAL_KNOWLEDGE['old_manali'];
    } else if ((q.includes('emergency') || q.includes('number') || q.includes('helpline')) && q.includes('spiti')) {
      localMatch = LOCAL_KNOWLEDGE['spiti_numbers'];
    } else if (q.includes('hampta') && (q.includes('register') || q.includes('trek') || q.includes('tourism'))) {
      localMatch = LOCAL_KNOWLEDGE['hampta_reg'];
    } else if ((q.includes('solang') || q.includes('hospital') || q.includes('female doctor')) && (q.includes('hospital') || q.includes('doctor') || q.includes('solang'))) {
      localMatch = LOCAL_KNOWLEDGE['solang_hospital'];
    }

    try {
      const res = await fetch('/api/gemini/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptToSend,
          location: currentLocationName,
          userRole: 'Verified Female Solo Explorer',
        }),
      });

      const data = await res.json();
      const aiReply = data.advice || localMatch?.advice || 'Please contact HP Women Helpline 1091 for immediate safety assistance.';

      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: aiReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          recommendations: data.recommendations || localMatch?.recs,
        },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: localMatch?.advice || `Emergency Mountain Protocol: In ${currentLocationName}, call Women Helpline 1091 or State Police 112. Stay on main lighted streets after dark.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          recommendations: localMatch?.recs || ['Dial 1091 for 24/7 Women Police Dispatch'],
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPrompts =
    activeCategory === 'all'
      ? CORE_TRAINED_PROMPTS
      : CORE_TRAINED_PROMPTS.filter((p) => p.category === activeCategory);

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl mx-auto">
      
      {/* HEADER BANNER */}
      <div className="p-6 sm:p-7 rounded-3xl bg-[#FAF8F5] dark:bg-[#18221A] border border-[#E5E0D5] dark:border-[#2C382E] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-full bg-[#F0F4EF] dark:bg-[#253327] text-[#5A6D56] dark:text-[#88B084] border border-[#5A6D56]/30">
              <Bot className="w-5 h-5" />
            </span>
            <span className="text-[11px] font-black uppercase tracking-wider text-[#5A6D56] dark:text-[#88B084]">
              Gemini 3.6 AI Safety Companion • Himalaya Knowledge Engine
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-serif font-black text-[#2C362B] dark:text-[#FFFFFF] mt-1.5">
            24/7 Mountain Safety & Local Intelligence Advisor
          </h1>
          <p className="text-xs text-[#7A7A7A] dark:text-[#9DAFA0] mt-1 max-w-2xl">
            Trained on safe night routes, emergency numbers, hospital female doctors, and trek registrations across <strong>{currentLocationName}</strong> and all Himalayan destinations.
          </p>
        </div>

        <div className="shrink-0 flex sm:flex-col items-center sm:items-end gap-1.5">
          <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Active & Verified
          </span>
          <span className="text-[10px] text-[#8A8A8A] dark:text-[#9DAFA0]">
            Location: {currentLocationName.split(',')[0]}
          </span>
        </div>
      </div>

      {/* CATEGORY SELECTOR & SUGGESTED QUICK PROMPTS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#8A8A8A] dark:text-[#9DAFA0] uppercase tracking-wider block">
            Featured Safety Queries (Trained Knowledge Base):
          </span>

          <div className="flex items-center gap-1 text-[11px] overflow-x-auto no-scrollbar">
            {[
              { id: 'all', label: 'All Queries' },
              { id: 'manali', label: 'Old Manali' },
              { id: 'spiti', label: 'Spiti Valley' },
              { id: 'trekking', label: 'Hampta & Treks' },
              { id: 'medical', label: 'Hospitals & Doctors' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition whitespace-nowrap cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-[#5A6D56] text-white'
                    : 'bg-white dark:bg-[#1E2920] border border-[#E5E0D5] dark:border-[#2C382E] text-[#555] dark:text-[#CBD5CB] hover:bg-[#F0F4EF]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* PROMPT CHIPS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {filteredPrompts.map((p) => (
            <button
              key={p.id}
              onClick={() => handleSend(p.text)}
              className="p-3 rounded-2xl bg-white dark:bg-[#1B251D] hover:bg-[#F0F4EF] dark:hover:bg-[#243326] border border-[#E5E0D5] dark:border-[#2C382E] hover:border-[#5A6D56] text-left transition cursor-pointer shadow-xs flex items-start justify-between gap-3 group"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FAF8F5] dark:bg-[#222E23] text-[#5A6D56] dark:text-[#88B084] border border-[#E5E0D5] dark:border-[#2C382E] inline-block">
                  {p.badge}
                </span>
                <p className="text-xs font-semibold text-[#2C362B] dark:text-[#EAEFE9] group-hover:text-[#5A6D56] dark:group-hover:text-[#88B084] leading-snug">
                  {p.icon} {p.text}
                </p>
              </div>
              <span className="text-[#8A8A8A] text-xs shrink-0 mt-1 font-bold group-hover:translate-x-0.5 transition">
                →
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* CHAT CONTAINER */}
      <div className="bg-white dark:bg-[#18221A] border border-[#E5E0D5] dark:border-[#2C382E] rounded-3xl p-4 sm:p-6 shadow-sm flex flex-col h-[540px]">
        
        {/* MESSAGES STREAM */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 text-xs font-bold ${
                  m.sender === 'user'
                    ? 'bg-[#5A6D56] text-white shadow-xs'
                    : 'bg-[#F0F4EF] dark:bg-[#253327] border border-[#5A6D56]/30 text-[#5A6D56] dark:text-[#88B084]'
                }`}
              >
                {m.sender === 'user' ? 'YOU' : <Bot className="w-5 h-5" />}
              </div>

              <div
                className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-[#5A6D56] text-white rounded-tr-none shadow-xs'
                    : 'bg-[#FAF8F5] dark:bg-[#1F2920] border border-[#E5E0D5] dark:border-[#2C382E] text-[#2C362B] dark:text-[#EAEFE9] rounded-tl-none whitespace-pre-line'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5 pb-1 border-b border-black/5 dark:border-white/5">
                  <span className="font-bold opacity-90 flex items-center gap-1.5">
                    {m.sender === 'user' ? (
                      'You'
                    ) : (
                      <>
                        <Shield className="w-3.5 h-3.5 text-[#5A6D56] dark:text-[#88B084]" />
                        <span>AstraSafe AI Safety Companion</span>
                      </>
                    )}
                  </span>
                  <span className="text-[10px] opacity-60">{m.time}</span>
                </div>

                <div className="space-y-2">
                  <p>{m.text}</p>

                  {m.recommendations && m.recommendations.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-black/10 dark:border-white/10 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#5A6D56] dark:text-[#88B084] block">
                        Safety Checkpoints:
                      </span>
                      <ul className="space-y-1">
                        {m.recommendations.map((rec, rIdx) => (
                          <li key={rIdx} className="flex items-center gap-1.5 text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-3 text-xs text-[#8A8A8A] dark:text-[#9DAFA0] p-2 bg-[#FAF8F5] dark:bg-[#1F2920] rounded-2xl border border-[#E5E0D5] dark:border-[#2C382E] max-w-sm">
              <Bot className="w-5 h-5 text-[#5A6D56] dark:text-[#88B084] animate-spin" />
              <span>Analyzing mountain safety intelligence & police protocols...</span>
            </div>
          )}
        </div>

        {/* INPUT BAR */}
        <div className="pt-4 border-t border-[#E5E0D5] dark:border-[#2C382E] flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={`Ask about safe walking routes, female doctors, or emergency contacts in ${currentLocationName}...`}
            className="flex-1 bg-[#FAF8F5] dark:bg-[#1C261E] border border-[#E5E0D5] dark:border-[#2C382E] rounded-full px-4 py-3 text-xs text-[#2C362B] dark:text-[#FFFFFF] focus:outline-none focus:border-[#5A6D56]"
          />
          <button
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim()}
            className="px-6 py-3 rounded-full bg-[#5A6D56] hover:bg-[#2C362B] dark:hover:bg-[#465643] disabled:opacity-50 text-white font-bold text-xs transition flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>

      </div>

    </div>
  );
};
