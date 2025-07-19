# 🧨 CTRL ALT Failure

**CTRL ALT Failure** is a turn-based, roguelike resource management game where you play as the frazzled CEO of a chaotic Managed Service Provider (MSP). Hire agents, complete bizarre client contracts, and survive the relentless flood of help desk tickets, spam, and complaints.

> 🏢 Build your company.  
> 🤬 Manage stressed-out agents.  
> 📬 Don't let your inbox overflow... or it's game over.

## 🎮 Core Gameplay Loop

- **Turn-Based Simulation:** Each turn, you get a fixed number of **Energy Points (EP)**.
- **Spend EP** to assign tickets, resolve complaints, delete spam, or help your agents.
- **Contracts** define the type of chaos you'll face, with scaling difficulty.
- **Inbox Management** is key — let it fill up, and you lose.

No traditional win-state. Your goal: survive as long as possible and complete as many contracts as you can.

## 🧩 Game Systems

### 📋 Contracts

Contracts change:

- Ticket tone (e.g. Cyberpunk startup, Fantasy RPG company)
- Game modifiers (+1 spam/complaint per turn, dangerous tickets)
- Win conditions (e.g. resolve X tickets)

Each completed contract grants rewards and escalates difficulty.

### 🔋 Energy Points (EP)

- Actions cost EP (assigning tickets, deleting spam, etc.)
- Max EP starts at 3 but can be upgraded
- Smart EP usage = efficient company survival

### 🧠 Agents

- Come with random traits, moods, and skills (Hardware, Software, People)
- Progress through tickets passively
- Can be advised (LLM-prompted interactions planned)

### 📬 Inbox Pressure

- Your inbox is the fail state
- Message types include:
  - **Tickets** (assign to agent)
  - **Spam** (delete manually)
  - **Complaints** (respond with EP)
  - **Urgent** (must be resolved fast)
  - **Events** (multi-choice encounters)

### 🔄 Progression

After each contract:

- Choose from powerful upgrades
- Hire quirky new agents (Common → Rare → Legendary)
- Face a harder contract

Eventually, the global inbox pressure overwhelms you. That's the run.

## 🧪 Status

> 🚧 Early Development (Pre-MVP)  
> The core game loop, inbox handling, and agent assignment are in progress. LLM ticket generation and progression systems coming next.

## 🧠 Tech Stack

- **ReactJS** (Next.js)
- **Tailwind CSS + daisyUI 5**
- **OpenAI API** for procedurally generated ticket content
- **Modular design** with hooks and context for extensibility

## 🗺️ Roadmap

- [x] Ticket assignment & agent action flow
- [ ] LLM ticket generation system
- [ ] Contract modifiers & progression screen
- [ ] Relic system (future)
- [ ] Meta-progression (roguelite layer)

## 🔥 Inspirations

Think:  
_Slay the Spire_ meets _Two Point Hospital_, but you're running a doomed IT startup with weird coworkers and catastrophic deadlines.

## 📦 Installation

```bash
git clone git@github.com:JKPearce/ctrl-alt-failure.git
cd ctrl-alt-failure
npm install
npm run dev
```

## 🙃 License

This is a hobby project, released under [MIT](LICENSE).

## ✨ Credits

Created by [@JKPearce](https://github.com/JKPearce)  
Design fueled by espresso, error messages, and accidental dark patterns.
