import NextAuth, { authConfig } from "./[...nextAuth]";

const handler = NextAuth(authConfig);

export { handler as GET, handler as POST };