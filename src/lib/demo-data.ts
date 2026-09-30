/**
 * PRARAMBH — Sample / Demo Recruitment Data.
 * This is prototype data for a hackathon. It is NOT connected to any
 * real government recruitment database.
 */

export const DEMO_OTP = "123456";

export type LanguageCode =
  | "en"
  | "hi"
  | "gu"
  | "mr"
  | "bn"
  | "ta"
  | "te"
  | "kn"
  | "ml"
  | "or"
  | "pa";

export interface Language {
  code: LanguageCode;
  label: string;
  native: string;
}

export const ALL_LANGUAGES: Language[] = [
  { code: "en", label: "English", native: "English" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "gu", label: "Gujarati", native: "ગુજરાતી" },
  { code: "mr", label: "Marathi", native: "मराठी" },
  { code: "bn", label: "Bengali", native: "বাংলা" },
  { code: "ta", label: "Tamil", native: "தமிழ்" },
  { code: "te", label: "Telugu", native: "తెలుగు" },
  { code: "kn", label: "Kannada", native: "ಕನ್ನಡ" },
  { code: "ml", label: "Malayalam", native: "മലയാളം" },
  { code: "or", label: "Odia", native: "ଓଡ଼ିଆ" },
  { code: "pa", label: "Punjabi", native: "ਪੰਜਾਬੀ" },
];

export function languageLabel(code: LanguageCode): string {
  return ALL_LANGUAGES.find((l) => l.code === code)?.label ?? "English";
}

export interface Recruitment {
  id: string;
  post: string;
  department: string;
  organisation: string;
  location: string;
  state: string;
  type: string;
  qualification: string;
  experience: string;
  vacancies: number;
  closes: string;
  match: number;
  languages: LanguageCode[];
  description: string;
  eligibility: string[];
  documents: string[];
  dates: { label: string; value: string }[];
  interviewDuration: string;
}

export const RECRUITMENTS: Recruitment[] = [
  {
    id: "mp-aio-2026",
    post: "Assistant Innovation Officer",
    department: "Department of Electronics & Information Technology",
    organisation: "Madhya Pradesh Public Service Recruitment — Demo 2026",
    location: "Bhopal / Hybrid",
    state: "Madhya Pradesh",
    type: "Direct Recruitment",
    qualification: "B.E. / B.Tech / MCA or equivalent",
    experience: "0–3 years (relaxation as per rules)",
    vacancies: 42,
    closes: "30 Sep 2026",
    match: 92,
    languages: ["en", "hi", "mr"],
    description:
      "Support the design and rollout of citizen-facing digital services across departments. The role involves coordinating with technical teams, preparing service blueprints and monitoring delivery outcomes for public service programmes.",
    eligibility: [
      "Qualified in the written examination (Paper I & II)",
      "Age 21–35 years as on 1 Jan 2026, relaxation as per category rules",
      "Bachelor's degree in engineering or computer applications",
      "Working knowledge of at least one permitted interview language",
    ],
    documents: [
      "Photo identity proof",
      "Degree certificate / provisional certificate",
      "Category certificate (if applicable)",
      "Written examination admit card",
    ],
    dates: [
      { label: "Written examination result", value: "12 Sep 2026" },
      { label: "Document verification window", value: "15–24 Sep 2026" },
      { label: "AI pre-interview window", value: "26–30 Sep 2026" },
      { label: "Human interview shortlist", value: "08 Oct 2026" },
    ],
    interviewDuration: "approximately 12–15 minutes",
  },
  {
    id: "niti-pra-2026",
    post: "Policy Research Associate",
    department: "Policy & Programme Evaluation",
    organisation: "NITI Aayog — Demo Data",
    location: "New Delhi",
    state: "Delhi",
    type: "Contract (3 years)",
    qualification: "Master's in Economics / Public Policy / Statistics",
    experience: "2+ years in research or evaluation",
    vacancies: 12,
    closes: "18 Oct 2026",
    match: 86,
    languages: ["en", "hi"],
    description:
      "Conduct evidence reviews and evaluation studies for national programmes, prepare policy briefs and support inter-ministerial consultations.",
    eligibility: [
      "Qualified in the written examination",
      "Post-graduate degree in a relevant discipline",
      "Demonstrated research writing experience",
    ],
    documents: ["Photo identity proof", "Post-graduate degree certificate", "Experience certificate"],
    dates: [
      { label: "Written examination result", value: "20 Sep 2026" },
      { label: "AI pre-interview window", value: "05–14 Oct 2026" },
      { label: "Final interview", value: "28 Oct 2026" },
    ],
    interviewDuration: "approximately 15 minutes",
  },
  {
    id: "health-dhpl-2026",
    post: "District Health Program Lead",
    department: "Department of Health & Family Welfare — Demo Data",
    organisation: "State Health Mission — Demo 2026",
    location: "Indore / Field posting",
    state: "Madhya Pradesh",
    type: "Deputation / Direct",
    qualification: "MBBS / MPH / MHA",
    experience: "3+ years in public health programmes",
    vacancies: 8,
    closes: "05 Nov 2026",
    match: 78,
    languages: ["en", "hi", "mr", "gu"],
    description:
      "Lead district-level implementation of health programmes, coordinate field teams and report on programme indicators.",
    eligibility: [
      "Qualified in the written examination",
      "Relevant public health qualification",
      "Willingness for field posting",
    ],
    documents: ["Photo identity proof", "Degree certificate", "Registration certificate"],
    dates: [
      { label: "Written examination result", value: "02 Oct 2026" },
      { label: "AI pre-interview window", value: "20–29 Oct 2026" },
    ],
    interviewDuration: "approximately 15 minutes",
  },
];

