import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import styles from '../styles';

type Props = {
    title: string,
    handleDrawer: () => void
}

const HeaderComponent: React.FC<Props> = ({ title, handleDrawer }) => {
    return (
        <View style={[styles.header, styles.containerPadding]}>
            <TouchableOpacity onPress={() => handleDrawer()}>
                <Image style={styles.miniLogo}
                    source={require('../resources/MoneyTrackIcon.png')}
                />
            </TouchableOpacity>
            <Text style={styles.headerText}>{title}</Text>
        </View>
    )
}

export default HeaderComponent