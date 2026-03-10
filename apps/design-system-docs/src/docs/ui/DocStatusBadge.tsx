import { Badge } from "@limia/design-system";
import type { DocStatus } from "../types";
import { useLanguage } from "../../components/language-provider";

interface DocStatusBadgeProps {
  status: DocStatus;
  className?: string;
}

const statusVariantMap: Record<
  DocStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  draft: "secondary",
  beta: "default",
  stable: "outline",
  deprecated: "destructive",
};

export function DocStatusBadge({ status, className }: DocStatusBadgeProps) {
  const { t } = useLanguage();

  return (
    <Badge
      variant={statusVariantMap[status]}
      className={className ?? "font-mono text-[10px] uppercase tracking-wider"}
    >
      {t(`docs.status.${status}`)}
    </Badge>
  );
}
