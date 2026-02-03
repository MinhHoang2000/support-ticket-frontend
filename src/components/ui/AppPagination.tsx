"use client";

import { Pagination, PaginationProps } from "antd";

const paginationClassName = [
  "[&_.ant-pagination-item]:rounded-lg [&_.ant-pagination-prev]:rounded-lg [&_.ant-pagination-next]:rounded-lg",
  "[&_.ant-pagination-item]:min-w-9 [&_.ant-pagination-item]:border [&_.ant-pagination-item]:border-border [&_.ant-pagination-item]:transition-colors [&_.ant-pagination-item]:duration-200",
  "[&_.ant-pagination-item:hover]:border-primary/50 [&_.ant-pagination-item.ant-pagination-item-active]:border-primary [&_.ant-pagination-item.ant-pagination-item-active]:!bg-primary [&_.ant-pagination-item.ant-pagination-item-active:hover]:!bg-primary-hover [&_.ant-pagination-item.ant-pagination-item-active:hover]:border-primary-hover",
  "[&_.ant-pagination-prev.ant-pagination-disabled]:opacity-50 [&_.ant-pagination-next.ant-pagination-disabled]:opacity-50",
  "[&_.ant-pagination-options_.ant-select-selector]:rounded-lg [&_.ant-pagination-options_.ant-select-selector]:border-border [&_.ant-pagination-options_.ant-select-selector]:!bg-foreground/10",
].join(" ");

export type AppPaginationProps = PaginationProps & {
  className?: string;
};

export function AppPagination({
  className,
  showSizeChanger = true,
  size = "middle",
  ...props
}: AppPaginationProps) {
  return (
    <Pagination
      className={`${paginationClassName} ${className ?? ""}`}
      showSizeChanger={showSizeChanger}
      size={size}
      {...props}
    />
  );
}
