import { v4 as uuid } from "uuid";
import bcrypt from 'bcryptjs';
import { ZodError } from "zod";
import { encode as defaultEncode } from "next-auth/jwt";
import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import GitLab from "next-auth/providers/gitlab";
import Google from "next-auth/providers/google";
import { signInSchema } from "@/libs/loginSchema";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/libs/dbConfig/prisma";

const adapter = PrismaAdapter(prisma);

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter,
    providers: [
        GitHub({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
        }),
        GitLab({
            clientId: process.env.GITLAB_CLIENT_ID,
            clientSecret: process.env.GITLAB_CLIENT_SECRET,
        }),
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        Credentials({
        credentials: {
            email: {label: "Email", type: "email"},
            password: { label: "Password", type: "password" },
        },

        authorize: async (credentials) => {
            try {
                const { email, password } = signInSchema.parse(credentials);
                const user = await prisma.user.findUnique({ where: { email } });
                if (!user) {
                    throw new Error("No user found");
                }
                const isValid = await bcrypt.compare(password, user.password);
                if (!isValid) {
                    throw new Error("Invalid password");
                }
                return user;
            } catch (error) {
                if (error instanceof ZodError) {
                    throw new Error("Invalid input");
                }
                throw error;
            }
        }
        
        }),
    ],
    callbacks: {
        async jwt({ token, account }) {
        if (account?.provider === "credentials") {
            token.credentials = true;
        }
        return token;
        },
    },
    jwt: {
        encode: async function (params) {
        if (params.token?.credentials) {
            const sessionToken = uuid();

            if (!params.token.sub) {
            throw new Error("No user ID found in token");
            }

            const createdSession = await adapter?.createSession?.({
            sessionToken: sessionToken,
            userId: params.token.sub,
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            });

            if (!createdSession) {
            throw new Error("Failed to create session");
            }

            return sessionToken;
        }
        return defaultEncode(params);
        },
    },
});
