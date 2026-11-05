# BeeGuard PRO • Central Command & Admin Intelligence

A web administration dashboard built for the **BeeGuard** platform using **React 19**, **TypeScript**, and **Vite**.

Designed with an **Obsidian Luxury Dark Palette** with **Honey Gold (`#f5b82e`)**, **Amber (`#e59400`)**, **Emerald (`#10b981`)**, and **Ruby Quarantine (`#ef4444`)** accents.

---

## 🚀 Quick Start

From the `admin/` directory:

```bash
# 1. Install dependencies (already installed)
npm install

# 2. Run local development server
npm run dev

# 3. Build optimized production bundle
npm run build

# 4. Preview production build
npm run preview -- --port 3000
```

---

## 🎨 Premium Color Palette

| Token | Hex | Role |
|---|---|---|
| Obsidian Deep | `#0a0c10` | Main canvas background |
| Obsidian Card | `#12151d` | Surface elevation cards & panels |
| Obsidian Border | `rgba(255, 255, 255, 0.08)` | Subtle glowing glass borders |
| Honey Gold | `#f5b82e` | Primary brand accent & active states |
| Amber Dark | `#e59400` | Warning & gradient secondary accent |
| Emerald Healthy | `#10b981` | Healthy colony indicator & approved badges |
| Ruby Outbreak | `#ef4444` | Critical biosecurity quarantines & spore alerts |
| Cyan Intelligence | `#06b6d4` | AI neural network status & inspector pills |

---

## 📂 Architecture & Components

```
admin/
├── index.html                 # Entry HTML with Plus Jakarta Sans & JetBrains Mono
├── package.json               # React 19 + TypeScript + Vite + Lucide React
├── tsconfig.json              # Strict TS configuration
├── vite.config.ts             # Vite bundler configuration
└── src/
    ├── main.tsx               # React mount root
    ├── App.tsx                # Central state container, global search, and tab router
    ├── types.ts               # Core domain models (Hives, Scans, Users, Outbreaks, etc.)
    ├── mockData.ts            # Realistic Western Ghats apiculture dataset
    ├── index.css              # Custom styling, glow utilities, and scrollbars
    └── components/
        ├── Sidebar.tsx        # Navigation rail with quarantine badges & admin profile
        ├── Header.tsx         # Global search, live Firestore status, and broadcast trigger
        ├── OverviewTab.tsx    # Executive dashboard, 7-class epidemiological stats, detection feed
        ├── ScansTab.tsx       # AI CNN classifier results & microscopic image inspection modal
        ├── HivesTab.tsx       # Hive fleet health tracking, queen status & registration modal
        ├── MarketplaceTab.tsx # Equipment & queen bee moderation table
        ├── UsersTab.tsx       # Beekeeper directory with role promotion & account controls
        ├── OutbreaksTab.tsx   # Regional spore tracking & containment protocols
        ├── SettingsTab.tsx    # CNN threshold sliders, Qwen LLM settings & FCM push gateways
        └── AlertBroadcastModal.tsx # Emergency regional FCM push broadcast modal
```

---

## 🛡️ Biosecurity & 7 Monitored Bee Pathologies
1. **Healthy**
2. **Nosema** (*Nosema apis / ceranae*)
3. **Chalkbrood** (*Ascosphaera apis*)
4. **Varroa Mites** (*Varroa destructor*)
5. **European Foulbrood (EFB)** (*Melissococcus plutonius*)
6. **American Foulbrood (AFB)** (*Paenibacillus larvae*)
7. **Sacbrood Virus (SBV)**

