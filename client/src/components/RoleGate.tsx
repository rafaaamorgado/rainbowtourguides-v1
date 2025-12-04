import { ReactNode } from "react";
import { getUser } from "@/lib/auth";
import { Link } from "wouter";
import type { Role } from "@shared/schema";

interface RoleGateProps {
  allowedRoles: Role[];
  children: ReactNode;
}

export default function RoleGate({ allowedRoles, children }: RoleGateProps) {
  const user = getUser();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="text-center p-8 bg-card rounded-2xl border border-border shadow-lg max-w-md">
          <i className="fas fa-lock text-4xl text-muted-foreground mb-4"></i>
          <h2 className="text-2xl font-bold mb-2">Authentication Required</h2>
          <p className="text-muted-foreground mb-6">
            Please sign in to access this page.
          </p>
          <Link href="/auth/demo-login">
            <a className="inline-flex items-center px-6 py-3 rainbow-gradient text-white rounded-lg font-semibold hover:opacity-90 transition-opacity">
              Sign In
            </a>
          </Link>
        </div>
      </div>
    );
  }

  if (!allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="text-center p-8 bg-card rounded-2xl border border-border shadow-lg max-w-md">
          <i className="fas fa-exclamation-triangle text-4xl text-destructive mb-4"></i>
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-muted-foreground mb-6">
            You don't have permission to view this page.
          </p>
          <Link href="/">
            <a className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity">
              Go Home
            </a>
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
