"use client";

import contractsData from "@/lib/data/contracts.json";
import { generateNewAgents } from "@/lib/helpers/agentHelpers";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PaidIcon from "@mui/icons-material/AttachMoneyOutlined";
import BusinessIcon from "@mui/icons-material/BusinessOutlined";
import CategoryIcon from "@mui/icons-material/CategoryOutlined";
import CheckIcon from "@mui/icons-material/CheckCircleOutline";
import FilterListIcon from "@mui/icons-material/FilterList";
import InboxIcon from "@mui/icons-material/InboxOutlined";
import InsightsIcon from "@mui/icons-material/InsightsOutlined";
import PeopleIcon from "@mui/icons-material/PeopleOutline";
import RefreshIcon from "@mui/icons-material/RefreshOutlined";
import WhatshotIcon from "@mui/icons-material/WhatshotOutlined";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  IconButton,
  LinearProgress,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  MenuItem,
  Paper,
  Stack,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";

const getRandomContracts = (contracts, n = 4) => {
  const shuffled = [...contracts].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
};

function SetupScreen({ startGame }) {
  const [contracts, setContracts] = useState([]);
  const [selectedContract, setSelectedContract] = useState("");
  const [agents, setAgents] = useState([]);
  const [step, setStep] = useState(0);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("recommended");

  // On mount, pick contracts and generate agents
  useEffect(() => {
    setContracts(getRandomContracts(contractsData, 4));
    setSelectedContract("");
    rerollAllAgents();
    // eslint-disable-next-line
  }, []);

  const rerollAllAgents = () => {
    const newAgents = Object.values(generateNewAgents(4));
    setAgents(newAgents);
  };

  const handleReroll = (idx) => {
    const newAgent = Object.values(generateNewAgents(1))[0];
    const newAgents = [...agents];
    newAgents[idx] = newAgent;
    setAgents(newAgents);
  };

  const readyToStart = selectedContract && agents.length === 4;

  const handleStart = () => {
    if (!readyToStart) return;
    startGame(
      contracts.find((c) => c.id === selectedContract),
      agents
    );
  };

  const getDifficulty = (c) => {
    if (c.baseChaos >= 12 || c.ticketsRequired >= 18) return "Nightmare";
    if (c.baseChaos >= 9 || c.ticketsRequired >= 16) return "Hard";
    if (c.baseChaos >= 7 || c.ticketsRequired >= 14) return "Medium";
    return "Chill";
  };

  const difficultyColor = (label) => {
    switch (label) {
      case "Nightmare":
        return "error";
      case "Hard":
        return "warning";
      case "Medium":
        return "info";
      default:
        return "success";
    }
  };

  const filteredAndSortedContracts = useMemo(() => {
    let list = contracts.filter((c) =>
      `${c.companyName} ${c.industry}`
        .toLowerCase()
        .includes(query.toLowerCase())
    );
    switch (sortBy) {
      case "reward":
        list = list.sort((a, b) => b.reward.cash - a.reward.cash);
        break;
      case "chaos":
        list = list.sort((a, b) => b.baseChaos - a.baseChaos);
        break;
      case "tickets":
        list = list.sort((a, b) => b.ticketsRequired - a.ticketsRequired);
        break;
      default:
        // recommended: balance reward vs difficulty
        list = list.sort(
          (a, b) =>
            b.reward.cash / (b.baseChaos + 1) -
            a.reward.cash / (a.baseChaos + 1)
        );
    }
    return list;
  }, [contracts, query, sortBy]);

  const selected = useMemo(
    () =>
      filteredAndSortedContracts.find((c) => c.id === selectedContract) || null,
    [filteredAndSortedContracts, selectedContract]
  );

  const renderContractList = () => (
    <Paper variant="outlined" sx={{ p: 1.5 }}>
      <Stack spacing={1.5}>
        <Stack direction="row" spacing={1} alignItems="center">
          <TextField
            size="small"
            fullWidth
            placeholder="Search contracts"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <TextField
            select
            size="small"
            label={
              <Stack direction="row" spacing={0.5} alignItems="center">
                <FilterListIcon fontSize="small" /> <span>Sort</span>
              </Stack>
            }
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="recommended">Recommended</MenuItem>
            <MenuItem value="reward">Highest Reward</MenuItem>
            <MenuItem value="chaos">Most Chaotic</MenuItem>
            <MenuItem value="tickets">Most Tickets</MenuItem>
          </TextField>
        </Stack>
        <Divider />
        <List dense disablePadding>
          {filteredAndSortedContracts.map((c) => {
            const diff = getDifficulty(c);
            const active = selectedContract === c.id;
            return (
              <ListItemButton
                key={c.id}
                selected={active}
                onClick={() => setSelectedContract(c.id)}
                sx={{ borderRadius: 1, mb: 0.5 }}
              >
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      bgcolor: "primary.main",
                      color: "primary.contrastText",
                    }}
                  >
                    {c.companyName.charAt(0)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  disableTypography
                  primary={
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography fontWeight={700} noWrap>
                        {c.companyName}
                      </Typography>
                      <Chip
                        size="small"
                        label={diff}
                        color={difficultyColor(diff)}
                      />
                    </Stack>
                  }
                  secondary={
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      flexWrap="wrap"
                    >
                      <Chip
                        size="small"
                        variant="outlined"
                        icon={<PaidIcon fontSize="small" />}
                        label={`$${c.reward.cash}`}
                      />
                      <Chip
                        size="small"
                        variant="outlined"
                        icon={<InboxIcon fontSize="small" />}
                        label={`${c.ticketsRequired} tickets`}
                      />
                      <Chip
                        size="small"
                        variant="outlined"
                        icon={<WhatshotIcon fontSize="small" />}
                        label={`Chaos ${c.baseChaos}`}
                      />
                    </Stack>
                  }
                />
              </ListItemButton>
            );
          })}
        </List>
        <Box>
          <Button
            size="small"
            startIcon={<RefreshIcon />}
            onClick={() => {
              const next = getRandomContracts(contractsData, 4);
              setContracts(next);
              if (!next.find((c) => c.id === selectedContract))
                setSelectedContract("");
            }}
          >
            Reroll Contracts
          </Button>
        </Box>
      </Stack>
    </Paper>
  );

  const renderContractDetails = () => {
    if (!selected) {
      return (
        <Paper variant="outlined" sx={{ p: 3, height: "100%" }}>
          <Stack
            alignItems="center"
            justifyContent="center"
            sx={{ height: 1 }}
            spacing={1}
          >
            <Typography variant="h6" fontWeight={800}>
              Pick a contract
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Select an option on the left to preview details
            </Typography>
          </Stack>
        </Paper>
      );
    }

    const diff = getDifficulty(selected);
    const chaosPct = Math.min(100, Math.round((selected.baseChaos / 15) * 100));
    const topSpawn = Object.entries(selected.spawnTable || {})
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return (
      <Paper variant="outlined" sx={{ p: 2 }}>
        <Stack spacing={1.5}>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            justifyContent="space-between"
          >
            <Stack spacing={0.25} sx={{ minWidth: 0 }}>
              <Typography variant="h6" fontWeight={800} noWrap>
                {selected.companyName}
              </Typography>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                flexWrap="wrap"
              >
                <Chip
                  size="small"
                  icon={<CategoryIcon fontSize="small" />}
                  label={selected.industry}
                />
                <Chip
                  size="small"
                  color={difficultyColor(diff)}
                  label={`Difficulty: ${diff}`}
                />
              </Stack>
            </Stack>
            <Tooltip title="Reward on contract completion">
              <Chip
                color="primary"
                icon={<PaidIcon />}
                label={`$${selected.reward.cash}`}
                sx={{ fontWeight: 700 }}
              />
            </Tooltip>
          </Stack>

          <Typography variant="body2" color="text.secondary">
            {selected.companyDescription}
          </Typography>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card variant="outlined">
                <CardContent>
                  <Stack spacing={0.5}>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <InboxIcon fontSize="small" />
                      <Typography variant="caption" color="text.secondary">
                        Tickets required
                      </Typography>
                    </Stack>
                    <Typography variant="h6" fontWeight={800}>
                      {selected.ticketsRequired}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card variant="outlined">
                <CardContent>
                  <Stack spacing={0.5}>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <InboxIcon fontSize="small" />
                      <Typography variant="caption" color="text.secondary">
                        Daily inbox
                      </Typography>
                    </Stack>
                    <Typography variant="h6" fontWeight={800}>
                      {selected.baseInboxSize}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card variant="outlined">
                <CardContent>
                  <Stack spacing={0.5}>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <WhatshotIcon fontSize="small" />
                      <Typography variant="caption" color="text.secondary">
                        Chaos
                      </Typography>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={chaosPct}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {selected.baseChaos} / 15
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card variant="outlined">
                <CardContent>
                  <Stack spacing={0.5}>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <PeopleIcon fontSize="small" />
                      <Typography variant="caption" color="text.secondary">
                        Users
                      </Typography>
                    </Stack>
                    <Typography variant="body2">
                      {selected.companyUserType}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Divider />
          <Stack spacing={0.5}>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <InsightsIcon fontSize="small" />
              <Typography variant="subtitle2" fontWeight={700}>
                Top incident mix
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {topSpawn.map(([key, weight]) => (
                <Chip
                  key={key}
                  size="small"
                  variant="outlined"
                  label={`${key.replaceAll("_", " ")} ${(weight * 100).toFixed(
                    0
                  )}%`}
                />
              ))}
            </Stack>
          </Stack>

          <Divider />
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            alignItems={{ sm: "center" }}
            justifyContent="space-between"
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <BusinessIcon fontSize="small" />
              <Typography variant="body2" color="text.secondary">
                {selected.companyCulture}
              </Typography>
            </Stack>
            <Button
              variant="contained"
              endIcon={<ArrowForwardIcon />}
              disabled={!selectedContract}
              onClick={() => setStep(1)}
            >
              Continue with {selected.companyName}
            </Button>
          </Stack>
        </Stack>
      </Paper>
    );
  };

  return (
    <Box
      sx={{
        maxWidth: 1100,
        mx: "auto",
        p: { xs: 2, md: 3 },
        minHeight: "calc(100vh - 64px)",
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ sm: "center" }}
        justifyContent="space-between"
        spacing={1}
        sx={{ mb: 2 }}
      >
        <Typography variant="h5" fontWeight={800}>
          New Run Setup
        </Typography>
        <Box sx={{ width: { xs: 1, sm: 420 } }}>
          <Stepper activeStep={step} alternativeLabel size="small">
            <Step>
              <StepLabel>Contract</StepLabel>
            </Step>
            <Step>
              <StepLabel>Agents</StepLabel>
            </Step>
          </Stepper>
        </Box>
      </Stack>

      {step === 0 && (
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid size={{ xs: 12, md: 5, lg: 4 }}>{renderContractList()}</Grid>
          <Grid size={{ xs: 12, md: 7, lg: 8 }}>{renderContractDetails()}</Grid>
        </Grid>
      )}

      {step === 1 && (
        <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            alignItems={{ sm: "center" }}
            justifyContent="space-between"
          >
            <Typography variant="subtitle2">Pick your starting team</Typography>
            <Stack direction="row" spacing={1}>
              <Chip
                size="small"
                variant="outlined"
                label={`Average HW ${Math.round(
                  agents.reduce((a, b) => a + b.skills.hardware, 0) /
                    Math.max(1, agents.length)
                )}`}
              />
              <Chip
                size="small"
                variant="outlined"
                label={`Average SW ${Math.round(
                  agents.reduce((a, b) => a + b.skills.software, 0) /
                    Math.max(1, agents.length)
                )}`}
              />
            </Stack>
          </Stack>
        </Paper>
      )}

      {step === 1 && (
        <>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ mb: 1 }}
          >
            <Typography variant="h6" fontWeight={800}>
              Starting Agent Roster
            </Typography>
            <IconButton
              size="small"
              onClick={rerollAllAgents}
              title="Reroll All"
            >
              <RefreshIcon fontSize="small" />
            </IconButton>
          </Stack>
          <Grid container spacing={2}>
            {agents.map((agent, idx) => {
              const total = agent.skills.hardware + agent.skills.software;
              const weakest = Math.min(
                ...agents.map((a) => a.skills.hardware + a.skills.software)
              );
              const isWeakest = total === weakest;
              return (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={agent.id}>
                  <Card variant="outlined" sx={{ height: 1 }}>
                    <CardContent>
                      <Stack alignItems="center" spacing={1}>
                        <Avatar
                          src={agent.profileImage}
                          alt={agent.agentName}
                          sx={{ width: 64, height: 64 }}
                        />
                        <Typography fontWeight={800} noWrap>
                          {agent.agentName}
                        </Typography>
                        <Stack direction="row" spacing={1}>
                          <Chip
                            size="small"
                            variant="outlined"
                            label={agent.personality}
                          />
                          <Chip
                            size="small"
                            variant="outlined"
                            label={agent.behavior}
                          />
                        </Stack>
                      </Stack>
                      <Stack spacing={1} sx={{ mt: 1 }}>
                        <Stack>
                          <Typography variant="caption" color="text.secondary">
                            Hardware
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={Math.min(100, agent.skills.hardware * 10)}
                            sx={{ height: 6, borderRadius: 3 }}
                          />
                        </Stack>
                        <Stack>
                          <Typography variant="caption" color="text.secondary">
                            Software
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={Math.min(100, agent.skills.software * 10)}
                            sx={{ height: 6, borderRadius: 3 }}
                          />
                        </Stack>
                      </Stack>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mt: 1, display: "block" }}
                      >
                        {agent.quirk}
                      </Typography>
                      <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                        <Button
                          fullWidth
                          size="small"
                          variant="outlined"
                          onClick={() => handleReroll(idx)}
                        >
                          Reroll
                        </Button>
                        {isWeakest && (
                          <Tooltip title="Weakest by total skill">
                            <Chip
                              size="small"
                              color="warning"
                              label="Weakest"
                            />
                          </Tooltip>
                        )}
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                if (agents.length === 0) return;
                const scores = agents.map((a, i) => ({
                  i,
                  s: a.skills.hardware + a.skills.software,
                }));
                const minIdx = scores.reduce(
                  (min, cur) => (cur.s < min.s ? cur : min),
                  scores[0]
                ).i;
                handleReroll(minIdx);
              }}
            >
              Reroll Weakest
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={rerollAllAgents}
              startIcon={<RefreshIcon />}
            >
              Surprise Me
            </Button>
          </Stack>
        </>
      )}

      <Paper
        sx={{
          position: "sticky",
          bottom: 0,
          mt: 3,
          p: 2,
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
        }}
        elevation={6}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
          alignItems={{ xs: "stretch", sm: "center" }}
        >
          <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
            {step === 0
              ? selectedContract
                ? "Good choice. Continue to assemble your team."
                : "Select a contract to continue."
              : readyToStart
              ? "All set. Your team is ready!"
              : "Reroll or adjust your roster."}
          </Typography>
          {step === 1 && (
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={rerollAllAgents}
              disabled={agents.length === 0}
            >
              Reroll All
            </Button>
          )}
          {step === 1 ? (
            <>
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={() => setStep(0)}
              >
                Back
              </Button>
              <Button
                variant="contained"
                size="large"
                startIcon={<CheckIcon />}
                disabled={!readyToStart}
                onClick={handleStart}
              >
                Start Game
              </Button>
            </>
          ) : (
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              disabled={!selectedContract}
              onClick={() => setStep(1)}
            >
              Next
            </Button>
          )}
        </Stack>
      </Paper>
    </Box>
  );
}

export default SetupScreen;
