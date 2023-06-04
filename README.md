Streamed hydration with `"use client"` components using `@tanstack/react-query`.

Demo: https://use-client-stream-hydration.vercel.app/

## How this works

- We use `suspense: true` in our `useQuery()`-calls
- The API-requests from the `useQuery`-hooks get initialize on the server
- We use Next.js' `useServerInsertedHTML()` to insert `<script>`-tags with dehydrated state of the request results.
- The browser subscribes to the data changes in said `<script>`-tags and updates the React Query cache

### Known limitations

- If the browser tree re-renders while the data is fetching, we'll initialize the request in the browser
- This is not "true" SSR and requires JS - the server does stream data to the browser, but if you View Source, you'll see that the DOM will only contain the suspense boundaries' fallbacks and not the DOM

## Prior art

- Apollo RFC: "The Next.js "App Router", React Server Component & "SSR with Suspense" story
  " for Apollo - https://github.com/apollographql/apollo-client-nextjs/blob/pr/RFC-2/RFC.md
- urql PR: "support Next 13 and React Server Components" - https://github.com/urql-graphql/urql/pull/3214
