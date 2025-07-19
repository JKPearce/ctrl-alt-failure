import { useState } from "react";

const DEFAULT_CEOS = [
  {
    id: "ceo_nullman",
    name: "Bob Nullman",
    tagline: "Nothing to lose, nothing to gain.",
    traits: ["balanced", "coffee snob"],
    effect: "Start with +1 energy",
  },
  {
    id: "ceo_blitz",
    name: "Sandra Blitz",
    tagline: "Speed is efficiency. Efficiency is life.",
    traits: ["fast resolver", "high pressure"],
    effect: "Agents start with +1 to all skills",
  },
];

const CompanyCreator = ({
  onNext,
  setPlayerName,
  setBusinessName,
  setSelectedCEO,
}) => {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [selected, setSelected] = useState(DEFAULT_CEOS[0]);

  const handleNext = () => {
    if (!name || !company) return;
    setPlayerName(name);
    setBusinessName(company);
    setSelectedCEO(selected);
    onNext();
  };

  return (
    <div className="p-8 max-w-xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">🧑‍💼 Create Your Company</h1>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Your Name (CEO)</span>
        </label>
        <input
          type="text"
          className="input input-bordered"
          placeholder="e.g., Bob Nullman"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Company Name</span>
        </label>
        <input
          type="text"
          className="input input-bordered"
          placeholder="e.g., UserError Inc."
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
      </div>

      <div>
        <p className="font-semibold mb-2">Choose Your CEO</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DEFAULT_CEOS.map((ceo) => (
            <div
              key={ceo.id}
              className={`card cursor-pointer transition ${
                selected.id === ceo.id
                  ? "bg-primary text-primary-content"
                  : "bg-base-200"
              }`}
              onClick={() => setSelected(ceo)}
            >
              <div className="card-body">
                <h2 className="card-title">{ceo.name}</h2>
                <p className="text-sm italic">{ceo.tagline}</p>
                <p className="text-xs mt-2 opacity-70">{ceo.effect}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-4 text-right">
        <button
          onClick={handleNext}
          className="btn btn-primary"
          disabled={!name || !company}
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default CompanyCreator;
