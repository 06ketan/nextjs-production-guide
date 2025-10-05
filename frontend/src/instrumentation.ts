import { PHASE_PRODUCTION_BUILD } from "next/constants";
import logStartupValues from "@/lib/logger/log-startup-values";

export async function register() {
  if (process?.env?.NEXT_RUNTIME === "nodejs") {
    console.log("==== Environment Variables ====");
    logStartupValues();
    console.log("===============================");

    console.log(
      "[instrumentation] BUILD_ID (runtime):",
      process?.env?.BUILD_ID ?? "undefined"
    );

    if (process?.env?.NEXT_PHASE !== PHASE_PRODUCTION_BUILD) {
      import("@/lib/cache/build-cache-manager")
        .then(({ checkAndPurgeBuildCache }) => {
          checkAndPurgeBuildCache()?.catch((err) => {
            console.warn(
              `[instrumentation] ⚠️ Build cache check failed: ${err?.message}`
            );
          });
        })
        .catch((err) => {
          console.warn(
            `[instrumentation] ⚠️ Failed to load build cache manager: ${err?.message}`
          );
        });
    }
  }
}
