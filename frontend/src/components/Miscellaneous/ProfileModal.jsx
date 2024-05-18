import React from 'react'
import {
    useDisclosure,
    IconButton,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    Image,
    ModalCloseButton,
    ModalFooter,
    Text
} from "@chakra-ui/react"
import {ViewIcon} from "@chakra-ui/icons"

function ProfileModal({user, children}) {
    // console.log(user);
    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
        <>
        {children ? (
            <span 
            onClick={onOpen}
            >
                {children}
            </span>
        ) : (
            <IconButton display={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
        )}

        <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent h='410px'>
            <ModalHeader
            fontSize="40px"
            display="flex"
            justifyContent="center"
            >{user.username}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody
            display="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="space-between"
            >
            <Image 
            borderRadius="full"
            boxSize="150px"
            src={user.pic}
            alt={user.username}
            />
            <Text>
                {user?.email}
            </Text>
            </ModalBody>
            <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
                Close
            </Button>
            </ModalFooter>
        </ModalContent>
        </Modal>
        </>
)
}

export default ProfileModal
