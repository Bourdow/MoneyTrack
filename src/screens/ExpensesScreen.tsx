import { DrawerScreenProps } from '@react-navigation/drawer'
import React, { useEffect, useState } from 'react'
import { FlatList, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { Divider, Icon } from 'react-native-elements'
import HeaderComponent from '../components/HeaderComponent'
import SwipeableComponent from '../components/SwipeableComponent'
import { useFirestore } from '../contexts/FirestoreContext'
import styles from '../styles'
import { Category, Expense, RootStackParamsList } from '../types'
import Accordion from 'react-native-collapsible/Accordion';
import { WINDOW_WIDTH } from '../constants'
import ModalComponent from '../components/ModalComponent'

type Props = DrawerScreenProps<RootStackParamsList, 'Expenses'>

const ExpensesScreen: React.FC<Props> = ({ navigation, route }) => {

    const [filter, setFilter] = useState<string>("Par date")
    const [displayCategories, setDisplayCategories] = useState<boolean>(false)
    const [expenses, setExpenses] = useState<Expense[]>([])
    const [expensesByCategory, setExpensesByCategory] = useState<{ category: Category, expenses: Expense[] }[]>([])
    const [activeSections, setActiveSections] = useState<number[]>([])
    const [isVisible, setIsVisible] = useState<boolean>(false)
    const [filters, setFilters] = useState<string[]>([])

    const store = useFirestore()

    useEffect(() => {
        setExpenses(store.expenses)
    }, [store.expenses])

    useEffect(() => {
        const expensesData = store.expenses
        const expensesByCat: { category: Category, expenses: Expense[] }[] = []
        let data = []
        switch (filter) {
            case "Par date":
                setDisplayCategories(false)
                data = filters.length != 0 ? expensesData.filter((expense) => filters.includes(expense.category)) : expensesData
                setExpenses(data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()))
                break;
            case "Par montant":
                setDisplayCategories(false)
                data = filters.length != 0 ? expensesData.filter((expense) => filters.includes(expense.category)) : expensesData
                setExpenses(data.sort((a, b) => b.amount - a.amount))
                break;
            case "Par catégorie":
                setDisplayCategories(true)
                store.categories.map((category) => {
                    const data = expensesData.filter((expense) => expense.category == category.name)
                    expensesByCat.push({ category: category, expenses: data })
                })

                setExpensesByCategory(expensesByCat)
                break;
            default:
                break;
        }

    }, [filter])

    const handleDisplay = () => {
        const expensesData = store.expenses
        const expensesByCat: { category: Category, expenses: Expense[] }[] = []
        let data = []
        switch (filter) {
            case "Par date":
                setDisplayCategories(false)
                data = filters.length != 0 ? expensesData.filter((expense) => filters.includes(expense.category)) : expensesData
                setExpenses(data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()))
                break;
            case "Par montant":
                setDisplayCategories(false)
                data = filters.length != 0 ? expensesData.filter((expense) => filters.includes(expense.category)) : expensesData
                setExpenses(data.sort((a, b) => b.amount - a.amount))
                break;
            case "Par catégorie":
                setDisplayCategories(true)
                store.categories.map((category) => {
                    const data = expensesData.filter((expense) => expense.category == category.name)
                    expensesByCat.push({ category: category, expenses: data })
                })

                setExpensesByCategory(expensesByCat)
                break;
            default:
                break;
        }
    }

    const _renderHeader = (section: { category: Category, expenses: Expense[] }, index: number) => {
        const isOpen = activeSections.includes(index)

        return (
            <View style={[styles.containerMargin, { width: WINDOW_WIDTH, flexDirection: 'row', alignItems: 'center' }]}>
                <Text style={styles.headerText}>{section.category.name}</Text>
                <Icon type="ionicon" name={isOpen ? "chevron-down" : "chevron-up"} color={isOpen ? "#E4B429" : "#00A3D8"} size={WINDOW_WIDTH * 0.1} />
            </View>
        );
    };

    const _renderContent = (section: { category: Category, expenses: Expense[] }) => {
        return (
            <View style={{ width: WINDOW_WIDTH }}>
                <FlatList
                    data={section.expenses}
                    keyExtractor={(item, index) => item.id}
                    renderItem={({ item }) => <SwipeableComponent expense={item} navigation={navigation} />}
                />
            </View>
        );
    };

    const _updateSections = (activeSections: any) => {
        console.log(activeSections);

        setActiveSections(activeSections)
    };

    const handleFilters = (value: string, type: string) => {
        if (type == "add") {
            const temp = filters
            temp.push(value)
            setFilters(temp)
        } else {
            const temp = filters
            let index = temp.findIndex((v) => v == value)
            console.log(index);
            temp.splice(index, 1)
            setFilters(temp)
        }
    }

    return (
        <View style={styles.container}>
            <ModalComponent isVisible={isVisible} handleVisibility={() => setIsVisible(false)} handleFilters={(value: string, type: string) => handleFilters(value, type)} filters={filters} handleDisplay={() => handleDisplay()} />
            <HeaderComponent title="Mes dépenses" handleDrawer={() => navigation.toggleDrawer()} />
            <View>
                <Text style={styles.hello}>Afficher par</Text>
            </View>
            <Divider style={styles.bigDivider} />
            <ScrollView horizontal style={{ flexGrow: 0 }}>
                {
                    ["Par date", "Par catégorie", "Par montant"].map((value) => {
                        return (
                            <TouchableOpacity onPress={() => {
                                setExpenses([])
                                setFilter(value)
                            }}
                                style={[styles.seeAllButton, styles.containerPadding, styles.containerMargin, { backgroundColor: filter == value ? '#00A3D8' : '#E4B429' }]}>
                                <Text style={styles.seeAllButtonText}>{value}</Text>
                            </TouchableOpacity>
                        )
                    })
                }
            </ScrollView>
            <View style={styles.container}>
                {
                    displayCategories ?
                        <Accordion
                            containerStyle={styles.container}
                            activeSections={activeSections}
                            sections={expensesByCategory}
                            renderHeader={(section, index) => _renderHeader(section, index)}
                            renderContent={section => _renderContent(section)}
                            onChange={section => _updateSections(section)}
                        />
                        :
                        <FlatList
                            data={expenses}
                            keyExtractor={(item, index) => item.id + "_" + index}
                            renderItem={({ item }) => <SwipeableComponent expense={item} navigation={navigation} />}
                        />
                }
            </View>
            <TouchableOpacity style={[styles.logsButton, styles.containerPadding, { backgroundColor: '#00A3D8' }]} onPress={() => setIsVisible(true)}>
                <Text style={styles.logsButtonText} >Filtres</Text>
            </TouchableOpacity>
        </View >
    )
}

export default ExpensesScreen