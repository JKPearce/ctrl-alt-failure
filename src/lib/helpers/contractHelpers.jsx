import contracts from "@/lib/data/contracts.json" assert { type: "json" };

/** Return the static definition for a given contract id */
export const getContract = (id) => contracts.find((c) => c.id === id);

/** Convenience: id of the first contract in the catalogue */
export const firstContractId = contracts[0]?.id;

/** The whole catalogue (useful for pickers & randomisation) */
export const contractList = contracts;
