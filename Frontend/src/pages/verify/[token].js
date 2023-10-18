import * as React from 'react'
import { ChakraProvider } from '@chakra-ui/react'

import VerifyWindow from '@/app/components/auth/Verify'

export default function Home() {
  return (
    <ChakraProvider>
      <VerifyWindow/>
    </ChakraProvider>
  )
}
