"use client";

const DEFAULT_CONTRACTS = [
  {
    id: "crusttech",
    name: "CrustTech Ltd.",
    theme: "Cyberpunk Office",
    modifier: "+1 spam per turn",
    goal: "Resolve 12 tickets",
    flavor: "Where neon lights blind you and so does the bureaucracy.",
  },
  {
    id: "harmonycoop",
    name: "Harmony Co-op",
    theme: "Wellness Startup",
    modifier: "+1 complaint per turn",
    goal: "Resolve 15 tickets",
    flavor: "They burn sage, not servers. Too bad the network’s always down.",
  },
  {
    id: "dungeoninc",
    name: "Dungeon, Inc.",
    theme: "Fantasy RPG Company",
    modifier: "25% chance of dangerous ticket",
    goal: "Resolve 20 tickets",
    flavor: "When dragons eat the routers, you're the chosen one.",
  },
];

const ContractPicker = ({
  value,
  onChange,
  title = "📑 Choose a Starting Contract",
  description = "Each contract changes how your run plays — with unique ticket styles and gameplay modifiers.",
  options = DEFAULT_CONTRACTS,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-sm opacity-70">{description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {options.map((contract) => {
          const isSelected = value?.id === contract.id;
          return (
            <div
              key={contract.id}
              className={`card cursor-pointer transition shadow-sm hover:scale-[1.01] ${
                isSelected
                  ? "bg-secondary text-secondary-content"
                  : "bg-base-200"
              }`}
              onClick={() => onChange(contract)}
            >
              <div className="card-body space-y-1">
                <h2 className="card-title">{contract.name}</h2>
                <p className="text-sm italic">{contract.theme}</p>
                <p className="text-sm">{contract.flavor}</p>
                <ul className="text-xs mt-2 space-y-1">
                  <li>
                    <strong>Modifier:</strong> {contract.modifier}
                  </li>
                  <li>
                    <strong>Goal:</strong> {contract.goal}
                  </li>
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ContractPicker;
