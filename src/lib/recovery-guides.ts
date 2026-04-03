export type RecoveryGuideStep = {
  id: string;
  when: string;
  instructions: string[];
  activityMilestones: string[];
};

export type RecoveryGuide = {
  id: string;
  title: string;
  subtitle: string;
  steps: RecoveryGuideStep[];
};

// Note: This MVP uses general education timelines. Discharge letter + clinic advice always take precedence.
export const recoveryGuides: RecoveryGuide[] = [
  {
    id: "breast-cancer-reconstruction",
    title: "Breast cancer & reconstruction",
    subtitle: "A safe, generic recovery timeline with activity milestones.",
    steps: [
      {
        id: "bc-r-0-2",
        when: "Day 0–2",
        instructions: [
          "Follow your dressing/drain instructions exactly; keep the area clean and dry as advised.",
          "Take pain relief as prescribed/approved by your team.",
          "Do gentle short walks around the house to support circulation.",
        ],
        activityMilestones: [
          "Pain is controlled enough to do short, relaxed walks.",
          "You can perform basic daily activities with support if needed.",
          "You are able to sleep/rest without needing to “chase” pain around the clock.",
        ],
      },
      {
        id: "bc-r-week-1",
        when: "Week 1",
        instructions: [
          "Check dressings and follow drain/wound care guidance (if you were given drains).",
          "Continue medication on schedule, and watch for signs your letter says are urgent.",
          "Increase movement gradually; avoid heavy lifting and sudden arm stretches.",
        ],
        activityMilestones: [
          "Walking distance increases slightly each day (without sharp worsening pain).",
          "Dressing/drain plan is understood and followed.",
          "You can comfortably perform light self-care tasks.",
        ],
      },
      {
        id: "bc-r-weeks-2-4",
        when: "Weeks 2–4",
        instructions: [
          "Keep movement gentle and paced; build activity in small steps.",
          "Attend scheduled follow-ups and bring questions for the clinic.",
          "Use skin/scar care guidance from your team when you’re instructed to start.",
        ],
        activityMilestones: [
          "You can spend longer periods out of bed/chair.",
          "You can do short, easier walks without needing to stop due to pain.",
          "No new severe/worsening pain compared with the previous week.",
        ],
      },
      {
        id: "bc-r-months-1-3",
        when: "Months 1–3",
        instructions: [
          "Gradually return toward normal activity as cleared by your team.",
          "Keep scar care and protective habits (sun protection if advised).",
          "Keep using the non-urgent message feature for questions about recovery (not emergencies).",
        ],
        activityMilestones: [
          "You’re increasing activity while staying within your comfort limits.",
          "Any planned exercise progresses only when approved/appropriate.",
          "You feel confident about what symptoms require urgent advice.",
        ],
      },
    ],
  },
  {
    id: "cosmetic-breast-surgery",
    title: "Cosmetic breast surgery",
    subtitle: "A safe general timeline (implant/adjustment dependent).",
    steps: [
      {
        id: "cos-0-2",
        when: "Day 0–2",
        instructions: [
          "Keep to prescribed medication and wound care instructions.",
          "Avoid sudden arm movements; support the chest wall as advised.",
          "Gentle walking only—short and frequent.",
        ],
        activityMilestones: [
          "You can do short walks without spikes in pain.",
          "You’re able to move safely with minimal assistance if needed.",
          "You can manage basic daily tasks (eating, hygiene) comfortably.",
        ],
      },
      {
        id: "cos-week-1",
        when: "Week 1",
        instructions: [
          "Follow any garment/compression guidance provided by your team.",
          "Keep dressing care consistent and monitor for urgent signs.",
          "Increase movement gradually; avoid heavy lifting.",
        ],
        activityMilestones: [
          "Slight increase in walking duration each day.",
          "Reduced need for “rescue” doses due to pain.",
          "You can maintain good posture and comfort while resting.",
        ],
      },
      {
        id: "cos-weeks-2-4",
        when: "Weeks 2–4",
        instructions: [
          "Continue to pace activity; avoid pushing through sharp pain.",
          "Use scar/skin care as instructed at your follow-up stage.",
          "Book/attend follow-up appointments and ask about concerns.",
        ],
        activityMilestones: [
          "Light household activity becomes easier.",
          "You can maintain activity for longer stretches without flare-ups.",
          "You feel confident with your aftercare plan and medication schedule.",
        ],
      },
      {
        id: "cos-months-1-3",
        when: "Months 1–3",
        instructions: [
          "Return gradually to normal activity; progression depends on your procedure and healing.",
          "Continue non-urgent questions via the app; emergencies go to the urgent lines in your paperwork.",
        ],
        activityMilestones: [
          "You’re steadily increasing normal routines.",
          "Scar care consistency improves (as approved).",
          "You understand what changes are “expected” vs urgent.",
        ],
      },
    ],
  },
  {
    id: "benign-breast-conditions",
    title: "Benign breast conditions",
    subtitle: "A general recovery timeline for biopsies/excision where applicable.",
    steps: [
      {
        id: "ben-0-2",
        when: "Day 0–2",
        instructions: [
          "Follow wound care and medication advice from your clinic letter.",
          "Short, gentle movement only; avoid heavy lifting.",
          "Keep an eye on your symptoms and contact the urgent lines if needed.",
        ],
        activityMilestones: [
          "Pain is manageable enough for short walks and normal light tasks.",
          "Wound/dressing care is being followed correctly.",
        ],
      },
      {
        id: "ben-week-1",
        when: "Week 1",
        instructions: [
          "Attend any scheduled review or dressing changes.",
          "Gradually increase movement as tolerated.",
          "Avoid overexertion; if something feels “wrong,” follow your discharge guidance.",
        ],
        activityMilestones: [
          "You can do daily activities with less assistance (if you needed any).",
          "Walking time increases in small increments.",
        ],
      },
      {
        id: "ben-weeks-2-4",
        when: "Weeks 2–4",
        instructions: [
          "Increase activity carefully; avoid sudden strenuous changes.",
          "Use any scar care advice when your team instructs you to begin.",
        ],
        activityMilestones: [
          "You can return toward usual routines without significant worsening pain.",
          "You have a clear plan for follow-up appointments and what to do if you’re concerned.",
        ],
      },
    ],
  },
];

