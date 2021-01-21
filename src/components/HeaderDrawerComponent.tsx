import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import styles from '../styles'


type Props = {
    handleDrawer: () => void
}
const HeaderDrawerComponent: React.FC<Props> = ({ handleDrawer }) => {
    return (
        <View style={[styles.headerDrawer, styles.containerPadding, styles.borderBottomDrawerItems]}>
            <TouchableOpacity onPress={() => handleDrawer()}>
                <Image style={styles.miniLogo}
                    source={require('../resources/MoneyTrackIcon.png')}
                />
            </TouchableOpacity>
            <Text style={styles.headerText}>Menu</Text>
        </View>
    )
}

export default HeaderDrawerComponent