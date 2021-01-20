import React, { useEffect } from 'react';
import { Alert, Image, Switch, Text, TouchableOpacity, View } from 'react-native';
import styles from '../styles';
import { Input } from 'react-native-elements';
import { WINDOW_WIDTH } from '../constants';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamsList } from '../types';
import { useAuth } from '../contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFirestore } from '../contexts/FirestoreContext';

type Props = StackScreenProps<RootStackParamsList, 'Login'>

const LoginScreen: React.FC<Props> = ({ navigation }) => {
    const [username, setUsername] = React.useState<string>('')
    const [password, setPassword] = React.useState<string>('')
    const [switched, setSwitched] = React.useState<boolean>(false)

    useEffect(() => {
        if (switched) {
            setToken()
        }
    }, [switched])

    const auth = useAuth()

    const setToken = async () => {
        await AsyncStorage.setItem('MoneyTrackToken', 'autolog')
    }

    const reset = () => {
        setUsername('')
        setPassword('')
    }

    const login = async () => {
        try {
            await auth.signIn(username, password)

            navigation.navigate('App')
            reset()
        } catch (e) {
            // e.code = "auth/user-not-found"
            // e.message = "There is no user record corresponding to this identifier. The user may have been deleted."
            if (e.code === "auth/user-not-found") {
                Alert.alert('Ce compte n\'existe pas')
            }
            else {
                Alert.alert(e.message)
            }
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.centerChildren}>
                <Image style={styles.logo}
                    source={require('../resources/MoneyTrackIcon.png')}
                />
            </View>
            <View style={[styles.container, { justifyContent: 'space-around' }]}>
                <Text style={styles.title}>Money Track</Text>
                <View>
                    <Input containerStyle={styles.containerLogsInput} inputContainerStyle={{ borderBottomWidth: 0 }} style={[styles.containerPadding, styles.logsInput]}
                        label="Identifiant" keyboardType="email-address"
                        value={username} onChangeText={username => setUsername(username)}
                    />
                    <Input containerStyle={styles.containerLogsInput} inputContainerStyle={{ borderBottomWidth: 0 }} style={[styles.containerPadding, styles.logsInput]}
                        label="Mot de passe" secureTextEntry
                        value={password} onChangeText={password => setPassword(password)}
                    />
                </View>
                <View>
                    <View style={styles.stayConnected}>
                        <Text style={styles.stayConnectedText}>Rester connecté</Text>
                        <Switch ios_backgroundColor="#fff" thumbColor="#000" trackColor={{ false: "#fff", true: "#00A3D8" }} value={switched} onValueChange={switched => setSwitched(switched)} />
                    </View>

                    <TouchableOpacity style={[styles.containerPadding, styles.logsButton, { backgroundColor: '#E4B429' }]}
                        onPress={() => login()}>
                        <Text style={styles.logsButtonText}>Connexion</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.containerPadding, styles.logsButton, { backgroundColor: '#00A3D8' }]}
                        onPress={() => navigation.navigate('Signup')}>
                        <Text style={styles.logsButtonText}>Inscription</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View >
    )
}

export default LoginScreen