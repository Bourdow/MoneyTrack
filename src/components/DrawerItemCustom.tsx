import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { WINDOW_WIDTH } from '../constants';
import styles from '../styles';

type Props = {
    title: string | ((props: { color: string; focused: boolean; }) => React.ReactNode) | undefined
    focused?: boolean
    onPress: () => void
}

const DrawerItemCustom: React.FC<Props> = ({ title, onPress, focused }) => {

    return (
        <TouchableOpacity onPress={() => onPress()}
            style={[styles.borderBottomDrawerItems, styles.itemDrawer, { borderBottomColor: focused ? '#202020' : '#fff' }]}>
            <Text style={[styles.headerText, { color: focused ? '#202020' : '#fff' }]}>{title}</Text>
        </TouchableOpacity>
    )
}

export default DrawerItemCustom