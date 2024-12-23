'use client';

import { Button } from '@/components/ui/button';
import {
   Card,
   CardContent,
   CardFooter,
   CardHeader,
   CardTitle,
} from '@/components/ui/card';
import {
   Form,
   FormControl,
   FormDescription,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { useSignup } from '@/mutations/useSingup';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const formSchema = z.object({
   username: z.string(),
   password: z.string(),
});

export default function Signup() {
   const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
         username: '',
         password: '',
      },
   });
   const { mutate } = useSignup();

   function onSubmit(values: z.infer<typeof formSchema>) {
      try {
         console.log(values);
         mutate(values);
      } catch (error) {
         console.error('Form submission error', error);
         toast.error('Failed to submit the form. Please try again.');
      }
   }

   return (
      <section className="flex h-screen flex-col items-center justify-center">
         <Card className="w-[400px]">
            <CardHeader>
               <CardTitle className="text-2xl font-bold">Signup</CardTitle>
            </CardHeader>

            <CardContent>
               <Form {...form}>
                  <form
                     onSubmit={form.handleSubmit(onSubmit)}
                     className="max-w-3xl space-y-8 py-10"
                  >
                     <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Username</FormLabel>
                              <FormControl>
                                 <Input
                                    placeholder="billa"
                                    required
                                    type=""
                                    {...field}
                                 />
                              </FormControl>
                              <FormDescription>
                                 This is your public display name.
                              </FormDescription>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                 <PasswordInput
                                    placeholder="Placeholder"
                                    {...field}
                                    required
                                 />
                              </FormControl>
                              <FormDescription>
                                 Enter your password.
                              </FormDescription>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     <Button type="submit">Submit</Button>
                  </form>
               </Form>
            </CardContent>

            <CardFooter className="flex justify-center">
               <Button variant="link" asChild>
                  <Link href="/auth/signin">Already have an account</Link>
               </Button>
            </CardFooter>
         </Card>
      </section>
   );
}
