"use client";

import { useState, useEffect, useRef } from "react";
import {
  Mail,
  Cpu,
  Database,
  GitBranch,
  Send,
  ArrowRight,
  ChevronDown,
  Sparkles,
  Inbox,
  CheckCheck,
  AlertCircle,
  Flag,
  CheckCircle2,
  Package,
  FileText,
  Users,
  RefreshCw,
  SkipForward,
  Zap,
  User,
  Briefcase,
  Target,
  Upload,
  X,
  Plus,
  FileCheck2,
  BookOpen,
  ChevronRight,
  ArrowLeft,
  Pencil,
  Trash2,
  Paperclip,
} from "lucide-react";

/* ─────────────────────────────────────────────────────────────
   BUSINESS DATABASE (unchanged — represents the company's ERP/CRM)
   ───────────────────────────────────────────────────────────── */

const DB = {
  invoices: [
    { id: "248", vendor: "Acme Corp", amount: 3200, dueDate: "2026-03-15", status: "UNPAID", daysOverdue: 37, contact: "billing@acmecorp.com" },
    { id: "251", vendor: "Quantum Supplies", amount: 1800, dueDate: "2026-04-24", status: "UNPAID", daysOverdue: 0, contact: "ap@quantumsupplies.io" },
    { id: "247", vendor: "Stellar Logistics", amount: 5400, dueDate: "2026-03-30", status: "PAID", paidDate: "2026-03-28", contact: "ar@stellarlog.com" },
    { id: "262", vendor: "Northwind Freight", amount: 2150, dueDate: "2026-05-01", status: "UNPAID", daysOverdue: 0, contact: "ap@northwind.co" },
  ],
  orders: [
    { id: "A-5821", customer: "Sarah Chen", product: "Enterprise Plan Upgrade", status: "SHIPPED", shippedDate: "2026-04-14", tracking: "1Z999AA10123456784", eta: "2026-04-22" },
    { id: "A-5833", customer: "Mike Rodriguez", product: "Hardware Bundle (×4)", status: "PROCESSING", orderDate: "2026-04-19", eta: null },
    { id: "A-5840", customer: "Leila Okafor", product: "Annual License", status: "FULFILLED", shippedDate: "2026-04-10", tracking: "DIGITAL", eta: "2026-04-10" },
  ],
  applications: [
    { id: "APP-1102", candidate: "Priya Patel", role: "Marketing Manager", status: "UNDER REVIEW", submitted: "2026-04-10", stage: "Phone Screen scheduled 04/24" },
    { id: "APP-1098", candidate: "James Walsh", role: "Senior Engineer", status: "INTERVIEW", submitted: "2026-04-05", stage: "Technical Round 04/23" },
    { id: "APP-1115", candidate: "Dana Liu", role: "Marketing Manager", status: "SUBMITTED", submitted: "2026-04-18", stage: "Awaiting recruiter review" },
  ],
};

/* ─────────────────────────────────────────────────────────────
   SAMPLE INBOX
   ───────────────────────────────────────────────────────────── */

const INITIAL_EMAILS = [
  { id: "e1", from: "lisa.morgan@acmecorp.com", fromName: "Lisa Morgan", subject: "Invoice #248 — status?", preview: "Just checking on invoice #248 for $3,200…", body: "Hi,\n\nJust checking on invoice #248 for $3,200. It was due in March and we haven't received payment yet. Could someone look into this?\n\nThanks,\nLisa", received: "9:14 AM" },
  { id: "e2", from: "priya.patel@gmail.com", fromName: "Priya Patel", subject: "Following up on my application", preview: "I applied for the Marketing Manager role last week…", body: "Hello,\n\nI applied for the Marketing Manager role last week (application under Priya Patel). I wanted to check in on the status.\n\nBest,\nPriya", received: "9:42 AM" },
  { id: "e3", from: "sarah.chen@gmail.com", fromName: "Sarah Chen", subject: "Where is order A-5821?", preview: "I placed order A-5821 last week and haven't gotten…", body: "Hi team,\n\nI placed order A-5821 last week and haven't gotten a shipping update. Can you tell me when it will arrive?\n\nThanks,\nSarah", received: "10:03 AM" },
  { id: "e4", from: "ap@quantumsupplies.io", fromName: "Quantum Supplies AP", subject: "Invoice #251 — due this week", preview: "Reminder that invoice #251 for $1,800 is due Friday…", body: "Hello,\n\nJust a reminder that invoice #251 for $1,800 is due this Friday. Please confirm receipt and expected payment date.\n\nRegards,\nQuantum Supplies AP", received: "10:21 AM" },
  { id: "e5", from: "mike.rodriguez@gmail.com", fromName: "Mike Rodriguez", subject: "Order A-5833 update?", preview: "Wondering when order A-5833 will ship…", body: "Hi,\n\nJust wondering when my order A-5833 will ship? I placed it over the weekend.\n\nThanks,\nMike", received: "11:08 AM" },
  { id: "e6", from: "accounts@stellarlog.com", fromName: "Stellar Logistics", subject: "Invoice #247 confirmation", preview: "Can you confirm receipt of payment for invoice #247…", body: "Hi,\n\nCan you confirm receipt of payment for invoice #247 ($5,400)? We want to make sure our records match yours.\n\nBest,\nStellar AR", received: "11:34 AM" },
];

/* ─────────────────────────────────────────────────────────────
   FORM TEMPLATES
   ───────────────────────────────────────────────────────────── */

const FORM_TEMPLATES = [
  {
    id: "pto",
    title: "Time-Off Request",
    subtitle: "Submit vacation, sick, or personal leave",
    icon: Target,
    fields: [
      { id: "name", label: "Full name", type: "text", source: "name" },
      { id: "role", label: "Position", type: "text", source: "role" },
      { id: "department", label: "Department", type: "text", source: "department" },
      { id: "startDate", label: "Start date", type: "date" },
      { id: "endDate", label: "End date", type: "date" },
      { id: "leaveType", label: "Type", type: "select", options: ["Vacation", "Sick", "Personal", "Bereavement", "Other"] },
      { id: "reason", label: "Reason", type: "textarea", prompt: "Write a brief, professional reason for the time off." },
      { id: "coverage", label: "Coverage plan", type: "textarea", prompt: "Explain who will cover which of the user's current projects during the leave. Reference specific project names." },
    ],
  },
  {
    id: "expense",
    title: "Expense Report",
    subtitle: "Submit business expenses for reimbursement",
    icon: FileText,
    fields: [
      { id: "name", label: "Submitted by", type: "text", source: "name" },
      { id: "role", label: "Position", type: "text", source: "role" },
      { id: "project", label: "Related project", type: "text", prompt: "Pick the most relevant project from the user's current projects list." },
      { id: "amount", label: "Amount (USD)", type: "number" },
      { id: "date", label: "Expense date", type: "date" },
      { id: "category", label: "Category", type: "select", options: ["Travel", "Meals", "Office supplies", "Software", "Conference", "Other"] },
      { id: "description", label: "Business purpose", type: "textarea", prompt: "Clear business-purpose statement tying the expense to the user's project goals. 2-3 sentences." },
    ],
  },
  {
    id: "brief",
    title: "Project Brief",
    subtitle: "Kick off a new initiative with stakeholders",
    icon: Briefcase,
    fields: [
      { id: "lead", label: "Project lead", type: "text", source: "name" },
      { id: "role", label: "Role", type: "text", source: "role" },
      { id: "company", label: "Organization", type: "text", source: "company" },
      { id: "projectName", label: "Project name", type: "text", prompt: "A short, clear project name tied to the user's stated goals. 3-6 words." },
      { id: "objective", label: "Objective", type: "textarea", prompt: "One paragraph explaining the project's objective, directly tied to one of the user's stated goals." },
      { id: "scope", label: "Scope", type: "textarea", prompt: "2-3 sentences defining scope — what's in, what's out." },
      { id: "timeline", label: "Timeline", type: "text", prompt: "A realistic timeline like 'Q3 2026 · 12 weeks'." },
      { id: "stakeholders", label: "Key stakeholders", type: "textarea", prompt: "A short list of roles/teams likely involved. One per line." },
    ],
  },
];

/* ─────────────────────────────────────────────────────────────
   DEMO PROFILE (for one-click fill)
   ───────────────────────────────────────────────────────────── */

const DEMO_PROFILE = {
  name: "John Smith",
  role: "Operations Analyst",
  company: "Meridian Industries",
  department: "Finance & Operations",
  email: "john.smith@meridian.co",
  goals:
    "Reduce vendor payment cycle time by 30% this year. Build a standardized reporting dashboard for the Ops team. Establish monthly business reviews with Finance leadership.",
  projects: [
    "Q2 Vendor consolidation initiative",
    "Monthly Ops dashboard rollout",
    "AP automation pilot with Finance",
  ],
};

/* ─────────────────────────────────────────────────────────────
   CLASSIFIER, DB LOOKUP, DECISION ENGINE, SUMMARY
   ───────────────────────────────────────────────────────────── */

