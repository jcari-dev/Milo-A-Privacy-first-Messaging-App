'use client';

import { useState, useRef } from 'react';
import React from 'react';
import axios from 'axios';
import {
    Card, Input, FormControl,
    FormLabel,
    FormErrorMessage,
    Button,
    InputGroup,
    FormHelperText,
    VStack,
    InputRightElement,
    Image, Box, Text, Container
} from '@chakra-ui/react';

import Head from 'next/head';

import { Field, Form, Formik, useFormikContext } from 'formik';


const SignUpForm = () => {
    const password1Ref = useRef(null);
    const password2Ref = useRef(null);
    const [formData, setFormData] = useState({ username: '', password1: '', password2: '', email: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const [showP1, setShowP1] = React.useState(false)
    const [showP2, setShowP2] = React.useState(false)
    const [registration, setRegistration] = React.useState(false)
    const handleClickP1 = () => setShowP1(!showP1)
    const handleClickP2 = () => setShowP2(!showP2)

    async function validateEmail(value) {


        if (!value) {
            return "Must not be blank."
        } else if (value.length >= 6) {
            let error

            const response = await fetch("http://localhost:8080/validate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ field: 'email', value: value }),
            });

            const data = await response.json();

            if (data.error) {
                error = data.error
            }

            return error
        }

    }

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

    async function validatePassword1(value) {
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

            if (data.error) {
                error = data.error
            } else {
                const password2 = password2Ref.current.value;
                if (password2 && password2 !== value) {
                    error = "Passwords do not match."
                    console.log(password2, value)
                }
            }
        }


        return error
    }

    async function validatePassword2(value) {
        let error

        if (!value) {
            error = "Must not be blank."
            return error
        } else if (value.length < 8) {
            error = "At least 8 characters in length."
            return error
        } else if (value.length >= 8) {

            const response = await fetch("http://localhost:8080/validate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ field: 'password', value: value }),
            });

            const data = await response.json();

            if (data.error) {
                error = data.error
            } else {
                const password1 = password1Ref.current.value;
                if (password1 && password1 !== value) {
                    error = "Passwords do not match."
                    console.log(password1, value)
                }
            }
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

    return registration ?
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Head>
                <title>Yay!</title>
            </Head>

            <Card align='center' h="100vh">

                <Box aspectRatio={8 / 5}>
                    <Image
                        src="./images/sign-up/bg-sign-up-success.png"
                        w={["512px", "640px", "768px"]}
                        alt="Sign Up Success"
                        mt={4}
                        borderRadius="md"
                        transition="transform .2s ease-in-out"
                        _hover={{ transform: "scale(1.05)" }}
                    />
                </Box>
                <Text mt={4} mb={4} >Hang tight! Sent you a little something in your inbox. Click it to verify your email address.</Text>

            </Card>
        </div>

        : (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

                <Head>
                    <title>Sign Up- It's Free !</title>
                </Head>

                <Card align='center' h="100%">

                    <Box aspectRatio={8 / 5}>
                        <Image
                            src="./images/sign-up/bg-sign-up.webp"
                            w={["512px", "640px", "768px"]}
                            alt="Sign Up"
                            mt={4}
                            borderRadius="md"
                            transition="transform .2s ease-in-out"
                            _hover={{ transform: "scale(1.05)" }}
                        />
                    </Box>

                    <Formik
                        initialValues={{ email: '', username: '', password1: '', password2: '' }}
                        validateOnBlur={true}
                        validateOnChange={false}
                        onSubmit={async (values, actions) => {
                            try {
                                const response = await axios.post('http://localhost:8080/register', values);
                                console.log('User registered:', response.data);
                                setRegistration(true)
                            } catch (error) {
                                console.error('Registration failed:', error);
                            }
                            actions.setSubmitting(false);
                        }}
                    >
                        {(props) => (
                            <Form>
                                <Field name='email' validate={validateEmail}>
                                    {({ field, form }) => (
                                        <FormControl isInvalid={form.errors.email && form.touched.email} isRequired>
                                            <FormLabel mt={0}>Email</FormLabel>
                                            <Input {...field} placeholder='Email' maxWidth="250px" />
                                            <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                                        </FormControl>
                                    )}
                                </Field>
                                <Field name='username' validate={validateUsername}>
                                    {({ field, form }) => (
                                        <FormControl isInvalid={form.errors.username && form.touched.username} isRequired>
                                            <FormLabel>Username</FormLabel>
                                            <Input {...field} placeholder='Username' maxWidth="250px" />
                                            <FormErrorMessage maxWidth={"250px"}>{form.errors.username}</FormErrorMessage>
                                        </FormControl>
                                    )}
                                </Field>
                                <Field name='password1' validate={validatePassword1} >
                                    {({ field, form }) => (
                                        <FormControl isInvalid={form.errors.password1 && form.touched.password1} mb={4} isRequired>
                                            <FormLabel>Password</FormLabel>
                                            <InputGroup size='md'>
                                                <Input
                                                    {...field}
                                                    pr='4.5rem'
                                                    type={showP1 ? 'text' : 'password'}
                                                    placeholder='Enter password'
                                                    maxWidth="250px"
                                                    ref={password1Ref}
                                                />
                                                <InputRightElement width='7rem'>
                                                    <Button h='1.75rem' size='sm' onClick={handleClickP1}>
                                                        {showP1 ? 'Hide' : 'Show'}
                                                    </Button>
                                                </InputRightElement>
                                            </InputGroup>
                                            <FormErrorMessage>{form.errors.password1}</FormErrorMessage>
                                        </FormControl>
                                    )}
                                </Field>
                                <Field name='password2' validate={validatePassword2} >
                                    {({ field, form }) => (
                                        <FormControl isInvalid={form.errors.password2 && form.touched.password2} mb={4} isRequired>
                                            <FormLabel>Re-enter Password</FormLabel>
                                            <InputGroup size='md'>
                                                <Input
                                                    {...field}
                                                    pr='4.5rem'
                                                    type={showP2 ? 'text' : 'password'}
                                                    placeholder='Re-enter Password'
                                                    maxWidth="250px"
                                                    ref={password2Ref}

                                                />
                                                <InputRightElement width='7rem'>
                                                    <Button h='1.75rem' size='sm' onClick={handleClickP2}>
                                                        {showP2 ? 'Hide' : 'Show'}
                                                    </Button>
                                                </InputRightElement>
                                            </InputGroup>
                                            <FormErrorMessage>{form.errors.password2}</FormErrorMessage>
                                            <VStack spacing={2} align="start">
                                                <FormHelperText>
                                                    <ul style={{ margin: 0, paddingInlineStart: '20px' }}>
                                                        <li>Minimum 8 characters</li>
                                                        <li>Include 1 lowercase & 1 uppercase</li>
                                                        <li>Include 1 special (!@#$%^&amp;*()-_+=&lt;&gt;?)</li>
                                                    </ul>
                                                </FormHelperText>
                                            </VStack>
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
                                    Sign Up
                                </Button>

                            </Form>
                        )}
                    </Formik>

                </Card>
            </div>
        )



};

export default SignUpForm;
