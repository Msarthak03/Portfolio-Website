/**
 * chatbot.js — Sarthak Mahajan Portfolio Chatbot
 * 100% Offline · No API Key · No Cost · No Dependencies
 * ──────────────────────────────────────────────────────
 * Smart keyword-pattern matching against Sarthak's full
 * resume. Instant responses, works on any static host.
 */

// ─── State ───────────────────────────────────
const chatHistory = [];
let chatOpen = false;

// ─── DOM refs ────────────────────────────────
const fab        = document.getElementById('chat-fab');
const fabIcon    = document.getElementById('chat-fab-icon');
const fabClose   = document.getElementById('chat-fab-close');
const chatWindow = document.getElementById('chat-window');
const messages   = document.getElementById('chat-messages');
const input      = document.getElementById('chat-input');
const sendBtn    = document.getElementById('chat-send');

// ─── Toggle open / close ─────────────────────
fab.addEventListener('click', () => {
  chatOpen = !chatOpen;
  chatWindow.classList.toggle('open', chatOpen);
  fabIcon.style.display  = chatOpen ? 'none'  : 'block';
  fabClose.style.display = chatOpen ? 'block' : 'none';
  if (chatOpen) {
    setTimeout(() => input.focus(), 350);
    scrollToBottom();
  }
});

// ─── Send on Enter ───────────────────────────
input.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
});
sendBtn.addEventListener('click', handleSend);

// ─── Suggestion chips ────────────────────────
function sendSuggestion(btn) {
  input.value = btn.textContent;
  const s = document.getElementById('chat-suggestions');
  if (s) s.remove();
  handleSend();
}

// ─── Main send handler ───────────────────────
function handleSend() {
  const text = input.value.trim();
  if (!text) return;
  const s = document.getElementById('chat-suggestions');
  if (s) s.remove();
  input.value = '';
  appendMessage('user', text);
  sendBtn.disabled = true;

  // Simulate natural typing delay
  const delay = 500 + Math.random() * 600;
  showTyping();
  setTimeout(() => {
    hideTyping();
    const reply = getReply(text);
    appendMessage('bot', reply);
    sendBtn.disabled = false;
    input.focus();
  }, delay);
}

// ════════════════════════════════════════════════════════
//  KNOWLEDGE BASE — Sarthak Mahajan's full resume
// ════════════════════════════════════════════════════════

