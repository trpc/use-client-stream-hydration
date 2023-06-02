// app/providers.jsx
"use client";

import {
  ContextOptions,
  DehydratedState,
  dehydrate,
  hydrate,
  useQueryClient,
} from "@tanstack/react-query";
import React, { useRef, useState } from "react";
import {
  HydrationStreamProviderProps,
  createHydrationStreamProvider,
} from "./HydrationStreamProvider";

const stream = createHydrationStreamProvider<DehydratedState>();

/**
 * This component is responsible for:
 * - hydrating the query client on the server
 * - dehydrating the query client on the server
 */
export function ReactQueryStreamedHydration(props: {
  children: React.ReactNode;
  context?: ContextOptions["context"];
  transformer?: HydrationStreamProviderProps<DehydratedState>["transformer"];
}) {
  const queryClient = useQueryClient({
    context: props.context,
  });

  // <server only>
  const isSubscribed = useRef(false);
  /**
   * We need to track which queries were added/updated during the render
   */
  const [trackedKeys] = useState(() => new Set<string>());
  /**
   * Track which queries were already passed to the client so we don't pass them again
   */
  // const [passedKeys] = useState(() => new Set<string>());

  const cache = queryClient.getQueryCache();

  if (typeof window === "undefined" && !isSubscribed.current) {
    // Do we need to care about unsubscribing? I don't think so to be honest
    cache.subscribe((event) => {
      switch (event.type) {
        case "added":
        case "updated":
          console.log(
            "tracking",
            event.query.queryHash,
            "b/c of a",
            event.type
          );
          trackedKeys.add(event.query.queryHash);
      }
    });
  }
  // </server only>

  return (
    <stream.Provider
      // Happens on server:
      onFlush={() => {
        /**
         * Dehydrated state of the client where we only include the queries that were added/updated since the last flush
         */
        const dehydratedState = dehydrate(queryClient, {
          shouldDehydrateQuery(query) {
            const shouldDehydrate =
              trackedKeys.has(query.queryHash) &&
              // !passedKeys.has(query.queryHash) &&
              query.state.status !== "loading";

            // passedKeys.add(query.queryHash);
            return shouldDehydrate;
          },
        });
        trackedKeys.clear();

        if (!dehydratedState.queries.length) {
          return [];
        }

        return [dehydratedState];
      }}
      // Happens in browser:
      onEntries={(entries) => {
        for (const hydratedState of entries) {
          hydrate(queryClient, hydratedState);
        }
      }}
      // Handle BigInts etc using superjson
      transformer={props.transformer}
    >
      {props.children}
    </stream.Provider>
  );
}
