import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const StatsCardIcon = ({ children }: { children: React.ReactNode }) => {
  return (
    <span className="bg-accent flex size-8 items-center justify-center rounded-full">
      {children}
    </span>
  );
};

export const StatsCardHeader = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <CardHeader className={cn("flex items-center gap-2 p-0", className)}>
      {children}
    </CardHeader>
  );
};

export const StatsCardDescription = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <CardDescription
      className={cn("text-muted-foreground text-sm font-semibold", className)}
    >
      {children}
    </CardDescription>
  );
};

export const StatsCardTitle = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <CardTitle className={cn("text-2xl font-bold text-black", className)}>
      {children}
    </CardTitle>
  );
};

export const StatsCard = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <Card className={cn("gap-2 px-5 py-5", className)}>{children}</Card>;
};
