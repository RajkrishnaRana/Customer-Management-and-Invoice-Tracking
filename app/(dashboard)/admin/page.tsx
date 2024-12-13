import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import React from "react";

const page = async () => {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    return (
      <h2 className="text-2xl">
        Admin page - welcome back {session?.user.name}
      </h2>
    );
  }

  return <div>Welcome to {session?.user.name}</div>;
};

export default page;
