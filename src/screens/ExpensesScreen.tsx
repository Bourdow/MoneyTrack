import { DrawerScreenProps } from '@react-navigation/drawer'
import React, { useEffect, useState } from 'react'
import { FlatList, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { Divider, Icon, Input } from 'react-native-elements'
import HeaderComponent from '../components/HeaderComponent'
import SwipeableComponent from '../components/SwipeableComponent'
import { useFirestore } from '../contexts/FirestoreContext'
import styles from '../styles'
import { Category, Expense, RootStackParamsList } from '../types'
import Accordion from 'react-native-collapsible/Accordion';
import { WINDOW_WIDTH } from '../constants'
import ModalComponent from '../components/ModalComponent'
import { Picker } from '@react-native-picker/picker'

type Props = DrawerScreenProps<RootStackParamsList, 'Expenses'>

const ExpensesScreen: React.FC<Props> = ({ navigation, route }) => {

    const [filter, setFilter] = useState<string>("Par date")
    const [displayCategories, setDisplayCategories] = useState<boolean>(false)
    const [expenses, setExpenses] = useState<Expense[]>([])
    const [expensesByCategory, setExpensesByCategory] = useState<{ category: Category, expenses: Expense[] }[]>([])
    const [activeSections, setActiveSections] = useState<number[]>([])
    const [isVisible, setIsVisible] = useState<boolean>(false)
    const [filters, setFilters] = useState<string[]>([])
    // const [isPickerVisible, setIsPickerVisible] = useState<boolean>(false)
    const refFilter = React.createRef<Input>()

    const store = useFirestore()

    useEffect(() => {
        setExpenses(store.expenses)
    }, [store.expenses])

    // useEffect(() => {
    //     refFilter.current?.blur()
    // }, [isPickerVisible])

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
                if (filters.length != 0) {
                    let expensesByCtg = expensesByCat.filter((expense) => filters.includes(expense.category.name))
                    setExpensesByCategory(expensesByCtg)
                } else {
                    setExpensesByCategory(expensesByCat)
                }
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
                if (filters.length != 0) {
                    let expensesByCtg = expensesByCat.filter((expense) => filters.includes(expense.category.name))
                    setExpensesByCategory(expensesByCtg)
                } else {
                    setExpensesByCategory(expensesByCat)
                }
                break;
            default:
                break;
        }
    }

    const _renderHeader = (section: { category: Category, expenses: Expense[] }, index: number) => {
        const isOpen = activeSections.includes(index)

        return (
            <View style={[styles.containerMargin, { width: WINDOW_WIDTH - 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
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

    const _updateSections = (sections: number[]) => {
        let temp = activeSections
        console.log("temp", temp);

        setActiveSections(sections)
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
            <View style={styles.containerPickerFilter}>
                <Picker
                    style={[{fontSize: 40, color: "#000"}]}
                    itemStyle = {{}}
                    selectedValue={filter}
                    onValueChange={(value) => setFilter(value.toString())}>
                            {
                                ["Par date", "Par catégorie", "Par montant"].map((value, index) => <Picker.Item key={index} label={value} value={value} />)
                            }
                </Picker>
            </View>
            <View style={styles.container}>
                {
                    displayCategories ?
                        <Accordion
                            containerStyle={[styles.container, styles.containerPadding]}
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
            <TouchableOpacity style={[styles.logsButton, styles.containerPadding, { backgroundColor: '#E4B429', marginBottom: 20, padding: 10, width: 'auto' }]} onPress={() => setIsVisible(true)}>
                <Text style={[styles.logsButtonText, {fontSize: WINDOW_WIDTH * 0.05,}]} >Filtrer</Text>
            </TouchableOpacity>
        </View >
    )
}

export default ExpensesScreen