"use client";

import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Grid,
  LinearProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

export default function GameOver({ restartGame, gameState }) {
  const inboxItems = Object.values(gameState.inbox || {});
  const inboxSize = gameState.inboxSize || 0;
  const activeItems = inboxItems.filter((i) => i.activeItem).length;
  const agents = gameState.agents || {};
  const dayNumber = gameState.dayNumber || 1;
  const contractName = gameState.currentContract?.companyName || "Contract";

  const ticketsResolved = inboxItems.filter(
    (i) => i.messageType === "ticket" && i.resolved
  ).length;
  const ticketsFailed = inboxItems.filter(
    (i) => i.messageType === "ticket" && (i.failCount || 0) > 0
  ).length;
  const spamDeleted = inboxItems.filter(
    (i) => i.messageType === "spam" && !i.activeItem
  ).length;
  const totalComplaints = inboxItems.filter(
    (i) => i.messageType === "complaint"
  ).length;

  const resolvesByAgentId = {};
  const failsByAgentId = {};
  inboxItems.forEach((i) => {
    if (i.messageType !== "ticket") return;
    if (i.resolved && i.resolvedBy) {
      resolvesByAgentId[i.resolvedBy] =
        (resolvesByAgentId[i.resolvedBy] || 0) + 1;
    }
    if ((i.failCount || 0) > 0 && i.agentAssigned) {
      failsByAgentId[i.agentAssigned] =
        (failsByAgentId[i.agentAssigned] || 0) + 1;
    }
  });
  const performance = Object.keys(agents).map((id) => {
    const resolved = resolvesByAgentId[id] || 0;
    const failed = failsByAgentId[id] || 0;
    const total = resolved + failed;
    const successRate = total > 0 ? Math.round((resolved / total) * 100) : 0;
    return { id, resolved, failed, total, successRate, agent: agents[id] };
  });
  performance.sort((a, b) => b.resolved - a.resolved);
  const mvp = performance[0] || null;

  return (
    <Box sx={{ maxWidth: 1100, mx: "auto", p: 3 }}>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={1}
          alignItems={{ md: "center" }}
        >
          <WarningAmberIcon color="warning" />
          <Typography variant="h5" fontWeight={700} sx={{ flex: 1 }}>
            Game Over — Inbox Overflow
          </Typography>
          <Chip label={`Day ${dayNumber}`} size="small" />
          <Chip
            label={contractName}
            size="small"
            color="primary"
            variant="outlined"
          />
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Inbox reached {activeItems}/{inboxSize}. Your team couldn’t keep up.
        </Typography>
      </Paper>

      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <CheckCircleOutlineIcon color="success" />
              <Typography variant="overline">Tickets Resolved</Typography>
            </Stack>
            <Typography variant="h4">{ticketsResolved}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <ErrorOutlineIcon color="error" />
              <Typography variant="overline">Tickets Failed</Typography>
            </Stack>
            <Typography variant="h4">{ticketsFailed}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <DeleteOutlineIcon color="info" />
              <Typography variant="overline">Spam Deleted</Typography>
            </Stack>
            <Typography variant="h4">{spamDeleted}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <WarningAmberIcon color="warning" />
              <Typography variant="overline">Complaints</Typography>
            </Stack>
            <Typography variant="h4">{totalComplaints}</Typography>
          </Paper>
        </Grid>
      </Grid>

      <Paper sx={{ p: 2, mt: 2 }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
          <EmojiEventsIcon color="secondary" />
          <Typography variant="subtitle1">Team Performance</Typography>
          <Box sx={{ flex: 1 }} />
          <Chip
            size="small"
            label={`${performance.filter((p) => p.total > 0).length} active`}
          />
        </Stack>
        {performance.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No team data.
          </Typography>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Agent</TableCell>
                <TableCell align="right">Resolved</TableCell>
                <TableCell align="right">Failed</TableCell>
                <TableCell align="right">Success</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {performance.map((p) => (
                <TableRow key={p.id} selected={mvp && p.id === mvp.id}>
                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Avatar
                        src={p.agent?.profileImage}
                        alt={p.agent?.agentName}
                        sx={{ width: 28, height: 28 }}
                      />
                      <Typography variant="body2">
                        {p.agent?.agentName || p.id}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell align="right">{p.resolved}</TableCell>
                  <TableCell align="right">{p.failed}</TableCell>
                  <TableCell align="right" sx={{ minWidth: 120 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="body2" sx={{ width: 28 }}>
                        {p.successRate}%
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={p.successRate}
                        sx={{ height: 8, borderRadius: 4, flex: 1 }}
                      />
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>

      <Paper sx={{ p: 2, mt: 2 }}>
        <Typography variant="subtitle1">Final Statistics</Typography>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid item xs={12} sm={3}>
            <Typography variant="caption" color="text.secondary">
              Total Items Processed
            </Typography>
            <Typography variant="h6">{inboxItems.length}</Typography>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Typography variant="caption" color="text.secondary">
              Chaos Level
            </Typography>
            <Typography variant="h6">{gameState.chaos}/100</Typography>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Typography variant="caption" color="text.secondary">
              Team Size
            </Typography>
            <Typography variant="h6">{Object.keys(agents).length}</Typography>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Typography variant="caption" color="text.secondary">
              Contract
            </Typography>
            <Typography variant="h6">{contractName}</Typography>
          </Grid>
        </Grid>
      </Paper>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1.5}
        justifyContent="center"
        sx={{ mt: 3 }}
      >
        <Button variant="outlined" onClick={restartGame}>
          Back to Main Menu
        </Button>
        <Button variant="contained" onClick={restartGame}>
          Restart
        </Button>
      </Stack>
    </Box>
  );
}
