import * as React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import LoginForm from '@/app/components/auth/Sign-In'

export default function Home() {
  return (
    <ChakraProvider>
      <LoginForm/>
    </ChakraProvider>
  )
}
