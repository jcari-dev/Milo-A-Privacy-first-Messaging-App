'use client';

import { useState } from 'react';
import React from 'react';
import axios from 'axios';
import {
  Card, Input, FormControl,
  FormLabel,
  FormErrorMessage,
  Button,
  Link,
  VStack,
  InputGroup,
  InputRightElement,
  Image, Box
} from '@chakra-ui/react'

import { Field, Form, Formik } from 'formik';


const SignInForm = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const [show, setShow] = React.useState(false)
  const handleClick = () => setShow(!show)

  function validateName(value) {
    let error
    if (!value) {
      error = 'Name is required'
    } else if (value.toLowerCase() !== 'naruto') {
      error = "Jeez! You're not a fan 😱"
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

      <Card align='center' h="100%">

        <Box aspectRatio={16 / 9}>
          <Image
            src="./images/sign-in/bg.png"
            w={["640px", "768px", "896px"]}
            alt="Cool Pic"
            mt={4}
            borderRadius="md"
            transition="transform .2s ease-in-out"
            _hover={{ transform: "scale(1.05)" }}
          />
        </Box>


        <Formik
          initialValues={{ name: 'Sasuke' }}
          onSubmit={(values, actions) => {
            setTimeout(() => {
              alert(JSON.stringify(values, null, 2))
              actions.setSubmitting(false)
            }, 1000)
          }}
        >
          {(props) => (
            <Form>
              <Field name='Email' validate={validateName}>
                {({ field, form }) => (
                  <FormControl isInvalid={form.errors.name && form.touched.name}>
                    <FormLabel mt={4}>Email</FormLabel>
                    <Input {...field} placeholder='Email' maxWidth="250px" />
                    <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name='password' validate={validateName} >
                {({ field, form }) => (
                  <FormControl isInvalid={form.errors.name && form.touched.name} mb={4}>
                    <FormLabel>Password</FormLabel>
                    <InputGroup size='md'>
                      <Input
                        {...field}
                        pr='4.5rem'
                        type={show ? 'text' : 'password'}
                        placeholder='Enter password'
                        maxWidth="250px"
                      />
                      <InputRightElement width='4.5rem'>
                        <Button h='1.75rem' size='sm' onClick={handleClick}>
                          {show ? 'Hide' : 'Show'}
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                    <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <VStack spacing={2} align="start">
                <Link href="/sign-up" color="cyan.500">Sign Up</Link>
                <Link href="/forgot-password" color="cyan.500">Forgot Password</Link>
              </VStack>
              <Button
                mt={4}
                mb={4}
                colorScheme='orange'
                isLoading={props.isSubmitting}
                type='submit'
              >
                Login
              </Button>

            </Form>
          )}
        </Formik>

      </Card>
    </div>
  );
};

export default SignInForm;
