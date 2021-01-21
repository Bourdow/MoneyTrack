import React, { useState } from 'react'
import { Animated, Text, View, TouchableOpacity } from 'react-native'
import { Icon } from 'react-native-elements'
import { WINDOW_WIDTH } from './../constants/index';
import { Expense, RootStackParamsList } from '../types'
import styles from '../styles'
import ExpenseComponent from './ExpenseComponent'
import SwipeComponent from './SwipeComponent'
// Swipe component
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { RectButton } from 'react-native-gesture-handler';
import { useFirestore } from '../contexts/FirestoreContext';
import { DrawerNavigationProp } from '@react-navigation/drawer';


type Props = {
  expense: Expense,
  navigation: DrawerNavigationProp<RootStackParamsList, 'Home'>
}

const SwipeableComponent: React.FC<Props> = ({ expense, navigation }) => {

  const [swipeableRow, setSwipeableRow] = useState<Swipeable>()

  const store = useFirestore()

  const updateRef = (ref: Swipeable) => {
    setSwipeableRow(ref);
  };

  const close = () => {
    if (swipeableRow != undefined) {
      swipeableRow.close();
    }
    else {
      console.log("erreur close item swipeable")
    }

  };

  const renderLeftActions = (progress: Animated.AnimatedInterpolation) => (
    <View style={{ width: 130, flexDirection: 'row' }}>
      {renderLeftAction('trash', '#f04747', 130, progress)}
    </View>
  );

  const renderLeftAction = (text: string, color: string, x: number, progress: Animated.AnimatedInterpolation) => {
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [x, 0],
    });

    return (
      <Animated.View style={{ flex: 1, transform: [{ translateX: trans }] }}>
        <RectButton style={[styles.swipeRightAction]} onPress={() => store.deleteExpense(expense.id)}>
          <SwipeComponent name={text} color={color} onPress={() => { }} />
        </RectButton>
      </Animated.View>
    );
  };

  const renderRightActions = (progress: Animated.AnimatedInterpolation) => (
    <View style={{ width: 130, flexDirection: 'row' }}>
      {renderRightAction('edit', '#E4B429', 130, progress)}
    </View>
  );

  const renderRightAction = (text: string, color: string, x: number, progress: Animated.AnimatedInterpolation) => {
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [x, 0],
    });
    return (
      <Animated.View style={{ flex: 1, transform: [{ translateX: trans }] }}>
        <RectButton style={[styles.swipeRightAction]} onPress={() => navigation.navigate('Creation', { expense: expense })}>
          <SwipeComponent name={text} color={color} onPress={() => { }} />
        </RectButton>
      </Animated.View>
    );
  }

  return (
    <Swipeable
      renderLeftActions={renderLeftActions}
      renderRightActions={renderRightActions}
      ref={updateRef}
      leftThreshold={30}
      rightThreshold={30}
    >
      <ExpenseComponent expense={expense} />
    </Swipeable>
  )
}

export default SwipeableComponent