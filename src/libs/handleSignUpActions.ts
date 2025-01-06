import bcrypt from 'bcryptjs';
import { schema } from '@/libs/schema';
import { actionExecutor } from '@/libs/actionExecutor';
import prisma from '@/libs/dbConfig/prisma';

const signUpAction = async (formData: FormData) => {
    return actionExecutor({
        actionFn: async () => {
            const formValues = {
                username: formData.get('username') as string,
                email: formData.get('email') as string,
                password: formData.get('password') as string,
            }
            const validatedData = schema.safeParse(formValues);
            if (!validatedData.success) {
                const errors = validatedData.error.format();
                return { success: false, errors };
            }

            // Cek apakah username atau email sudah ada di database
            const { username, email, password } = validatedData.data;
            const existingUser = await prisma.user.findFirst({
                where: {
                    OR: [
                        { username },
                        { email },
                    ],
                },
            });

            if (existingUser) {
                return {
                    success: false,
                    errors: {
                        username: existingUser.username === username ? 'Username already exists' : '',
                        email: existingUser.email === email ? 'Email already exists' : '',
                    },
                };
            }

            //save new user to database
            const newUser = await prisma.user.create({
                data: {
                    username,
                    email,
                    password: await bcrypt.hash(password, 10),
                },
            });

            return { success: true, data: newUser };
        }
    })
};


export { signUpAction };