export const TICKET_TEMPLATES = [
  {
    ticketType: "hardware",
    sender: "Mary Simmons",
    subject: "Monitor won’t turn on",
    body: "Hi IT,\nMy screen is black but the power light is on...\nThanks!",
    difficulty: 4,
    resolutionNotes:
      "Confirmed it was plugged in (because apparently that’s not assumed anymore), reseated cables, swapped in a known-good monitor to rule out drama, replaced the flaky power brick. Told user next time to try 'turn it off and on' before escalating.",
  },
  {
    ticketType: "software",
    sender: "John Patel",
    subject: "Cannot save files in Word",
    body: "I keep getting an error code 0x887….",
    difficulty: 3,
    resolutionNotes:
      "Cleared temp/autosave junk, disabled the dozen unnecessary add-ins, repaired Office install, verified permissions. Explained gently that saving to a shaky network share without checking it was mounted will always bite you in the ass.",
  },
  // new entries
  {
    ticketType: "hardware",
    sender: "Alice “No-Scope” Nguyen",
    subject: "USB port swallowed my flash drive",
    body: "Hey team,\nI stuck my USB in but it won’t eject and I can’t reach it… Pls help!\n– Alice",
    difficulty: 6,
    resolutionNotes:
      "Powered down the machine, extracted the stuck USB with the correct tool (no, you can’t just yank it), inspected the port, flagged it for future replacement. Gave the standard passive reminder about not jamming things like they’re trying to plug in a black hole.",
  },
  {
    ticketType: "hardware",
    sender: "Bob “Bluetooth” Brown",
    subject: "Wireless mouse only works upside down",
    body: "IT, my mouse only clicks if I hold it upside down. What sorcery is this?\nCheers!",
    difficulty: 5,
    resolutionNotes:
      "Replaced batteries, cleaned the sensor (because dust is forever), tested on a normal surface, updated firmware. Sensor was misaligned/garbled—issued a replacement and silently questioned how the original survived this long.",
  },
  {
    ticketType: "hardware",
    sender: "Charlie Chip",
    subject: "Headset mic keeps squawking",
    body: "Hello,\nEvery time I speak the mic makes a chicken-like squawk. Not helpful on calls.\nThanks!",
    difficulty: 7,
    resolutionNotes:
      "Swapped ports, updated drivers, killed off audio enhancement junk. Traced the interference to a rogue wireless device near their desk, swapped them to a backup headset. Told them the mic isn’t auditioning for a farm animal choir anymore.",
  },
  {
    ticketType: "hardware",
    sender: "Ima Buffer",
    subject: "Printer jammed on last sheet… again",
    body: "IT, the printer ate my TPS report and won’t spit it back out. Please rescue it.\n– Baffled Buffer",
    difficulty: 4,
    resolutionNotes:
      "Cleared the jam, cleaned rollers, reset the device, applied firmware update. Gave the ‘how to load paper properly’ talk with the kind of tone reserved for explaining breathing—again.",
  },
  {
    ticketType: "hardware",
    sender: "Diana Disk",
    subject: "PC beeping seven times on startup",
    body: "Hi,\nMy computer beeps 7 times and then goes dark. Do I need a new motherboard?\n– Diana",
    difficulty: 8,
    resolutionNotes:
      "Looked up beep codes (7 = CPU/microcode exception), reseated CPU/RAM, inspected for bent pins, confirmed hardware failure, replaced the motherboard. Told user the PC wasn’t haunted, just dying slowly and dramatically.",
  },
  {
    ticketType: "software",
    sender: "Elon Putsch",
    subject: "Excel froze on cell A1 forever",
    body: "Greetings,\nTyped ‘1+1’, hit enter, and Excel has been staring at me for 10 minutes.\nPlease advise.",
    difficulty: 2,
    resolutionNotes:
      "Forced Excel to quit, nuked cache, disabled extension circus, applied updates, recreated the sheet. Explained that '1+1' isn't supposed to trigger a system existential crisis, but hey—fixed.",
  },
  {
    ticketType: "software",
    sender: "Fiona Firewall",
    subject: "Can’t access internet—error 403",
    body: "Hey,\nSuddenly every site says 403 forbidden. Did I do something naughty online?\nThanks!",
    difficulty: 6,
    resolutionNotes:
      "Cleared browser cache, checked proxy/firewall rules, flushed DNS, discovered expired auth token. Reauthenticated user and gently reminded them that sessions don’t last forever and blaming the internet won’t fix it faster.",
  },
  {
    ticketType: "software",
    sender: "Gregory Glitch",
    subject: "VPN disconnects whenever I blink",
    body: "IT,\nMy VPN drops connection if I look away for more than 2 seconds. Help?\n– Greg",
    difficulty: 7,
    resolutionNotes:
      "Dug through logs, disabled power-saving on network adapter (because apparently the adapter needs naps), tweaked keepalive settings. Fixed by turning off the 'sleep when you blink' behavior. Told him VPN isn’t sentient—just overzealous about connection drops.",
  },
  {
    ticketType: "software",
    sender: "Hannah Hotkey",
    subject: "Shortcut Ctrl+Alt+Delete opened fan controls",
    body: "Hello,\nI pressed Ctrl+Alt+Del and my fans started spinning at 9000 RPM. That’s new…\n– Hannah",
    difficulty: 5,
    resolutionNotes:
      "Found a hotkey conflict with the system utility, reset fan profile, updated the control software, disabled the rogue mapping. Reminded user that Ctrl+Alt+Del isn’t a secret overclock spell (but sure, we’ll call it magic for now).",
  },
];

