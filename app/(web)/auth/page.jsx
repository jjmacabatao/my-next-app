import { auth } from "@/auth";
import AuthForm from "@/features/auth/components/AuthForm";
import { redirect } from "next/navigation";


const AuthPage = async () => {
    // Check if session exist, if exist redirect to home page
    const session = await auth();

    if(session) {
        redirect('/');
    }

    // Otherwise, render the auth form
    return <AuthForm />
}

export default AuthPage