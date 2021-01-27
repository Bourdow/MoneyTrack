import React, { useEffect } from 'react';
import { Alert, Image, Switch, Text, TouchableOpacity, View } from 'react-native';
import styles from '../styles';
import { Input, Overlay } from 'react-native-elements';
import { WINDOW_WIDTH } from '../constants';
import { useAuth } from '../contexts/AuthContext';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamsList } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = StackScreenProps<RootStackParamsList, 'Signup'>

const SignupScreen: React.FC<Props> = ({ navigation }) => {
    const [firstname, setFirstname] = React.useState<string>('')
    const [lastname, setLastname] = React.useState<string>('')
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
        setFirstname('')
        setUsername('')
        setPassword('')
    }

    const signup = async () => {
        try {
            await auth.register(username, password, firstname, lastname)
            Alert.alert("Votre espace personnalisé a été créée", "Nous vous souhaitons la bienvenue dans la MoneyTrack Family, en espérant vous être utile dans vos finances.", [
                {
                    text: 'Super !',
                    onPress: () => {
                        reset()
                        navigation.navigate('App')
                    }
                }
            ])
        } catch (e) {
            Alert.alert(e)
        }
    }

    return (
        <View style={styles.container}>
            <Overlay isVisible={false}>
                <>
                </>
            </Overlay>
            <TouchableOpacity style={styles.centerChildren} onPress={() => navigation.goBack()}>
                <Image style={styles.logo}
                    source={require('../resources/MoneyTrackIcon.png')}
                />
            </TouchableOpacity>

            <View style={[styles.container, { justifyContent: 'space-around' }]}>
                <Text style={styles.title}>Money Track</Text>

                <View>
                    <Input containerStyle={styles.containerLogsInput} inputContainerStyle={{ borderBottomWidth: 0 }} style={[styles.containerPadding, styles.logsInput]}
                        label="Prénom"
                        value={firstname} onChangeText={firstname => setFirstname(firstname)}
                    />
                    <Input containerStyle={styles.containerLogsInput} inputContainerStyle={{ borderBottomWidth: 0 }} style={[styles.containerPadding, styles.logsInput]}
                        label="Nom"
                        value={lastname} onChangeText={lastname => setLastname(lastname)}
                    />
                    <Input containerStyle={styles.containerLogsInput} inputContainerStyle={{ borderBottomWidth: 0 }} style={[styles.containerPadding, styles.logsInput]}
                        label="Identifiant" keyboardType='email-address'
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
                        onPress={() => signup()}>
                        <Text style={styles.logsButtonText}>S'inscrire</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default SignupScreen