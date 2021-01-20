import React from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import { Icon } from 'react-native-elements'
import { WINDOW_WIDTH } from './../constants/index';
import styles from '../styles'

type Props = {
    color: string,
    name: string,
    onPress: Function,
}

const SwipeComponent: React.FC<Props> = ({ color, name, onPress }) => {


    console.log("-- name icon --")
    console.log(name)

    return (
            <TouchableOpacity>
                <Icon
                    onPress={() => onPress}
                    type="font-awesome"
                    name={"edit"}
                    size={WINDOW_WIDTH * 0.1}
                    color={color}
                />
            </TouchableOpacity>
    )
}

export default SwipeComponent