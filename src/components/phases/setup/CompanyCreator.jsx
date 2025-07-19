"use client";

const DEFAULT_FOUNDERS = [
  {
    id: "founder_nullman",
    name: "Bob Nullman",
    tagline: "Nothing to lose, nothing to gain.",
    traits: ["balanced", "coffee snob"],
    effect: "Start with +1 energy",
  },
  {
    id: "founder_blitz",
    name: "Sandra Blitz",
    tagline: "Speed is efficiency. Efficiency is life.",
    traits: ["fast resolver", "high pressure"],
    effect: "Agents start with +1 to all skills",
  },
];

const CompanyCreator = ({
  setBusinessName,
  setSelectedFounder,
  businessName,
  selectedFounder,
}) => {
  return (
    <div className="space-y-6">
      <div className="form-control">
        <label className="label">
          <span className="label-text font-semibold">Company Name</span>
        </label>
        <input
          type="text"
          className="input input-bordered"
          placeholder="e.g., UserError Inc."
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
        />
      </div>

      <div>
        <p className="font-semibold mb-2">Choose Your Founder</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DEFAULT_FOUNDERS.map((founder) => {
            const isSelected = selectedFounder?.id === founder.id;
            return (
              <div
                key={founder.id}
                className={`card cursor-pointer transition hover:scale-[1.02] ${
                  isSelected
                    ? "bg-primary text-primary-content shadow-lg"
                    : "bg-base-100"
                }`}
                onClick={() => setSelectedFounder(founder)}
              >
                <div className="card-body space-y-1">
                  <h2 className="card-title">{founder.name}</h2>
                  <p className="italic text-sm">{founder.tagline}</p>
                  <div className="text-xs opacity-80">{founder.effect}</div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {founder.traits.map((trait) => (
                      <span
                        key={trait}
                        className={`badge ${
                          isSelected ? "badge-accent" : "badge-outline"
                        } text-xs`}
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CompanyCreator;
