import React, { createContext, useContext, useState, ReactNode } from "react";

export type AnimationGateContextValue = {
  animationsReady: boolean;
  setAnimationsReady: (ready: boolean) => void;
};

const AnimationGateContext = createContext<
  AnimationGateContextValue | undefined
>(undefined);

export function AnimationGateProvider({
  children,
  initialReady = false,
}: {
  children: ReactNode;
  initialReady?: boolean;
}) {
  const [animationsReady, setAnimationsReady] = useState<boolean>(initialReady);

  return (
    <AnimationGateContext.Provider
      value={{ animationsReady, setAnimationsReady }}
    >
      {children}
    </AnimationGateContext.Provider>
  );
}

export function useAnimationGate() {
  const ctx = useContext(AnimationGateContext);
  if (!ctx) {
    throw new Error(
      "useAnimationGate must be used within AnimationGateProvider"
    );
  }
  return ctx;
}
