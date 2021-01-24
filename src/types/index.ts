import Animated from "react-native-reanimated"; // Nécessaire pour le type RenderUnderlay

export type RootStackParamsList = {
    Login: undefined,
    Signup: undefined,
    App: undefined,
    Home: {
        token?: string | null
    },
    Expenses: undefined,
    Creation: {
        expense?: Expense
    },
    Stats: undefined
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

export type Statistic = {
    type: string,
    valueType: string,
    totalAmount: number
}

export type RenderUnderlay<T> = (params: {
    item: T;
    percentOpen: Animated.Node<number>;
    open: (snapToIndex?: number) => Promise<void>;
    close: () => Promise<void>;
}) => React.ReactNode;

export type RenderOverlay<T> = (params: {
    item: T;
    openLeft: (snapToIndex?: number) => Promise<void>;
    openRight: (snapToIndex?: number) => Promise<void>;
    close: () => Promise<void>;
}) => React.ReactNode;

export enum OpenDirection {
    LEFT = "left",
    RIGHT = "right",
    NONE = 0
}