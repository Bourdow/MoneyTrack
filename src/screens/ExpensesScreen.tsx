import { DrawerScreenProps } from '@react-navigation/drawer'
import React, { useEffect, useState } from 'react'
import { FlatList, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { Divider } from 'react-native-elements'
import HeaderComponent from '../components/HeaderComponent'
import SwipeableComponent from '../components/SwipeableComponent'
import { useFirestore } from '../contexts/FirestoreContext'
import styles from '../styles'
import { Expense, RootStackParamsList } from '../types'

type Props = DrawerScreenProps<RootStackParamsList, 'Expenses'>

const ExpensesScreen: React.FC<Props> = ({ navigation, route }) => {

    const [filter, setFilter] = useState<string>("Par date")
    const [displayCategories, setDisplayCategories] = useState<boolean>(false)
    const [expenses, setExpenses] = useState<Expense[]>([])

    const store = useFirestore()

    useEffect(() => {
        setExpenses(store.expenses)
    }, [store.expenses])

    return (
        <View style={styles.container}>
            <HeaderComponent title="Mes dépenses" handleDrawer={() => navigation.toggleDrawer()} />
            <View>
                <Text style={styles.hello}>Afficher par</Text></View>
            <Divider style={styles.bigDivider} />
            <ScrollView horizontal >
                {
                    ["Par date", "Par catégorie", "Par montant"].map((value) => {
                        return (
                            <TouchableOpacity onPress={() => setFilter(value)}
                                style={[styles.seeAllButton, styles.containerPadding, styles.containerMargin, { backgroundColor: filter == value ? '#00A3D8' : '#E4B429' }]}>
                                <Text style={styles.seeAllButtonText}>{value}</Text>
                            </TouchableOpacity>
                        )
                    })
                }
            </ScrollView>
            {
                displayCategories ?
                    <Text>Display</Text>
                    :
                    <FlatList
                        data={expenses}
                        keyExtractor={(item, index) => item.title + item.category + item.amount.toString() + "_" + index}
                        renderItem={({ item }) => <SwipeableComponent expense={item} navigation={navigation} />}
                    />
            }
        </View >
    )
}

export default ExpensesScreen