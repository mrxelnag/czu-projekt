import * as React from "react";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    const [visible, setVisible] = React.useState(false);

    const isPassword = type === "password";
    const inputType = isPassword ? (visible ? "text" : "password") : type;

    return (
      <div className="relative w-full">
        <input
          type={inputType}
          className={cn(
            "hide-password-toggle border-input file:text-foreground placeholder:text-muted-foreground focus-visible:ring-ring dark:bg-input/30 flex h-9 w-full rounded-md border px-3 py-1 text-base shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            className,
          )}
          ref={ref}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            className="text-muted-foreground absolute inset-y-0 right-3 flex items-center"
            onClick={() => setVisible(!visible)}
          >
            {visible ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
        <style>{`.hide-password-toggle::-ms-reveal,.hide-password-toggle::-ms-clear {visibility: hidden;pointer-events: none; display: none;}`}</style>
      </div>
    );
  },
);

Input.displayName = "Input";

export { Input };
