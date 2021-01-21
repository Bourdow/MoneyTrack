import { Text } from "react-native-svg";
import React from 'react'

type Props = {
    slices: any
}

const StatLabelsComponent = (slices: any) => {
    return slices.slices.map((slice: any, index: number) => {
        const { labelCentroid, pieCentroid, data } = slice;
        return (
            <Text
                key={index}
                x={pieCentroid[0]}
                y={pieCentroid[1]}
                fill="#fff"
                textAnchor={'middle'}
                alignmentBaseline={'middle'}
                fontSize={24}
                fontWeight='bold'
                stroke={'black'}
                strokeWidth={0.2}
            >
                {data.value}
            </Text>
        )
    })
}

export default StatLabelsComponent
