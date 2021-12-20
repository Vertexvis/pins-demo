import CloseIcon from "@mui/icons-material/Close";
import { Tooltip } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";

import styles from "./VideoPlayer.module.css";

export type VideoProps = {
  readonly id?: string;
  readonly onClose?: () => void;
};

export function VideoPlayer({ id, onClose }: VideoProps): JSX.Element {
  if (!id) return <></>;

  return (
    <div className={styles.player}>
      <CircularProgress />

      <p>Playing video {id}...</p>
      <small className={styles.disclaimer}>
        This is only for demo purposes. No video will actually load here.
      </small>

      <Tooltip title="Close">
        <IconButton onClick={onClose} className={styles.close}>
          <CloseIcon sx={{ color: "white" }} />
        </IconButton>
      </Tooltip>
    </div>
  );
}