export const CANDIDATE = {
  name: "Aarav Sharma",
  firstName: "Aarav",
  applicationId: "MP-REC-2026-001284",
  rollNumber: "MPPSC-PR-482913",
  blindId: "CAND-00482",
  email: "aarav.demo@example.com",
  mobile: "+91 98XXX XXX12",
  dob: "14 Mar 2001",
  category: "General",
  recruitmentId: "mp-aio-2026",
  writtenScore: "78.4%",
  writtenStatus: "Qualified",
  eligibilityStatus: "Verified",
  location: "Bhopal, Madhya Pradesh",
};

export interface StageInfo {
  key: string;
  title: string;
  status: "completed" | "current" | "pending";
  date: string;
  detail: string;
  action?: string;
}

export const BASE_STAGES: StageInfo[] = [
  {
    key: "applied",
    title: "Application Submitted",
    status: "completed",
    date: "02 Jul 2026",
    detail: "Application received and acknowledged.",
  },
  {
    key: "written",
    title: "Written Examination",
    status: "completed",
    date: "24 Aug 2026",
    detail: "Appeared at Bhopal centre.",
  },
  {
    key: "qualified",
    title: "Written Exam Qualified",
    status: "completed",
    date: "12 Sep 2026",
    detail: "Score 78.4% — above cut-off.",
  },
  {
    key: "docs",
    title: "Document Verification",
    status: "completed",
    date: "18 Sep 2026",
    detail: "4 of 4 documents verified.",
  },
  {
    key: "interview",
    title: "AI Pre-Interview",
    status: "current",
    date: "Not booked",
    detail: "Standardised AI pre-interview, video mode compulsory.",
    action: "Book slot",
  },
  {
    key: "assessment",
    title: "AI Assessment",
    status: "pending",
    date: "Pending",
    detail: "AI-assisted assessment — human review required.",
  },
  {
    key: "shortlist",
    title: "Human Interview Shortlist",
    status: "pending",
    date: "08 Oct 2026",
    detail: "Authorised reviewers finalise the shortlist.",
  },
  {
    key: "human",
    title: "Final Human Interview",
    status: "pending",
    date: "Pending",
    detail: "Conducted by the recruitment board.",
  },
  {
    key: "decision",
    title: "Final Decision",
    status: "pending",
    date: "Pending",
    detail: "Result published on the recruitment portal.",
  },
];

export const DOCUMENTS = [
  { name: "Photo identity proof", status: "Verified", date: "16 Sep 2026", method: "OCR + manual check" },
  { name: "Degree certificate", status: "Verified", date: "16 Sep 2026", method: "OCR extraction" },
  { name: "Written exam admit card", status: "Verified", date: "17 Sep 2026", method: "OCR extraction" },
  { name: "Category certificate", status: "Not required", date: "—", method: "General category" },
];

export const UPCOMING_EXAMS = [
  {
    name: "State Digital Governance Services Exam 2027",
    body: "State Public Service Commission — Demo Data",
    date: "14 Feb 2027",
    apply: "Opens 01 Nov 2026",
  },
  {
    name: "Combined Technical Services Examination",
    body: "Staff Selection Board — Demo Data",
    date: "22 Mar 2027",
    apply: "Opens 15 Dec 2026",
  },
  {
    name: "Public Policy Analyst Recruitment 2027",
    body: "National Institute of Governance — Demo Data",
    date: "09 Apr 2027",
    apply: "Opens 20 Jan 2027",
  },
];

