import { 
    Stack,
    Skeleton,
} from '@chakra-ui/react'
import React from 'react'

function ChatLoading() {
    return (
    <Stack>
        <Skeleton mt={3} height='45px' />
        <Skeleton height='45px' />
        <Skeleton height='45px' />
        <Skeleton height='45px' />
        <Skeleton height='45px' />
        <Skeleton height='45px' />
        <Skeleton height='45px' />
        <Skeleton height='45px' />
        <Skeleton height='45px' />
    </Stack>
)
}

export default ChatLoading
