import { useActivityLog } from "@/hooks/useActivityLog";
import { useAgent } from "@/hooks/useAgent";
import { useInbox } from "@/hooks/useInbox";
import useSound from "@/hooks/useSound";
import { GAME_TIME, formatGameTime } from "@/lib/helpers/gameHelpers";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import BarChartIcon from "@mui/icons-material/BarChartOutlined";
import MegaphoneIcon from "@mui/icons-material/CampaignOutlined";
import HandshakeIcon from "@mui/icons-material/HandshakeOutlined";
import InboxIcon from "@mui/icons-material/InboxOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import {
  AppBar,
  Box,
  Button,
  ButtonGroup,
  Chip,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  LinearProgress,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import ContractView from "./ContractView";
import InboxScreen from "./InboxScreen";
import ScreamFeed from "./ScreamFeed";
import Stats from "./Stats";

const drawerWidth = 280;

const navItems = [
  { label: "inbox", icon: <InboxIcon fontSize="small" /> },
  { label: "contract", icon: <HandshakeIcon fontSize="small" /> },
  { label: "stats", icon: <BarChartIcon fontSize="small" /> },
  { label: "screams", icon: <MegaphoneIcon fontSize="small" /> },
];

export default function Active({
  gameState,
  pauseTime,
  resumeTime,
  setTimeSpeed,
}) {
  const { assignTicketToAgent, deleteSpam } = useInbox();
  const { playPause, playResume } = useSound();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedNav, setSelectedNav] = useState("inbox");
  const [selectedAgentId, setSelectedAgentId] = useState(null);
  const [agentChats, setAgentChats] = useState({});
  const [chatDraft, setChatDraft] = useState("");
  const agentAutoReplies = useMemo(
    () => [
      "Got it, I’ll start now.",
      "Acknowledged. I’ll update you in 10 minutes.",
      "On it.",
      "I’ll prioritize this above my queue.",
      "Waiting on a log; will follow up shortly.",
      "Reproduced locally, drafting steps.",
      "Fix ready, testing now.",
      "Escalating to vendor for a license key.",
      "I need a few more minutes to verify.",
      "Pushing a hotfix.",
      "Queued behind another ticket; ETA 15 min.",
      "Stepping into a quick meeting; will resume right after.",
      "Blocker: missing database access.",
      "Resolved; monitoring for regressions.",
      "Can’t reproduce—can you share a clip?",
      "Deploying to staging now.",
      "Writing a root-cause summary.",
      "I’ll ping you once the metrics settle.",
    ],
    []
  );
  useAgent();
  useActivityLog();

  const agents = useMemo(
    () => Object.values(gameState.agents),
    [gameState.agents]
  );
  const selectedAgent = agents.find((a) => a.id === selectedAgentId) || null;

  const inboxItems = Object.values(gameState.inbox);
  const activeCount = inboxItems.filter((i) => i.activeItem).length;
  const inboxSize = gameState.inboxSize;
  const ticketsRequired = gameState.currentContract?.ticketsRequired || 0;
  const ticketsResolved = inboxItems.filter(
    (i) => i.messageType === "ticket" && i.resolved
  ).length;
  const chaos = gameState.chaos ?? 0;
  const dayProgressRaw = Math.max(
    0,
    Math.min(
      1,
      (gameState.gameTime.currentTick - GAME_TIME.DAY_START) /
        (GAME_TIME.DAY_END - GAME_TIME.DAY_START)
    )
  );
  const dayProgress = Math.round(dayProgressRaw * 100);
  const contractPercent = ticketsRequired
    ? Math.min(100, Math.round((ticketsResolved / ticketsRequired) * 100))
    : 0;

  const handleSendChat = useCallback(() => {
    if (!selectedAgent) return;
    const text = chatDraft.trim();
    if (!text) return;
    setAgentChats((prev) => ({
      ...prev,
      [selectedAgent.id]: [
        ...(prev[selectedAgent.id] || []),
        { from: "you", text, ts: Date.now() },
      ],
    }));
    setChatDraft("");
    const reply =
      agentAutoReplies[Math.floor(Math.random() * agentAutoReplies.length)];
    setTimeout(() => {
      setAgentChats((prev) => ({
        ...prev,
        [selectedAgent.id]: [
          ...(prev[selectedAgent.id] || []),
          { from: "agent", text: reply, ts: Date.now() },
        ],
      }));
    }, 450);
  }, [chatDraft, selectedAgent, agentAutoReplies]);

  // Sound on new screams/new inbox items
  const { playNewInbox, playNewScream } = useSound();
  const prevScreamsRef = useRef(gameState.screams.length);
  const prevActiveCountRef = useRef(activeCount);
  useEffect(() => {
    if (gameState.screams.length > prevScreamsRef.current) {
      playNewScream();
    }
    prevScreamsRef.current = gameState.screams.length;
  }, [gameState.screams.length, playNewScream]);

  useEffect(() => {
    if (activeCount > prevActiveCountRef.current) {
      playNewInbox();
    }
    prevActiveCountRef.current = activeCount;
  }, [activeCount, playNewInbox]);

  const drawer = (
    <Box sx={{ display: "flex", flexDirection: "column", height: 1 }}>
      <Toolbar />
      <Box sx={{ p: 2 }}>
        <Typography variant="overline" color="text.secondary">
          Navigation
        </Typography>
        <List>
          {navItems.map((item) => (
            <ListItemButton
              key={item.label}
              selected={selectedNav === item.label && !selectedAgentId}
              onClick={() => {
                setSelectedNav(item.label);
                setSelectedAgentId(null);
                setMobileOpen(false);
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
        <Divider sx={{ my: 1 }} />
        <Typography variant="overline" color="text.secondary">
          Agents
        </Typography>
        <List sx={{ maxHeight: 360, overflow: "auto" }}>
          {agents.map((agent) => (
            <ListItemButton
              key={agent.id}
              selected={selectedAgentId === agent.id}
              onClick={() => setSelectedAgentId(agent.id)}
            >
              <ListItemIcon>
                <img
                  src={agent.profileImage}
                  alt={agent.agentName}
                  width={28}
                  height={28}
                  style={{ borderRadius: 999 }}
                />
              </ListItemIcon>
              <ListItemText
                primary={agent.agentName}
                secondary={
                  <>
                    <Typography variant="caption" color="text.secondary">
                      {agent.currentAction}
                    </Typography>
                    {agent.assignedTicketId && (
                      <Box sx={{ mt: 0.5 }}>
                        <LinearProgress
                          variant="determinate"
                          value={Math.min(
                            100,
                            Math.round(
                              ((gameState.inbox[agent.assignedTicketId]
                                ?.resolveProgress || 0) /
                                Math.max(
                                  1,
                                  gameState.inbox[agent.assignedTicketId]
                                    ?.timeToResolve || 1
                                )) *
                                100
                            )
                          )}
                          sx={{ height: 6, borderRadius: 3 }}
                        />
                      </Box>
                    )}
                  </>
                }
                primaryTypographyProps={{ noWrap: true }}
                secondaryTypographyProps={{ component: "div" }}
              />
            </ListItemButton>
          ))}
        </List>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            sx={{ mr: 2, display: { md: "none" } }}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ mr: 2 }}>
            CTRL-ALT-FAIL
          </Typography>
          <Stack
            direction="row"
            spacing={1}
            sx={{ display: { xs: "none", lg: "flex" } }}
          >
            <Chip
              label={`Inbox ${activeCount}/${inboxSize}`}
              color="info"
              variant="outlined"
              size="small"
            />
            <Chip
              label={`Contract ${contractPercent}%`}
              color="primary"
              variant="outlined"
              size="small"
            />
            <Chip
              label={`Chaos ${chaos}`}
              color={
                chaos >= 70 ? "error" : chaos >= 40 ? "warning" : "success"
              }
              variant="outlined"
              size="small"
            />
            <Chip
              label={`Day ${gameState.dayNumber}`}
              color="secondary"
              variant="outlined"
              size="small"
            />
          </Stack>
          <Box sx={{ flex: 1 }} />
          <Stack direction="row" spacing={1.5} alignItems="center">
            <ButtonGroup variant="outlined" size="small">
              {gameState.gameTime.isPaused ? (
                <Button
                  onClick={() => {
                    playResume();
                    resumeTime();
                  }}
                  startIcon={<PlayArrowIcon />}
                >
                  Play
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    playPause();
                    pauseTime();
                  }}
                  startIcon={<PauseIcon />}
                >
                  Pause
                </Button>
              )}
              {[1, 2, 3].map((s) => (
                <Button
                  key={s}
                  variant={
                    gameState.gameTime.speed === s ? "contained" : "outlined"
                  }
                  onClick={() => setTimeSpeed(s)}
                >
                  {s}x
                </Button>
              ))}
            </ButtonGroup>
            {/* Compact meters */}
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ display: { xs: "none", md: "flex" }, minWidth: 220 }}
            >
              <Stack spacing={0.25} sx={{ width: 80 }}>
                <Typography variant="caption" color="text.secondary">
                  Inbox
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(
                    100,
                    Math.round((activeCount / Math.max(1, inboxSize)) * 100)
                  )}
                  sx={{ height: 4, borderRadius: 2 }}
                />
              </Stack>
              <Stack spacing={0.25} sx={{ width: 80 }}>
                <Typography variant="caption" color="text.secondary">
                  Chaos
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={chaos}
                  color={
                    chaos >= 70 ? "error" : chaos >= 40 ? "warning" : "success"
                  }
                  sx={{ height: 4, borderRadius: 2 }}
                />
              </Stack>
              <Stack spacing={0.25} sx={{ width: 80 }}>
                <Typography variant="caption" color="text.secondary">
                  Win
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={contractPercent}
                  color="primary"
                  sx={{ height: 4, borderRadius: 2 }}
                />
              </Stack>
            </Stack>
            <Stack
              direction="row"
              alignItems="center"
              spacing={0.5}
              sx={{ display: { xs: "none", sm: "flex" } }}
            >
              <AccessTimeIcon fontSize="small" />
              <Typography variant="body2">
                {formatGameTime(gameState.gameTime.currentTick)}
              </Typography>
            </Stack>
          </Stack>
        </Toolbar>
        <LinearProgress
          variant="determinate"
          value={dayProgress}
          sx={{ height: 2 }}
        />
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        aria-label="sidebar"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": { width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": { width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box component="main" sx={{ flexGrow: 1, p: 2 }}>
        <Toolbar />
        <Box sx={{ maxWidth: 1200, mx: "auto" }}>
          {selectedAgent ? (
            <Paper sx={{ p: 2 }}>
              <Stack direction="row" spacing={2} alignItems="center">
                {selectedAgent.profileImage ? (
                  <img
                    src={selectedAgent.profileImage}
                    alt={selectedAgent.agentName}
                    width={64}
                    height={64}
                    style={{ borderRadius: 12 }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: 2,
                      bgcolor: "action.hover",
                    }}
                  />
                )}
                <Box>
                  <Typography variant="h6">
                    {selectedAgent.agentName}
                  </Typography>
                  {(selectedAgent.nickName ||
                    selectedAgent.age ||
                    selectedAgent.gender) && (
                    <Typography variant="body2" color="text.secondary">
                      {selectedAgent.nickName || "Agent"} • Age{" "}
                      {selectedAgent.age ?? "?"} • {selectedAgent.gender || "?"}
                    </Typography>
                  )}
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    {selectedAgent.personalStatement || ""}
                  </Typography>
                </Box>
              </Stack>
              <Divider sx={{ my: 2 }} />
              <Stack direction={{ xs: "column", md: "row" }} spacing={4}>
                <Box>
                  <Typography variant="overline">Skills</Typography>
                  <Typography variant="body2">
                    Hardware: {selectedAgent.skills?.hardware ?? 0}
                  </Typography>
                  <Typography variant="body2">
                    Software: {selectedAgent.skills?.software ?? 0}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="overline">Personality</Typography>
                  {Array.isArray(selectedAgent.personality?.traits) && (
                    <Typography variant="body2">
                      Traits: {selectedAgent.personality.traits.join(", ")}
                    </Typography>
                  )}
                  {selectedAgent.personality?.favFood && (
                    <Typography variant="body2">
                      Fav Food: {selectedAgent.personality.favFood}
                    </Typography>
                  )}
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="overline">Current Work</Typography>
                  {selectedAgent.assignedTicketId ? (
                    <>
                      <Typography variant="body2" noWrap>
                        Ticket:{" "}
                        {gameState.inbox[selectedAgent.assignedTicketId]
                          ?.subject || "(unknown)"}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={Math.min(
                          100,
                          Math.round(
                            ((gameState.inbox[selectedAgent.assignedTicketId]
                              ?.resolveProgress || 0) /
                              Math.max(
                                1,
                                gameState.inbox[selectedAgent.assignedTicketId]
                                  ?.timeToResolve || 1
                              )) *
                              100
                          )
                        )}
                        sx={{ mt: 1, height: 8, borderRadius: 4 }}
                      />
                    </>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No active ticket
                    </Typography>
                  )}
                </Box>
              </Stack>
              <Divider sx={{ my: 2 }} />
              <Box>
                <Typography variant="overline">Chat</Typography>
                <Box
                  sx={{
                    mt: 1,
                    p: 1,
                    bgcolor: "background.paper",
                    borderRadius: 1,
                    maxHeight: 220,
                    overflow: "auto",
                  }}
                >
                  <Stack spacing={1}>
                    {(agentChats[selectedAgent.id] || []).map((m, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          alignSelf:
                            m.from === "you" ? "flex-end" : "flex-start",
                          maxWidth: "75%",
                        }}
                      >
                        <Paper variant="outlined" sx={{ px: 1.5, py: 0.75 }}>
                          <Typography variant="caption" color="text.secondary">
                            {m.from === "you" ? "You" : selectedAgent.agentName}
                          </Typography>
                          <Typography variant="body2">{m.text}</Typography>
                        </Paper>
                      </Box>
                    ))}
                    {(agentChats[selectedAgent.id] || []).length === 0 && (
                      <Typography variant="caption" color="text.secondary">
                        Start a conversation…
                      </Typography>
                    )}
                  </Stack>
                </Box>
                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                  <TextField
                    size="small"
                    fullWidth
                    placeholder={`Message ${selectedAgent.agentName}`}
                    value={chatDraft}
                    onChange={(e) => setChatDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSendChat();
                    }}
                  />
                  <Button variant="contained" onClick={handleSendChat}>
                    Send
                  </Button>
                </Stack>
              </Box>
            </Paper>
          ) : selectedNav === "inbox" ? (
            <InboxScreen
              gameState={gameState}
              assignTicketToAgent={assignTicketToAgent}
              deleteSpam={deleteSpam}
            />
          ) : selectedNav === "screams" ? (
            <ScreamFeed screams={gameState.screams} agents={gameState.agents} />
          ) : selectedNav === "contract" ? (
            <Paper sx={{ p: 2 }}>
              <ContractView contract={gameState.currentContract} />
            </Paper>
          ) : selectedNav === "stats" ? (
            <Stats gameState={gameState} />
          ) : (
            <Paper sx={{ p: 4, textAlign: "center" }}>
              <Typography variant="h6" color="text.secondary">
                Coming soon...
              </Typography>
            </Paper>
          )}
        </Box>
      </Box>
    </Box>
  );
}
