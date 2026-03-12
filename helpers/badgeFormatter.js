import { Chip } from "@mui/material";

// Common utility to render a Chip based on a status-to-style map
const renderBadge = (status, styleMap, defaultKey = "default", onClick) => {
  const key = styleMap[status] ? status : defaultKey;
  const { color, sx } = styleMap[key];
  return (
    <Chip
      label={status}
      color={color}
      sx={sx}
      clickable={!!onClick}
      onClick={onClick ? () => onClick(status) : undefined}
    />
  );
};

// Configuration maps for each badge type
const badgeStyles = {
  Invited: {
    color: "success",
    sx: {
      backgroundColor: "#01943C0D",
      color: "#109A4E",
      fontWeight: 500,
      borderRadius: 2,
    },
  },
  "Not Invited": {
    color: "info",
    sx: {
      backgroundColor: "#FF2F2F0D",
      color: "#FF2F2F",
      fontSize: 15,
      fontWeight: 500,
      textTransform: "capitalize",
      borderRadius: 2,
    },
  },
  Pending: {
    color: "warning",
    sx: {
      backgroundColor: "#FF98001A",
      color: "#FF9800",
      fontWeight: 500,
      borderRadius: 2,
    },
  },
  default: {
    color: "error",
    sx: {
      backgroundColor: "#e8fff3",
      color: "#00927C",
      fontSize: 15,
      fontWeight: 500,
      textTransform: "capitalize",
      borderRadius: 2,
    },
  },
};

const accountStatusStyles = {
  active: {
    color: "success",
    sx: {
      backgroundColor: "#01943C0D",
      color: "#109A4E",
      fontSize: 15,
      fontWeight: 500,
      textTransform: "capitalize",
      borderRadius: 2,
    },
  },
  inactive: {
    color: "info",
    sx: {
      backgroundColor: "#FF2F2F0D",
      color: "#FF2F2F",
      fontSize: 15,
      fontWeight: 500,
      textTransform: "capitalize",
      borderRadius: 2,
    },
  },
  default: {
    color: "default",
    sx: {},
  },
};

const planStyles = {
  pending: {
    color: "warning",
    sx: {
      backgroundColor: "#FF98001A",
      color: "#FF9800",
      textTransform: "capitalize",
      fontWeight: 600,
      borderRadius: 2,
    },
  },
  accepted: {
    color: "success",
    sx: {
      backgroundColor: "#14917C1A",
      color: "#00927C",
      textTransform: "capitalize",
      fontWeight: 600,
      borderRadius: 2,
    },
  },
  rejected: {
    color: "error",
    sx: {
      backgroundColor: "#F1416C1A",
      color: "#F1416C",
      textTransform: "capitalize",
      fontWeight: 600,
      borderRadius: 2,
    },
  },
  default: {
    color: "error",
    sx: {
      backgroundColor: "#e8fff3",
      color: "#63d396",
      textTransform: "capitalize",
      fontWeight: 600,
      borderRadius: 2,
    },
  },
};

// Exported formatters
// Exported formatters; planBadgeFormatter now accepts an optional onClick callback

export const badgeFormatter = (status, onClick) =>
  renderBadge(status, badgeStyles, "default", onClick);
export const accountStatusBadgeFormatter = (status, onClick) =>
  renderBadge(status, accountStatusStyles, "default", onClick);
export const planBadgeFormatter = (status, onClick) =>
  renderBadge(status, planStyles, "default", onClick);
