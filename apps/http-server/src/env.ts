import { config } from 'dotenv';
import { expand } from 'dotenv-expand';
import { z } from 'zod';

expand(config());

const EnvSchema = z.object({
   NODE_ENV: z.string().default('deployment'),
   PORT: z.coerce.number().default(9000),
   LOG_LEVEL: z.enum([
      'fatal',
      'error',
      'warn',
      'info',
      'debug',
      'trace',
      'silent',
   ]),
});

const { data: env, error } = EnvSchema.safeParse(process.env);

if (error) {
   console.error('❌ Invalid env:');
   console.error(JSON.stringify(error.flatten().fieldErrors, null, 2));
   process.exit(1);
}

export default env!;
