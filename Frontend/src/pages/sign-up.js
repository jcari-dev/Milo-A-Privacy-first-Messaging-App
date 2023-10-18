import * as React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import RegisterForm from '@/app/components/auth/Sign-Up'

export default function Home() {
  return (
    <ChakraProvider>
      <RegisterForm/>
    </ChakraProvider>
  )
}
