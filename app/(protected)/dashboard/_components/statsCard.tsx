import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const StatsCardIcon = ({ children }: { children: React.ReactNode }) => {
  return (
    <span className="bg-accent flex size-8 items-center justify-center rounded-full">
      {children}
    </span>
  );
};

export const StatsCardHeader = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <CardHeader className="flex items-center gap-2 p-0">{children}</CardHeader>
  );
};

export const StatsCardDescription = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <CardDescription className="text-muted-foreground text-sm font-semibold">
      {children}
    </CardDescription>
  );
};

export const StatsCardTitle = ({ children }: { children: React.ReactNode }) => {
  return (
    <CardTitle className="text-2xl font-bold text-black">{children}</CardTitle>
  );
};

export const StatsCard = ({ children }: { children: React.ReactNode }) => {
  return <Card className="gap-2 px-5 py-5">{children}</Card>;
};
