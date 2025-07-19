import AgentPicker from "@/components/drafting/AgentPicker";
import ContractPicker from "@/components/drafting/ContractPicker";
import { useState } from "react";
import CompanyCreator from "./CompanyCreator";

function SetupScreen() {
  const [stage, setStage] = useState(1);
  const [playerName, setPlayerName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [selectedCEO, setSelectedCEO] = useState("");
  const [selectedContract, setSelectedContract] = useState(null);
  const [selectedAgents, setSelectedAgents] = useState([]);

  const next = () => setStage(stage + 1);
  const back = () => setStage(stage - 1);

  const startGame = () => {
    dispatch({
      type: GAME_ACTIONS.START_GAME,
      payload: {
        playerName,
        businessName,
        ceo: selectedCEO,
        contract: selectedContract,
        agents: selectedAgents,
      },
    });
  };

  return (
    <>
      {stage === 1 && (
        <CompanyCreator
          onNext={next}
          setPlayerName={setPlayerName}
          setBusinessName={setBusinessName}
          setSelectedCEO={setSelectedCEO}
        />
      )}
      {stage === 2 && (
        <ContractPicker
          onNext={next}
          setSelectedContract={setSelectedContract}
        />
      )}
      {stage === 3 && (
        <AgentPicker onNext={next} setSelectedAgents={setSelectedAgents} />
      )}
      {/* {stage === 2 && <ContractPicker ... />}
      {stage === 3 && <AgentPicker ... />}
      {stage === 4 && <SummaryConfirm onStart={startGame} />} */}
    </>
  );
}

export default SetupScreen;
