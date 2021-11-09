import { Box, Link } from "@mui/material";
import React from "react";

export function Header(): JSX.Element {
  return (
    <Box
      sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}
    >
      <Link
        href="https://github.com/Vertexvis/pins-demo"
        rel="noreferrer"
        sx={{ marginLeft: "auto" }}
        target="_blank"
      >
        View on GitHub
      </Link>
    </Box>
  );
}
