"use client";

import ErrorComponent from "../error";

function createServerError(message: string): Error & { digest?: string } {
  const err = new Error(message);
  return err as Error & { digest?: string };
}

export default function ServerErrorPage() {
  const serverError = createServerError("Server Error");
  return <ErrorComponent error={serverError} reset={() => {}} />;
}
