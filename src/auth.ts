import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

// 动态创建 Supabase 客户端（避免构建时错误）
function getSupabaseClient() {
  const { createClient } = require("@supabase/supabase-js");
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    return null;
  }
  
  return createClient(supabaseUrl, supabaseKey);
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Email",
      credentials: {
        email: { label: "邮箱", type: "email" },
        password: { label: "密码", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;

        // If Supabase is not configured, skip auth
        const supabase = getSupabaseClient();
        if (!supabase) {
          console.warn("Supabase not configured, skipping auth");
          return null;
        }

        const email = credentials.email as string;

        try {
          // 查找或创建用户
          const { data: profile, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("email", email)
            .single();

          if (error && error.code === "PGRST116") {
            // 用户不存在，创建新用户
            const { data: newProfile, error: createError } = await supabase
              .from("profiles")
              .insert({
                id: crypto.randomUUID(),
                email,
                full_name: email.split("@")[0],
                avatar_url: null,
              })
              .select()
              .single();

            if (createError) {
              console.error("Create profile error:", createError);
              return null;
            }

            return {
              id: newProfile.id,
              email: newProfile.email,
              name: newProfile.full_name,
              image: newProfile.avatar_url,
            };
          }

          if (error) {
            console.error("Auth error:", error);
            return null;
          }

          return {
            id: profile.id,
            email: profile.email,
            name: profile.full_name,
            image: profile.avatar_url,
          };
        } catch (e) {
          console.error("Auth exception:", e);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
  },
});
