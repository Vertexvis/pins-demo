import { ExpandMore } from "@mui/icons-material";
import { Accordion, AccordionSummary, Drawer, Typography } from "@mui/material";
import { drawerClasses } from "@mui/material/Drawer";
import { styled } from "@mui/material/styles";
import React from "react";

import { Metadata } from "../lib/metadata";
import { RightDrawerWidth } from "./Layout";
import { MetadataProperties } from "./MetadataProperties";

interface Props {
  readonly metadata?: Metadata;
  readonly open: boolean;
}

const Title = styled((props) => <Typography variant="body2" {...props} />)(
  () => ({ textTransform: "uppercase" })
);

export function RightDrawer({ metadata, open }: Props): JSX.Element {
  return (
    <Drawer
      anchor="right"
      open={open}
      sx={{
        display: { sm: "block", xs: "none" },
        flexShrink: 0,
        width: RightDrawerWidth,
        [`& .${drawerClasses.paper}`]: { width: RightDrawerWidth },
      }}
      variant="persistent"
    >
      <Accordion defaultExpanded={true}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Title>Metadata Properties</Title>
        </AccordionSummary>
        <MetadataProperties metadata={metadata} />
      </Accordion>
    </Drawer>
  );
}
