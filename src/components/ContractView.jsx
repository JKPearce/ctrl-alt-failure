export default function ContractView({ contract }) {
  console.log(contract);
  const {
    companyName,
    companyCulture,
    companyDescription,
    companyUserType,
    baseChaos,
    industry,
    ticketsRequired,
  } = contract;
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">{companyName}</h2>
      <p className="text-sm text-gray-500">{companyDescription}</p>
      <p className="text-sm text-gray-500">{companyCulture}</p>
      <p className="text-sm text-gray-500">{companyUserType}</p>
      <p className="text-sm text-gray-500">Base Chaos: {baseChaos}</p>
      <p className="text-sm text-gray-500">Industry: {industry}</p>
      <p className="text-sm text-gray-500">
        Tickets Required: {ticketsRequired}
      </p>
    </div>
  );
}
