import React from "react";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => (
  <main className="w-screen h-screen">{children}</main>
);

export default Layout;
