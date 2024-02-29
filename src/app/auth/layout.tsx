import React from "react";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      {children}
    </div>
  );
};

export default Layout;
