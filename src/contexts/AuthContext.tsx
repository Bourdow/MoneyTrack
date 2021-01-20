
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebaseAuth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import React, { createContext, useContext, useEffect } from 'react';

type AuthContextType = {
    isSignedIn: boolean;
    user?: FirebaseAuthTypes.User | { uid: string | null };
    userInfo?: { firstname: string | null, lastname: string | null }
    register: (email: string, password: string, firstname: string, lastname: string) => Promise<void>;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    getUserInfo: () => void
}

const defaultAuthState: AuthContextType = {
    isSignedIn: true,
    register: async () => undefined,
    signIn: async () => undefined,
    signOut: async () => undefined,
    getUserInfo: async () => undefined
}

const AuthContext = createContext<AuthContextType>(defaultAuthState)

export const AuthContextProvider: React.FC = ({ children }) => {

    const [auth, setAuth] = React.useState<{ user?: FirebaseAuthTypes.User | { uid: string | null }; isSignedIn: boolean }>({
        isSignedIn: false,
    })
    const [userInfo, setUserInfo] = React.useState<{ firstname: string | null, lastname: string | null }>({ firstname: '', lastname: '' })

    const usersCollection = firestore().collection('users')

    useEffect(() => {
        const unsubscribe = firebaseAuth().onAuthStateChanged((_user) => {
            if (_user) {
                // user is logged in
                setAuth({
                    user: _user,
                    isSignedIn: true
                })
            } else {
                // user is logged out
                setAuth({
                    user: undefined,
                    isSignedIn: false
                })
            }
        })

        return unsubscribe
    }, [])

    const register = async (email: string, password: string, firstname: string, lastname: string) => {
        const register = await firebaseAuth().createUserWithEmailAndPassword(email, password)
        usersCollection.doc(register.user.uid).get()
            .then(async (documentSnapshot) => {
                if (!documentSnapshot.exists) {
                    usersCollection.doc(register.user.uid).set({ uid: register.user.uid, username: register.user.email, firstname, lastname })
                    setUserInfo({ firstname, lastname })
                    await AsyncStorage.setItem('MoneyTrackUserUID', register.user.uid)
                    await AsyncStorage.setItem('MoneyTrackFirstname', firstname)
                    await AsyncStorage.setItem('MoneyTrackLastname', lastname)

                }
            })
    }

    const signIn = async (email: string, password: string) => {
        const signIn = await firebaseAuth().signInWithEmailAndPassword(email, password)
        usersCollection.doc(signIn.user.uid).get()
            .then(async (documentSnapshot) => {
                const data = documentSnapshot.data()
                setUserInfo({ firstname: data?.firstname, lastname: data?.lastname })

                await AsyncStorage.setItem('MoneyTrackUserUID', signIn.user.uid)
                await AsyncStorage.setItem('MoneyTrackFirstname', data?.firstname)
                await AsyncStorage.setItem('MoneyTrackLastname', data?.lastname)
            })
    }

    const signOut = async () => {
        await firebaseAuth().signOut()
    }

    const getUserInfo = async () => {
        const uid = await AsyncStorage.getItem('MoneyTrackUserUID')
        const firstname = await AsyncStorage.getItem('MoneyTrackFirstname')
        const lastname = await AsyncStorage.getItem('MoneyTrackLastname')
        setAuth({ user: { uid: uid }, isSignedIn: true })
        setUserInfo({ firstname, lastname })
    }

    return (
        <AuthContext.Provider
            value={{
                isSignedIn: auth.isSignedIn,
                user: auth.user,
                userInfo: userInfo,
                register,
                signIn,
                signOut,
                getUserInfo
            }}>
            {children}
        </AuthContext.Provider>
    );

}

export const useAuth = () => {
    const auth = useContext(AuthContext)
    return auth
}