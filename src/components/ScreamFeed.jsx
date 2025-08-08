import { formatGameTime } from "@/lib/helpers/gameHelpers";
import {
  Avatar,
  Box,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

const ScreamFeed = ({ screams, agents }) => {
  if (!screams || screams.length === 0) {
    return (
      <Box
        sx={{
          height: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "text.secondary",
        }}
      >
        No screams yet. Peaceful... for now.
      </Box>
    );
  }

  return (
    <Paper sx={{ p: 2, height: 1, overflow: "auto" }}>
      <List>
        {screams.map((scream) => {
          const agent = agents[scream.agentId];
          return (
            <ListItem key={scream.screamId} alignItems="flex-start" divider>
              <ListItemAvatar>
                <Avatar src={agent.profileImage} alt={agent.agentName} />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="body2" fontWeight={600}>
                      {agent.agentName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Day {scream.dayCreated} •{" "}
                      {formatGameTime(scream.createdAt)}
                    </Typography>
                  </Stack>
                }
                secondary={
                  <Typography variant="body2" component="span">
                    {scream.message}
                  </Typography>
                }
              />
            </ListItem>
          );
        })}
      </List>
    </Paper>
  );
};

export default ScreamFeed;
