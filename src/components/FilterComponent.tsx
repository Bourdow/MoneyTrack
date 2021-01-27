import React from 'react'
import { Switch, Text, View } from 'react-native'
import styles from '../styles'

type Props = {
    categoryName: string,
    handleAdd: () => void,
    handleDelete: () => void,
    checked: boolean
}

const FilterComponent: React.FC<Props> = ({ categoryName, handleAdd, handleDelete, checked }) => {

    const [switched, setSwitched] = React.useState<boolean>(checked)

    const handleSwitch = (switchedValue: boolean) => {
        setSwitched(switchedValue)
        if (switchedValue) {
            handleAdd()
        } else {
            handleDelete()
        }
    }

    return (
        <View style={[styles.containerMargin, { flexDirection: 'row', alignItems: 'center' }]}>
            <Text style={[styles.filterText, { marginRight: 10 }]}>{categoryName}</Text>
            <Switch thumbColor="#00A3D8" trackColor={{ true: "#fff", false: "#000" }} value={switched} onValueChange={switched => handleSwitch(switched)} />
        </View>
    )
}

export default FilterComponent