const KB = {

  // ── Greetings ──────────────────────────────
  greet: {
    patterns: [/^(hi|hey|hello|howdy|sup|good\s*(morning|evening|afternoon))/i],
    responses: [
      "👋 Hi there! I'm Sarthak's AI assistant. Ask me anything about his skills, experience, projects, or how to get in touch!",
      "Hello! 👋 Great to have you here. I can tell you all about Sarthak's background, tech stack, and projects. What would you like to know?",
      "Hey! 👋 I'm here to answer any questions about Sarthak Mahajan — skills, experience, projects, you name it!"
    ]
  },

  // ── Who is Sarthak ─────────────────────────
  who: {
    patterns: [/who (is|are) (sarthak|he|you)|tell me about (sarthak|him|yourself)|about sarthak|introduce/i],
    responses: [
      "Sarthak Mahajan is a Junior Backend Developer based in Pune, Maharashtra. He currently works at Cognizant Technology Solutions on an enterprise pharmaceutical application for Astellas Pharma. He specialises in Java, Spring Boot, microservices, and event-driven systems. He holds a B.E. in Computer Science with an 8.5 CGPA."
    ]
  },

  // ── Summary ────────────────────────────────
  summary: {
    patterns: [/summary|overview|background|profile|introduce yourself/i],
    responses: [
      "Sarthak is a Junior Backend Developer experienced in building RESTful APIs and microservice-based systems using Java, Spring Boot, and Spring Data JPA. He's proficient in implementing business logic, integrating MySQL databases, and contributing to event-driven workflows using Kafka. He's familiar with Spring Security, Docker, Kubernetes, CI/CD pipelines, and has worked on enterprise-grade pharmaceutical applications within Agile teams."
    ]
  },

  // ── Experience ─────────────────────────────
  experience: {
    patterns: [/experience|work(ed)?|job|employ|cognizant|astellas|pharma|company|role|position|career/i],
    responses: [
      "Sarthak is currently a **Program Analyst Trainee** at **Cognizant Technology Solutions** (Feb 2025 – Present), working on an enterprise pharmaceutical application for **Astellas Pharma**.\n\nHis responsibilities include:\n→ Building REST APIs with Java & Spring Boot\n→ Kafka-based event flows for real-time order/inventory updates\n→ Spring Security + JWT for auth & role-based access\n→ Docker, Kubernetes & CI/CD pipeline support\n→ JUnit & Mockito for testing in an Agile/Scrum team"
    ]
  },

  // ── Skills general ─────────────────────────
  skills: {
    patterns: [/skill|tech(nolog|stack)?|what (can|does) he (do|know)|proficien|capabilit|expertise/i],
    responses: [
      "Here's Sarthak's tech stack:\n\n🔵 Backend: Java, Spring Boot, Spring Data JPA, Spring AI, RESTful APIs, Microservices\n🗄️ Databases: MySQL, PostgreSQL, MongoDB\n☁️ DevOps & Cloud: Docker, Kubernetes, AWS, Jenkins, GitHub Actions, CI/CD\n🌐 Frontend: React, JavaScript, HTML, CSS\n🔐 Security & Messaging: OAuth2, JWT, Keycloak, Kafka, RabbitMQ\n🛠️ Tools: Git, Postman, IntelliJ IDEA, VS Code\n🤖 AI/ML: Machine Learning, Deep Learning, Generative AI"
    ]
  },

  // ── Java / Spring Boot ─────────────────────
  java: {
    patterns: [/\bjava\b|spring\s*boot|spring\s*data|jpa|hibernate/i],
    responses: [
      "Java and Spring Boot are Sarthak's primary stack. He uses Spring Boot for building REST APIs and microservices, Spring Data JPA with Hibernate for ORM, and applies @Service, @Transactional, and @Repository patterns in production enterprise applications at Cognizant."
    ]
  },

  // ── Microservices ──────────────────────────
  microservices: {
    patterns: [/microservice|eureka|service.discover|distributed/i],
    responses: [
      "Sarthak has hands-on microservices experience. His project ActivityIQ is a full microservices system with User, Activity, and AI services registered on Eureka Server. He uses RabbitMQ for async inter-service communication and Spring Boot for each service. He also works on microservices at Cognizant for the Astellas Pharma application."
    ]
  },

  // ── Kafka ──────────────────────────────────
  kafka: {
    patterns: [/kafka|event.driven|message.queue|event.stream/i],
    responses: [
      "Sarthak has experience with Kafka-based event-driven architecture. At Cognizant, he built Kafka event flows for real-time order and inventory update pipelines in the Astellas Pharma application."
    ]
  },

  // ── RabbitMQ ───────────────────────────────
  rabbit: {
    patterns: [/rabbitmq|rabbit|amqp|message.broker/i],
    responses: [
      "Sarthak used RabbitMQ in his ActivityIQ project for asynchronous inter-service communication between microservices, which improved scalability of the fitness tracking platform."
    ]
  },

  // ── Docker / Kubernetes ────────────────────
  devops: {
    patterns: [/docker|kubernetes|k8s|container|deploy|ci.?cd|jenkins|github.action|devops|pipeline/i],
    responses: [
      "Sarthak has practical DevOps experience at Cognizant — he assisted with Docker containerisation, Kubernetes deployments, and CI/CD pipelines using Jenkins and GitHub Actions for the Astellas Pharma enterprise application."
    ]
  },

  // ── AWS / Cloud ────────────────────────────
  cloud: {
    patterns: [/aws|cloud|amazon|azure(?! ai)|gcp/i],
    responses: [
      "Sarthak is familiar with AWS as part of his cloud & DevOps skill set. He also holds an Azure AI Foundation certification from Udemy, giving him exposure to both major cloud platforms."
    ]
  },

  // ── Security / JWT / OAuth ─────────────────
  security: {
    patterns: [/security|jwt|oauth|keycloak|auth(entication|orisation)?|token|role.based/i],
    responses: [
      "Sarthak has solid backend security experience. He implemented Spring Security with JWT for authentication and role-based access control at Cognizant. In his ActivityIQ project, he used Keycloak with OAuth2 + JWT for enterprise-grade secure authentication and authorisation."
    ]
  },

  // ── Databases ──────────────────────────────
  database: {
    patterns: [/database|mysql|postgres|mongodb|mongo|sql|nosql|db/i],
    responses: [
      "Sarthak works across relational and NoSQL databases:\n→ MySQL — used at Cognizant for JPA entity management\n→ PostgreSQL — used in the ActivityIQ project\n→ MongoDB — used in ActivityIQ for hybrid storage patterns\n\nHe manages entities using Spring Data JPA and has experience designing database schemas for production applications."
    ]
  },

  // ── Spring AI ──────────────────────────────
  springai: {
    patterns: [/spring.?ai|ai.?integrat/i],
    responses: [
      "Sarthak integrated Spring AI into his ActivityIQ fitness tracking platform to provide intelligent activity insights and personalised recommendations to users. This is also listed as a core backend skill on his resume."
    ]
  },

  // ── Frontend ───────────────────────────────
  frontend: {
    patterns: [/frontend|react|javascript|html|css|ui|web.?dev/i],
    responses: [
      "While Sarthak is primarily a backend developer, he has frontend skills in React, JavaScript, HTML, and CSS. His SkyCast weather app demonstrates his ability to build responsive, dynamic UIs with REST API integration."
    ]
  },

  // ── Projects (general) ─────────────────────
  projects: {
    patterns: [/project|built|build|portfolio|what.*(made|created|developed)/i],
    responses: [
      "Sarthak has built 2 notable projects:\n\n1️⃣ **ActivityIQ** — AI-Powered Fitness Tracking Platform built with Spring Boot microservices, RabbitMQ, Keycloak, Spring AI, PostgreSQL & MongoDB.\n\n2️⃣ **SkyCast** — Real-time weather forecasting web app with live REST API integration, dynamic UI, and full responsiveness.\n\nAsk me about either project for more details!"
    ]
  },

  // ── ActivityIQ ─────────────────────────────
  activityiq: {
    patterns: [/activityiq|activity.?iq|fitness|workout.?track/i],
    responses: [
      "**ActivityIQ** is Sarthak's flagship backend project — an AI-Powered Fitness Tracking Platform.\n\nKey highlights:\n→ Spring Boot microservices (User, Activity, AI services)\n→ Eureka Server for service discovery\n→ RabbitMQ for async inter-service communication\n→ Keycloak + OAuth2 + JWT for secure auth\n→ Spring AI for intelligent activity recommendations\n→ Dual database: PostgreSQL + MongoDB\n\nIt demonstrates real-world microservices design, security patterns, and AI integration."
    ]
  },

  // ── SkyCast ────────────────────────────────
  skycast: {
    patterns: [/skycast|weather|forecast/i],
    responses: [
      "**SkyCast** is Sarthak's weather forecasting web application.\n\nHighlights:\n→ Integrates open-source weather REST APIs for real-time data\n→ Displays temperature, humidity, and wind conditions dynamically\n→ Input validation & API error handling\n→ Fully responsive across mobile and desktop\n→ Built with JavaScript, HTML & CSS\n\nLive demo: https://msarthak03.github.io/Weather-forecasting-website/"
    ]
  },

  // ── Education ──────────────────────────────
  education: {
    patterns: [/educat|college|university|degree|cgpa|gpa|study|studies|academic|pdea/i],
    responses: [
      "Sarthak holds a **Bachelor of Engineering in Computer Science** from **PDEA College of Engineering, Manjiri, Pune, Maharashtra** (2020 – 2024) with a strong CGPA of **8.5 / 10**."
    ]
  },

  // ── Certifications ─────────────────────────
  certs: {
    patterns: [/certif|course|udemy|google|azure.?ai|mern|sap/i],
    responses: [
      "Sarthak has 4 certifications:\n\n🤖 Google Generative AI — Cognizant Technology\n☁️ Azure AI Foundation — Udemy\n⚛️ MERN Stack Development — Capabl\n🔷 SAP Developer — Code Unnati Program"
    ]
  },

  // ── Availability / Hire ────────────────────
  hire: {
    patterns: [/hire|available|open.to|opportunit|job|full.?time|freelance|remote|relocat|when.*(start|join)/i],
    responses: [
      "Yes! Sarthak is actively open to opportunities. He's available for:\n→ Full-time backend developer roles\n→ Freelance backend projects\n→ Interesting collaborations\n\nBased in Pune but open to remote roles. Reach out at sarthakmahajan894@gmail.com or call +91 7058547282!"
    ]
  },

  // ── Contact ────────────────────────────────
  contact: {
    patterns: [/contact|email|phone|reach|linkedin|github|connect|message/i],
    responses: [
      "Here's how to reach Sarthak:\n\n✉️ Email: sarthakmahajan894@gmail.com\n📱 Phone: +91 7058547282\n💼 LinkedIn: linkedin.com/in/sarthak-mahajan-748b57217\n🐙 GitHub: github.com/Msarthak03\n📍 Location: Pune, Maharashtra, India"
    ]
  },

  // ── Location ───────────────────────────────
  location: {
    patterns: [/locat|where|city|pune|maharashtra|india|based/i],
    responses: [
      "Sarthak is based in **Pune, Maharashtra, India**. He's open to remote opportunities as well as local roles in Pune."
    ]
  },

  // ── Salary / Compensation ──────────────────
  salary: {
    patterns: [/salary|compensation|ctc|pay|package|expect/i],
    responses: [
      "For compensation details, please reach out to Sarthak directly — he'd be happy to discuss expectations based on the role and company. 📧 sarthakmahajan894@gmail.com"
    ]
  },

  // ── Agile / Testing ────────────────────────
  agile: {
    patterns: [/agile|scrum|junit|mockito|test(ing)?|tdd|code.?review/i],
    responses: [
      "Sarthak has practical experience with Agile/Scrum methodology at Cognizant. He uses JUnit and Mockito for unit and integration testing, and participates in regular code reviews to maintain code quality in the Astellas Pharma project."
    ]
  },

  // ── Thanks ─────────────────────────────────
  thanks: {
    patterns: [/thank|thanks|appreciate|helpful|great|awesome|cool|nice/i],
    responses: [
      "You're welcome! 😊 Feel free to ask anything else about Sarthak.",
      "Happy to help! Let me know if you have more questions. 🚀",
      "Glad I could help! Don't hesitate to reach out to Sarthak directly if you'd like to connect. ✉️"
    ]
  },

  // ── Bye ────────────────────────────────────
  bye: {
    patterns: [/bye|goodbye|see you|cya|later|take care/i],
    responses: [
      "Goodbye! Feel free to come back anytime. You can also reach Sarthak at sarthakmahajan894@gmail.com 👋",
      "Take care! If you'd like to connect with Sarthak, drop him an email at sarthakmahajan894@gmail.com 😊"
    ]
  },

  // ── Fallback ───────────────────────────────
  fallback: {
    responses: [
      "I'm not sure about that, but I can tell you about Sarthak's skills, experience, projects, education, or how to contact him. What would you like to know?",
      "That's a bit outside what I know! Try asking about his tech stack, projects, work experience, or availability. 😊",
      "I don't have that specific info. Feel free to ask about his Java/Spring Boot skills, microservices projects, or reach out directly at sarthakmahajan894@gmail.com"
    ]
  }
};

