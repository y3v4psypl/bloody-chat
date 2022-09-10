import {useRouter} from 'next/router';


export const useAuth = () => {
    const router = useRouter();

    if (typeof window === 'undefined') {
        return;
    }
    const isSignedIn = localStorage.getItem("isSignedIn");

    if (!isSignedIn) {
        router.push('/sign-in').then();
    }
}