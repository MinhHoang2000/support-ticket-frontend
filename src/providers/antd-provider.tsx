"use client";

import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";

const theme = {
  token: {
    colorPrimary: "#6366F1",
    colorPrimaryHover: "#4F46E5",
    borderRadius: 8,
    colorBorder: "var(--border)",
    colorText: "var(--foreground)",
    colorTextPlaceholder: "var(--muted)",
    colorBgContainer: "var(--background)",
    colorBgElevated: "var(--background)",
    colorBorderSecondary: "var(--border)",
  },
  components: {
    Select: {
      selectorBg: "var(--background)",
      optionSelectedBg: "rgba(99, 102, 241, 0.1)",
      optionActiveBg: "var(--border)",
    },
    Input: {
      activeBorderColor: "#6366F1",
      hoverBorderColor: "var(--border)",
    },
    Pagination: {
      itemActiveBg: "#6366F1",
      itemActiveColor: "#ffffff",
      itemActiveColorHover: "#ffffff",
      itemBg: "color-mix(in srgb, var(--foreground) 10%, var(--background))",
    },
  },
};

export function AntdProvider({ children }: { children: React.ReactNode }) {
  return (
    <AntdRegistry>
      <ConfigProvider theme={theme}>{children}</ConfigProvider>
    </AntdRegistry>
  );
}