// ─── Response engine ─────────────────────────
function getReply(userText) {
  const text = userText.toLowerCase().trim();

  // Check each KB category in priority order
  const priorityOrder = [
    'greet', 'bye', 'thanks',
    'activityiq', 'skycast',        // specific projects first
    'springai', 'kafka', 'rabbit',  // specific techs before general
    'java', 'microservices', 'security', 'devops', 'cloud',
    'database', 'frontend',
    'experience', 'skills',
    'education', 'certs',
    'hire', 'contact', 'location', 'salary',
    'agile', 'projects', 'who', 'summary'
  ];

  for (const key of priorityOrder) {
    const entry = KB[key];
    if (!entry.patterns) continue;
    for (const pattern of entry.patterns) {
      if (pattern.test(text)) {
        return pick(entry.responses);
      }
    }
  }

  return pick(KB.fallback.responses);
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ─── DOM helpers ─────────────────────────────
function appendMessage(role, text) {
  const msgEl = document.createElement('div');
  msgEl.className = `chat-msg ${role}`;

  const bubble = document.createElement('div');
  bubble.className = 'chat-bubble';

  // Render simple markdown-like bold (**text**) and newlines
  bubble.innerHTML = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>');

  msgEl.appendChild(bubble);
  messages.appendChild(msgEl);
  scrollToBottom();
}

let typingEl = null;
function showTyping() {
  typingEl = document.createElement('div');
  typingEl.className = 'chat-msg bot';
  typingEl.innerHTML = `<div class="typing-bubble"><span></span><span></span><span></span></div>`;
  messages.appendChild(typingEl);
  scrollToBottom();
}

function hideTyping() {
  if (typingEl) { typingEl.remove(); typingEl = null; }
}

function scrollToBottom() {
  requestAnimationFrame(() => { messages.scrollTop = messages.scrollHeight; });
}
