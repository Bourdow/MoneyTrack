import { FirebaseAuthTypes } from '@react-native-firebase/auth'
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { Category, Expense, Statistic } from '../types'
import { toCategory, toExpense } from '../utils'
import { useAuth } from './AuthContext'
import moment from 'moment'

type FirestoreContextType = {
    statistics: Statistic[],
    expenses: Expense[],
    categories: Category[],
    addExpense: (title: string, date: string, amount: number, category: string) => Promise<void>
    getExpenses: () => void
    updateExpense: (id: string, title: string, date: string, amount: number, category: string) => Promise<void>
    deleteExpense: (itemId: string) => Promise<void>,
    getByCategories: () => void
}

const defaultFirestoreState: FirestoreContextType = {
    statistics: [],
    expenses: [],
    categories: [],
    addExpense: async () => undefined,
    getExpenses: async () => undefined,
    updateExpense: async () => undefined,
    deleteExpense: async () => undefined,
    getByCategories: async () => undefined,
}

const FirestoreContext = createContext<FirestoreContextType>(defaultFirestoreState)

export const FirestoreContextProvider: React.FC = ({ children }) => {
    const [user, setUser] = useState<FirebaseAuthTypes.User | { uid: string | null }>()
    const [expenses, setExpenses] = useState<Expense[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [statistics, setStatistics] = useState<Statistic[]>([])
    const auth = useAuth()
    const expensesCollection = firestore().collection('expenses')
    const categoriesCollection = firestore().collection('categories')


    useEffect(() => {
        if (auth.user != undefined) {
            setUser(auth.user)
        }

    }, [auth])

    useEffect(() => {
        getCategories()
    }, [user])


    /* Début du CRUD des dépenses */

    // CREATE
    const addExpense = async (title: string, date: string, amount: number, category: string) => {
        await expensesCollection.add({
            title,
            amount,
            category,
            date,
            owner: user?.uid
        })
    }

    // READ
    const getExpenses = async () => {
        console.log("getexpenses");

        const expensesData = (await expensesCollection.where('owner', '==', user!.uid).get()).docs
        const expenses = expensesData.map((data) => toExpense(data))
        expenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        setExpenses(expenses)
    }

    // UPDATE
    const updateExpense = async (id: string, title: string, date: string, amount: number, category: string) => {
        await expensesCollection.doc(id).update({
            title,
            date,
            amount,
            category
        })
    }

    // DELETE
    const deleteExpense = async (itemId: string) => {
        await expensesCollection.doc(itemId).delete().then(() => getExpenses())

    }

    /* FIN du CRUD des dépenses */

    /* DEBUT des filtres des statistiques de dépenses */
    // A REVOIR
    const getByCategories = async () => {
        //     setStatistics([])
        //     const tempTab = statistics
        //     categoriesCollection.get()
        //         .then((queryCategories) => {
        //             queryCategories.docs.map((category) => {
        //                 const categoryData = category.data()
        //                 let totalAmount = 0
        //                 expensesCollection.where('owner', '==', user!.uid).where("category", "==", categoryData.name).get()
        //                     .then((querySnapshot) => {
        //                         querySnapshot.docs.map((data) => {
        //                             const expense = data.data()
        //                             totalAmount += expense.amount
        //                         })
        //                         tempTab.push({
        //                             type: "category",
        //                             valueType: categoryData.name,
        //                             totalAmount
        //                         })
        //                     })
        //             })
        //         }).finally(() => {
        //             setStatistics(tempTab)
        //         })
    }

    /* FIN des filtres des statistiques de dépenses */


    /* Début du CRUD des catégories */
    // READ
    const getCategories = async () => {
        const categories = (await categoriesCollection.get()).docs
        setCategories(categories.map((data: any) => toCategory(data.data())))
    }
    /* Fin du CRUD des catégories */


    return (
        <FirestoreContext.Provider
            value={{
                statistics: statistics,
                categories: categories,
                expenses: expenses,
                addExpense,
                getExpenses,
                updateExpense,
                deleteExpense,
                getByCategories
            }}>
            {children}
        </FirestoreContext.Provider>
    )
}


export const useFirestore = () => {
    const firestore = useContext(FirestoreContext)
    return firestore
}