export const COMPLAINT_TEMPLATES = [
  {
    sender: "Rebecca Wong",
    subject: "Issue fixed, but support was condescending",
    body: `To IT Management,
The VPN issue is resolved, so technically you did your job. However, the agent spent the entire call making me feel like I personally broke the internet. Comments like "Did you even try flushing the DNS?" and "It's not hard, just follow the steps" came with zero patience or explanation. I left feeling embarrassed, not empowered.`,
  },
  {
    sender: "Marcus Li",
    subject: "Thanks for the fix; your tone needed a patch",
    body: `Dear Support,
My email sync is back, so that part’s done. The problem was how the agent talked to me—"Next time don't flood the system before trying the obvious" was delivered like I had sabotaged infrastructure. I get burnout exists, but taking it out on users makes a routine help request feel like a reprimand.`,
  },
  {
    sender: "Sophie Grant",
    subject: "Resolved, yet felt lectured",
    body: `IT Leadership,
The application crash was fixed, thank you. The interaction, however, felt like a scolding. I was repeatedly told things like "You installed that unsupported plugin, didn't you?" and given a guilt trip instead of clear guidance. The solution worked, but the delivery discouraged me from asking for help next time.`,
  },
  {
    sender: "Jeremy Brooks",
    subject: "Problem solved, attitude not acceptable",
    body: `To Whom It May Concern,
My workstation is functioning again, so credit where it's due. That said, being told "You should've checked the cable before calling" multiple times came off as accusatory and dismissive. I understand workloads are heavy, but making a user feel stupid while fixing something reflects poorly on service culture.`,
  },
  {
    sender: "Nia Patel",
    subject: "Printer jam cleared, but interaction felt punitive",
    body: `Hello,
The printer jam was cleared and it works now, but the agent kept saying "You keep doing this wrong" in a tone that felt more punishing than helpful. Suggestions were framed as blame instead of instruction. The fix was fine; the way it was communicated made me apologize to them instead of feeling supported.`,
  },
  {
    sender: "Carlos Mendez",
    subject: "Support made me feel dumb despite resolution",
    body: `IT Team,
Cache cleared, system responsive, issue resolved—so yes, fine. What I'm complaining about is the delivery. Being told "Why didn't you just clear your cache like a normal person?" with sarcasm and no explanation was unnecessary. A bit of patience would have made the same fix feel like actual support.`,
  },
  {
    sender: "Tara O'Neill",
    subject: "Fixed, but felt publicly shamed",
    body: `Dear IT,
The app crash was sorted, but I left the session feeling publicly shamed. The agent opened with "I told you this would happen if you installed that junk" and repeatedly cut me off with "Just do this, trust me." I needed help, not a performance review.`,
  },
  {
    sender: "Devon Harper",
    subject: "Ticket closed, emotional damage remains",
    body: `Support,
Issue: resolved. Experience: not great. The agent responded in one-word bursts, offered no explanation of what was done, and ended the session with "Glad it's working now, next time read the FAQ." I felt like I had to beg for respect while being treated like a checkbox.`,
  },
  {
    sender: "Lena Brooks",
    subject: "Efficient fix, zero empathy",
    body: `To IT Management,
My license issue was resolved quickly, but the agent was visibly rushed and kept saying "Hurry up, I don’t have all day" while walking me through steps. I was made to feel like a burden. Efficiency is fine; a little basic courtesy would’ve made it feel like support instead of throughput.`,
  },
  {
    sender: "Omar Farouk",
    subject: "Resolved, but dismissive attitude unacceptable",
    body: `Hi,
The network dropouts are gone, which is good. The agent, however, was dismissive—cut me off, used phrases like "This is basic stuff," and closed the ticket with no context. I left knowing what was done but not why, and feeling like I shouldn’t bother next time. That’s a problem for a support system.`,
  },
];

export const SPAM_TEMPLATES = [
  {
    sender: "System Admin",
    subject: "URGENT: Your mailbox is full",
    body: "Click here to upgrade your storage ⬇️",
  },
  // new entries
  {
    sender: "Promotional Panda",
    subject: "You’ve won a free coffee!",
    body: "Claim your free latte 🐼☕ before midnight—no catch!",
  },
  {
    sender: "Dr. Malware",
    subject: "Your antivirus subscription expired",
    body: "Renew now or risk losing all your data! 🔒",
  },
  {
    sender: "Crypto King",
    subject: "Double your BTC today",
    body: "Send 0.1 BTC and get 0.2 BTC back in 5 minutes! 🚀",
  },
  {
    sender: "Lottery Larry",
    subject: "Congratulations, you’ve won $1,000,000!",
    body: "Provide your bank details to claim your prize now.",
  },
  {
    sender: "Nigerian Prince",
    subject: "URGENT: Transfer inheritance",
    body: "Help me move $5,000,000 out of the country. Full reimbursement promised.",
  },
  {
    sender: "Discount Dan",
    subject: "90% off all IT equipment",
    body: "Limited-time offer on servers, routers, and more—click here!",
  },
  {
    sender: "Freebie Fiona",
    subject: "Get a free iPhone 17 today",
    body: "No surveys, no catch. Simply click & fill in your address.",
  },
];
