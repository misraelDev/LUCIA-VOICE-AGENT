"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { AlertCircle, ChevronDown, LucideIcon } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
}

export interface InputWithIconProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange"
> {
  icon?: LucideIcon;
  label?: string;
  error?: string;
  success?: boolean;
  hint?: string;
  suffixIcon?: LucideIcon;
  onSuffixIconClick?: () => void;
  onChange?: (value: string) => void;
  onFileChange?: (file: File | null) => void;
  options?: SelectOption[];
  multiline?: boolean;
  rows?: number;
}

export const InputWithIcon = React.forwardRef<
  HTMLInputElement,
  InputWithIconProps
>(
  (
    {
      icon: Icon,
      label,
      error,
      success,
      hint,
      suffixIcon: SuffixIcon,
      onSuffixIconClick,
      onChange,
      onFileChange,
      options,
      multiline,
      rows = 4,
      className,
      disabled,
      required,
      type,
      value,
      placeholder,
      name,
      id,
      onBlur,
      readOnly,
      autoComplete,
      tabIndex,
      ...props
    },
    ref,
  ) => {
    const isFile = type === "file";
    const isSelect = !!options;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (isFile) {
        onFileChange?.(e.target.files?.[0] ?? null);
      } else {
        onChange?.(e.target.value);
      }
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      onChange?.(e.target.value);
    };

    const handleTextareaChange = (
      e: React.ChangeEvent<HTMLTextAreaElement>,
    ) => {
      onChange?.(e.target.value);
    };

    return (
      <div className="space-y-1.5">
        {label && (
          <label className="text-sm font-medium text-foreground flex items-center gap-1">
            {label}
            {required && <span className="text-destructive">*</span>}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <span
              className={cn(
                "absolute left-0 flex h-10 w-10 items-center justify-center border-r border-input text-muted-foreground",
                multiline ? "top-0" : "top-1/2 -translate-y-1/2",
              )}
            >
              <Icon className="h-4 w-4" />
            </span>
          )}
          {multiline ? (
            <textarea
              name={name}
              id={id}
              onBlur={
                onBlur as
                  | React.FocusEventHandler<HTMLTextAreaElement>
                  | undefined
              }
              readOnly={readOnly}
              autoComplete={autoComplete}
              tabIndex={tabIndex}
              value={(value ?? "") as string}
              onChange={handleTextareaChange}
              placeholder={placeholder}
              disabled={disabled}
              rows={rows}
              className={cn(
                "w-full rounded-lg border bg-background px-3 py-2 text-sm transition-colors resize-y",
                "placeholder:text-muted-foreground",
                "focus:outline-none",
                "disabled:cursor-not-allowed disabled:opacity-50",
                Icon && "pl-12",
                error && "border-destructive",
                success && "border-emerald-500",
                !error && !success && "border-gray-300 dark:border-gray-600",
                className,
              )}
            />
          ) : isSelect ? (
            <>
              <select
                name={name}
                id={id}
                onBlur={
                  onBlur as
                    | React.FocusEventHandler<HTMLSelectElement>
                    | undefined
                }
                autoComplete={autoComplete}
                tabIndex={tabIndex}
                disabled={disabled}
                value={value as string}
                onChange={handleSelectChange}
                className={cn(
                  "h-10 w-full rounded-lg border bg-background px-3 py-2 text-sm transition-colors appearance-none",
                  "focus:outline-none",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                  Icon && "pl-12",
                  "pr-10",
                  error && "border-destructive",
                  success && "border-emerald-500",
                  !error && !success && "border-gray-300 dark:border-gray-600",
                  className,
                )}
              >
                {options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <span className="absolute right-0 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center text-muted-foreground pointer-events-none">
                <ChevronDown className="h-4 w-4" />
              </span>
            </>
          ) : (
            <input
              ref={ref}
              type={type}
              name={name}
              id={id}
              onBlur={onBlur}
              readOnly={readOnly}
              autoComplete={autoComplete}
              tabIndex={tabIndex}
              value={value as string}
              placeholder={placeholder}
              disabled={disabled}
              className={cn(
                "h-10 w-full rounded-lg border bg-background px-3 py-2 text-sm transition-colors",
                "placeholder:text-muted-foreground",
                "focus:outline-none",
                "disabled:cursor-not-allowed disabled:opacity-50",
                Icon && "pl-12",
                SuffixIcon && "pr-10",
                isFile &&
                  "file:border-0 file:bg-transparent file:text-sm file:font-medium py-1.5",
                error && "border-destructive",
                success && "border-emerald-500",
                !error && !success && "border-gray-300 dark:border-gray-600",
                className,
              )}
              onChange={handleChange}
              {...props}
            />
          )}
          {!isSelect && SuffixIcon && (
            <button
              type="button"
              onClick={onSuffixIconClick}
              disabled={disabled}
              className={cn(
                "absolute right-0 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center text-muted-foreground",
                "hover:text-foreground transition-colors",
                disabled && "cursor-not-allowed opacity-50",
              )}
            >
              <SuffixIcon className="h-4 w-4" />
            </button>
          )}
        </div>
        {(error || hint) && (
          <div
            className={cn(
              "text-sm flex items-start gap-2",
              error && "text-destructive",
              success && !error && "text-emerald-500",
              !error && !success && "text-muted-foreground",
            )}
          >
            {error && (
              <AlertCircle
                className="h-4 w-4 mt-0.5 shrink-0"
                aria-hidden="true"
              />
            )}
            <p className="leading-snug">{error || hint}</p>
          </div>
        )}
      </div>
    );
  },
);

InputWithIcon.displayName = "InputWithIcon";
