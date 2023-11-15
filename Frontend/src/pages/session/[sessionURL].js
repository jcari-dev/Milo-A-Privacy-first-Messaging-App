import * as React from 'react'
import { ChakraProvider } from '@chakra-ui/react'

export default function Home() {
    return (
        <ChakraProvider>
            <h1>Chat</h1>
        </ChakraProvider>
    )
}