export const LEARNING = [
  "Public Administration Basics",
  "Communication Skills",
  "Digital Governance Fundamentals",
  "Role-specific technical preparation",
  "Situational Judgement Practice",
];

export const INTERVIEW_DATES = [
  { id: "2026-09-28", label: "28 Sep", day: "Monday" },
  { id: "2026-09-29", label: "29 Sep", day: "Tuesday" },
  { id: "2026-09-30", label: "30 Sep", day: "Wednesday" },
];

export const INTERVIEW_TIMES = ["09:00 AM", "10:30 AM", "12:00 PM", "02:00 PM", "04:30 PM"];

export interface InterviewQuestion {
  index: number;
  category: string;
  text: Partial<Record<LanguageCode, string>> & { en: string };
}

/** Standardised question framework — identical categories for every candidate on a role. */
export const QUESTION_FRAMEWORK: InterviewQuestion[] = [
  {
    index: 1,
    category: "Introduction / Motivation",
    text: {
      en: "Please introduce yourself and tell us why you wish to serve in this public service role.",
      hi: "कृपया अपना परिचय दें और बताएं कि आप इस लोक सेवा पद पर क्यों कार्य करना चाहते हैं।",
    },
  },
  {
    index: 2,
    category: "Role Knowledge",
    text: {
      en: "What do you understand by citizen-centric digital service delivery in a government department?",
      hi: "सरकारी विभाग में नागरिक-केंद्रित डिजिटल सेवा वितरण से आप क्या समझते हैं?",
    },
  },
  {
    index: 3,
    category: "Teamwork",
    text: {
      en: "Tell us about a time when you worked with people who had different priorities.",
      hi: "हमें ऐसे समय के बारे में बताएं जब आपने भिन्न प्राथमिकताओं वाले लोगों के साथ कार्य किया।",
    },
  },
  {
    index: 4,
    category: "Problem Solving",
    text: {
      en: "A public service portal is receiving repeated complaints about failed submissions. How would you approach the problem?",
      hi: "एक लोक सेवा पोर्टल पर आवेदन विफल होने की बार-बार शिकायतें आ रही हैं। आप इस समस्या का समाधान कैसे करेंगे?",
    },
  },
  {
    index: 5,
    category: "Situational Judgement",
    text: {
      en: "A senior officer asks for a report by today, but the data is incomplete. What would you do?",
      hi: "एक वरिष्ठ अधिकारी आज ही रिपोर्ट मांगते हैं, परंतु आंकड़े अधूरे हैं। आप क्या करेंगे?",
    },
  },
  {
    index: 6,
    category: "Public Service Orientation",
    text: {
      en: "How would you ensure that a new service reaches citizens who have limited digital access?",
      hi: "आप कैसे सुनिश्चित करेंगे कि नई सेवा सीमित डिजिटल पहुंच वाले नागरिकों तक पहुंचे?",
    },
  },
  {
    index: 7,
    category: "Communication",
    text: {
      en: "Explain a technical process in simple language, as you would to a citizen at a service counter.",
      hi: "किसी तकनीकी प्रक्रिया को सरल भाषा में समझाइए, जैसे आप सेवा केंद्र पर किसी नागरिक को समझाते।",
    },
  },
  {
    index: 8,
    category: "Role-specific Scenario",
    text: {
      en: "Your department must launch an innovation pilot in 60 days with a limited budget. Outline your plan.",
      hi: "आपके विभाग को सीमित बजट में 60 दिनों में एक नवाचार पायलट शुरू करना है। अपनी योजना बताइए।",
    },
  },
];

export const ASSESSMENT_DIMENSIONS = [
  "Role Knowledge",
  "Problem Solving",
  "Communication",
  "Situational Judgement",
  "Public Service Orientation",
  "Structured Thinking",
  "Role-specific Competencies",
] as const;

export interface HrCandidate {
  blindId: string;
  name: string;
  recruitmentId: string;
  interview: "Completed" | "Scheduled" | "In progress" | "Not booked";
  overall: number | null;
  scores: Record<string, number>;
  integrity: "Clear" | "Review required";
  status: "Shortlisted" | "Under review" | "Not shortlisted" | "Awaiting interview";
  language: LanguageCode;
}

