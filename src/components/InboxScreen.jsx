import useSound from "@/hooks/useSound";
import { formatGameTime } from "@/lib/helpers/gameHelpers";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import SearchIcon from "@mui/icons-material/Search";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  InputAdornment,
  ListItemButton,
  Paper,
  Snackbar,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { FixedSizeList as VirtualList } from "react-window";

const FILTERS = [
  { label: "All", value: "all" },
  { label: "Tickets", value: "ticket" },
  { label: "Spam", value: "spam" },
  { label: "Complaints", value: "complaint" },
];

export default function InboxScreen({
  gameState,
  assignTicketToAgent,
  deleteSpam,
}) {
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const { playAssign, playDelete } = useSound();
  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const searchRef = useRef(null);

  const agents = useMemo(
    () => Object.values(gameState.agents),
    [gameState.agents]
  );
  const items = useMemo(
    () => Object.values(gameState.inbox).filter((i) => i.activeItem),
    [gameState.inbox]
  );

  const counts = useMemo(() => {
    const base = { all: 0, ticket: 0, spam: 0, complaint: 0 };
    for (const it of items) {
      base.all += 1;
      base[it.messageType] += 1;
    }
    return base;
  }, [items]);

  const filtered = useMemo(() => {
    let rows = items;
    if (filter !== "all") rows = rows.filter((i) => i.messageType === filter);
    if (query.trim()) {
      const q = query.toLowerCase();
      rows = rows.filter((i) => {
        const sender = (i.sender ?? "").toString().toLowerCase();
        const subject = (i.subject ?? "").toString().toLowerCase();
        const body = (i.body ?? "").toString().toLowerCase();
        return sender.includes(q) || subject.includes(q) || body.includes(q);
      });
    }
    return rows.sort((a, b) => b.receivedTime - a.receivedTime);
  }, [items, filter, query]);

  const selected = filtered.find((i) => i.id === selectedId) || null;

  useEffect(() => {
    // Clear selection if it no longer exists under current filter/query
    if (selectedId && !filtered.some((r) => r.id === selectedId)) {
      setSelectedId(null);
    }
  }, [filtered, selectedId]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "/") {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (
        e.key.toLowerCase() === "b" &&
        selected &&
        selected.messageType === "ticket"
      ) {
        const best = getBestAgentId(selected);
        if (best) {
          playAssign();
          assignTicketToAgent(selected.id, best);
          setSnack({
            open: true,
            message: "Assigned best agent",
            severity: "success",
          });
        }
      }
      if (
        (e.key === "Delete" || e.key === "Backspace") &&
        selected &&
        selected.messageType !== "ticket"
      ) {
        playDelete();
        deleteSpam(selected.id);
        setSnack({ open: true, message: "Deleted", severity: "warning" });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, assignTicketToAgent, deleteSpam, playAssign, playDelete]);

  const getBestAgentId = (ticket) => {
    const available = agents.filter((a) => !a.assignedTicketId);
    if (available.length === 0) return null;
    const sorted = available.sort(
      (a, b) => b.skills[ticket.ticketType] - a.skills[ticket.ticketType]
    );
    return sorted[0]?.id || null;
  };

  const ROW_HEIGHT = 76;

  const renderRow = ({ index, style }) => {
    const item = filtered[index] || {};
    const isSelected = selectedId === item.id;
    const isTicket = item.messageType === "ticket";
    return (
      <Box style={style} key={item.id}>
        <ListItemButton
          onClick={() => setSelectedId(item.id)}
          selected={isSelected}
          sx={{
            mx: 1,
            my: 0.5,
            borderRadius: 1,
            py: 1,
            pr: 1,
            bgcolor: isSelected ? "action.selected" : undefined,
          }}
        >
          <Stack
            direction="row"
            spacing={1.5}
            alignItems="flex-start"
            sx={{ width: 1 }}
          >
            <Chip
              size="small"
              color={
                isTicket
                  ? "primary"
                  : item.messageType === "complaint"
                  ? "warning"
                  : "default"
              }
              variant={isTicket ? "filled" : "outlined"}
              label={
                isTicket
                  ? "Ticket"
                  : item.messageType === "spam"
                  ? "Spam"
                  : "Complaint"
              }
            />
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ minWidth: 0 }}
              >
                <Typography variant="body2" noWrap fontWeight={600}>
                  {item.sender || "Unknown"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  —
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  noWrap
                  sx={{ flex: 1 }}
                >
                  {item.subject || "(no subject)"}
                </Typography>
              </Stack>
              <Typography variant="caption" color="text.secondary" noWrap>
                {item.body || ""}
              </Typography>
            </Box>
            <Stack
              direction="row"
              spacing={0.5}
              alignItems="center"
              color="text.secondary"
            >
              <Typography variant="caption">
                Day {item.receivedDay ?? "?"}
              </Typography>
              <Typography variant="caption">•</Typography>
              <Typography variant="caption">
                {formatGameTime(item.receivedTime ?? 0)}
              </Typography>
              <ChevronRightIcon fontSize="small" />
            </Stack>
            {isTicket && (
              <Button
                size="small"
                variant="outlined"
                sx={{ ml: 1, display: { xs: "none", lg: "inline-flex" } }}
                onClick={(e) => {
                  e.stopPropagation();
                  const best = getBestAgentId(item);
                  if (!best) return;
                  playAssign();
                  assignTicketToAgent(item.id, best);
                  setSnack({
                    open: true,
                    message: "Assigned best agent",
                    severity: "success",
                  });
                }}
              >
                Assign
              </Button>
            )}
          </Stack>
        </ListItemButton>
      </Box>
    );
  };

  return (
    <Paper sx={{ p: 1.5, height: 1, minHeight: 420 }}>
      {/* Outlook-like header */}
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
        <TextField
          size="small"
          placeholder="Search sender, subject, or body… (/ to focus)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          inputRef={searchRef}
          sx={{ flex: 1, minWidth: 220 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
        <ToggleButtonGroup
          value={filter}
          exclusive
          onChange={(e, v) => v && setFilter(v)}
          size="small"
          color="primary"
        >
          {FILTERS.map((f) => (
            <ToggleButton key={f.value} value={f.value} sx={{ gap: 0.75 }}>
              <Typography variant="body2">{f.label}</Typography>
              <Chip size="small" variant="outlined" label={counts[f.value]} />
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
        <Chip
          size="small"
          variant="outlined"
          label={`${filtered.length} items`}
        />
      </Stack>

      {/* Split pane */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 1.5,
          height: { xs: "auto", md: `calc(100% - 44px)` },
        }}
      >
        {/* Fixed-width message list */}
        <Paper
          variant="outlined"
          sx={{
            width: { xs: 1, md: 360 },
            minWidth: { md: 320 },
            maxWidth: { md: 420 },
            overflow: "hidden",
          }}
        >
          {filtered.length === 0 ? (
            <Box
              sx={{
                height: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "text.secondary",
                p: 2,
              }}
            >
              No messages.
            </Box>
          ) : filtered.length <= 50 ? (
            <Box sx={{ py: 0.5 }}>
              {filtered.map((_, index) =>
                renderRow({ index, style: { height: ROW_HEIGHT } })
              )}
            </Box>
          ) : (
            <VirtualList
              height={Math.min(
                520,
                Math.max(320, filtered.length * ROW_HEIGHT)
              )}
              itemCount={filtered.length}
              itemSize={ROW_HEIGHT}
              width={"100%"}
            >
              {renderRow}
            </VirtualList>
          )}
        </Paper>

        {/* Reading pane expands */}
        <Paper
          variant="outlined"
          sx={{
            flex: 1,
            p: 2,
            overflow: "auto",
            minHeight: { xs: 260, md: "auto" },
          }}
        >
          {!selected ? (
            <Box
              sx={{
                height: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "text.secondary",
              }}
            >
              Select a message to view details
            </Box>
          ) : (
            <Stack spacing={1.5}>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                color="text.secondary"
              >
                <Chip
                  size="small"
                  label={
                    selected.messageType === "ticket"
                      ? "Ticket"
                      : selected.messageType === "spam"
                      ? "Spam"
                      : "Complaint"
                  }
                  variant="outlined"
                />
                <Typography variant="caption">
                  Day {selected.receivedDay}
                </Typography>
                <Typography variant="caption">•</Typography>
                <Typography variant="caption">
                  {formatGameTime(selected.receivedTime)}
                </Typography>
              </Stack>
              <Typography variant="h6" sx={{ lineHeight: 1.2 }}>
                {selected.subject}
              </Typography>
              <Typography variant="subtitle2" color="text.secondary">
                From {selected.sender}
              </Typography>
              {selected.messageType === "ticket" && (
                <Typography variant="caption" color="text.secondary">
                  {selected.ticketType.charAt(0).toUpperCase() +
                    selected.ticketType.slice(1)}{" "}
                  • Difficulty {selected.difficulty}
                </Typography>
              )}
              <Divider sx={{ my: 1 }} />
              <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                {selected.body}
              </Typography>

              {selected.messageType === "ticket" ? (
                <Box>
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ mb: 1 }}
                  >
                    <Button
                      size="small"
                      variant="contained"
                      startIcon={<PersonAddAltIcon />}
                      onClick={() => {
                        const best = getBestAgentId(selected);
                        if (best) {
                          playAssign();
                          assignTicketToAgent(selected.id, best);
                          setSnack({
                            open: true,
                            message: "Assigned best agent",
                            severity: "success",
                          });
                        }
                      }}
                      disabled={
                        agents.filter((a) => !a.assignedTicketId).length === 0
                      }
                    >
                      Assign Best
                    </Button>
                    <Typography variant="caption" color="text.secondary">
                      or choose an agent
                    </Typography>
                  </Stack>
                  <Stack spacing={1}>
                    {agents
                      .filter((a) => !a.assignedTicketId)
                      .sort(
                        (a, b) =>
                          b.skills[selected.ticketType] -
                          a.skills[selected.ticketType]
                      )
                      .map((agent) => {
                        const skill = agent.skills[selected.ticketType];
                        const isGood = skill >= selected.difficulty;
                        return (
                          <Paper
                            key={agent.id}
                            variant="outlined"
                            sx={{ p: 1 }}
                          >
                            <Stack
                              direction="row"
                              spacing={1.5}
                              alignItems="center"
                            >
                              <Avatar
                                src={agent.profileImage}
                                alt={agent.agentName}
                                sx={{ width: 28, height: 28 }}
                              />
                              <Box sx={{ minWidth: 0, flex: 1 }}>
                                <Typography
                                  variant="body2"
                                  noWrap
                                  fontWeight={600}
                                >
                                  {agent.agentName}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  {selected.ticketType.charAt(0).toUpperCase() +
                                    selected.ticketType.slice(1)}{" "}
                                  skill:{" "}
                                  <b
                                    style={{
                                      color: isGood ? "#4ade80" : undefined,
                                    }}
                                  >
                                    {skill}
                                  </b>{" "}
                                  | Ticket difficulty:{" "}
                                  <b>{selected.difficulty}</b>
                                </Typography>
                              </Box>
                              <Button
                                size="small"
                                onClick={() => {
                                  playAssign();
                                  assignTicketToAgent(selected.id, agent.id);
                                  setSnack({
                                    open: true,
                                    message: `Assigned ${agent.agentName}`,
                                    severity: "success",
                                  });
                                }}
                              >
                                Assign
                              </Button>
                            </Stack>
                          </Paper>
                        );
                      })}
                  </Stack>
                </Box>
              ) : (
                <Box>
                  <Button
                    size="small"
                    color="error"
                    variant="outlined"
                    startIcon={<DeleteOutlineIcon />}
                    onClick={() => {
                      playDelete();
                      deleteSpam(selected.id);
                      setSnack({
                        open: true,
                        message: "Deleted",
                        severity: "warning",
                      });
                    }}
                  >
                    Delete
                  </Button>
                </Box>
              )}
            </Stack>
          )}
        </Paper>
      </Box>

      <Snackbar
        open={snack.open}
        autoHideDuration={1800}
        onClose={() => setSnack({ ...snack, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snack.severity}
          variant="filled"
          onClose={() => setSnack({ ...snack, open: false })}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
}
