"use client";
import { GAME_TIME } from "@/lib/helpers/gameHelpers";
import {
  Avatar,
  Box,
  Chip,
  Divider,
  Grid,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

function minutesBetween(
  receivedDay,
  receivedTime,
  resolvedOnDay,
  resolvedOnTick
) {
  if (
    receivedDay == null ||
    receivedTime == null ||
    resolvedOnDay == null ||
    resolvedOnTick == null
  )
    return null;
  const dayDiff = (resolvedOnDay - receivedDay) * GAME_TIME.FULL_DAY;
  return Math.max(0, dayDiff + (resolvedOnTick - receivedTime));
}

export default function Stats({ gameState }) {
  const inboxItems = Object.values(gameState.inbox || {});
  const tickets = inboxItems.filter((i) => i.messageType === "ticket");
  const resolvedTickets = tickets.filter((t) => t.resolved);
  const activeItems = inboxItems.filter((i) => i.activeItem).length;
  const complaintsOpen = inboxItems.filter(
    (i) => i.messageType === "complaint" && i.activeItem
  ).length;
  const spamTotal = inboxItems.filter((i) => i.messageType === "spam").length;

  const avgResolutionMinutes = (() => {
    const times = resolvedTickets
      .map((t) =>
        minutesBetween(
          t.receivedDay,
          t.receivedTime,
          t.resolvedOnDay,
          t.resolvedOnTick
        )
      )
      .filter((n) => typeof n === "number");
    if (times.length === 0) return null;
    return Math.round(times.reduce((a, b) => a + b, 0) / times.length);
  })();

  // Ticket type distribution
  const typeCounts = tickets.reduce((acc, t) => {
    const key = t.ticketType || "unknown";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, /** @type {Record<string, number>} */ ({}));
  const typeMax = Math.max(1, ...Object.values(typeCounts));

  // Agent performance (resolves per agent)
  const agentResolves = resolvedTickets.reduce((acc, t) => {
    const id = t.resolvedBy;
    if (!id) return acc;
    acc[id] = (acc[id] || 0) + 1;
    return acc;
  }, /** @type {Record<string, number>} */ ({}));
  const maxResolves = Math.max(1, ...Object.values(agentResolves));

  const chaos = gameState.chaos ?? 0;
  const inboxPercent = Math.min(
    100,
    Math.round((activeItems / Math.max(1, gameState.inboxSize || 1)) * 100)
  );

  return (
    <Stack spacing={2}>
      {/* KPI header */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="overline" color="text.secondary">
              Inbox Load
            </Typography>
            <Stack direction="row" alignItems="baseline" spacing={1}>
              <Typography variant="h5">{activeItems}</Typography>
              <Typography variant="body2" color="text.secondary">
                / {gameState.inboxSize}
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={inboxPercent}
              sx={{ mt: 1, height: 8, borderRadius: 4 }}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="overline" color="text.secondary">
              Tickets Resolved
            </Typography>
            <Typography variant="h5">{resolvedTickets.length}</Typography>
            <Typography variant="caption" color="text.secondary">
              total this contract
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="overline" color="text.secondary">
              Chaos
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip
                size="small"
                color={
                  chaos >= 70 ? "error" : chaos >= 40 ? "warning" : "success"
                }
                label={`${chaos}`}
              />
              <Box sx={{ flex: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={chaos}
                  color={
                    chaos >= 70 ? "error" : chaos >= 40 ? "warning" : "success"
                  }
                  sx={{ height: 6, borderRadius: 3 }}
                />
              </Box>
            </Stack>
            <Typography variant="caption" color="text.secondary">
              higher is worse
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="overline" color="text.secondary">
              Avg Resolution Time
            </Typography>
            <Typography variant="h5">
              {avgResolutionMinutes == null ? "—" : `${avgResolutionMinutes}m`}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              across resolved tickets
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Workload breakdown */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2">Workload</Typography>
            <Divider sx={{ my: 1 }} />
            <Stack spacing={1}>
              <RowStat
                label="Open Complaints"
                value={complaintsOpen}
                color="warning"
              />
              <RowStat label="Spam" value={spamTotal} color="default" />
              <RowStat
                label="Tickets (total)"
                value={tickets.length}
                color="info"
              />
              <RowStat
                label="Tickets Resolved"
                value={resolvedTickets.length}
                color="success"
              />
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2">Ticket Types</Typography>
            <Divider sx={{ my: 1 }} />
            <Stack spacing={1}>
              {Object.keys(typeCounts).length === 0 && (
                <Typography variant="body2" color="text.secondary">
                  No tickets yet.
                </Typography>
              )}
              {Object.entries(typeCounts).map(([type, count]) => (
                <BarRow key={type} label={type} value={count} max={typeMax} />
              ))}
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* Agent performance */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="subtitle2">Agent Performance</Typography>
        <Divider sx={{ my: 1 }} />
        {Object.keys(agentResolves).length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No resolved tickets yet.
          </Typography>
        ) : (
          <Stack spacing={1.25}>
            {Object.entries(agentResolves)
              .sort((a, b) => b[1] - a[1])
              .map(([agentId, val]) => {
                const agent = gameState.agents[agentId];
                return (
                  <Stack
                    key={agentId}
                    direction="row"
                    spacing={1}
                    alignItems="center"
                  >
                    <Avatar
                      src={agent?.profileImage}
                      alt={agent?.agentName}
                      sx={{ width: 28, height: 28 }}
                    />
                    <Box sx={{ minWidth: 120 }}>
                      <Typography variant="body2" noWrap>
                        {agent?.agentName || agentId}
                      </Typography>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={Math.round((val / maxResolves) * 100)}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                    <Box sx={{ minWidth: 36, textAlign: "right" }}>
                      <Typography variant="body2">{val}</Typography>
                    </Box>
                  </Stack>
                );
              })}
          </Stack>
        )}
      </Paper>
    </Stack>
  );
}

function RowStat({ label, value, color = "default" }) {
  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <Box
        sx={{
          width: 10,
          height: 10,
          borderRadius: 999,
          bgcolor: (t) =>
            color === "warning"
              ? t.palette.warning.main
              : color === "success"
              ? t.palette.success.main
              : color === "info"
              ? t.palette.info.main
              : t.palette.divider,
        }}
      />
      <Typography variant="body2" sx={{ flex: 1 }}>
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={600}>
        {value}
      </Typography>
    </Stack>
  );
}

function BarRow({ label, value, max }) {
  const percent = Math.round((value / Math.max(1, max)) * 100);
  return (
    <Stack spacing={0.5}>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="body2">{label}</Typography>
        <Typography variant="body2" color="text.secondary">
          {value}
        </Typography>
      </Stack>
      <LinearProgress
        variant="determinate"
        value={percent}
        sx={{ height: 8, borderRadius: 4 }}
      />
    </Stack>
  );
}
