'use client'

import { alert, border, button, card, input, layout, surface, text } from '@/shared/styles/globalN'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { toast } from 'sonner'
import showAlert from '@/lib/alert'


const signUpObj = {
    firstName: '',
    lastName: '',
    maidenName: '',
    email: '',
    password: '',
    confirmPassword: '',
}

const loginObj = {
    email: '',
    password: ''
}

const AuthForm = () => {
    const [activeForm, setActiveForm] = useState('login');
    const [signUpForm, setSignUpForm] = useState(signUpObj);
    const [loginForm, setLoginForm] = useState(loginObj);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const router = useRouter();
    
    
    const register = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            const response = await fetch("http://localhost:3000/api/auth/register",{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(signUpForm)
            });

            const result = await response.json();

            if (!result.success) {
            //    toast(result.error);
                showAlert("danger", result.error);
                return;
            }

            showAlert("success", result.message);

            setActiveForm('login');

        } catch (error) {
            // setError(error.message);
            showAlert("danger", error.message);
        }finally {
            setLoading(false);
        }

        
    }

    const login = async (e) => {
        e.preventDefault();
        
        try {
            setLoading(true);
            const response = await signIn("credentials", {
                email: loginForm.email,
                password: loginForm.password,
                redirect: false,
            });

            // console.log("response for signin nextauth:",response);
            
            if (response?.error) {
                setError(response.error === 'CredentialsSignin' ? "Invalid email or password. Please try again." : `Something went wrong. ${response.error}`);
                return;
            } 

            router.replace("/");
            
        }catch (error) {
            console.log(error.message);

            setError(error.message);
        }finally {
            setLoading(false);
        }

    }

    const handleOnchangeSignUpForm = (e) => {
        const { name, value } = event.target;
        
        // update signup for value by copying the previous object using ...prevObj and overwriting or adding the [name]: value.
        setSignUpForm((prevObj) => ({
            ...prevObj,
            [name]: value
        }));   

    }

    const handleOnchangeLoginForm = (e) => {
        const { name, value } = event.target;

        setLoginForm((prevObj) => ({
            ...prevObj,
            [name]: value
        }));
    }

    return (
        <section className={`${layout.stack} ${layout.center} ${card.base} ${card.padding} w-85 sm:100 mx-auto mt-10`}>
            <h1 className='text-2xl font-bold mt-2'>Twitter-Clone</h1>
            <div className='border-b border-gray-200 w-full'>
                <nav className={`flex flex-row gap-6 border-gray-200 w-55 mx-auto`}>
                    <button onClick={() => setActiveForm('login')} className={`text-gray-600 py-4 px-6 block hover:text-blue-500 focus:outline-none ${activeForm === 'login' && 'text-blue-500 border-b-3 font-medium border-blue-500 transition-all'}`}>
                        Login
                    </button>
                    <button onClick={() => setActiveForm('signup')} className={`text-gray-600 py-4 px-6 block hover:text-blue-500 focus:outline-none ${activeForm === 'signup' && 'text-blue-500 border-b-3 font-medium border-blue-500 transition-all'}`}>
                        Sign Up
                    </button>
                </nav>
            </div>

            <section className={` w-full space-y-4 ${activeForm === 'login' || 'hidden'}`}>
                {
                    (error && activeForm === 'login') && <span className={`${alert.base} ${alert.variants.danger} text-xs`}>{error}</span>
                }
                <span className={`${text.primary} text-lg font-bold`}>Welcome back!</span>
                <p className={`${text.muted} text-xs`}>Catch up on the latest posts and conversations.</p>
                <form className='flex flex-col gap-4' onSubmit={login}>
                    <input required name='email' type="text" placeholder='Email' className={`${input.base} w-full focus:ring-1`} onChange={handleOnchangeLoginForm}/>
                    <input required name='password' type="password" placeholder='Password' className={`${input.base} w-full focus:ring-1`} onChange={handleOnchangeLoginForm}/>
                    <button type='submit' className={`${button.base} ${button.variants.solid} ${button.sizes.md} w-full`} disabled={loading}>{loading ? 'Signing in. . . .' : 'Login'}</button>
                </form>
                
                {/* enhancement feature */}
                {/* <Link href={'/forgot-password'} className='w-full flex justify-end text-sm text-gray-500 cursor-pointer hover:text-blue-500'>
                    Forgot password?
                </Link> */}
            </section>

            <section className={` w-full space-y-4 ${activeForm === 'signup' || 'hidden'}`}>
                {
                    (error && activeForm === 'signup') && <span className={`${alert.base} ${alert.variants.danger} text-xs`}>{error}</span>
                }
                <span className={`${text.primary} text-lg font-bold`}>Create your account</span>
                <p className={`${text.muted} text-xs`}>See what's happening and be part of it.</p>
                <form className='flex flex-col gap-4 mt-4' onSubmit={register}>
                                
                    <input type="text" required name='firstName' placeholder='First Name*' className={`${input.base} w-full focus:ring-1`} onChange={handleOnchangeSignUpForm}/>
                    <input type="text" required name='lastName' placeholder='Last Name*' className={`${input.base} w-full focus:ring-1`} onChange={handleOnchangeSignUpForm}/>
                    <input type="text" name='maidenName' placeholder='Maiden Name (Optional)' className={`${input.base} w-full focus:ring-1`} onChange={handleOnchangeSignUpForm}/>
                    <input type="text" required name='email' placeholder='Email*' className={`${input.base} w-full focus:ring-1`} onChange={handleOnchangeSignUpForm}/>
                    <input type="text" required name='username' placeholder='Username*' className={`${input.base} w-full focus:ring-1`} onChange={handleOnchangeSignUpForm}/>
                    <input type="password" required name='password' placeholder='Password*' className={`${input.base} w-full focus:ring-1`} onChange={handleOnchangeSignUpForm}/>
                    <input type="password" required name='confirmPassword' placeholder='Confirm Password*' className={`${input.base} w-full focus:ring-1`} onChange={handleOnchangeSignUpForm}/>

                    <button type='submit' className={`${button.base} ${button.variants.solid} ${button.sizes.md} w-full`} disabled={loading}>
                        {loading ? 'Creating Account. . . .' : 'Create Account'}
                    </button>
                </form>
            </section>
            
            {
                activeForm === 'login' 
                ?
                    <section className={`${layout.center} gap-1 text-sm text-gray-500 w-full`}>
                        Don't have an account yet? 
                        <p className='text-blue-500 hover:underline cursor-pointer' onClick={() => setActiveForm('signup')}>Sign up</p>
                    </section> 
                :
                    <section className={`${layout.center} gap-1 text-sm text-gray-500 w-full`}>
                        Already have an account?
                        <p className='text-blue-500 hover:underline cursor-pointer' onClick={() => setActiveForm('login')}>Login</p>
                    </section>
            }
            
        </section>
    )
}

export default AuthForm