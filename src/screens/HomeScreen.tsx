import { DrawerScreenProps } from '@react-navigation/drawer'
import React from 'react'
import { Animated, FlatList, Text, View } from 'react-native'
import { Divider, Icon } from 'react-native-elements'
import ExpenseComponent from '../components/ExpenseComponent'
import HeaderComponent from '../components/HeaderComponent'
import SwipeComponent from '../components/SwipeComponent'
import SwipeableComponent from '../components/SwipeableComponent'
import { WINDOW_WIDTH } from '../constants'
import { useAuth } from '../contexts/AuthContext'
import { useFirestore } from '../contexts/FirestoreContext'
import styles from '../styles'
import { Expense, RootStackParamsList } from '../types'
type Props = DrawerScreenProps<RootStackParamsList, 'Home'>

const HomeScreen: React.FC<Props> = ({ navigation, route }) => {
    const store = useFirestore()
    const auth = useAuth()

    const [firstname, setFirstname] = React.useState<string | null>('')

    React.useEffect(() => {
        if (route.params?.token == 'autolog') {
            auth.getUserInfo()
        }
        store.getExpenses()
    }, [])

    return (
        <View style={styles.container}>
            <HeaderComponent title="Mon compte" handleDrawer={() => navigation.toggleDrawer()} />
            <View>
                <Text style={styles.hello}>Bonjour</Text>
                <Text style={[styles.hello, { fontWeight: 'bold', fontSize: WINDOW_WIDTH * 0.18, }]}>{auth.userInfo?.firstname}</Text>
            </View>
            <Divider style={styles.bigDivider} />
            <Text style={styles.flatlistText}>Dernières dépenses</Text>
            <FlatList
                data={store.expenses}
                keyExtractor={(item, index) => item.title + item.category + item.amount.toString() + "_" + index}
                renderItem={({ item }) => <SwipeableComponent expense={item} navigation={navigation} />}
            />
            <Icon onPress={() => navigation.navigate('Creation', {})}
                type="entypo" name="circle-with-plus" size={WINDOW_WIDTH * 0.10} color="#E4B429" />
        </View>
    )
}

export default HomeScreen