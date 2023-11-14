'use client';

import { useState, useRef } from 'react';
import React from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import {
  Card, Input, FormControl,
  FormLabel,
  FormErrorMessage,
  Button,
  InputGroup,
  InputRightElement,
  Image, Box, Text, Divider,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Switch,
  Flex
} from '@chakra-ui/react'

import Head from 'next/head';

import { Field, Form, Formik, useFormikContext } from 'formik';


const SignUpForm = () => {
  const router = useRouter();
  const passwordRef = useRef(null);
  const [formData, setFormData] = useState({ username: '', password: '' });

  function generateSessionURL() {
    const data = "123"
    return data
  }

  const handleGenerateSession = () => {
    const sessionURL = generateSessionURL();

    router.push(`/session/${sessionURL}`)
  }
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const [showP1, setShowP1] = React.useState(false)
  const { isOpen, onOpen, onClose: baseOnClose } = useDisclosure();
  const [isExpireChecked, setIsExpireChecked] = useState(false);

  const handleClickP1 = () => setShowP1(!showP1)
  const onClose = () => {
    setIsExpireChecked(false);
    baseOnClose();
  };

  async function validateUsername(value) {

    if (!value) {
      return "Must not be blank."
    } else if (value.length < 3) {
      return "Minimum 3 characters."
    } else if (value.length >= 3) {
      if (/^[0-9]+$/.test(value)) {
        return "Invalid username, can't be only numeric."
      } else if (!/^[a-zA-Z0-9._-]+$/.test(value)) {
        return "Invalid username. Only English characters numbers and (._-)."
      }
      let error

      const response = await fetch("http://localhost:8080/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ field: 'username', value: value }),
      });

      const data = await response.json();

      if (data.error) {
        error = data.error
      }

      return error
    }

  }

  async function validatePassword(value) {
    let error

    if (!value) {
      error = "Must not be blank."
      return error
    } else if (value.length < 8) {
      error = "At least 8 characters in length."
      return error
    } else {

      const response = await fetch("http://localhost:8080/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ field: 'password', value: value }),
      });

      const data = await response.json();

    }


    return error
  }



  const handleSubmit = async (e) => {
    console.log(formData)
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/register', formData);
      console.log('User registered:', response.data);
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (


    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Head>
        <title>Welcome Back !</title>
      </Head>

      <Card align='center' h="100%">

        <Box aspectRatio={8 / 5}>
          <Image
            src="./images/sign-in/bg-sign-in.webp"
            w={["512px", "640px", "768px"]}
            alt="Sign In"
            mt={4}
            borderRadius="md"
            transition="transform .2s ease-in-out"
            _hover={{ transform: "scale(1.05)" }}
          />
        </Box>

        <Formik
          initialValues={{ username: '', password: '' }}
          onSubmit={async (values, actions) => {
            try {
              const response = await axios.post('http://localhost:8080/register', values);
              console.log('User registered:', response.data);
            } catch (error) {
              console.error('Registration failed:', error);
            }
            actions.setSubmitting(false);
          }}
        >
          {(props) => (
            <Form>
              <Field name='username' validate={validateUsername}>
                {({ field, form }) => (
                  <FormControl isInvalid={form.errors.username && form.touched.username}>
                    <FormLabel>Username</FormLabel>
                    <Input {...field} placeholder='Username' maxWidth="250px" />
                    <FormErrorMessage maxWidth={"250px"}>{form.errors.username}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name='password' validate={validatePassword} >
                {({ field, form }) => (
                  <FormControl isInvalid={form.errors.password && form.touched.password} mb={4}>
                    <FormLabel>Password</FormLabel>
                    <InputGroup size='md'>
                      <Input
                        {...field}
                        pr='4.5rem'
                        type={showP1 ? 'text' : 'password'}
                        placeholder='Enter password'
                        maxWidth="250px"
                        ref={passwordRef}
                      />
                      <InputRightElement width='7rem'>
                        <Button h='1.75rem' size='sm' onClick={handleClickP1}>
                          {showP1 ? 'Hide' : 'Show'}
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                    <FormErrorMessage>{form.errors.password}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Button
                mt={2}
                mb={4}
                colorScheme='orange'
                isLoading={props.isSubmitting}
                type='submit'
              >
                Sign In
              </Button>

            </Form>
          )}

        </Formik>
        <Box textAlign="center" p={4}>
          <Divider borderColor="orange.500" borderWidth={2} my={4} w="full" />

          <Text fontSize="xl" mb={3}>
            ✨ Introducing... ✨<br />
            Instant Chat Rooms: No Sign-Up Required, Just Share a Link & Chat Away!
          </Text>
          <Button colorScheme="orange" onClick={onOpen}>
            Try Now!
          </Button>
        </Box>
        {/* Modal */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              Create a Chat Session
            </ModalHeader>
            <ModalCloseButton color="cyan.800" />
            <ModalBody>
              <FormControl display="flex" alignItems="center">
                <FormLabel htmlFor="expire-switch" mb="0">
                  Expire:
                </FormLabel>
                <Switch id="expire-switch" onChange={() => setIsExpireChecked(!isExpireChecked)} />
              </FormControl>
              {isExpireChecked && (
                <FormControl mt={4}>
                  <FormLabel htmlFor="expire-date"> Expiration Date:</FormLabel>
                  <Input type="date" id="expire-date" />
                </FormControl>
              )}
            </ModalBody>
            <ModalFooter>
              <Flex width="full" justifyContent="center">
                <Button colorScheme="orange" onClick={handleGenerateSession}>
                  Generate Session!
                </Button>
              </Flex>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Card>

    </div>)




};

export default SignUpForm;
