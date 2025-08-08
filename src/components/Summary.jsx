import { useGame } from "@/hooks/useGame";
import { GAME_TIME, formatGameTime } from "@/lib/helpers/gameHelpers";
import {
  Bolt,
  CheckCircleOutline,
  EmojiEvents,
  ErrorOutline,
  Forum,
  Insights,
  Speed,
  Star,
  WarningAmber,
  Whatshot,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  LinearProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import { useMemo } from "react";

export default function Summary({ startNewDay, today }) {
  const { gameState } = useGame();
  if (!today) return null;

  // Derived stats for the day
  const {
    resolvedCount,
    failedCount,
    complaintsCount,
    screamsToday,
    newTicketsToday,
    backlogLeft,
    fastestFix,
    toughestTicket,
    leaderboard,
    topScreams,
    achievements,
  } = useMemo(() => {
    const inboxItems = Object.values(gameState.inbox || {});
    const ticketsToday = inboxItems.filter(
      (i) => i.messageType === "ticket" && i.receivedDay === today.day
    );
    const complaintsTodayArr = inboxItems.filter(
      (i) => i.messageType === "complaint" && i.receivedDay === today.day
    );
    const resolvedToday = inboxItems.filter(
      (i) => i.resolved && i.resolvedOnDay === today.day
    );
    const unresolvedUpToToday = inboxItems.filter(
      (i) =>
        i.messageType === "ticket" && !i.resolved && i.receivedDay <= today.day
    );

    // Agent leaderboard from resolved tickets
    const byAgent = new Map();
    for (const t of resolvedToday) {
      const agentId = t.resolvedBy;
      if (!agentId) continue;
      const stats = byAgent.get(agentId) || { resolves: 0, fails: 0 };
      stats.resolves += 1;
      byAgent.set(agentId, stats);
    }

    const leaderboardArr = Array.from(byAgent.entries())
      .map(([agentId, stats]) => ({
        id: agentId,
        resolves: stats.resolves || 0,
        fails: stats.fails || 0,
        agent: gameState.agents[agentId],
      }))
      .sort((a, b) => b.resolves - a.resolves)
      .slice(0, 3);

    // Fastest fix and toughest ticket
    const withDurations = resolvedToday
      .map((t) => {
        const startTick = Math.max(
          GAME_TIME.DAY_START,
          t.receivedTime ?? GAME_TIME.DAY_START
        );
        const duration = Math.max(
          0,
          (t.resolvedOnTick ?? GAME_TIME.DAY_END) - startTick
        );
        return { ...t, duration };
      })
      .filter((t) => Number.isFinite(t.duration));

    const fastest = withDurations.length
      ? withDurations.reduce((a, b) => (a.duration < b.duration ? a : b))
      : null;
    const toughest = resolvedToday.length
      ? resolvedToday.reduce((a, b) =>
          (a.difficulty || 0) > (b.difficulty || 0) ? a : b
        )
      : null;

    // Scream highlights
    const screams = (gameState.screams || []).filter(
      (s) => s.dayCreated === today.day
    );
    const screamTop = screams.slice(0, 3);

    // Achievements (just-for-fun badges)
    const ach = [];
    if (complaintsTodayArr.length === 0)
      ach.push({ label: "No Complaints", color: "success" });
    if (resolvedToday.length >= 5)
      ach.push({ label: "Ticket Grinder", color: "primary" });
    if (withDurations.some((t) => t.duration <= 15))
      ach.push({ label: "Speed Demon <15m", color: "warning" });
    if (screams.length >= 3) ach.push({ label: "Scream Fest", color: "error" });

    return {
      resolvedCount: resolvedToday.length,
      failedCount: today.failed ?? 0,
      complaintsCount: complaintsTodayArr.length,
      screamsToday: screams.length,
      newTicketsToday: ticketsToday.length,
      backlogLeft: unresolvedUpToToday.length,
      fastestFix: fastest,
      toughestTicket: toughest,
      leaderboard: leaderboardArr,
      topScreams: screamTop,
      achievements: ach,
    };
  }, [
    gameState.inbox,
    gameState.screams,
    gameState.agents,
    today.day,
    today.failed,
  ]);

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", p: 3 }}>
      <Stack
        direction="row"
        alignItems="baseline"
        justifyContent="space-between"
        sx={{ mb: 1 }}
      >
        <Typography variant="h4" fontWeight={800}>
          Day {today.day} Summary
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Contract: {gameState.currentContract?.companyName || "—"}
        </Typography>
      </Stack>

      {/* Top KPIs */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" spacing={1} alignItems="center">
                <CheckCircleOutline color="success" />
                <Typography variant="subtitle2" color="text.secondary">
                  Resolved
                </Typography>
              </Stack>
              <Typography variant="h4" color="success.main">
                {resolvedCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" spacing={1} alignItems="center">
                <ErrorOutline color="error" />
                <Typography variant="subtitle2" color="text.secondary">
                  Failed
                </Typography>
              </Stack>
              <Typography variant="h4" color="error.main">
                {failedCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" spacing={1} alignItems="center">
                <WarningAmber color="warning" />
                <Typography variant="subtitle2" color="text.secondary">
                  Complaints
                </Typography>
              </Stack>
              <Typography variant="h4">{complaintsCount}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" spacing={1} alignItems="center">
                <Forum color="primary" />
                <Typography variant="subtitle2" color="text.secondary">
                  Screams
                </Typography>
              </Stack>
              <Typography variant="h4" color="primary.main">
                {screamsToday}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Chaos meter */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems={{ xs: "flex-start", sm: "center" }}
          >
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ minWidth: 180 }}
            >
              <Whatshot color="error" />
              <Typography variant="subtitle2" color="text.secondary">
                Chaos level
              </Typography>
            </Stack>
            <Box sx={{ flex: 1 }}>
              <LinearProgress
                variant="determinate"
                value={Math.max(0, Math.min(100, gameState.chaos || 0))}
              />
            </Box>
            <Typography
              variant="body2"
              sx={{ minWidth: 56, textAlign: "right" }}
            >
              {Math.round(gameState.chaos || 0)}%
            </Typography>
          </Stack>
        </CardContent>
      </Card>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        {/* Ticket highlights */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ mb: 1 }}
              >
                <Insights color="info" />
                <Typography variant="h6" fontWeight={700}>
                  Ticket highlights
                </Typography>
              </Stack>
              <Stack spacing={1.25}>
                <KPIRow
                  icon={<Speed fontSize="small" color="success" />}
                  label="Fastest fix"
                  value={
                    fastestFix
                      ? `${fastestFix.subject || "Ticket"} • ${Math.max(
                          1,
                          fastestFix.duration
                        )}m`
                      : "—"
                  }
                  hint={
                    fastestFix
                      ? `Resolved at ${formatGameTime(
                          fastestFix.resolvedOnTick
                        )} by ${
                          gameState.agents[fastestFix.resolvedBy]?.agentName ||
                          "Unknown"
                        }`
                      : undefined
                  }
                />
                <Divider light />
                <KPIRow
                  icon={<Bolt fontSize="small" color="warning" />}
                  label="Toughest ticket"
                  value={
                    toughestTicket
                      ? `${toughestTicket.subject || "Ticket"} • D${
                          toughestTicket.difficulty || 0
                        }`
                      : "—"
                  }
                  hint={
                    toughestTicket
                      ? `${
                          toughestTicket.ticketType?.toUpperCase() || ""
                        } • Resolved by ${
                          gameState.agents[toughestTicket.resolvedBy]
                            ?.agentName || "Unknown"
                        }`
                      : undefined
                  }
                />
                <Divider light />
                <KPIRow
                  icon={<ErrorOutline fontSize="small" color="error" />}
                  label="Backlog remaining"
                  value={`${backlogLeft}`}
                  hint={`${newTicketsToday} new tickets today`}
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Agent leaderboard */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ mb: 1 }}
              >
                <EmojiEvents color="warning" />
                <Typography variant="h6" fontWeight={700}>
                  Agent leaderboard
                </Typography>
              </Stack>
              {leaderboard.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No ticket resolutions logged today.
                </Typography>
              ) : (
                <List dense>
                  {leaderboard.map((p) => (
                    <ListItem key={p.id} disableGutters>
                      <ListItemAvatar>
                        <Avatar
                          src={p.agent?.profileImage}
                          alt={p.agent?.agentName}
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            <Typography fontWeight={700}>
                              {p.agent?.agentName || p.id}
                            </Typography>
                            {today.mvp === p.id && (
                              <Chip
                                size="small"
                                icon={<Star />}
                                label="MVP"
                                color="warning"
                                variant="outlined"
                              />
                            )}
                          </Stack>
                        }
                        secondary={
                          <Typography variant="caption" color="text.secondary">
                            {p.resolves} resolved
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Scream highlights */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <Forum color="primary" />
            <Typography variant="h6" fontWeight={700}>
              Scream highlights
            </Typography>
          </Stack>
          {topScreams.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No screams today. Eerily calm…
            </Typography>
          ) : (
            <List>
              {topScreams.map((s) => {
                const agent = gameState.agents[s.agentId];
                return (
                  <ListItem key={s.screamId} alignItems="flex-start" divider>
                    <ListItemAvatar>
                      <Avatar
                        src={agent?.profileImage}
                        alt={agent?.agentName}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography variant="body2" fontWeight={700}>
                            {agent?.agentName || "Unknown"}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatGameTime(s.createdAt)}
                          </Typography>
                        </Stack>
                      }
                      secondary={
                        <Typography variant="body2">{s.message}</Typography>
                      }
                    />
                  </ListItem>
                );
              })}
            </List>
          )}
        </CardContent>
      </Card>

      {/* Achievements */}
      {achievements.length > 0 && (
        <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
          {achievements.map((a, idx) => (
            <Chip
              key={idx}
              icon={<Bolt />}
              label={a.label}
              color={a.color}
              variant="outlined"
            />
          ))}
        </Stack>
      )}

      <Box sx={{ position: "sticky", bottom: 16 }}>
        <Button
          variant="contained"
          size="large"
          onClick={startNewDay}
          fullWidth
        >
          Start Day {today.day + 1}
        </Button>
      </Box>
    </Box>
  );
}

function KPIRow({ icon, label, value, hint }) {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={1}
      alignItems={{ xs: "flex-start", sm: "center" }}
    >
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        sx={{ minWidth: 180 }}
      >
        {icon}
        <Typography variant="subtitle2" color="text.secondary">
          {label}
        </Typography>
      </Stack>
      <Typography variant="body1" fontWeight={700}>
        {value}
      </Typography>
      {hint && (
        <Typography variant="caption" color="text.secondary">
          {hint}
        </Typography>
      )}
    </Stack>
  );
}
