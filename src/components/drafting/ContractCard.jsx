"use client";

const ContractCard = ({ contract, selected, onSelect }) => (
  <label
    className={`card transition-all cursor-pointer hover:scale-[1.03] hover:opacity-95
      ${
        selected
          ? "ring-2 ring-primary bg-secondary text-secondary-content"
          : "bg-base-200"
      }`}
  >
    <input
      type="radio"
      name="contract"
      className="hidden"
      checked={selected}
      onChange={() => onSelect(contract)}
    />

    <div className="card-body space-y-1">
      <h2 className="card-title">{contract.name}</h2>
      <p className="text-sm">{contract.description}</p>

      <ul className="text-xs mt-2 space-y-1">
        <li>
          <strong>Goal:</strong> Resolve {contract.ticketsRequired} tickets
        </li>
        <li>
          <strong>Starting inbox:</strong> {contract.baseInboxSize}
        </li>
      </ul>
    </div>
  </label>
);

export default ContractCard;
