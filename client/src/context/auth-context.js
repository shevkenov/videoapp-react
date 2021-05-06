import React, { useContext } from 'react';
import { useQuery } from 'react-query';

import {axiosClient} from '../utils/api-client';

const AuthContext = React.createContext(null);

export function AuthProvider({children}) {

    const { data } = useQuery('AuthProvider', () => axiosClient.get('/auth/me').then(res => res.data.user))
    const user = data || null
    
    // const [user, setUser] = useState(null);

    // useEffect(() => {
    //     axiosClient.get('/auth/me').then(response => {
    //         setUser(response.data.user)
    //     }).catch(err => {
    //         console.log(err)
    //     })
    // }, [])

    return(
        <AuthContext.Provider value={user}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext);

    if(context === undefined) {
        throw new Error("Context is undefined!")
    }

    return context;
}
