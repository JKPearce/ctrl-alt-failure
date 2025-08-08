"use client";

import contractsData from "@/lib/data/contracts.json";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

const getRandomContracts = (contracts, n = 3) => {
  const shuffled = [...contracts].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
};

const ContractComplete = ({ startNewContract, gameState }) => {
  const [contracts, setContracts] = useState([]);
  const [selectedContract, setSelectedContract] = useState("");

  // Safety guard → don't render until state is populated
  if (!gameState?.currentContract?.id) return null;

  const { id, ticketsResolved, ticketsRequired } = gameState.currentContract;
  const completedContract = contractsData.find((c) => c.id === id);

  // Fallback if contract ID went missing (shouldn't happen)
  if (!completedContract) return null;

  const percent = Math.min(
    100,
    Math.round((ticketsResolved / ticketsRequired) * 100)
  );

  // Load random contracts on mount
  useEffect(() => {
    setContracts(getRandomContracts(contractsData, 3));
  }, []);

  /* ----- Handlers ----- */
  const handleContractSelect = (contractId) => {
    setSelectedContract(contractId);
  };

  const handleStartNewContract = () => {
    if (!selectedContract) return;
    const contract = contracts.find((c) => c.id === selectedContract);
    if (contract) {
      startNewContract(contract);
    }
  };

  const handleMainMenu = () => {
    // This will need to be implemented in useGame
    window.location.reload(); // Temporary solution
  };

  const readyToStart = selectedContract !== "";

  /* ----- UI ----- */
  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "rgba(0,0,0,0.5)",
        p: 2,
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 1000,
          maxHeight: "90vh",
          overflow: "auto",
        }}
      >
        <CardContent>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            🎉 Contract Complete!
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" fontWeight={700} gutterBottom>
              Completed: {completedContract.name}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={percent}
              sx={{ height: 8, borderRadius: 2, mb: 0.5 }}
            />
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ float: "right" }}
            >
              {ticketsResolved}/{ticketsRequired} tickets resolved
            </Typography>
          </Box>
          <Typography variant="h6" fontWeight={700} sx={{ mt: 2, mb: 1 }}>
            Choose Your Next Contract
          </Typography>
          <Grid container spacing={2}>
            {contracts.map((contract) => (
              <Grid item xs={12} md={4} key={contract.id}>
                <Card
                  variant={
                    selectedContract === contract.id ? "outlined" : undefined
                  }
                  sx={{
                    borderColor:
                      selectedContract === contract.id
                        ? "primary.main"
                        : undefined,
                  }}
                >
                  <CardActionArea
                    onClick={() => handleContractSelect(contract.id)}
                  >
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight={700}>
                        {contract.companyName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {contract.industry}
                      </Typography>
                      <Grid container spacing={1} sx={{ mt: 1 }}>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary">
                            Tickets Required
                          </Typography>
                          <Typography fontWeight={600}>
                            {contract.ticketsRequired}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary">
                            Reward
                          </Typography>
                          <Typography fontWeight={600}>
                            ${contract.reward.cash}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary">
                            Chaos
                          </Typography>
                          <Typography fontWeight={600}>
                            {contract.baseChaos}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary">
                            Daily Tickets
                          </Typography>
                          <Typography fontWeight={600}>
                            {contract.baseInboxSize}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Stack
            direction="row"
            justifyContent="flex-end"
            spacing={2}
            sx={{ mt: 2 }}
          >
            <Button variant="outlined" onClick={handleMainMenu}>
              Main Menu
            </Button>
            <Button
              variant="contained"
              onClick={handleStartNewContract}
              disabled={!readyToStart}
            >
              {readyToStart
                ? "🚀 Start New Contract"
                : "Select a contract to continue"}
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ContractComplete;