function classify(text) {
  const t = text.toLowerCase();
  const invoiceMatch = t.match(/(?:invoice|inv)[\s#]*([0-9]{2,6})/);
  const orderMatch = t.match(/(?:order|#)\s*([a-z]-?\d{3,6})/i);
  const invoiceId = invoiceMatch ? invoiceMatch[1] : null;
  const orderId = orderMatch ? orderMatch[1].toUpperCase().replace(/^#/, "") : null;
  let department = "General";
  let intent = "Inquiry";
  if (/invoice|payment|overdue|bill|paid|due|receipt|accounts payable|ap\b/.test(t)) {
    department = "Finance";
    if (/overdue|not received|haven'?t received|past due|late/.test(t)) intent = "Overdue payment";
    else if (/confirm receipt|confirm payment|records match|confirmation/.test(t)) intent = "Payment confirmation";
    else if (/due this|due friday|reminder/.test(t)) intent = "Payment reminder";
    else intent = "Invoice inquiry";
  } else if (/application|resume|interview|role|position|candidate|hiring|job/.test(t)) {
    department = "HR";
    intent = "Application follow-up";
  } else if (/order|shipping|delivery|tracking|arrive|ship|package|when will/.test(t)) {
    department = "Customer Service";
    intent = "Order status";
  } else if (/contract|vendor|supplier|purchase order|\bpo\b/.test(t)) {
    department = "Procurement";
    intent = "Vendor inquiry";
  }
  const nameMatch = text.match(/(?:Thanks|Best|Regards|Sincerely|Cheers)[,\s]+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/);
  const senderName = nameMatch ? nameMatch[1] : null;
  return { department, intent, invoiceId, orderId, senderName };
}

function queryDB({ department, invoiceId, orderId, senderName }) {
  const hits = [];
  if (department === "Finance" && invoiceId) {
    const inv = DB.invoices.find((i) => i.id === invoiceId);
    if (inv) hits.push({ type: "invoice", record: inv });
  }
  if (department === "Customer Service" && orderId) {
    const ord = DB.orders.find((o) => o.id === orderId);
    if (ord) hits.push({ type: "order", record: ord });
  }
  if (department === "HR" && senderName) {
    const app = DB.applications.find((a) => a.candidate.toLowerCase().includes(senderName.toLowerCase()));
    if (app) hits.push({ type: "application", record: app });
  }
  return hits;
}

function decide(classification, hits) {
  if (hits.length === 0) return { action: "REQUEST MORE INFO", severity: "neutral", reasoning: "No matching record found. Need clarifying detail.", routeTo: `${classification.department} team` };
  const hit = hits[0];
  if (hit.type === "invoice") {
    const inv = hit.record;
    if (inv.status === "PAID") return { action: "CONFIRM PAID", severity: "success", reasoning: `Invoice #${inv.id} paid on ${inv.paidDate}.`, routeTo: "Finance · AR" };
    if (inv.daysOverdue > 14) return { action: "ESCALATE", severity: "danger", reasoning: `Invoice #${inv.id} is ${inv.daysOverdue} days overdue ($${inv.amount.toLocaleString()}).`, routeTo: "Finance · Lead" };
    if (inv.daysOverdue > 0) return { action: "FLAG — MINOR DELAY", severity: "warning", reasoning: `Invoice #${inv.id} is ${inv.daysOverdue} days past due.`, routeTo: "Finance · AP" };
    return { action: "CONFIRM RECEIPT", severity: "neutral", reasoning: `Invoice #${inv.id} due ${inv.dueDate}, normal processing window.`, routeTo: "Finance · AP" };
  }
  if (hit.type === "order") {
    const o = hit.record;
    if (o.status === "SHIPPED" || o.status === "FULFILLED") return { action: "SEND STATUS UPDATE", severity: "success", reasoning: `Order ${o.id} shipped ${o.shippedDate}. ETA ${o.eta}.`, routeTo: "Customer Service" };
    return { action: "FLAG — DELAYED FULFILLMENT", severity: "warning", reasoning: `Order ${o.id} still ${o.status}. Proactive outreach needed.`, routeTo: "Customer Service + Ops" };
  }
  if (hit.type === "application") {
    const a = hit.record;
    return { action: "SEND STATUS UPDATE", severity: "neutral", reasoning: `Application ${a.id} is ${a.status}. Stage: ${a.stage}.`, routeTo: "HR · Recruiting" };
  }
  return { action: "ROUTE MANUALLY", severity: "neutral", reasoning: "Classified but no rule matched.", routeTo: classification.department };
}

function summarize(email, classification, hits) {
  const sender = classification.senderName || email.fromName || "Sender";
  if (hits.length === 0) return `${sender} has a ${classification.department.toLowerCase()} question with no matching internal record yet.`;
  const h = hits[0];
  if (h.type === "invoice") {
    const inv = h.record;
    if (inv.status === "PAID") return `${sender} is asking about invoice #${inv.id} — paid ${inv.paidDate}.`;
    if (inv.daysOverdue > 14) return `${sender} is flagging invoice #${inv.id} ($${inv.amount.toLocaleString()}) — ${inv.daysOverdue} days overdue.`;
    if (inv.daysOverdue > 0) return `${sender} is following up on invoice #${inv.id} — ${inv.daysOverdue} days past due.`;
    return `${sender} is asking about invoice #${inv.id} ($${inv.amount.toLocaleString()}), due ${inv.dueDate}.`;
  }
  if (h.type === "order") {
    const o = h.record;
    return `${sender} is asking about order ${o.id} (${o.product}) — currently ${o.status}.`;
  }
  if (h.type === "application") {
    const a = h.record;
    return `${sender} is following up on their ${a.role} application — currently ${a.status}.`;
  }
  return `${sender} sent a ${classification.department.toLowerCase()} inquiry.`;
}

/* ─────────────────────────────────────────────────────────────
   FALLBACK REPLY (uses profile for signoff)
   ───────────────────────────────────────────────────────────── */

function fallbackReply(emailObj, classification, hits, profile) {
  const name = classification.senderName || emailObj.fromName?.split(" ")[0] || "there";
  const signoff = profile?.name ? `Best,\n${profile.name}\n${profile.role || ""}${profile.company ? `, ${profile.company}` : ""}` : `Best regards,\n${classification.department} Team`;
  if (hits.length === 0) return `Hi ${name},\n\nThanks for reaching out. Could you share a reference number (invoice, order, or application ID) so I can pull the right record? I'll get back to you as soon as I have it in hand.\n\n${signoff}`;
  const h = hits[0];
  if (h.type === "invoice") {
    const inv = h.record;
    if (inv.status === "PAID") return `Hi ${name},\n\nThanks for the note. Our records show invoice #${inv.id} for $${inv.amount.toLocaleString()} was paid on ${inv.paidDate}. Let me know if anything looks off on your end.\n\n${signoff}`;
    if (inv.daysOverdue > 14) return `Hi ${name},\n\nThank you for flagging invoice #${inv.id}. I've confirmed it is ${inv.daysOverdue} days past due and have escalated it for immediate processing. You'll hear back within 24 hours with a payment date.\n\n${signoff}`;
    return `Hi ${name},\n\nThanks for the reminder on invoice #${inv.id} ($${inv.amount.toLocaleString()}, due ${inv.dueDate}). I've confirmed receipt and it's in our standard processing queue. Confirmation will follow once payment is released.\n\n${signoff}`;
  }
  if (h.type === "order") {
    const o = h.record;
    if (o.status === "SHIPPED" || o.status === "FULFILLED") return `Hi ${name},\n\nThanks for checking in on order ${o.id}. It shipped on ${o.shippedDate} (tracking: ${o.tracking}) and is expected to arrive by ${o.eta}.\n\n${signoff}`;
    return `Hi ${name},\n\nThanks for checking in on order ${o.id}. It's currently in ${o.status.toLowerCase()} status — I've flagged this with ops and you'll have a shipping update within 24 hours.\n\n${signoff}`;
  }
  if (h.type === "application") {
    const a = h.record;
    return `Hi ${name},\n\nThanks for following up. Your application for the ${a.role} role is currently ${a.status} — ${a.stage}. Recruiting will be in touch with next steps shortly.\n\n${signoff}`;
  }
  return `Hi ${name},\n\nThanks for your message — I've received it and will follow up shortly.\n\n${signoff}`;
}

/* ─────────────────────────────────────────────────────────────
   AI REPLY GENERATION (now grounded in profile + uploads)
   ───────────────────────────────────────────────────────────── */

async function generateReplyAI(emailObj, classification, hits, decision, profile, uploads) {
  const profileContext = profile ? `
USER PROFILE (the reply is written on behalf of this person):
- Name: ${profile.name}
- Role: ${profile.role}
- Company: ${profile.company}
- Department: ${profile.department || "—"}
- Current goals: ${profile.goals || "—"}
- Current projects: ${(profile.projects || []).join("; ")}
` : "";

  const uploadsContext = (uploads && uploads.length) ? `
ADDITIONAL KNOWLEDGE (user has uploaded these for context):
${uploads.map((u) => `— [${u.name}]: ${u.content.slice(0, 500)}`).join("\n")}
` : "";

  const prompt = `You are OmniFlow AI, a personal assistant. Write an email reply on behalf of the user.

${profileContext}
${uploadsContext}
INCOMING EMAIL:
From: ${emailObj.fromName} <${emailObj.from}>
Subject: ${emailObj.subject}
"""
${emailObj.body}
"""

DETECTED CONTEXT:
- Department: ${classification.department}
- Intent: ${classification.intent}
- Sender: ${classification.senderName || emailObj.fromName}

DATA FROM INTERNAL SYSTEMS:
${JSON.stringify(hits, null, 2)}

DECISION: ${decision.action}
REASONING: ${decision.reasoning}

Write a reply that:
- Addresses the sender by first name
- References the specific record with concrete facts (invoice #, order ID, etc.)
- Reflects the decision naturally
- Is written in first person from the user's perspective ("I've confirmed…", "I've escalated…")
- Uses any relevant context from the user's uploaded knowledge if helpful
- Is 3-5 sentences, professional, warm but direct
- Ends with this exact signoff (no variations):
Best,
${profile?.name || "—"}
${profile?.role || ""}${profile?.company ? `, ${profile.company}` : ""}

NO markdown, NO subject line, NO placeholders. Output only the email body text.`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, messages: [{ role: "user", content: prompt }] }),
    });
    const data = await response.json();
    const text = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("\n").trim();
    return text || fallbackReply(emailObj, classification, hits, profile);
  } catch (e) {
    return fallbackReply(emailObj, classification, hits, profile);
  }
}

/* ─────────────────────────────────────────────────────────────
   AI FORM FILLING
   ───────────────────────────────────────────────────────────── */

async function fillFormAI(template, userContext, profile, uploads) {
  const fieldsToFill = template.fields.filter((f) => !f.source && f.prompt);
  if (fieldsToFill.length === 0) return {};

  const schema = fieldsToFill.reduce((acc, f) => {
    acc[f.id] = f.type === "textarea" ? "string (multi-line)" : f.type === "select" ? `one of: ${(f.options || []).join(" | ")}` : "string";
    return acc;
  }, {});

  const uploadsContext = (uploads && uploads.length) ? `\nKNOWLEDGE BASE:\n${uploads.map((u) => `[${u.name}]: ${u.content.slice(0, 500)}`).join("\n")}\n` : "";

  const prompt = `You are OmniFlow AI. Fill out the following ${template.title} on behalf of the user. Use the user's profile, any provided context, and their uploaded knowledge.

USER PROFILE:
- Name: ${profile.name}
- Role: ${profile.role}
- Company: ${profile.company}
- Department: ${profile.department || "—"}
- Goals: ${profile.goals}
- Current projects: ${profile.projects.join("; ")}

USER-PROVIDED CONTEXT FOR THIS FORM:
"""
${userContext || "(none — use profile and knowledge only)"}
"""
${uploadsContext}
FIELDS TO FILL (with per-field guidance):
${fieldsToFill.map((f) => `- "${f.id}" (${f.label}): ${f.prompt}`).join("\n")}

Return ONLY a JSON object matching this schema (no markdown, no backticks, no commentary):
${JSON.stringify(schema, null, 2)}`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1500, messages: [{ role: "user", content: prompt }] }),
    });
    const data = await response.json();
    const text = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("\n").trim();
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);
    return parsed;
  } catch (e) {
    // Fallback: simple template-based fill
    const out = {};
    for (const f of fieldsToFill) {
      if (f.id === "project" || f.id === "projectName") out[f.id] = profile.projects[0] || "";
      else if (f.type === "textarea") out[f.id] = `[Draft based on your profile and projects. Please review and edit.]\n\nContext: ${userContext || profile.goals}`;
      else if (f.type === "select") out[f.id] = (f.options || [""])[0];
      else out[f.id] = "";
    }
    return out;
  }
}

