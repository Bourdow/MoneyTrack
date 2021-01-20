import { FirebaseAuthTypes } from '@react-native-firebase/auth'
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { Category, Expense } from '../types'
import { toCategory, toExpense } from '../utils'
import { useAuth } from './AuthContext'

type FirestoreContextType = {
    expenses: Expense[],
    categories: Category[],
    addExpense: (title: string, date: string, amount: number, category: string) => Promise<void>
    getExpenses: () => void
    deleteExpense: (itemId: string) => Promise<void>
}

const defaultFirestoreState: FirestoreContextType = {
    expenses: [],
    categories: [],
    addExpense: async () => undefined,
    getExpenses: async () => undefined,
    deleteExpense: async () => undefined
}

const FirestoreContext = createContext<FirestoreContextType>(defaultFirestoreState)

export const FirestoreContextProvider: React.FC = ({ children }) => {
    const [user, setUser] = useState<FirebaseAuthTypes.User | { uid: string | null }>()
    const [expenses, setExpenses] = useState<Expense[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const auth = useAuth()
    const expensesCollection = firestore().collection('expenses')
    const categoriesCollection = firestore().collection('categories')


    useEffect(() => {
        getCategories()
        if (auth.user != undefined) {
            setUser(auth.user)
        }
    }, [auth])

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
        const expensesData = (await expensesCollection.where('owner', '==', user?.uid).get()).docs
        setExpenses(expensesData.map((data) => toExpense(data)))
    }

    // UPDATE
    const updateExpense = async () => {

    }

    // DELETE
    const deleteExpense = async (itemId: string) => {
        await expensesCollection.doc(itemId).delete().then(() => getExpenses())

    }

    /* FIN du CRUD des dépenses */


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
                categories: categories,
                expenses: expenses,
                addExpense,
                getExpenses,
                deleteExpense
            }}>
            {children}
        </FirestoreContext.Provider>
    )
}


export const useFirestore = () => {
    const firestore = useContext(FirestoreContext)
    return firestore
}