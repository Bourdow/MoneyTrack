import React from 'react'
import { Text, View } from 'react-native'
import styles from '../styles'
import { Expense } from '../types'
import moment from 'moment'


type Props = {
    expense: Expense
}


const ExpenseComponent: React.FC<Props> = ({ expense }) => {
    return (
        <View style={styles.expenseCard}>
            <View style={[styles.containerPadding, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
                <Text style={styles.expenseTitle}>{expense.title}</Text>
                <Text style={styles.expenseDate}>{moment(expense.date).format("DD/MM/YYYY")}</Text>
            </View>
            <View style={[styles.containerPadding, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomLeftRadius: 15, borderBottomRightRadius: 15, backgroundColor: '#00A3D8' }]}>
                <Text style={[styles.expenseDate, { color: '#fff', fontWeight: 'bold' }]}>Montant : </Text>
                <Text style={styles.expenseAmount}>{expense.amount} €</Text>
            </View>
        </View>
    )
}

export default ExpenseComponent