/* ─────────────────────────────────────────────────────────────
   UTILITIES
   ───────────────────────────────────────────────────────────── */

const delay = (ms) => new Promise((r) => setTimeout(r, ms));
const uid = () => Math.random().toString(36).slice(2, 9);

const severityStyle = {
  danger:  { label: "text-red-300",     bg: "bg-red-500/10",     border: "border-red-500/30",     dot: "bg-red-400" },
  warning: { label: "text-amber-300",   bg: "bg-amber-500/10",   border: "border-amber-500/30",   dot: "bg-amber-400" },
  success: { label: "text-emerald-300", bg: "bg-emerald-500/10", border: "border-emerald-500/30", dot: "bg-emerald-400" },
  neutral: { label: "text-stone-300",   bg: "bg-stone-500/10",   border: "border-stone-500/30",   dot: "bg-stone-400" },
};

const statusStyle = {
  pending:     { label: "Needs reply", dot: "bg-stone-500",                text: "text-stone-400" },
  analyzing:   { label: "Analyzing…",  dot: "bg-amber-400 animate-pulse",  text: "text-amber-300" },
  draft_ready: { label: "Draft ready", dot: "bg-amber-400",                text: "text-amber-300" },
  sent:        { label: "Sent",        dot: "bg-emerald-400",              text: "text-emerald-300" },
  skipped:     { label: "Skipped",     dot: "bg-stone-700",                text: "text-stone-500" },
};

/* ═════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═════════════════════════════════════════════════════════════ */

