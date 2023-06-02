Streamed hydration with `"use client"` components using `@tanstack/react-query`.

Demo: https://use-client-stream-hydration.vercel.app/

## How this works

- We use `suspense: true` in our `useQuery()`-calls
- The requests gets initialize on the server
- We use Next.js' `useServerInsertedHTML()` to insert `<script>`-tags with dehydrated state of the request results.
- The browser subscribes to the data changes in said `<script>`-tags and updates the React Query cache

### Known limitations

- If the browser tree re-renders while the data is fetching, we'll initialize the request in the browser
- This is not "true" SSR and requires JS - the server does stream data to the browser, but if you View Source, you'll see that the DOM will only the suspense boundaries' fallbacks
