"use client";
import { useQuery } from "@tanstack/react-query";
import { Suspense } from "react";

function getBaseURL() {
  if (typeof window !== "undefined") {
    return "";
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}
const baseUrl = getBaseURL();
function useWaitQuery(props: { wait: number }) {
  const query = useQuery({
    queryKey: ["wait", props.wait],
    queryFn: async () => {
      const path = `/api/wait?wait=${props.wait}`;
      console.log("fetching", path);

      const url = baseUrl + path;
      const res: string = await (
        await fetch(url, {
          cache: "no-store",
        })
      ).json();
      return res;
    },
    suspense: true,
  });

  return [query.data as string, query] as const;
}

function MyComponent(props: { wait: number }) {
  const [data] = useWaitQuery(props);

  return <div>result: {data}</div>;
}

export default function MyPage() {
  return (
    <>
      <Suspense fallback={<div>waiting 100....</div>}>
        <MyComponent wait={100} />
      </Suspense>
      <Suspense fallback={<div>waiting 200....</div>}>
        <MyComponent wait={200} />
      </Suspense>
      <Suspense fallback={<div>waiting 300....</div>}>
        <MyComponent wait={300} />
      </Suspense>
      <Suspense fallback={<div>waiting 400....</div>}>
        <MyComponent wait={400} />
      </Suspense>
      <Suspense fallback={<div>waiting 500....</div>}>
        <MyComponent wait={500} />
      </Suspense>
      <Suspense fallback={<div>waiting 600....</div>}>
        <MyComponent wait={600} />
      </Suspense>
      <Suspense fallback={<div>waiting 700....</div>}>
        <MyComponent wait={700} />
      </Suspense>
      <Suspense fallback={<div>waiting 800....</div>}>
        <MyComponent wait={800} />
      </Suspense>
      <Suspense fallback={<div>waiting 900....</div>}>
        <MyComponent wait={900} />
      </Suspense>
      <Suspense fallback={<div>waiting 1000....</div>}>
        <MyComponent wait={1000} />
      </Suspense>

      <fieldset>
        <legend>
          combined <code>Suspense</code>-container
        </legend>
        <Suspense
          fallback={
            <>
              <div>waiting 2000....</div>
              <div>waiting 3000....</div>
              <div>waiting 4000....</div>
            </>
          }
        >
          <MyComponent wait={1000} />
          <MyComponent wait={2000} />

          <MyComponent wait={3000} />
        </Suspense>
      </fieldset>
    </>
  );
}
