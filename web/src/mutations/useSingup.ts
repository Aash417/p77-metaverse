'use client'

import { useMutation } from "@tanstack/react-query";
import axios from 'axios'
import { useRouter } from "next/navigation";

type Props = {
   username: string,
   password: string
}

async function postData(values: Props) {
   try {
      const { data } = await axios.post('http://localhost:9000/signup', values);
      console.log(data);
   } catch (error) {
      console.error(error);
   }


}

export function useSignup() {
   const router = useRouter()
   const mutation = useMutation({
      mutationFn: postData,
      onSuccess: () => {
         router.push('/auth/signin')
         console.log("Success!");
      }
   });

   return mutation;
}
