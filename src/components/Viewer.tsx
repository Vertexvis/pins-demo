/* @jsx jsx */ /** @jsxRuntime classic */ import { jsx } from "@emotion/react";
import { vertexvis } from "@vertexvis/frame-streaming-protos";
import type {
  JSX as ViewerJSX,
  TapEventDetails,
  VertexViewerCustomEvent,
} from "@vertexvis/viewer";
import {
  VertexViewer,
  VertexViewerDomRenderer,
  VertexViewerToolbar,
  VertexViewerViewCube,
} from "@vertexvis/viewer-react";
import React from "react";

import { StreamCredentials } from "../lib/config";
import { Pin } from "./pins/Pin";
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
  return (
    <VertexViewer
      clientId={credentials.clientId}
      css={{ height: "100%", width: "100%" }}
      ref={viewer}
      src={`urn:vertex:stream-key:${credentials.streamKey}`}
      depthBuffers="all"
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
        <Pin
          text="Main Shaft"
          position={`[6500, 23530, 14800]`}
          smoothingFactor={4}
        />
        <Pin
          text="Brake"
          position={`[5476, 23840, 14760]`}
          startingValue={0.2}
          smoothingFactor={6}
        />
        <Pin text="Generator" position={`[4800, 23900, 14850]`} />
      </VertexViewerDomRenderer>
    </VertexViewer>
  );
}

function onTap<P extends ViewerProps>(
  WrappedViewer: ViewerComponentType
): React.FunctionComponent<P & OnSelectProps> {
  return function Component({ viewer, onSelect, ...props }: P & OnSelectProps) {
    async function handleTap(e: VertexViewerCustomEvent<TapEventDetails>) {
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
