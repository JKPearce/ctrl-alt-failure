"use client";

import { contractList } from "@/lib/helpers/contractHelpers";
import ContractCard from "./ContractCard";

const ContractPicker = ({
  value,
  onChange,
  title = "📑 Choose a Starting Contract",
  description = "Each contract tweaks your run with unique goals and inbox sizes.",
}) => {
  return (
    <div className="space-y-4">
      {/* Heading */}
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-sm opacity-70">{description}</p>
      </div>

      {/* Card grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {contractList.map((contract) => (
          <ContractCard
            key={contract.id}
            contract={contract}
            selected={value?.id === contract.id}
            onSelect={onChange}
          />
        ))}
      </div>
    </div>
  );
};

export default ContractPicker;
