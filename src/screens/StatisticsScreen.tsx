import React, { useEffect, useState } from 'react';
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

const StatisticsScreen: React.FC<Props> = ({ navigation, route }) => {


    const [selectedSlice, setSelectedSlice] = useState<{ label: String, value: Number }>({ label: '', value: 0 })

    const store = useFirestore()

    useEffect(() => {
        store.getByCategories()
    }, [])

    const randomColor = () => ('#' + ((Math.random() * 0xffffff) << 0).toString(16) + '000000').slice(0, 7)

    const pieData = store.statistics
        .map((value, index) => {
            const color = randomColor()
            return ({
                value: value.totalAmount,
                svg: {
                    fill: color,
                    onPress: () => {
                        setSelectedSlice({ label: value.valueType, value: value.totalAmount })
                        console.log(value);

                    },
                },
                arc: { outerRadius: (70 + value.totalAmount / 100) + '%', padAngle: selectedSlice.label === value.valueType ? 0.1 : 0 },
                key: value.valueType,
            })
        })

    const renderChartLegend = (item: any) => {
        return (
            <TouchableOpacity onPress={() => { }}
                style={{ flex: 1, justifyContent: 'center', flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
                <View style={{ backgroundColor: item.svg.fill, width: WINDOW_WIDTH * 0.05, height: WINDOW_WIDTH * 0.05 }}></View>
                <Text style={[styles.flatlistText, { marginLeft: 10 }]}>{item.key}</Text>
            </TouchableOpacity>
        )
    }

    return (
        <View style={styles.container}>
            <HeaderComponent title="Mes stats" handleDrawer={() => navigation.toggleDrawer()} />


            <PieChart
                style={{ height: WINDOW_WIDTH * 0.8 }}
                valueAccessor={({ item }) => item.value}
                outerRadius={'90%'}
                innerRadius={'25%'}
                labelRadius={'80%'}
                data={pieData}
            >
                <StatLabelsComponent />
            </PieChart>
            <FlatList
                numColumns={2}
                data={pieData}
                keyExtractor={(item) => item.key}
                renderItem={({ item }) => renderChartLegend(item)}
            />
        </View>
    )
}

export default StatisticsScreen