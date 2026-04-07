import * as React from "react";

import { cn } from "../lib/utils";

const MATERIAL_SYMBOLS_STYLESHEET_ID = "limia-material-symbols-stylesheet";
const MATERIAL_SYMBOLS_STYLESHEET_URL =
  "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD,ROND@24,400,0,0,100";

type IconProps = Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> & {
  name: string;
  size?: number | string;
};

const Icon = React.forwardRef<HTMLSpanElement, IconProps>(
  ({ name, size = "1em", className, style, title, "aria-hidden": ariaHidden, ...props }, ref) => {
    React.useEffect(() => {
      if (typeof document === "undefined") return;
      if (document.getElementById(MATERIAL_SYMBOLS_STYLESHEET_ID)) return;

      const link = document.createElement("link");
      link.id = MATERIAL_SYMBOLS_STYLESHEET_ID;
      link.rel = "stylesheet";
      link.href = MATERIAL_SYMBOLS_STYLESHEET_URL;
      document.head.appendChild(link);
    }, []);

    const computedStyle = {
      fontSize: typeof size === "number" ? `${size}px` : size,
      ...style,
    };

    const decorative = title == null && ariaHidden === undefined;

    return (
      <span
        ref={ref}
        className={cn("limia-icon", className)}
        style={computedStyle}
        title={title}
        aria-hidden={decorative ? true : ariaHidden}
        {...props}
      >
        {name}
      </span>
    );
  },
);

Icon.displayName = "Icon";

export { Icon };
export type { IconProps };