export default function Page() {
  // onboarding + profile
  const [onboarded, setOnboarded] = useState(false);
  const [profile, setProfile] = useState({
    name: "", role: "", company: "", department: "", email: "",
    goals: "", projects: [],
  });

  // knowledge base
  const [uploads, setUploads] = useState([]);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  // app tabs
  const [activeTab, setActiveTab] = useState("inbox");

  // inbox
  const [emails, setEmails] = useState(() => INITIAL_EMAILS.map((e) => ({ ...e, status: "pending" })));
  const [selectedId, setSelectedId] = useState(INITIAL_EMAILS[0].id);
  const [analyses, setAnalyses] = useState({});
  const [drafts, setDrafts] = useState({});
  const [scanning, setScanning] = useState(false);
  const [sendingId, setSendingId] = useState(null);
  const [regeneratingId, setRegeneratingId] = useState(null);

  // forms
  const [selectedFormId, setSelectedFormId] = useState(FORM_TEMPLATES[0].id);
  const [formValues, setFormValues] = useState({});
  const [formContext, setFormContext] = useState("");
  const [filling, setFilling] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const demoRef = useRef(null);

  /* load fonts */
  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;0,9..144,900;1,9..144,400&family=IBM+Plex+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => { if (document.head.contains(link)) document.head.removeChild(link); };
  }, []);

  const fontSerif = { fontFamily: "'Fraunces', Georgia, serif" };
  const fontSans = { fontFamily: "'IBM Plex Sans', system-ui, sans-serif" };
  const fontMono = { fontFamily: "'JetBrains Mono', ui-monospace, monospace" };

  const scrollToDemo = () => demoRef.current?.scrollIntoView({ behavior: "smooth" });

  /* onboarding */
  const finishOnboarding = (finalProfile, initialUploads = []) => {
    setProfile(finalProfile);
    setUploads(initialUploads);
    setOnboarded(true);
    // pre-fill sourced form fields
    const template = FORM_TEMPLATES.find((t) => t.id === selectedFormId);
    if (template) setFormValues(prefillFormFromProfile(template, finalProfile));
  };

  /* inbox logic */
  const selectedEmail = emails.find((e) => e.id === selectedId);
  const analysis = analyses[selectedId];
  const draft = drafts[selectedId] ?? "";
  const pendingCount = emails.filter((e) => e.status === "pending").length;
  const draftReadyCount = emails.filter((e) => e.status === "draft_ready").length;
  const sentCount = emails.filter((e) => e.status === "sent").length;

  async function processEmail(email) {
    const c = classify(email.body);
    const h = queryDB(c);
    const d = decide(c, h);
    const s = summarize(email, c, h);
    const a = { classification: c, hits: h, decision: d, summary: s };
    setAnalyses((prev) => ({ ...prev, [email.id]: a }));
    const reply = await generateReplyAI(email, c, h, d, profile, uploads);
    setDrafts((prev) => ({ ...prev, [email.id]: reply }));
    return a;
  }

  async function scanInbox() {
    if (scanning) return;
    const pending = emails.filter((e) => e.status === "pending");
    if (pending.length === 0) return;
    setScanning(true);
    for (let i = 0; i < pending.length; i++) {
      setTimeout(() => {
        setEmails((prev) => prev.map((e) => (e.id === pending[i].id ? { ...e, status: "analyzing" } : e)));
      }, i * 120);
    }
    await delay(pending.length * 120 + 300);
    for (const email of pending) {
      await processEmail(email);
      setEmails((prev) => prev.map((e) => (e.id === email.id ? { ...e, status: "draft_ready" } : e)));
    }
    setScanning(false);
  }

  async function regenerate(emailId) {
    const email = emails.find((e) => e.id === emailId);
    if (!email) return;
    setRegeneratingId(emailId);
    setEmails((prev) => prev.map((e) => (e.id === emailId ? { ...e, status: "analyzing" } : e)));
    await processEmail(email);
    setEmails((prev) => prev.map((e) => (e.id === emailId ? { ...e, status: "draft_ready" } : e)));
    setRegeneratingId(null);
  }

  async function sendDraft(emailId) {
    setSendingId(emailId);
    await delay(900);
    setEmails((prev) => prev.map((e) => (e.id === emailId ? { ...e, status: "sent" } : e)));
    setSendingId(null);
  }

  function skip(emailId) { setEmails((prev) => prev.map((e) => (e.id === emailId ? { ...e, status: "skipped" } : e))); }
  function updateDraft(text) { setDrafts((prev) => ({ ...prev, [selectedId]: text })); }

  function resetInbox() {
    setEmails(INITIAL_EMAILS.map((e) => ({ ...e, status: "pending" })));
    setAnalyses({}); setDrafts({}); setSelectedId(INITIAL_EMAILS[0].id);
  }

  /* forms logic */
  const selectedForm = FORM_TEMPLATES.find((t) => t.id === selectedFormId);

  function prefillFormFromProfile(template, prof) {
    const out = {};
    for (const f of template.fields) {
      if (f.source && prof[f.source]) out[f.id] = prof[f.source];
      else out[f.id] = "";
    }
    return out;
  }

  function selectForm(id) {
    setSelectedFormId(id);
    setFormSubmitted(false);
    setFormContext("");
    const template = FORM_TEMPLATES.find((t) => t.id === id);
    setFormValues(prefillFormFromProfile(template, profile));
  }

  async function autofillForm() {
    if (filling || !selectedForm) return;
    setFilling(true);
    const aiFields = await fillFormAI(selectedForm, formContext, profile, uploads);
    setFormValues((prev) => ({ ...prefillFormFromProfile(selectedForm, profile), ...prev, ...aiFields }));
    setFilling(false);
  }

  function updateFormField(fieldId, value) {
    setFormValues((prev) => ({ ...prev, [fieldId]: value }));
  }

  async function submitForm() {
    setFormSubmitted(true);
  }

  /* knowledge base */
  function addUpload(name, content) {
    setUploads((prev) => [...prev, { id: uid(), name, content, added: new Date().toLocaleDateString() }]);
  }
  function removeUpload(id) { setUploads((prev) => prev.filter((u) => u.id !== id)); }

  /* ────────────  RENDER  ──────────── */

  return (
    <div
      className="min-h-screen w-full text-stone-100"
      style={{
        ...fontSans,
        background: "radial-gradient(1200px 600px at 80% -10%, rgba(233,165,59,0.08), transparent 60%), radial-gradient(900px 500px at -10% 40%, rgba(233,165,59,0.05), transparent 60%), #0A0A0B",
      }}
    >
      {/* grain overlay */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.04] mix-blend-overlay z-0"
        style={{ backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")" }}
      />

      {/* ════════════  NAV  ════════════ */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-6 border-b border-stone-800/60">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-sm flex items-center justify-center" style={{ background: "#E9A53B" }}>
            <span className="text-stone-950 font-bold text-sm" style={fontSerif}>O</span>
          </div>
          <span className="tracking-wider text-sm uppercase" style={fontMono}>OmniFlow AI</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-stone-400" style={fontMono}>
          <a href="#demo" onClick={(e) => { e.preventDefault(); scrollToDemo(); }} className="hover:text-stone-100 transition">Demo</a>
          <a href="#how" className="hover:text-stone-100 transition">How it works</a>
          <a href="#why" className="hover:text-stone-100 transition">Why</a>
        </div>
        {onboarded ? (
          <button onClick={() => setProfileModalOpen(true)} className="hidden md:inline-flex items-center gap-2 bg-stone-900 border border-stone-700 text-stone-200 px-3 py-2 rounded-sm text-sm hover:border-amber-400/50 transition" style={fontMono}>
            <div className="w-5 h-5 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center text-xs font-bold" style={fontSerif}>
              {profile.name.trim().split(" ").map((p) => p[0]).slice(0, 2).join("")}
            </div>
            {profile.name}
          </button>
        ) : (
          <button onClick={scrollToDemo} className="hidden md:inline-flex items-center gap-2 bg-stone-100 text-stone-950 px-4 py-2 rounded-sm text-sm font-medium hover:bg-amber-200 transition" style={fontMono}>
            Get started <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </nav>

      {/* ════════════  HERO  ════════════ */}
      <section className="relative z-10 px-6 md:px-12 pt-20 md:pt-32 pb-24 md:pb-40 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 text-xs text-amber-300/80 mb-8 uppercase tracking-[0.2em]" style={fontMono}>
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          Your personal AI, trained on your work
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] leading-[0.95] tracking-tight mb-8 max-w-5xl" style={fontSerif}>
          Where email, data, and decisions{" "}
          <span className="italic" style={{ color: "#E9A53B" }}>flow</span>{" "}
          through one brain.
        </h1>

        <p className="text-lg md:text-xl text-stone-400 max-w-2xl leading-relaxed mb-12" style={fontSans}>
          Install OmniFlow. Tell it who you are, what you're working on, and what matters. Upload the
          documents you want it to remember. From there, it drafts every email, fills every form, and
          handles every document — in your voice, on your terms. You review and send.
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <button onClick={scrollToDemo} className="group inline-flex items-center gap-3 bg-amber-400 text-stone-950 px-6 py-3.5 rounded-sm font-medium hover:bg-amber-300 transition" style={fontMono}>
            {onboarded ? "Open your workspace" : "Install & set up"}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
          </button>
          <a href="#how" className="inline-flex items-center gap-2 text-stone-300 px-4 py-3.5 border border-stone-700 hover:border-stone-500 rounded-sm transition" style={fontMono}>
            See the pipeline
          </a>
        </div>

        {/* capability strip */}
        <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl">
          {[
            { icon: User, label: "Learns you" },
            { icon: BookOpen, label: "Reads your files" },
            { icon: Mail, label: "Drafts email" },
            { icon: FileCheck2, label: "Fills forms" },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-3 p-4 border border-stone-800 rounded-sm bg-stone-950/40">
              <s.icon className="w-4 h-4 text-amber-300/80" />
              <span className="text-sm text-stone-300 uppercase tracking-wider" style={fontMono}>{s.label}</span>
            </div>
          ))}
        </div>

        <div className="mt-24 animate-bounce text-stone-600"><ChevronDown className="w-5 h-5" /></div>
      </section>

      {/* ════════════  DEMO SECTION  ════════════ */}
      <section ref={demoRef} id="demo" className="relative z-10 border-t border-stone-800/60 bg-stone-950/40">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28">

          {!onboarded ? (
            <OnboardingWizard onFinish={finishOnboarding} demoProfile={DEMO_PROFILE} fontSerif={fontSerif} fontSans={fontSans} fontMono={fontMono} />
          ) : (
            <AppWorkspace
              // profile / knowledge
              profile={profile}
              uploads={uploads}
              onOpenUploadModal={() => setUploadModalOpen(true)}
              onRemoveUpload={removeUpload}
              onOpenProfile={() => setProfileModalOpen(true)}
              // tabs
              activeTab={activeTab}
              onTabChange={setActiveTab}
              // inbox
              emails={emails}
              selectedEmail={selectedEmail}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
              analysis={analysis}
              draft={draft}
              scanning={scanning}
              pendingCount={pendingCount}
              draftReadyCount={draftReadyCount}
              sentCount={sentCount}
              sendingId={sendingId}
              regeneratingId={regeneratingId}
              onScanInbox={scanInbox}
              onResetInbox={resetInbox}
              onSendDraft={sendDraft}
              onSkip={skip}
              onRegenerate={regenerate}
              onProcessEmail={async () => {
                if (!selectedEmail) return;
                setEmails((prev) => prev.map((e) => (e.id === selectedEmail.id ? { ...e, status: "analyzing" } : e)));
                await processEmail(selectedEmail);
                setEmails((prev) => prev.map((e) => (e.id === selectedEmail.id ? { ...e, status: "draft_ready" } : e)));
              }}
              onDraftChange={updateDraft}
              // forms
              forms={FORM_TEMPLATES}
              selectedForm={selectedForm}
              selectedFormId={selectedFormId}
              onSelectForm={selectForm}
              formValues={formValues}
              onUpdateFormField={updateFormField}
              formContext={formContext}
              onFormContextChange={setFormContext}
              onAutofill={autofillForm}
              filling={filling}
              formSubmitted={formSubmitted}
              onSubmitForm={submitForm}
              // styling
              fontSerif={fontSerif}
              fontSans={fontSans}
              fontMono={fontMono}
            />
          )}

        </div>
      </section>

      {/* ════════════  HOW IT WORKS  ════════════ */}
      <section id="how" className="relative z-10 border-t border-stone-800/60">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28">
          <div className="max-w-3xl mb-16">
            <div className="text-xs uppercase tracking-[0.2em] text-amber-300/80 mb-3" style={fontMono}>Under the hood</div>
            <h2 className="text-4xl md:text-6xl tracking-tight mb-6" style={fontSerif}>Every output runs through the same brain.</h2>
            <p className="text-stone-400 text-lg" style={fontSans}>
              Whether it's drafting a reply or filling a form, OmniFlow grounds every word in three things:
              your profile, your uploaded knowledge, and — when relevant — your business systems.
              Transparent, auditable, and always yours to review before sending.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { n: "01", t: "Understand", d: "Classifies what the document or email is really asking for.", i: Cpu },
              { n: "02", t: "Pull context", d: "Combines your profile, uploaded knowledge, and business data.", i: Database },
              { n: "03", t: "Decide", d: "Rule-based action: escalate, confirm, request info, or draft.", i: GitBranch },
              { n: "04", t: "Generate", d: "Writes replies or fills forms in your voice, with your facts.", i: Sparkles },
              { n: "05", t: "You approve", d: "Every output lands in your review queue. Nothing ships without you.", i: Send },
            ].map((step) => (
              <div key={step.n} className="border border-stone-800 bg-stone-950/40 rounded-sm p-6 hover:border-amber-500/40 transition group">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs text-stone-500" style={fontMono}>{step.n}</span>
                  <step.i className="w-4 h-4 text-amber-300/80 group-hover:text-amber-300 transition" />
                </div>
                <h3 className="text-xl mb-2" style={fontSerif}>{step.t}</h3>
                <p className="text-sm text-stone-400 leading-relaxed" style={fontSans}>{step.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════  WHY  ════════════ */}
      <section id="why" className="relative z-10 border-t border-stone-800/60 bg-stone-950/40">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28">
          <div className="max-w-3xl mb-16">
            <div className="text-xs uppercase tracking-[0.2em] text-amber-300/80 mb-3" style={fontMono}>Differentiation</div>
            <h2 className="text-4xl md:text-6xl tracking-tight" style={fontSerif}>Not another AI chat wrapper.</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-px bg-stone-800">
            <Cell title="Most AI tools don't know you." body="Generic drafts with no grounding. They sound right. They don't know your goals, your projects, or your team." fontSerif={fontSerif} fontSans={fontSans} />
            <Cell title="Most tools don't close the loop." body="Assistants can write. They can't also fill forms, scan an inbox, pull records, and stage the output for your review." fontSerif={fontSerif} fontSans={fontSans} />
            <Cell title="OmniFlow does all of it." body="Profile + uploads + business data → email drafts, filled forms, grounded replies. One brain. One loop. You stay in control." fontSerif={fontSerif} fontSans={fontSans} highlight />
          </div>

          <div className="mt-16 flex flex-wrap items-center justify-between gap-6 p-8 border border-stone-800 bg-gradient-to-br from-stone-950 to-stone-900/40 rounded-sm">
            <div>
              <h3 className="text-2xl md:text-3xl mb-2" style={fontSerif}>{onboarded ? "Jump back into your workspace." : "Set it up and clear your inbox."}</h3>
              <p className="text-stone-400" style={fontSans}>{onboarded ? "Your profile and knowledge are loaded." : "Three-step onboarding. Takes under a minute."}</p>
            </div>
            <button onClick={scrollToDemo} className="inline-flex items-center gap-2 bg-amber-400 text-stone-950 px-6 py-3 rounded-sm font-medium hover:bg-amber-300 transition" style={fontMono}>
              {onboarded ? "Back to workspace" : "Start onboarding"} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ════════════  FOOTER  ════════════ */}
      <footer className="relative z-10 border-t border-stone-800/60">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 rounded-sm flex items-center justify-center" style={{ background: "#E9A53B" }}>
              <span className="text-stone-950 font-bold text-xs" style={fontSerif}>O</span>
            </div>
            <span className="text-xs text-stone-500 uppercase tracking-wider" style={fontMono}>OmniFlow AI · prototype</span>
          </div>
          <div className="text-xs text-stone-600" style={fontMono}>v0.3 · personal profile · uploads · email drafts · form filling</div>
        </div>
      </footer>

      {/* ════════════  MODALS  ════════════ */}
      {uploadModalOpen && (
        <UploadModal onClose={() => setUploadModalOpen(false)} onSave={addUpload} fontSerif={fontSerif} fontSans={fontSans} fontMono={fontMono} />
      )}
      {profileModalOpen && onboarded && (
        <ProfileModal profile={profile} onSave={(p) => { setProfile(p); setProfileModalOpen(false); }} onClose={() => setProfileModalOpen(false)} fontSerif={fontSerif} fontSans={fontSans} fontMono={fontMono} />
      )}
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════
   ONBOARDING WIZARD
   ═════════════════════════════════════════════════════════════ */

function OnboardingWizard({ onFinish, demoProfile, fontSerif, fontSans, fontMono }) {
  const [step, setStep] = useState(1);
  const [p, setP] = useState({ name: "", role: "", company: "", department: "", email: "", goals: "", projects: [""] });
  const [initialUploads, setInitialUploads] = useState([]);
  const [uploadName, setUploadName] = useState("");
  const [uploadContent, setUploadContent] = useState("");

  const canNext1 = p.name.trim() && p.role.trim() && p.company.trim();
  const canNext2 = p.goals.trim() && p.projects.some((x) => x.trim());

  const useDemo = () => {
    setP({ ...demoProfile, email: demoProfile.email });
    setStep(3);
  };

  const addProject = () => setP((x) => ({ ...x, projects: [...x.projects, ""] }));
  const updateProject = (i, v) => setP((x) => ({ ...x, projects: x.projects.map((p, idx) => (idx === i ? v : p)) }));
  const removeProject = (i) => setP((x) => ({ ...x, projects: x.projects.filter((_, idx) => idx !== i) }));

  const addInitialUpload = () => {
    if (!uploadName.trim() || !uploadContent.trim()) return;
    setInitialUploads((prev) => [...prev, { id: uid(), name: uploadName, content: uploadContent, added: new Date().toLocaleDateString() }]);
    setUploadName(""); setUploadContent("");
  };

  const finish = () => {
    const cleanProfile = { ...p, projects: p.projects.map((x) => x.trim()).filter(Boolean) };
    onFinish(cleanProfile, initialUploads);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-xs uppercase tracking-[0.2em] text-amber-300/80 mb-3" style={fontMono}>Set up your workspace</div>
      <h2 className="text-4xl md:text-5xl tracking-tight mb-4" style={fontSerif}>Teach OmniFlow who you are.</h2>
      <p className="text-stone-400 mb-10" style={fontSans}>
        The more it knows about your role, goals, and work, the better every draft and form will be.
        Takes under a minute.{" "}
        <button onClick={useDemo} className="text-amber-300 hover:text-amber-200 underline underline-offset-2" style={fontMono}>Use demo data →</button>
      </p>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8" style={fontMono}>
        {[1, 2, 3].map((n) => (
          <div key={n} className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-sm flex items-center justify-center text-xs ${step >= n ? "bg-amber-400 text-stone-950" : "bg-stone-800 text-stone-500"}`}>
              {step > n ? "✓" : n}
            </div>
            {n < 3 && <div className={`w-10 h-px ${step > n ? "bg-amber-400" : "bg-stone-800"}`} />}
          </div>
        ))}
      </div>

      <div className="border border-stone-800 bg-stone-950/60 rounded-sm p-8">
        {step === 1 && (
          <div className="space-y-5">
            <StepHeader num="01" title="Who are you?" sub="The basics. Used in every signature and every form." fontSerif={fontSerif} fontMono={fontMono} />
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Full name" value={p.name} onChange={(v) => setP({ ...p, name: v })} placeholder="John Smith" fontMono={fontMono} />
              <Field label="Position / title" value={p.role} onChange={(v) => setP({ ...p, role: v })} placeholder="Operations Analyst" fontMono={fontMono} />
              <Field label="Company" value={p.company} onChange={(v) => setP({ ...p, company: v })} placeholder="Meridian Industries" fontMono={fontMono} />
              <Field label="Department (optional)" value={p.department} onChange={(v) => setP({ ...p, department: v })} placeholder="Finance & Ops" fontMono={fontMono} />
              <Field label="Email (optional)" value={p.email} onChange={(v) => setP({ ...p, email: v })} placeholder="you@company.com" fontMono={fontMono} />
            </div>
            <div className="flex justify-end pt-2">
              <button onClick={() => setStep(2)} disabled={!canNext1} className="inline-flex items-center gap-2 bg-amber-400 text-stone-950 px-4 py-2 rounded-sm text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-amber-300 transition" style={fontMono}>
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <StepHeader num="02" title="What are you working on?" sub="Your goals and current projects. OmniFlow uses these to prioritize and to ground every output." fontSerif={fontSerif} fontMono={fontMono} />
            <FieldArea label="Your goals for the quarter/year" value={p.goals} onChange={(v) => setP({ ...p, goals: v })} placeholder="e.g., Reduce vendor payment cycle by 30%. Ship monthly ops dashboard. Start AP automation pilot." rows={3} fontMono={fontMono} />
            <div>
              <label className="text-[10px] uppercase tracking-wider text-stone-500 mb-2 block" style={fontMono}>Current projects</label>
              <div className="space-y-2">
                {p.projects.map((proj, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input value={proj} onChange={(e) => updateProject(i, e.target.value)} placeholder="Project name…" className="flex-1 bg-stone-950 border border-stone-800 rounded-sm px-3 py-2 text-sm text-stone-200 outline-none focus:border-amber-500/40 transition" style={fontSans} />
                    {p.projects.length > 1 && (
                      <button onClick={() => removeProject(i)} className="text-stone-500 hover:text-red-300 p-2 transition"><X className="w-4 h-4" /></button>
                    )}
                  </div>
                ))}
              </div>
              <button onClick={addProject} className="mt-2 inline-flex items-center gap-1.5 text-xs text-amber-300 hover:text-amber-200 transition" style={fontMono}>
                <Plus className="w-3.5 h-3.5" /> Add another project
              </button>
            </div>
            <div className="flex items-center justify-between pt-2">
              <button onClick={() => setStep(1)} className="inline-flex items-center gap-1 text-sm text-stone-400 hover:text-stone-100 transition" style={fontMono}>
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button onClick={() => setStep(3)} disabled={!canNext2} className="inline-flex items-center gap-2 bg-amber-400 text-stone-950 px-4 py-2 rounded-sm text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-amber-300 transition" style={fontMono}>
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <StepHeader num="03" title="Upload starter documents (optional)" sub="Bio, resume, a project brief, a past proposal — anything you want OmniFlow to reference. You can always add more later." fontSerif={fontSerif} fontMono={fontMono} />

            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Document name" value={uploadName} onChange={setUploadName} placeholder="e.g., My bio / Resume / Q2 plan" fontMono={fontMono} />
              <div className="flex items-end">
                <label className="inline-flex items-center gap-2 text-xs text-amber-300 hover:text-amber-200 cursor-pointer transition" style={fontMono}>
                  <Paperclip className="w-3.5 h-3.5" /> Or upload a text file
                  <input type="file" accept=".txt,.md,.csv" className="hidden" onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                      setUploadName(f.name);
                      setUploadContent(String(ev.target?.result || ""));
                    };
                    reader.readAsText(f);
                  }} />
                </label>
              </div>
            </div>
            <FieldArea label="Content" value={uploadContent} onChange={setUploadContent} placeholder="Paste the text here…" rows={4} fontMono={fontMono} />
            <button onClick={addInitialUpload} disabled={!uploadName.trim() || !uploadContent.trim()} className="inline-flex items-center gap-1.5 text-sm bg-stone-900 border border-stone-700 text-stone-200 px-3 py-2 rounded-sm hover:border-amber-400/50 disabled:opacity-40 transition" style={fontMono}>
              <Plus className="w-3.5 h-3.5" /> Add to knowledge base
            </button>

            {initialUploads.length > 0 && (
              <div className="pt-4 border-t border-stone-800">
                <div className="text-[10px] uppercase tracking-wider text-stone-500 mb-2" style={fontMono}>Added ({initialUploads.length})</div>
                <div className="flex flex-wrap gap-2">
                  {initialUploads.map((u) => (
                    <div key={u.id} className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs px-3 py-1.5 rounded-sm" style={fontMono}>
                      <FileCheck2 className="w-3 h-3" /> {u.name}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <button onClick={() => setStep(2)} className="inline-flex items-center gap-1 text-sm text-stone-400 hover:text-stone-100 transition" style={fontMono}>
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button onClick={finish} className="inline-flex items-center gap-2 bg-amber-400 text-stone-950 px-5 py-2.5 rounded-sm text-sm font-medium hover:bg-amber-300 transition" style={fontMono}>
                Finish setup <CheckCircle2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StepHeader({ num, title, sub, fontSerif, fontMono }) {
  return (
    <div className="mb-2">
      <div className="text-[10px] uppercase tracking-[0.2em] text-amber-300/80 mb-1.5" style={fontMono}>Step {num}</div>
      <h3 className="text-2xl mb-1" style={fontSerif}>{title}</h3>
      <p className="text-sm text-stone-400">{sub}</p>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, fontMono }) {
  return (
    <div>
      <label className="text-[10px] uppercase tracking-wider text-stone-500 mb-1.5 block" style={fontMono}>{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full bg-stone-950 border border-stone-800 rounded-sm px-3 py-2 text-sm text-stone-200 outline-none focus:border-amber-500/40 transition" />
    </div>
  );
}

function FieldArea({ label, value, onChange, placeholder, rows = 3, fontMono }) {
  return (
    <div>
      <label className="text-[10px] uppercase tracking-wider text-stone-500 mb-1.5 block" style={fontMono}>{label}</label>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={rows} className="w-full bg-stone-950 border border-stone-800 rounded-sm px-3 py-2 text-sm text-stone-200 outline-none focus:border-amber-500/40 transition resize-none leading-relaxed" />
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════
   APP WORKSPACE (main app after onboarding)
   ═════════════════════════════════════════════════════════════ */

function AppWorkspace(props) {
  const { profile, uploads, onOpenUploadModal, onRemoveUpload, onOpenProfile, activeTab, onTabChange, fontSerif, fontSans, fontMono } = props;

  return (
    <div>
      {/* Header strip */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-amber-300/80 mb-2" style={fontMono}>Workspace</div>
          <h2 className="text-3xl md:text-5xl tracking-tight" style={fontSerif}>
            Welcome back, <span className="italic">{profile.name.split(" ")[0]}</span>.
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onOpenProfile} className="inline-flex items-center gap-2 bg-stone-900 border border-stone-700 text-stone-200 px-3 py-2 rounded-sm text-sm hover:border-amber-400/50 transition" style={fontMono}>
            <User className="w-3.5 h-3.5" /> Profile
          </button>
          <button onClick={onOpenUploadModal} className="inline-flex items-center gap-2 bg-stone-100 text-stone-950 px-3 py-2 rounded-sm text-sm font-medium hover:bg-amber-200 transition" style={fontMono}>
            <Upload className="w-3.5 h-3.5" /> Add knowledge
          </button>
        </div>
      </div>

      {/* Tabs + Knowledge bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-800 mb-5">
        <div className="flex items-center gap-1" style={fontMono}>
          {[
            { id: "inbox", label: "Inbox", icon: Inbox },
            { id: "forms", label: "Forms & Docs", icon: FileText },
          ].map((t) => (
            <button key={t.id} onClick={() => onTabChange(t.id)} className={`inline-flex items-center gap-2 px-4 py-3 text-sm transition border-b-2 -mb-px ${
              activeTab === t.id ? "text-amber-300 border-amber-400" : "text-stone-400 border-transparent hover:text-stone-100"
            }`}>
              <t.icon className="w-3.5 h-3.5" />
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 text-xs text-stone-500 pb-2" style={fontMono}>
          <BookOpen className="w-3.5 h-3.5" /> Knowledge: {uploads.length} item{uploads.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Knowledge pills */}
      {uploads.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-5">
          {uploads.map((u) => (
            <div key={u.id} className="group inline-flex items-center gap-2 bg-stone-900 border border-stone-800 text-stone-300 text-xs px-3 py-1.5 rounded-sm hover:border-amber-500/40 transition" style={fontMono}>
              <FileCheck2 className="w-3 h-3 text-amber-300" />
              {u.name}
              <button onClick={() => onRemoveUpload(u.id)} className="opacity-0 group-hover:opacity-100 text-stone-500 hover:text-red-300 transition">
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Tab content */}
      {activeTab === "inbox" ? <InboxTab {...props} /> : <FormsTab {...props} />}
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════
   INBOX TAB
   ═════════════════════════════════════════════════════════════ */

function InboxTab(props) {
  const {
    emails, selectedEmail, selectedId, setSelectedId, analysis, draft,
    scanning, pendingCount, draftReadyCount, sentCount, sendingId, regeneratingId,
    onScanInbox, onResetInbox, onSendDraft, onSkip, onRegenerate, onProcessEmail, onDraftChange,
    fontSerif, fontSans, fontMono,
  } = props;

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4 px-4 py-3 border border-stone-800 bg-stone-900/40 rounded-sm">
        <div className="flex items-center gap-6 flex-wrap">
          <Stat icon={Inbox} label="Needs reply" value={pendingCount} tone="stone" fontMono={fontMono} />
          <Stat icon={Sparkles} label="Drafts ready" value={draftReadyCount} tone="amber" fontMono={fontMono} />
          <Stat icon={CheckCheck} label="Sent" value={sentCount} tone="emerald" fontMono={fontMono} />
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onResetInbox} className="text-xs text-stone-500 hover:text-stone-200 px-3 py-2 transition" style={fontMono}>Reset</button>
          <button onClick={onScanInbox} disabled={scanning || pendingCount === 0} className="inline-flex items-center gap-2 bg-amber-400 text-stone-950 px-4 py-2 rounded-sm text-sm font-medium hover:bg-amber-300 disabled:opacity-40 disabled:cursor-not-allowed transition" style={fontMono}>
            {scanning ? (<><Sparkles className="w-3.5 h-3.5 animate-pulse" /> Scanning inbox</>) : (<><Zap className="w-3.5 h-3.5" /> Scan inbox ({pendingCount})</>)}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-4">
        <div className="lg:col-span-2 border border-stone-800 bg-stone-950/60 rounded-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-stone-800 flex items-center gap-2 text-xs text-stone-500 uppercase tracking-wider" style={fontMono}>
            <Inbox className="w-3.5 h-3.5" /> Inbox · {emails.length} messages
          </div>
          <div className="divide-y divide-stone-800 max-h-[700px] overflow-y-auto">
            {emails.map((e) => (
              <InboxItem key={e.id} email={e} selected={e.id === selectedId} onClick={() => setSelectedId(e.id)} fontMono={fontMono} />
            ))}
          </div>
        </div>

        <div className="lg:col-span-3 border border-stone-800 bg-stone-950/60 rounded-sm">
          {selectedEmail && (
            <DetailPanel
              email={selectedEmail} analysis={analysis} draft={draft}
              onDraftChange={onDraftChange}
              onSend={() => onSendDraft(selectedEmail.id)}
              onSkip={() => onSkip(selectedEmail.id)}
              onRegenerate={() => onRegenerate(selectedEmail.id)}
              onProcess={onProcessEmail}
              sending={sendingId === selectedEmail.id}
              regenerating={regeneratingId === selectedEmail.id}
              fontSerif={fontSerif} fontSans={fontSans} fontMono={fontMono}
            />
          )}
        </div>
      </div>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════
   FORMS TAB
   ═════════════════════════════════════════════════════════════ */

function FormsTab({ forms, selectedForm, selectedFormId, onSelectForm, formValues, onUpdateFormField, formContext, onFormContextChange, onAutofill, filling, formSubmitted, onSubmitForm, profile, uploads, fontSerif, fontSans, fontMono }) {

  if (!selectedForm) return null;

  return (
    <div className="grid lg:grid-cols-5 gap-4">
      {/* Form picker */}
      <div className="lg:col-span-2 border border-stone-800 bg-stone-950/60 rounded-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-stone-800 flex items-center gap-2 text-xs text-stone-500 uppercase tracking-wider" style={fontMono}>
          <FileText className="w-3.5 h-3.5" /> Form templates · {forms.length}
        </div>
        <div className="divide-y divide-stone-800">
          {forms.map((f) => (
            <button key={f.id} onClick={() => onSelectForm(f.id)} className={`w-full text-left px-4 py-4 transition ${
              selectedFormId === f.id ? "bg-amber-500/5 border-l-2 border-amber-400" : "hover:bg-stone-900/40 border-l-2 border-transparent"
            }`}>
              <div className="flex items-start gap-3">
                <f.icon className={`w-4 h-4 mt-0.5 ${selectedFormId === f.id ? "text-amber-300" : "text-stone-500"}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-stone-100 font-medium mb-0.5">{f.title}</div>
                  <div className="text-xs text-stone-500">{f.subtitle}</div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Context input */}
        <div className="p-4 border-t border-stone-800 space-y-2">
          <div className="text-[10px] uppercase tracking-wider text-stone-500" style={fontMono}>Optional: add context</div>
          <textarea value={formContext} onChange={(e) => onFormContextChange(e.target.value)} placeholder="e.g., '5 days off in mid-June for family trip' or 'Client dinner in Chicago last week, $187.50'" rows={3} className="w-full bg-stone-950 border border-stone-800 rounded-sm px-3 py-2 text-sm text-stone-200 outline-none focus:border-amber-500/40 transition resize-none" style={fontSans} />
          <button onClick={onAutofill} disabled={filling} className="w-full inline-flex items-center justify-center gap-2 bg-amber-400 text-stone-950 px-4 py-2.5 rounded-sm text-sm font-medium hover:bg-amber-300 disabled:opacity-40 transition" style={fontMono}>
            {filling ? (<><Sparkles className="w-3.5 h-3.5 animate-pulse" /> AI is filling…</>) : (<><Sparkles className="w-3.5 h-3.5" /> Auto-fill with AI</>)}
          </button>
          <div className="text-[10px] text-stone-500 leading-relaxed" style={fontMono}>
            Using: profile, {uploads.length} uploaded doc{uploads.length !== 1 ? "s" : ""}, and your context.
          </div>
        </div>
      </div>

      {/* Form renderer */}
      <div className="lg:col-span-3 border border-stone-800 bg-stone-950/60 rounded-sm">
        <div className="px-5 py-4 border-b border-stone-800 flex items-center justify-between">
          <div>
            <h3 className="text-lg" style={fontSerif}>{selectedForm.title}</h3>
            <p className="text-xs text-stone-500" style={fontMono}>{selectedForm.subtitle}</p>
          </div>
          {formSubmitted && (
            <span className="inline-flex items-center gap-1.5 text-xs text-emerald-300 px-3 py-1.5 rounded-sm bg-emerald-500/10 border border-emerald-500/30" style={fontMono}>
              <CheckCircle2 className="w-3.5 h-3.5" /> Submitted
            </span>
          )}
        </div>

        <div className="p-5 space-y-4">
          {selectedForm.fields.map((f) => (
            <FormFieldRenderer key={f.id} field={f} value={formValues[f.id] ?? ""} onChange={(v) => onUpdateFormField(f.id, v)} disabled={formSubmitted} fontMono={fontMono} fontSans={fontSans} />
          ))}
        </div>

        {!formSubmitted && (
          <div className="px-5 py-4 border-t border-stone-800 flex items-center justify-between">
            <div className="text-xs text-stone-500" style={fontMono}>
              Fields auto-populated from your profile have a <span className="text-amber-300">●</span> indicator.
            </div>
            <button onClick={onSubmitForm} className="inline-flex items-center gap-2 bg-amber-400 text-stone-950 px-4 py-2 rounded-sm text-sm font-medium hover:bg-amber-300 transition" style={fontMono}>
              Submit form <CheckCircle2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function FormFieldRenderer({ field, value, onChange, disabled, fontMono, fontSans }) {
  const fromProfile = !!field.source;
  return (
    <div>
      <label className="text-[10px] uppercase tracking-wider text-stone-500 mb-1.5 flex items-center gap-1.5" style={fontMono}>
        {field.label}
        {fromProfile && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" title="From your profile" />}
      </label>
      {field.type === "textarea" ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled} rows={3} className="w-full bg-stone-950 border border-stone-800 rounded-sm px-3 py-2 text-sm text-stone-200 outline-none focus:border-amber-500/40 transition resize-none leading-relaxed disabled:opacity-70" style={fontSans} />
      ) : field.type === "select" ? (
        <select value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled} className="w-full bg-stone-950 border border-stone-800 rounded-sm px-3 py-2 text-sm text-stone-200 outline-none focus:border-amber-500/40 transition disabled:opacity-70" style={fontSans}>
          <option value="">Select…</option>
          {field.options?.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input type={field.type === "date" ? "date" : field.type === "number" ? "number" : "text"} value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled} className="w-full bg-stone-950 border border-stone-800 rounded-sm px-3 py-2 text-sm text-stone-200 outline-none focus:border-amber-500/40 transition disabled:opacity-70" style={fontSans} />
      )}
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════
   MODALS
   ═════════════════════════════════════════════════════════════ */

function UploadModal({ onClose, onSave, fontSerif, fontSans, fontMono }) {
  const [name, setName] = useState("");
  const [content, setContent] = useState("");

  const handleFile = (f) => {
    if (!f) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setName(f.name);
      setContent(String(ev.target?.result || ""));
    };
    reader.readAsText(f);
  };

  const save = () => {
    if (!name.trim() || !content.trim()) return;
    onSave(name, content);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg border border-stone-700 bg-stone-950 rounded-sm">
        <div className="px-5 py-4 border-b border-stone-800 flex items-center justify-between">
          <div>
            <h3 className="text-lg" style={fontSerif}>Add to knowledge base</h3>
            <p className="text-xs text-stone-500" style={fontMono}>Paste text or upload a file. OmniFlow will reference it in future drafts and forms.</p>
          </div>
          <button onClick={onClose} className="text-stone-500 hover:text-stone-200"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <label className="flex-1">
              <div className="text-[10px] uppercase tracking-wider text-stone-500 mb-1.5 block" style={fontMono}>Document name</div>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Company handbook excerpt" className="w-full bg-stone-900 border border-stone-800 rounded-sm px-3 py-2 text-sm text-stone-200 outline-none focus:border-amber-500/40 transition" />
            </label>
            <label className="inline-flex items-center gap-2 text-xs text-amber-300 hover:text-amber-200 cursor-pointer transition mt-6" style={fontMono}>
              <Paperclip className="w-3.5 h-3.5" /> Upload file
              <input type="file" accept=".txt,.md,.csv,.json" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
            </label>
          </div>
          <label className="block">
            <div className="text-[10px] uppercase tracking-wider text-stone-500 mb-1.5 block" style={fontMono}>Content</div>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={8} placeholder="Paste the content here…" className="w-full bg-stone-900 border border-stone-800 rounded-sm px-3 py-2 text-sm text-stone-200 outline-none focus:border-amber-500/40 transition resize-none leading-relaxed" style={fontSans} />
          </label>
        </div>
        <div className="px-5 py-4 border-t border-stone-800 flex items-center justify-end gap-2">
          <button onClick={onClose} className="text-sm text-stone-400 hover:text-stone-100 px-3 py-2 transition" style={fontMono}>Cancel</button>
          <button onClick={save} disabled={!name.trim() || !content.trim()} className="inline-flex items-center gap-2 bg-amber-400 text-stone-950 px-4 py-2 rounded-sm text-sm font-medium hover:bg-amber-300 disabled:opacity-40 transition" style={fontMono}>
            <Plus className="w-3.5 h-3.5" /> Save to knowledge
          </button>
        </div>
      </div>
    </div>
  );
}

function ProfileModal({ profile, onSave, onClose, fontSerif, fontSans, fontMono }) {
  const [p, setP] = useState(profile);
  const addProject = () => setP((x) => ({ ...x, projects: [...(x.projects || []), ""] }));
  const updateProject = (i, v) => setP((x) => ({ ...x, projects: x.projects.map((p, idx) => (idx === i ? v : p)) }));
  const removeProject = (i) => setP((x) => ({ ...x, projects: x.projects.filter((_, idx) => idx !== i) }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-2xl border border-stone-700 bg-stone-950 rounded-sm my-8">
        <div className="px-5 py-4 border-b border-stone-800 flex items-center justify-between">
          <div>
            <h3 className="text-lg" style={fontSerif}>Your profile</h3>
            <p className="text-xs text-stone-500" style={fontMono}>Every email and form is written using these details.</p>
          </div>
          <button onClick={onClose} className="text-stone-500 hover:text-stone-200"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid md:grid-cols-2 gap-3">
            <Field label="Full name" value={p.name} onChange={(v) => setP({ ...p, name: v })} placeholder="" fontMono={fontMono} />
            <Field label="Position" value={p.role} onChange={(v) => setP({ ...p, role: v })} placeholder="" fontMono={fontMono} />
            <Field label="Company" value={p.company} onChange={(v) => setP({ ...p, company: v })} placeholder="" fontMono={fontMono} />
            <Field label="Department" value={p.department} onChange={(v) => setP({ ...p, department: v })} placeholder="" fontMono={fontMono} />
            <Field label="Email" value={p.email} onChange={(v) => setP({ ...p, email: v })} placeholder="" fontMono={fontMono} />
          </div>
          <FieldArea label="Goals" value={p.goals} onChange={(v) => setP({ ...p, goals: v })} placeholder="" rows={3} fontMono={fontMono} />
          <div>
            <label className="text-[10px] uppercase tracking-wider text-stone-500 mb-1.5 block" style={fontMono}>Current projects</label>
            <div className="space-y-2">
              {(p.projects || []).map((proj, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input value={proj} onChange={(e) => updateProject(i, e.target.value)} className="flex-1 bg-stone-900 border border-stone-800 rounded-sm px-3 py-2 text-sm text-stone-200 outline-none focus:border-amber-500/40 transition" />
                  <button onClick={() => removeProject(i)} className="text-stone-500 hover:text-red-300 p-2 transition"><X className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
            <button onClick={addProject} className="mt-2 inline-flex items-center gap-1.5 text-xs text-amber-300 hover:text-amber-200 transition" style={fontMono}>
              <Plus className="w-3.5 h-3.5" /> Add project
            </button>
          </div>
        </div>
        <div className="px-5 py-4 border-t border-stone-800 flex items-center justify-end gap-2">
          <button onClick={onClose} className="text-sm text-stone-400 hover:text-stone-100 px-3 py-2 transition" style={fontMono}>Cancel</button>
          <button onClick={() => onSave({ ...p, projects: p.projects.map((x) => x.trim()).filter(Boolean) })} className="inline-flex items-center gap-2 bg-amber-400 text-stone-950 px-4 py-2 rounded-sm text-sm font-medium hover:bg-amber-300 transition" style={fontMono}>
            <CheckCircle2 className="w-3.5 h-3.5" /> Save profile
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════
   SHARED SUBCOMPONENTS
   ═════════════════════════════════════════════════════════════ */

function Stat({ icon: Icon, label, value, tone, fontMono }) {
  const toneMap = { stone: "text-stone-300", amber: "text-amber-300", emerald: "text-emerald-300" };
  return (
    <div className="flex items-center gap-2">
      <Icon className={`w-4 h-4 ${toneMap[tone]}`} />
      <span className={`text-lg ${toneMap[tone]}`} style={fontMono}>{value}</span>
      <span className="text-xs text-stone-500 uppercase tracking-wider" style={fontMono}>{label}</span>
    </div>
  );
}

function InboxItem({ email, selected, onClick, fontMono }) {
  const s = statusStyle[email.status];
  return (
    <button onClick={onClick} className={`w-full text-left px-4 py-3.5 transition ${
      selected ? "bg-amber-500/5 border-l-2 border-amber-400" : "hover:bg-stone-900/40 border-l-2 border-transparent"
    } ${email.status === "skipped" ? "opacity-50" : ""}`}>
      <div className="flex items-center justify-between gap-2 mb-1">
        <span className="text-sm text-stone-100 truncate font-medium">{email.fromName}</span>
        <span className="text-[10px] text-stone-500 shrink-0" style={fontMono}>{email.received}</span>
      </div>
      <div className="text-sm text-stone-300 truncate mb-1.5">{email.subject}</div>
      <div className="text-xs text-stone-500 truncate mb-2">{email.preview}</div>
      <div className="flex items-center gap-1.5">
        <div className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
        <span className={`text-[10px] uppercase tracking-wider ${s.text}`} style={fontMono}>{s.label}</span>
      </div>
    </button>
  );
}

function DetailPanel({ email, analysis, draft, onDraftChange, onSend, onSkip, onRegenerate, onProcess, sending, regenerating, fontSerif, fontSans, fontMono }) {
  const hasDraft = email.status === "draft_ready" || email.status === "sent";
  const isAnalyzing = email.status === "analyzing";

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 py-4 border-b border-stone-800">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="text-lg text-stone-100" style={fontSerif}>{email.subject}</h3>
          <span className="text-xs text-stone-500 shrink-0 mt-1" style={fontMono}>{email.received}</span>
        </div>
        <div className="text-xs text-stone-500" style={fontMono}>
          From <span className="text-stone-300">{email.fromName}</span> · {email.from}
        </div>
      </div>

      <div className="px-5 py-4 border-b border-stone-800 bg-stone-950/40">
        <div className="text-sm text-stone-300 whitespace-pre-wrap leading-relaxed max-h-40 overflow-y-auto" style={fontSans}>{email.body}</div>
      </div>

      {email.status === "pending" && <EmptyAnalysis onProcess={onProcess} fontMono={fontMono} fontSans={fontSans} />}

      {isAnalyzing && (
        <div className="px-5 py-8 flex items-center gap-3 border-b border-stone-800">
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
            <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
            <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
          <span className="text-sm text-amber-300" style={fontMono}>Running pipeline…</span>
        </div>
      )}

      {(hasDraft || email.status === "skipped") && analysis && (
        <>
          <div className="px-5 py-4 border-b border-stone-800">
            <Label icon={Sparkles} text="AI Summary" mono={fontMono} />
            <p className="text-sm text-stone-200 leading-relaxed" style={fontSans}>{analysis.summary}</p>
          </div>

          <div className="px-5 py-4 border-b border-stone-800 grid grid-cols-3 gap-2">
            <MiniField label="Department" value={analysis.classification.department} mono={fontMono} />
            <MiniField label="Intent" value={analysis.classification.intent} mono={fontMono} />
            <MiniField label="Reference" value={
              analysis.classification.invoiceId ? `#${analysis.classification.invoiceId}` :
              analysis.classification.orderId ? analysis.classification.orderId :
              analysis.classification.senderName || "—"
            } mono={fontMono} />
          </div>

          {analysis.hits.length > 0 && (
            <div className="px-5 py-4 border-b border-stone-800">
              <Label icon={Database} text="Data pulled" mono={fontMono} />
              {analysis.hits.map((h, i) => (
                <div key={i} className="bg-stone-950 border border-stone-800 rounded-sm p-3 text-xs" style={fontMono}>
                  <div className="text-amber-300 uppercase tracking-wider mb-1.5">{h.type}</div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-stone-300">
                    {Object.entries(h.record).map(([k, v]) => (
                      <div key={k} className="flex">
                        <span className="text-stone-500 w-20 shrink-0">{k}</span>
                        <span className="text-stone-200 truncate">{String(v)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="px-5 py-4 border-b border-stone-800">
            <Label icon={GitBranch} text="Decision" mono={fontMono} />
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-sm border mb-2 ${severityStyle[analysis.decision.severity].border} ${severityStyle[analysis.decision.severity].bg}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${severityStyle[analysis.decision.severity].dot}`} />
              <span className={`text-xs uppercase tracking-wider ${severityStyle[analysis.decision.severity].label}`} style={fontMono}>{analysis.decision.action}</span>
            </div>
            <p className="text-sm text-stone-400 leading-relaxed" style={fontSans}>{analysis.decision.reasoning}</p>
            <div className="text-xs text-stone-500 mt-2" style={fontMono}>→ Routed to: <span className="text-stone-300">{analysis.decision.routeTo}</span></div>
          </div>

          {hasDraft && (
            <div className="px-5 py-4 flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <Label icon={Send} text={email.status === "sent" ? "Sent reply" : "Draft reply (editable)"} mono={fontMono} />
                {email.status === "sent" && (
                  <span className="inline-flex items-center gap-1 text-xs text-emerald-300" style={fontMono}>
                    <CheckCircle2 className="w-3.5 h-3.5" /> Sent
                  </span>
                )}
              </div>
              <textarea value={draft} onChange={(e) => onDraftChange(e.target.value)} disabled={email.status === "sent"} className="w-full bg-stone-950 border border-stone-800 rounded-sm px-4 py-3 text-sm text-stone-200 outline-none resize-none leading-relaxed min-h-[200px] focus:border-amber-500/40 transition disabled:opacity-70" style={fontSans} />

              {email.status !== "sent" && (
                <div className="flex flex-wrap items-center justify-between gap-2 mt-3">
                  <div className="flex items-center gap-2">
                    <button onClick={onRegenerate} disabled={regenerating} className="inline-flex items-center gap-2 text-xs text-stone-400 hover:text-stone-100 px-2 py-1.5 transition disabled:opacity-50" style={fontMono}>
                      <RefreshCw className={`w-3.5 h-3.5 ${regenerating ? "animate-spin" : ""}`} />
                      {regenerating ? "Regenerating" : "Regenerate"}
                    </button>
                    <button onClick={onSkip} className="inline-flex items-center gap-2 text-xs text-stone-400 hover:text-stone-100 px-2 py-1.5 transition" style={fontMono}>
                      <SkipForward className="w-3.5 h-3.5" /> Skip
                    </button>
                  </div>
                  <button onClick={onSend} disabled={sending || !draft.trim()} className="inline-flex items-center gap-2 bg-amber-400 text-stone-950 px-4 py-2 rounded-sm text-sm font-medium hover:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed transition" style={fontMono}>
                    {sending ? "Sending…" : (<><Send className="w-3.5 h-3.5" /> Send reply</>)}
                  </button>
                </div>
              )}
            </div>
          )}

          {email.status === "skipped" && (
            <div className="px-5 py-4 flex items-center gap-2 text-sm text-stone-500" style={fontMono}>
              <AlertCircle className="w-4 h-4" /> Skipped — no reply will be sent.
            </div>
          )}
        </>
      )}
    </div>
  );
}

function EmptyAnalysis({ onProcess, fontMono, fontSans }) {
  return (
    <div className="px-5 py-12 flex flex-col items-center justify-center gap-3 border-b border-stone-800">
      <Cpu className="w-6 h-6 text-stone-600" />
      <p className="text-sm text-stone-400 text-center max-w-sm" style={fontSans}>
        This email is waiting to be processed. Run the pipeline to generate a summary, decision, and draft reply.
      </p>
      <button onClick={onProcess} className="inline-flex items-center gap-2 bg-stone-100 text-stone-950 px-4 py-2 rounded-sm text-xs font-medium hover:bg-amber-200 transition" style={fontMono}>
        <Zap className="w-3.5 h-3.5" /> Process this email
      </button>
    </div>
  );
}

function Label({ icon: Icon, text, mono }) {
  return (
    <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-stone-500 mb-2" style={mono}>
      <Icon className="w-3.5 h-3.5" />
      {text}
    </div>
  );
}

function MiniField({ label, value, mono }) {
  return (
    <div className="bg-stone-950 border border-stone-800 rounded-sm px-3 py-2">
      <div className="text-[10px] uppercase tracking-wider text-stone-500 mb-0.5" style={mono}>{label}</div>
      <div className="text-xs text-stone-100 truncate" style={mono}>{value}</div>
    </div>
  );
}

function Cell({ title, body, fontSerif, fontSans, highlight }) {
  return (
    <div className={`p-8 md:p-10 ${highlight ? "bg-amber-500/5" : "bg-stone-950/40"}`}>
      <h3 className={`text-2xl md:text-3xl mb-4 ${highlight ? "text-amber-200" : "text-stone-100"}`} style={fontSerif}>{title}</h3>
      <p className="text-stone-400 leading-relaxed" style={fontSans}>{body}</p>
    </div>
  );
}
