import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import React from "react";

import { Home } from "../components/Home";
import { Config, Configuration } from "../lib/config";

export interface Props {
  readonly config: Configuration;
}

export default function Index(props: Props): JSX.Element {
  return <Home {...props} />;
}

export async function getServerSideProps(
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<Props>> {
  const empty = { props: { config: Config } };
  const host = context.req.headers.host;
  if (!host) return empty;

  return empty
}
