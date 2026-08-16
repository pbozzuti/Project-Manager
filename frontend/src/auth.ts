import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const ALLOWED_DOMAIN = process.env.ALLOWED_GOOGLE_DOMAIN ?? "adamstheatrecompany.com";
const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8000";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      authorization: {
        params: {
          // Hints Google's account chooser to the org — a UX nicety, not the
          // actual enforcement. Real enforcement is either the OAuth consent
          // screen being set to "Internal" (Google rejects outside accounts
          // before consent) or the signIn callback check below.
          hd: ALLOWED_DOMAIN,
          prompt: "select_account",
        },
      },
    }),
  ],
  pages: {
    signIn: "/",
  },
  callbacks: {
    async signIn({ profile }) {
      const email = profile?.email ?? "";
      const hd = (profile as { hd?: string } | undefined)?.hd;

      if (hd !== ALLOWED_DOMAIN && !email.toLowerCase().endsWith(`@${ALLOWED_DOMAIN}`)) {
        return false;
      }

      try {
        await fetch(`${BACKEND_URL}/users/upsert`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            name: profile?.name,
            picture: (profile as { picture?: string } | undefined)?.picture,
          }),
        });
      } catch (err) {
        // Don't block sign-in if the backend happens to be down — the user
        // still gets a valid session, they just won't show up in /users yet.
        console.error("Failed to sync user to backend:", err);
      }

      return true;
    },
  },
});
