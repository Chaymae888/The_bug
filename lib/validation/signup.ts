import { z } from 'zod';

export const SignupSchema = z.object({
    username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
    .refine(username => !/[<>"'`;]/.test(username), {
      message: 'Username contains invalid characters',
    }),
    email: z.string()
        .email('Invalid email address')
        .min(5, 'Email must be atleast 5 characters')
        .max(50, 'Email must be less than 50 characters')
        .refine(email => {
            const parts = email.split('@');
            if (parts.length !== 2) return false;

            const [localPart, domain] = parts;
            return (
                localPart.length > 0 &&
                domain.length > 0 &&
                domain.includes('.') &&
                !domain.startsWith('.') &&
                !domain.endsWith('.')
            );
        }, {
            message: 'Email must be in format: user@example.com'
        })
        .refine(email => !/[<>"'`;]/.test(email), {
            message: 'Email contain invalid characters'
        }),
    password: z.string()
        .min(8, 'Password must be atleast 8 characters')
        .max(40, 'Password must be less than 40 characters')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character')
        .refine(password => !/[<>"'`;]/.test(password), {
            message: 'Password contain invalid characters'
        }),

})
export type SignupFormData = z.infer<typeof SignupSchema>;