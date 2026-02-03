"use client";

import { DownOutlined } from "@ant-design/icons";
import { Select, SelectProps } from "antd";

const selectClassName =
  "w-full rounded-lg border-border bg-background text-sm text-foreground transition-colors duration-200 [&_.ant-select]:h-10 [&_.ant-select-selector]:h-10 [&_.ant-select-selector]:rounded-lg [&_.ant-select-selector]:border [&_.ant-select-selector]:border-border [&_.ant-select-selector]:bg-background [&_.ant-select-selector]:px-3 [&_.ant-select-selector]:py-2 [&_.ant-select-selector]:text-sm [&_.ant-select-selector]:transition-colors [&_.ant-select-selector]:duration-200 [&_.ant-select:hover_.ant-select-selector]:border-primary/50 [&_.ant-select.ant-select-focused_.ant-select-selector]:border-primary [&_.ant-select.ant-select-focused_.ant-select-selector]:ring-2 [&_.ant-select.ant-select-focused_.ant-select-selector]:ring-primary/20 [&_.ant-select-suffix_svg]:fill-white [&_.ant-select-suffix_path]:fill-white";
const selectDropdownClassName =
  "rounded-lg border border-border bg-background shadow-lg [&_.ant-select-item]:text-foreground [&_.ant-select-item-option-active]:bg-muted/30 [&_.ant-select-item-option-selected]:bg-primary/10 [&_.ant-select-item-option-selected]:text-primary";

export type AppSelectOption = {
  value: string | number;
  label: React.ReactNode;
};

export type AppSelectProps<ValueType = string> = Omit<
  SelectProps<ValueType, AppSelectOption>,
  "options"
> & {
  options: AppSelectOption[];
  className?: string;
};

export function AppSelect<ValueType = string>({
  options,
  className,
  ...props
}: AppSelectProps<ValueType>) {
  return (
    <Select
      className={`${selectClassName} ${className ?? ""}`}
      classNames={{ popup: { root: selectDropdownClassName } }}
      options={options}
      suffixIcon={<DownOutlined />}
      {...props}
    />
  );
}
