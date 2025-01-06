import { v4 as uuid } from "uuid";
import { encode as defaultEncode } from "next-auth/jwt";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import GitLab from "next-auth/providers/gitlab";
import Google from "next-auth/providers/google";
import { schema } from "@/libs/schema";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/libs/dbConfig/prisma";

const adapter = PrismaAdapter(prisma);

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter,
    providers: [
        GitHub,
        GitLab,
        Google,
        Credentials({
        credentials: {
            email: {},
            password: {},
        },
            authorize: async (credentials) => {
                const validatedCredentials = schema.parse(credentials);

                const user = await prisma.user.findFirst({
                where: {
                    email: validatedCredentials.email,
                    password: validatedCredentials.password,
                },
                });

                if (!user) {
                throw new Error("Invalid credentials.");
                }

                return user;
            },
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
