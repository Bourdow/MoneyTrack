import { Expense, Category } from './../types/index';
export const toExpense = (data: any) => {
    const datas = data.data()
    const expense: Expense = {
        id: data.id,
        title: datas.title,
        amount: datas.amount,
        category: datas.category,
        date: datas.date
    }
    return expense
}

export const toCategory = (data: any) => {
    const category: Category = {
        id: data.id,
        name: data.name
    }
    return category
}