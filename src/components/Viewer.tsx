/* @jsx jsx */ /** @jsxRuntime classic */ import { jsx } from "@emotion/react";
import { vertexvis } from "@vertexvis/frame-streaming-protos";
import type { TapEventDetails } from "@vertexvis/viewer";
import { JSX as ViewerJSX } from "@vertexvis/viewer";
import {
  VertexViewer,
  VertexViewerDomRenderer,
  VertexViewerToolbar,
  VertexViewerViewCube,
} from "@vertexvis/viewer-react";
import React from "react";

import { StreamCredentials } from "../lib/config";
import pins from "../pin-config.json";
import { CameraPin } from "./pins/CameraPin";
import { Pin } from "./pins/Pin";
import { VideoPlayer } from "./VideoPlayer";
import { ViewerSpeedDial } from "./ViewerSpeedDial";

interface ViewerProps extends ViewerJSX.VertexViewer {
  readonly credentials: StreamCredentials;
  readonly viewer: React.MutableRefObject<HTMLVertexViewerElement | null>;
}

export interface ActionProps {
  icon: React.ReactNode;
  name: string;
  onClick: () => void;
}

type ViewerComponentType = React.ComponentType<
  ViewerProps & React.RefAttributes<HTMLVertexViewerElement>
>;

type HOCViewerProps = React.RefAttributes<HTMLVertexViewerElement>;

interface OnSelectProps extends HOCViewerProps {
  readonly onSelect: (hit?: vertexvis.protobuf.stream.IHit) => Promise<void>;
}

export const AnimationDurationMs = 1500;
export const Viewer = onTap(UnwrappedViewer);

function UnwrappedViewer({
  credentials,
  viewer,
  ...props
}: ViewerProps): JSX.Element {
  const [video, setVideo] = React.useState<string | undefined>();

  return (
    <VertexViewer
      clientId={credentials.clientId}
      css={{ height: "100%", width: "100%" }}
      ref={viewer}
      src={`urn:vertexvis:stream-key:${credentials.streamKey}`}
      depthBuffers="final"
      {...props}
    >
      <VertexViewerToolbar placement="top-right">
        <VertexViewerViewCube
          css={{ marginRight: "32px" }}
          animationDuration={AnimationDurationMs}
          viewer={viewer.current ?? undefined}
        />
      </VertexViewerToolbar>
      <VertexViewerToolbar placement="bottom-right">
        <ViewerSpeedDial viewer={viewer} />
      </VertexViewerToolbar>
      <VertexViewerDomRenderer drawMode="2d">
        {pins.cameras.map((p, i) => (
          <CameraPin
            key={`camera-${i}`}
            id={p.id}
            position={JSON.stringify(p.position)}
            onClick={setVideo}
          />
        ))}

        {pins.data.map((p, i) => (
          <Pin
            key={`data-${i}`}
            text={p.label}
            position={JSON.stringify(p.position)}
            smoothingFactor={p.smoothing}
            startingValue={p.startingValue}
          />
        ))}
      </VertexViewerDomRenderer>
      <VideoPlayer id={video} onClose={() => setVideo(undefined)} />
    </VertexViewer>
  );
}

function onTap<P extends ViewerProps>(
  WrappedViewer: ViewerComponentType
): React.FunctionComponent<P & OnSelectProps> {
  return function Component({ viewer, onSelect, ...props }: P & OnSelectProps) {
    async function handleTap(e: CustomEvent<TapEventDetails>) {
      if (props.onTap) props.onTap(e);

      if (!e.defaultPrevented) {
        const scene = await viewer.current?.scene();
        const raycaster = scene?.raycaster();

        if (raycaster != null) {
          const res = await raycaster.hitItems(e.detail.position, {
            includeMetadata: true,
          });
          const hit = (res?.hits ?? [])[0];
          await onSelect(hit);
        }
      }
    }

    return <WrappedViewer viewer={viewer} {...props} onTap={handleTap} />;
  };
}
