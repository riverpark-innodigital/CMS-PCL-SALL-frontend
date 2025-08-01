/* eslint-disable react-hooks/rules-of-hooks */
// component
import LogoComponent from '../../../components/Logo/logo'
import InputComponet from '../../../components/content-input/input-full';
import ButtonFullComponent from '../../../components/content-buttons/full-button';
import { useState } from 'react';
import { ToastifySuccess, ToastifyError } from '../../../components/content-alert/toastify';
import { Checkbox } from 'antd';

// libs
import { useAuth } from '../../../hooks/AuthProvider';
import Cookies from 'js-cookie';
import { useEffect } from 'react';

const signinForm = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isRemember, setRemember] = useState(false);
    const auth = useAuth();
    const lastPage = Cookies.get("lastPath");
    const usernameRememdered = Cookies.get("username");
    const passwordRememdered = Cookies.get("password");

    useEffect(() => {
        if (usernameRememdered || passwordRememdered) {
            setRemember(true);
            setEmail(usernameRememdered);
            setPassword(passwordRememdered);
        }
    }, [usernameRememdered, passwordRememdered]);

    const handleSignup = async () => {
        try {
            setIsLoading(true);
            if (!email ||!password) throw 'All fields are required';
            let data = {
                email: email,
                password: password
            };

            const response = await auth.SiginAction(data);

            if (response.status === true) {
                if (isRemember) {
                    await Cookies.set("username", email);
                    await Cookies.set("password", password);
                } else {
                    await Cookies.remove("username");
                    await Cookies.remove("password");
                }
                ToastifySuccess({ lable: 'Sign In successfully' });
                setIsLoading(false);
                if (lastPage === undefined || lastPage === '/') {
                    window.location.href = `${import.meta.env.VITE_REDIRECT_URL}/dashboard`;
                } else {
                    window.location.href = `${import.meta.env.VITE_REDIRECT_URL}/dashboard`;
                }
            } else {
                throw `${response.error.payload.error.message}`
            }
        } catch (error) {
            setIsLoading(false);
            console.log(error);
            ToastifyError({ lable: error || 'System Have a Problem, Contact To Developer' });
        }
    };


    return (
        <div className="my-10 px-[20px] xs:mt-0">
            <div className="font-primaryBold uppercase animate-fade-down animate-once animate-duration-1000 animate-delay-100 text-[25px]">
                <LogoComponent />
            </div>
            <div className="flex justify-center animate-fade-down animate-once animate-duration-1000 mt-5">
                <span className="text-center font-primaryMedium text-[20px]">Log in to your account</span>
            </div>
            <div className="flex justify-center animate-fade-down animate-once animate-duration-1000">
                <span className="text-center block text-[12px]">Welcome back! Please enter your details.</span>
            </div>
            <div className="my-[20px] animate-fade-left animate-once animate-duration-1000">
                <div className="my-5">
                    <InputComponet placeholder="Enter your Username" color="red" label="Username" value={email} OnChange={setEmail} />
                </div>
                <div className="mt-5 mb-2">
                    <InputComponet placeholder="Enter your Password" color="red" type="password" label="Password" value={password} OnChange={setPassword} />
                </div>
                <div className="mt-5">
                    <Checkbox checked={isRemember} onChange={(e) => setRemember(e.target.checked)}>Remember Me</Checkbox>
                </div>
            </div>
            <div className="animate-fade-up animate-once animate-duration-1000">
                <ButtonFullComponent size="large" color="red" lable="Sign In" func={handleSignup} isLoading={isLoading} />
            </div>
        </div>
    )
}

export default signinForm