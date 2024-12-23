'use client'

import { useToken } from "@/lib/tokenContext";
import { useMutation } from "@tanstack/react-query";
import axios from 'axios';
import { useRouter } from "next/navigation";

type Props = {
   username: string,
   password: string
}

async function postData(values: Props) {
   try {
      const { data } = await axios.post('http://localhost:9000/signin', values);
      return data
   } catch (error) {
      console.error(error);
   }
}

export function useSignin() {
   const router = useRouter()
   const { setToken } = useToken();
   const mutation = useMutation({
      mutationFn: postData,
      onSuccess: (data) => {
         console.log("Success!");

         setToken(data.token)
         router.push('/arena')
      }
   });
   return mutation;
}