export const HR_CANDIDATES: HrCandidate[] = [
  {
    blindId: "CAND-00482",
    name: "Aarav Sharma",
    recruitmentId: "mp-aio-2026",
    interview: "Completed",
    overall: 83.2,
    scores: {
      "Role Knowledge": 88,
      "Problem Solving": 76,
      Communication: 82,
      "Situational Judgement": 79,
      "Public Service Orientation": 91,
      "Structured Thinking": 80,
      "Role-specific Competencies": 86,
    },
    integrity: "Clear",
    status: "Under review",
    language: "hi",
  },
  {
    blindId: "CAND-00517",
    name: "Meera Iyer",
    recruitmentId: "mp-aio-2026",
    interview: "Completed",
    overall: 88.6,
    scores: {
      "Role Knowledge": 91,
      "Problem Solving": 88,
      Communication: 90,
      "Situational Judgement": 85,
      "Public Service Orientation": 89,
      "Structured Thinking": 87,
      "Role-specific Competencies": 90,
    },
    integrity: "Clear",
    status: "Shortlisted",
    language: "en",
  },
  {
    blindId: "CAND-00601",
    name: "Rohit Verma",
    recruitmentId: "mp-aio-2026",
    interview: "Completed",
    overall: 64.1,
    scores: {
      "Role Knowledge": 62,
      "Problem Solving": 58,
      Communication: 70,
      "Situational Judgement": 64,
      "Public Service Orientation": 72,
      "Structured Thinking": 60,
      "Role-specific Competencies": 63,
    },
    integrity: "Review required",
    status: "Not shortlisted",
    language: "hi",
  },
  {
    blindId: "CAND-00712",
    name: "Sana Qureshi",
    recruitmentId: "niti-pra-2026",
    interview: "Scheduled",
    overall: null,
    scores: {},
    integrity: "Clear",
    status: "Awaiting interview",
    language: "en",
  },
  {
    blindId: "CAND-00833",
    name: "Devansh Patel",
    recruitmentId: "health-dhpl-2026",
    interview: "Not booked",
    overall: null,
    scores: {},
    integrity: "Clear",
    status: "Awaiting interview",
    language: "gu",
  },
  {
    blindId: "CAND-00905",
    name: "Priya Nair",
    recruitmentId: "mp-aio-2026",
    interview: "Completed",
    overall: 79.8,
    scores: {
      "Role Knowledge": 80,
      "Problem Solving": 77,
      Communication: 84,
      "Situational Judgement": 78,
      "Public Service Orientation": 82,
      "Structured Thinking": 76,
      "Role-specific Competencies": 79,
    },
    integrity: "Clear",
    status: "Under review",
    language: "ml",
  },
];

export const AUDIT_TRAIL = [
  { time: "26 Sep 2026 · 10:41:02", actor: "System", event: "Standardised question set v3 locked for MP-AIO-2026." },
  { time: "26 Sep 2026 · 10:42:15", actor: "Integrity Monitor", event: "CAND-00601 temporarily out of frame." },
  { time: "26 Sep 2026 · 10:44:03", actor: "Integrity Monitor", event: "CAND-00601 camera connection interrupted." },
  { time: "26 Sep 2026 · 10:47:21", actor: "Integrity Monitor", event: "CAND-00601 interview resumed." },
  { time: "26 Sep 2026 · 11:15:40", actor: "AI Assessment", event: "CAND-00482 assessment generated — human review required." },
  { time: "26 Sep 2026 · 12:02:11", actor: "Reviewer R-14", event: "CAND-00517 shortlisted for human interview." },
  { time: "26 Sep 2026 · 12:06:55", actor: "Reviewer R-14", event: "Blind review mode enabled for evaluation session." },
];

export const ANALYTICS = {
  totals: { applicants: 18420, qualified: 3840, interviewed: 2712, shortlisted: 486 },
  weekly: [320, 460, 610, 540, 720, 810, 660],
  departments: [
    { name: "Electronics & IT", drives: 4, candidates: 1240, fill: 78 },
    { name: "Health & Family Welfare", drives: 3, candidates: 860, fill: 62 },
    { name: "Policy & Evaluation", drives: 2, candidates: 410, fill: 54 },
    { name: "Revenue", drives: 2, candidates: 640, fill: 71 },
  ],
  predictions: [
    { label: "Projected shortlist completion", value: "08 Oct 2026", note: "Based on current interview throughput" },
    { label: "Predicted interview no-show rate", value: "6.4%", note: "Demo predictive model" },
    { label: "Estimated reviewer hours saved", value: "1,840 hrs", note: "Versus fully manual pre-interviews" },
  ],
};
