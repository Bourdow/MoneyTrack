export type RootStackParamsList = {
    Login: undefined,
    Signup: undefined,
    App: undefined,
    Home: {
        token: string | null
    },
    Creation: undefined
}

export type Expense = {
    id: string,
    title: string,
    amount: number,
    category: string,
    date: string,
}

export type Category = {
    id: string,
    name: string
}