import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import PaidIcon from "@mui/icons-material/AttachMoneyOutlined";
import BoltIcon from "@mui/icons-material/BoltOutlined";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenterOutlined";
import CategoryIcon from "@mui/icons-material/CategoryOutlined";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotionsOutlined";
import GroupIcon from "@mui/icons-material/GroupOutlined";
import InboxIcon from "@mui/icons-material/InboxOutlined";
import InsightsIcon from "@mui/icons-material/InsightsOutlined";
import WhatshotIcon from "@mui/icons-material/WhatshotOutlined";
import {
  Box,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  LinearProgress,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";

export default function ContractView({ contract, compact = false }) {
  if (!contract) return null;
  const {
    companyName,
    companyCulture,
    companyDescription,
    companyUserType,
    baseChaos,
    industry,
    ticketsRequired,
    ticketsResolved,
    baseInboxSize,
    reward,
    spawnTable,
  } = contract;

  const progress = Math.min(
    100,
    Math.round(
      ((ticketsResolved || 0) / Math.max(1, ticketsRequired || 1)) * 100
    )
  );

  const chaosPct = Math.min(100, Math.round(((baseChaos || 0) / 15) * 100));

  const getDifficulty = () => {
    if ((baseChaos || 0) >= 12 || (ticketsRequired || 0) >= 18)
      return "Nightmare";
    if ((baseChaos || 0) >= 9 || (ticketsRequired || 0) >= 16) return "Hard";
    if ((baseChaos || 0) >= 7 || (ticketsRequired || 0) >= 14) return "Medium";
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

  const topSpawn = Object.entries(spawnTable || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, compact ? 3 : 6);

  const sectionTitleVariant = compact ? "caption" : "overline";
  const containerPadding = compact ? 1.5 : 2.5;
  const donutSize = compact ? 56 : 72;
  const donutThickness = compact ? 4 : 5;

  return (
    <Paper sx={{ p: containerPadding }}>
      {/* Header: identity + tags + progress + reward */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={compact ? 1.5 : 2.5}
        alignItems={{ md: "center" }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant={compact ? "h6" : "h5"}
            fontWeight={800}
            sx={{ lineHeight: 1.1 }}
          >
            {companyName}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 0.5 }}
            noWrap
          >
            {companyDescription}
          </Typography>
          <Stack
            direction="row"
            spacing={1}
            sx={{ flexWrap: "wrap", mt: 1.25 }}
          >
            <Chip
              icon={<CategoryIcon />}
              label={industry}
              size="small"
              variant="outlined"
            />
            <Chip
              size="small"
              color={difficultyColor(getDifficulty())}
              label={`Difficulty: ${getDifficulty()}`}
            />
            <Chip
              icon={<GroupIcon />}
              label={companyUserType}
              size="small"
              variant="outlined"
            />
          </Stack>
        </Box>
        <Stack spacing={1} alignItems="center">
          <Box sx={{ position: "relative", display: "inline-flex" }}>
            <Tooltip
              title={`${ticketsResolved || 0}/${ticketsRequired} resolved`}
            >
              <CircularProgress
                variant="determinate"
                value={progress}
                size={donutSize}
                thickness={donutThickness}
              />
            </Tooltip>
            <Box
              sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: "absolute",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="caption" color="text.secondary">
                {progress}%
              </Typography>
            </Box>
          </Box>
          <Chip
            color="primary"
            icon={<PaidIcon />}
            label={`$${reward?.cash ?? 0}`}
            sx={{ fontWeight: 700 }}
          />
        </Stack>
      </Stack>

      <Divider sx={{ my: compact ? 1.5 : 2 }} />

      {/* KPI cards */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper variant="outlined" sx={{ p: compact ? 1 : 1.5, height: 1 }}>
            <Stack spacing={0.5}>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <AssignmentTurnedInIcon fontSize="small" />
                <Typography variant="caption" color="text.secondary">
                  Tickets
                </Typography>
              </Stack>
              <Typography variant="h6" fontWeight={800}>
                {ticketsResolved || 0} / {ticketsRequired}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{ height: compact ? 6 : 8, borderRadius: 4 }}
              />
            </Stack>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper variant="outlined" sx={{ p: compact ? 1 : 1.5, height: 1 }}>
            <Stack spacing={0.5}>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <InboxIcon fontSize="small" />
                <Typography variant="caption" color="text.secondary">
                  Daily inbox
                </Typography>
              </Stack>
              <Typography variant="h6" fontWeight={800}>
                {baseInboxSize ?? "—"}
              </Typography>
            </Stack>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper variant="outlined" sx={{ p: compact ? 1 : 1.5, height: 1 }}>
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
                sx={{ height: compact ? 6 : 8, borderRadius: 4 }}
              />
              <Typography variant="caption" color="text.secondary">
                {baseChaos} / 15
              </Typography>
            </Stack>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper variant="outlined" sx={{ p: compact ? 1 : 1.5, height: 1 }}>
            <Stack spacing={0.5}>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <GroupIcon fontSize="small" />
                <Typography variant="caption" color="text.secondary">
                  Users
                </Typography>
              </Stack>
              <Typography variant="body2">{companyUserType}</Typography>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      <Divider sx={{ my: compact ? 1.5 : 2 }} />

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper variant="outlined" sx={{ p: compact ? 1 : 1.5, height: 1 }}>
            <Stack
              direction="row"
              spacing={0.5}
              alignItems="center"
              sx={{ mb: compact ? 0.5 : 1 }}
            >
              <InsightsIcon fontSize="small" />
              <Typography variant={sectionTitleVariant} fontWeight={700}>
                Top incident mix
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {topSpawn.length === 0 ? (
                <Typography variant="caption" color="text.secondary">
                  No data
                </Typography>
              ) : (
                topSpawn.map(([key, weight]) => (
                  <Chip
                    key={key}
                    size="small"
                    variant="outlined"
                    label={`${key.replaceAll("_", " ")} ${(
                      weight * 100
                    ).toFixed(0)}%`}
                  />
                ))
              )}
            </Stack>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper variant="outlined" sx={{ p: compact ? 1 : 1.5, height: 1 }}>
            <Typography variant={sectionTitleVariant} fontWeight={700}>
              About
            </Typography>
            <Stack spacing={0.5} sx={{ mt: compact ? 0.25 : 0.5 }}>
              <Typography variant="body2">
                <b>Industry:</b> {industry}
              </Typography>
              <Typography variant="body2">
                <b>Culture:</b> {companyCulture}
              </Typography>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Paper>
  );
}
