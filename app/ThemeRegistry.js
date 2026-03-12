"use client";

import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import styled from "@emotion/styled";
import { LoadingButton } from "@mui/lab";
import { Button, Switch } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useServerInsertedHTML } from "next/navigation";
import React from "react";

const theme = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        body {
          background-color: #f4f5f8;
        }
      `,
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: "20px",
          padding: "22px",
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          ".MuiOutlinedInput-notchedOutline": {
            borderRadius: "8px",
            borderColor: "#e2e8f0 !important",
          },
        },
        icon: {
          color: "#555",
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          borderWidth: "0px",
          ".MuiDataGrid-columnHeader": {
            backgroundColor: "#F9F9FB",
          },
          ".MuiDataGrid-filler": {
            backgroundColor: "#F9F9FB",
          },
          ".MuiDataGrid-row": {
            borderRadius: "8px",
          },
        },
      },
    },
  },
  palette: {
    primary: {
      main: "#01933c",
      black: "#000000",
      light: "#ffffff",
    },
  },
});

export default function ThemeRegistry({ children }) {
  const [{ cache, flush }] = React.useState(() => {
    const cache = createCache({ key: "mui" });
    cache.compat = true;
    const prevInsert = cache.insert;
    let inserted = [];
    cache.insert = (...args) => {
      const serialized = args[1];
      if (cache.inserted[serialized.name] === undefined) {
        inserted.push(serialized.name);
      }
      return prevInsert(...args);
    };
    const flush = () => {
      const prevInserted = inserted;
      inserted = [];
      return prevInserted;
    };
    return { cache, flush };
  });

  useServerInsertedHTML(() => {
    const names = flush();
    if (names.length === 0) {
      return null;
    }
    let styles = "";
    for (const name of names) {
      styles += cache.inserted[name];
    }
    return (
      <style
        data-emotion={`${cache.key} ${names.join(" ")}`}
        dangerouslySetInnerHTML={{
          __html: styles,
        }}
      />
    );
  });

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}

export function CustomButton({
  children,
  bgColor,
  hoverBgColor,
  fontColor,
  variant,
  width,
  minWidth,
  margin,
  padding,
  boxShadow,
  fontSize,
  lineHeight,
  borderRadius,
  fontWeight,
  cursorPointer,
  ...props
}) {
  const commonStyles = {
    fontSize: fontSize ? fontSize : "17px",
    padding: padding ? padding : "10px",
    borderRadius: borderRadius ? borderRadius : "8px",
    textTransform: "capitalize",
    width: width,
    margin: margin,
    minWidth: minWidth,
    lineHeight: lineHeight,
    boxShadow: boxShadow,
    fontWeight: fontWeight ? fontWeight : "600",
    cursor: cursorPointer ? cursorPointer : "pointer",
    ...props.sx,
  };

  const variantStyles = {
    outlined: {
      backgroundColor: "transparent",
      color: "#01933c",
      border: "1px solid #01933c",
      "&:hover": {
        backgroundColor: "#01933c",
        color: "#ffffff",
        boxShadow: boxShadow,
      },
    },
    contained: {
      backgroundColor: bgColor ? bgColor : "#01933c",
      color: fontColor ? fontColor : "#ffffff",
      "&:hover": {
        backgroundColor: hoverBgColor ? hoverBgColor : "#01933c",
        boxShadow: boxShadow,
      },
    },
  };

  return (
    <LoadingButton
      variant={variant}
      sx={{
        ...commonStyles,
        ...variantStyles[variant],
      }}
      {...props}
    >
      {children}
    </LoadingButton>
  );
}

export const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 36,
  height: 20,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: "#65C466",
        opacity: 1,
        border: 0,
        ...theme.applyStyles("dark", {
          backgroundColor: "#2ECA45",
        }),
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#33cf4d",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color: theme.palette.grey[100],
      ...theme.applyStyles("dark", {
        color: theme.palette.grey[600],
      }),
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: 0.7,
      ...theme.applyStyles("dark", {
        opacity: 0.3,
      }),
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 16,
    height: 16,
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: "#E9E9EA",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
    ...theme.applyStyles("dark", {
      backgroundColor: "#39393D",
    }),
  },
}));
