"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ApiError, getClinicMe, type TherapistProfile } from "@/lib/api";

type State =
  | { status: "loading" }
  | { status: "ready"; therapist: TherapistProfile }
  | { status: "needs-onboarding" }
  | { status: "unauthenticated" };

/**
 * Loads the logged-in therapist's clinic profile. Redirects to /login if
 * there's no session, or to /clinic/onboarding if the account hasn't
 * finished becoming a clinic account yet (see POST /api/clinic/register).
 * Pages that don't want the redirect behavior can ignore `redirect` and
 * just read `state`.
 */
export function useClinicMe(options?: { redirect?: boolean }) {
  const redirect = options?.redirect ?? true;
  const router = useRouter();
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;

    getClinicMe()
      .then(({ therapist }) => {
        if (!cancelled) setState({ status: "ready", therapist });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 401) {
          setState({ status: "unauthenticated" });
          if (redirect) router.replace("/login");
        } else if (err instanceof ApiError && err.code === "THERAPIST_ACCOUNT_REQUIRED") {
          setState({ status: "needs-onboarding" });
          if (redirect) router.replace("/clinic/onboarding");
        } else {
          setState({ status: "unauthenticated" });
        }
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return state;
}
