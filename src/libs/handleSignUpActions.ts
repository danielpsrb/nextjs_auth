import bcrypt from 'bcryptjs';
import { schema } from '@/libs/schema';
import { actionExecutor } from '@/libs/actionExecutor';
import prisma from '@/libs/dbConfig/prisma';

const signUpAction = async (formData: FormData) => {
    return actionExecutor({
        actionFn: async () => {
            const username = formData.get('username');
            const email = formData.get('email');
            const password = formData.get('password');
            const confirm_password = formData.get("confirmPassword");
            const validatedDataResult = schema.parse({
                username,
                email,
                password,
                confirmPassword: confirm_password,
            })
            const saveNewUserData = await prisma.user.create({
                data: {
                    username: validatedDataResult.username.toLocaleLowerCase(),
                    email: validatedDataResult.email.toLocaleLowerCase(),
                    password: await bcrypt.hash(validatedDataResult.password, 10),
                }
            });
        },
        successMessage: 'Sign up success',
    })
};


export { signUpAction };