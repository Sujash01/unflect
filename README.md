# Unflect

> A modern digital studio focused on building thoughtful digital experiences, products, and systems.

Unflect is a creative development studio built around the idea that good digital work should feel intentional, useful, and memorable.

The Unflect website brings together the studio's services, selected work, process, story, and contact experience through a highly interactive and responsive interface.

---

## ✦ Features

- Modern responsive interface
- Interactive and animated UI
- Multi-page website architecture
- Services showcase
- Selected work / case studies
- Process overview
- About page
- Contact / enquiry system
- Responsive navigation
- Accessible interactions
- Reduced-motion support
- SEO-friendly page metadata
- Custom Unflect branding
- API-backed enquiry form
- Form validation
- Spam protection
- Analytics-ready architecture

---

## 🧭 Pages

| Route | Description |
|---|---|
| `/` | Main Unflect landing page |
| `/services` | Services offered by Unflect |
| `/services/[slug]` | Individual service pages |
| `/work` | Selected work and projects |
| `/work/[slug]` | Individual project pages |
| `/process` | Unflect's working process |
| `/about` | About Unflect |
| `/contact` | Contact and enquiry form |

---

## 🛠️ Tech Stack

- **Next.js**
- **React**
- **TypeScript**
- **Tailwind CSS**
- **Motion / Framer Motion**
- **Next.js App Router**
- **API Routes**
- **ESLint**

---

## 📁 Project Structure

```text
unflect-main/
├── public/
├── src/
│   ├── app/
│   │   ├── about/
│   │   ├── contact/
│   │   ├── process/
│   │   ├── services/
│   │   ├── work/
│   │   ├── api/
│   │   │   └── enquiries/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── components/
│   │   ├── brand/
│   │   └── ui/
│   │
│   ├── content/
│   └── lib/
│
├── public/
├── package.json
├── next.config.mjs
├── tsconfig.json
└── README.md
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Sujash01/unflect.git
cd unflect
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:3000
```

---

## 🧪 Development

Useful commands:

```bash
# Start development server
npm run dev

# Create production build
npm run build

# Start production server
npm run start

# Run linting
npm run lint
```

---

## 🔐 Environment Variables

If environment-specific configuration is required, create:

```text
.env.local
```

Keep sensitive credentials and API keys in environment variables.

**Never commit secrets, API keys, credentials, or other sensitive environment variables to GitHub.**

---

## 📬 Enquiries

The contact experience is connected to a backend enquiry endpoint.

The frontend submits enquiries through:

```text
POST /api/enquiries
```

The enquiry system includes request validation and protection against unwanted or spam submissions.

---

## 🎨 Design Philosophy

Unflect is designed around a balance of:

- Strong typography
- Intentional whitespace
- Editorial composition
- Motion and interaction
- Clear information hierarchy
- Restrained visual effects
- Responsive layouts
- Distinctive brand identity

Animation is used to reinforce the experience rather than distract from the content.

The goal is to create an interface that feels considered, expressive, and distinctly Unflect rather than like a generic template.

---

## 📱 Responsive

The interface is designed to work across:

- Desktop
- Laptop
- Tablet
- Mobile

Interactive elements and navigation adapt to smaller screens while maintaining the core Unflect experience.

---

## ♿ Accessibility

The project aims to provide:

- Keyboard-friendly interactions
- Semantic HTML
- Accessible navigation
- Appropriate focus states
- Reduced-motion support
- Responsive touch targets

Users who prefer reduced motion should receive a less animation-heavy experience.

---

## 🔄 Git Workflow

The repository uses Git for version control.

Typical workflow:

```bash
# Get the latest changes
git pull

# Make your changes

# Stage changes
git add .

# Commit changes
git commit -m "Describe your changes"

# Push changes
git push
```

For larger changes, use a feature branch:

```bash
git checkout -b feature/new-section
```

Then commit and push the branch.

---

## 📌 Project Status

**Active Development**

Unflect is continuously evolving as new experiences, interactions, projects, and capabilities are added.

---

## © Unflect

Built with intention.

**Unflect**
