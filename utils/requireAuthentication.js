import { getSession } from "next-auth/react";

export const requireAuthentication = async (context, cb) => {
  const session = await getSession(context);

  console.log(session);

  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }

  return cb({ session });
};

export const requireAdminAuthentication = async (context, cb) => {
  const session = await getSession(context);

  console.log(session);

  if (session.user) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }

  return cb({ session });
};
