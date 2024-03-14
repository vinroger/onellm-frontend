// import { useNexusUser } from "@nexus/utils/contexts/user";
// eslint-disable-next-line import/no-extraneous-dependencies
// import * as Sentry from "@sentry/nextjs";
import React, { Component, ErrorInfo, ReactNode } from "react";
import { useRouter } from "next/router";

interface Props {
  children?: ReactNode;
  fallBackUI?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
}

const DefaultError = () => (
  <p>Something went wrong. Try refreshing the page or come back later.</p>
);

class ErrorBoundaryInner extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  public static getDerivedStateFromError(): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.props.onError?.(error, errorInfo);
    if (process.env.NEXT_PUBLIC_ENVIRONMENT !== "production") {
      console.error("Uncaught error:", error, errorInfo);
    }
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallBackUI || <DefaultError />;
    }

    return this.props.children;
  }
}

export const ErrorBoundary = (
  props: Omit<Props, "onError"> & { name: string }
): JSX.Element => {
  const router = useRouter();

  return <ErrorBoundaryInner {...props} />;
};

export default ErrorBoundary;
