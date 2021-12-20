import VideoCameraBackIcon from "@mui/icons-material/VideoCameraBack";
import { Tooltip } from "@mui/material";
import Fab from "@mui/material/Fab";
import { VertexViewerDomElement } from "@vertexvis/viewer-react";
import React from "react";

import styles from "./CameraPin.module.css";

type PinProps = {
  readonly id: string;
  readonly position: string;
  readonly onClick: (id: string) => void;
};

export function CameraPin({ id, onClick, position }: PinProps): JSX.Element {
  return (
    <VertexViewerDomElement positionJson={position} className={styles.pin}>
      <Tooltip title={`Play ${id}`}>
        <Fab size="small" onClick={() => onClick(id)} color="primary">
          <VideoCameraBackIcon sx={{ color: "white" }} />
        </Fab>
      </Tooltip>
    </VertexViewerDomElement>
  );
}
