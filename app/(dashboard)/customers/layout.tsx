import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import React, { ReactNode } from "react";

const CustomerLayout = async ({ children }: { children: ReactNode }) => {
  const session = await getServerSession(authOptions);

  if (!session?.user) return <div>Plese login to see the customer details</div>;

  return <>{children}</>;
};

export default CustomerLayout;
