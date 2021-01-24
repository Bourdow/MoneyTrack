import React, { useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { Text, View, TouchableOpacity, FlatList } from 'react-native';
import styles from '../styles';
import { PieChart } from 'react-native-svg-charts'
import HeaderComponent from '../components/HeaderComponent';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { RootStackParamsList } from '../types';
import { useFirestore } from '../contexts/FirestoreContext';
import { WINDOW_WIDTH } from '../constants';
import StatLabelsComponent from '../components/StatLabelsComponent';


type Props = DrawerScreenProps<RootStackParamsList, 'Stats'>
type PropsReal = {
    props: Props,
    isFocused: boolean
}


const StatisticsRealScreen: React.FC<PropsReal> = ({ props, isFocused }) => {


    const [slices, setSlices] = useState<any[]>([])
    const [selectedSlice, setSelectedSlice] = useState<{ label: String, value: Number }>({ label: '', value: 0 })

    const store = useFirestore()

    useEffect(() => {
        if (isFocused) {
            pieData()
        }
    }, [isFocused, selectedSlice])

    const randomColor = () => ('#' + ((Math.random() * 0xffffff) << 0).toString(16) + '000000').slice(0, 7)

    const pieData = () => {
        const expenses = store.expenses
        const categories = store.categories
        const statistics: any[] = []
        categories.map((category) => {
            let totalAmount = 0.00
            const expensesData = expenses.filter((expense) => expense.category == category.name)
            expensesData.map((expense) => {
                totalAmount += expense.amount
            })
            statistics.push({
                category: category.name,
                totalAmount: totalAmount
            })
        })
        setSlices(statistics.map((value, index) => {
            const color = randomColor()
            return ({
                value: value.totalAmount,
                svg: {
                    fill: color,
                    onPress: () => {
                        setSelectedSlice({ label: value.category, value: value.totalAmount })
                    },
                },
                arc: { outerRadius: (80 + value.totalAmount / 100) + '%', padAngle: selectedSlice.label === value.category ? 0.1 : 0 },
                key: value.category,
            })
        })
        )
    }

    const renderChartLegend = (item: any) => {
        return (
            <TouchableOpacity onPress={() => { }}
                style={{ flex: 1, justifyContent: 'center', flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
                <View style={{ backgroundColor: item.svg.fill, width: WINDOW_WIDTH * 0.05, height: WINDOW_WIDTH * 0.05 }}></View>
                <Text style={[styles.flatlistText, { paddingBottom: 0, marginLeft: 10 }]}>{item.key}</Text>
            </TouchableOpacity>
        )
    }

    return (
        <View style={styles.container}>
            <HeaderComponent title="Mes stats" handleDrawer={() => props.navigation.toggleDrawer()} />
            <PieChart
                style={{ height: WINDOW_WIDTH * 0.8 }}
                valueAccessor={({ item }) => item.value}
                outerRadius={'90%'}
                innerRadius={'25%'}
                labelRadius={'80%'}
                data={slices}
            >
                <StatLabelsComponent />
            </PieChart>
            <FlatList
                numColumns={2}
                data={slices}
                keyExtractor={(item) => item.key}
                renderItem={({ item }) => renderChartLegend(item)}
            />
        </View>
    )
}

const StatisticsScreen: React.FC<Props> = (props) => {
    const isFocused = useIsFocused()
    console.log("Stats => ", isFocused)
    return (
        <StatisticsRealScreen props={props} isFocused={isFocused} />
    )
}

export default StatisticsScreen