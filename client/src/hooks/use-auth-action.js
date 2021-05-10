import { useAuth } from "context/auth-context";
import { useGoogleLogin } from "react-google-login";
import { authenticate } from "utils/api-client";

export default function useAuthAction() {
    const user = useAuth();
    const { signIn } = useGoogleLogin({
        onSuccess: authenticate,
        clientId:"311563765460-8amt6ikkopolg6rmq74k0otq0eseuuv0.apps.googleusercontent.com",
    });

    function handleAuthAction(authAction, data) {
        if(user) {
            authAction(data);
        }else{
            signIn()
        }
    }

    return handleAuthAction;
}
