"use client";

import React, { Component, type ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log error to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("ErrorBoundary caught an error:", error, errorInfo);
    }
  }

  handleReload = (): void => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-primary-50 px-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-primary-900 mb-3">
              Something went wrong
            </h1>
            <p className="text-muted mb-6">
              We apologize for the inconvenience. An unexpected error occurred. Please try
              refreshing the page or contact us if the problem persists.
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={this.handleReload}
              className="inline-flex items-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Reload Page
            </Button>
            <p className="mt-4 text-sm text-muted">
              If you continue to experience issues, please contact us at{" "}
              <a
                href="mailto:hello@hisdayspring.org"
                className="text-accent-600 hover:underline"
              >
                hello@hisdayspring.org
              </a>
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
