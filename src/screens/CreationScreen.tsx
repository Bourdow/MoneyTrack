import { DrawerScreenProps } from '@react-navigation/drawer';
import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View, Modal } from 'react-native';
import { Input, Icon, Overlay } from 'react-native-elements';
import HeaderComponent from '../components/HeaderComponent';
import { useAuth } from '../contexts/AuthContext';
import { useFirestore } from '../contexts/FirestoreContext';
import styles from '../styles';
import { Category, RootStackParamsList } from '../types';
import { Picker } from '@react-native-picker/picker';
// Calendar 
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { WINDOW_WIDTH } from '../constants';
import moment from 'moment';
import { useIsFocused, CommonActions } from '@react-navigation/native';


type Props = DrawerScreenProps<RootStackParamsList, 'Creation'>

type PropsReal = {
    props: Props,
    isFocused: boolean
}

const CreationRealScreen: React.FC<PropsReal> = ({ props, isFocused }) => {

    const [isVisible, setIsVisible] = useState<boolean>(false)
    const [title, setTitle] = useState<string>('')
    const [amount, setAmount] = useState<string>('')
    const [date, setDate] = useState<Date>(new Date())
    const [category, setCategory] = useState<string>('')
    const [buttonTitle, setButtonTitle] = useState<string>('Ajouter')
    // Modal
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const refDate = React.createRef<Input>()
    const refCategory = React.createRef<Input>()
    const store = useFirestore()

    useEffect(() => {
        console.log(props.route);

        if (isFocused) {
            if (props.route.params?.expense != undefined && props.route.params?.expense != null) {
                setButtonTitle('Valider')
                setTitle(props.route.params.expense!.title)
                setAmount(props.route.params.expense!.amount.toString())
                setCategory(props.route.params.expense!.category)
                setDate(new Date(props.route.params.expense!.date))
            } else {
                setButtonTitle('Ajouter')
                reset()
            }
        } else {
            props.navigation.dispatch(CommonActions.setParams({ expense: null }))
            reset()
        }
    }, [isFocused])

    useEffect(() => {
        refDate.current?.blur()
    }, [isDatePickerVisible])

    useEffect(() => {
        refCategory.current?.blur()
    }, [isVisible])

    const addExpense = () => {
        store.addExpense(title, moment(date).format("YYYY-MM-DD"), Number(amount), category).then(() => {
            store.getExpenses()
            props.navigation.navigate('Home', {})
            reset()
        })
    }

    const updateExpense = () => {
        store.updateExpense(props.route.params.expense!.id, title, moment(date).format("YYYY-MM-DD"), Number(amount), category).then(() => {
            store.getExpenses()
            props.navigation.navigate('Home', {})
            reset()
        })
    }



    const reset = () => {
        setTitle('')
        setAmount('')
        setDate(new Date())
        setCategory('')
    }

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        refDate.current?.blur()
        setDatePickerVisibility(false);
    };

    const editDatePicker = (date: Date) => {
        setDate(date)
        setDatePickerVisibility(false);
    };

    const pressHandler = () => {
        if (buttonTitle == 'Ajouter') {
            addExpense()
        } else {
            updateExpense()
        }
    }


    return (
        <View style={styles.container}>
            <Overlay isVisible={isVisible} >
                <>
                    <Picker
                        style={{ width: WINDOW_WIDTH * 0.9 }}
                        selectedValue={category}
                        onValueChange={(itemValue) =>
                            setCategory(itemValue.toString())
                        }>
                        <Picker.Item key="Aucune" label="Aucune" value="Aucune" />
                        {
                            store.categories.map((category: Category) => <Picker.Item key={category.id} label={category.name} value={category.name} />)
                        }
                    </Picker>
                    <Icon onPress={() => {
                        refCategory.current?.blur()
                        setIsVisible(false)
                    }}
                        name="checkmark-circle" type="ionicon" size={WINDOW_WIDTH * 0.1} color="#00A3D8" />
                </>
            </Overlay>
            <HeaderComponent title="Nouv. dépense" handleDrawer={() => props.navigation.toggleDrawer()} />
            <View style={[styles.container, { justifyContent: 'center' }]}>
                <View style={[styles.container, { justifyContent: 'center' }]}>
                    <Input label="Titre" placeholder="Soda"
                        value={title} onChangeText={title => setTitle(title)}
                        containerStyle={styles.containerLogsInput} inputContainerStyle={{ borderBottomWidth: 0 }} style={[styles.containerPadding, styles.logsInput]}
                    />
                    <Input label="Montant" placeholder="1.50"
                        value={amount.toString()} onChangeText={amount => setAmount(amount.replace(',', '.'))}
                        containerStyle={styles.containerLogsInput} inputContainerStyle={{ borderBottomWidth: 0 }} style={[styles.containerPadding, styles.logsInput]}
                    />



                    <Input
                        ref={refDate}
                        label="Date d'achat"
                        placeholder="12/05/2019"
                        value={moment(date).format('DD/MM/YYYY')}
                        onFocus={showDatePicker}
                        containerStyle={styles.containerLogsInput}
                        inputContainerStyle={{ borderBottomWidth: 0 }}
                        style={[styles.containerPadding, styles.logsInput]}
                    />

                    <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        mode="date"
                        onConfirm={date => editDatePicker(date)}
                        onCancel={hideDatePicker}
                        date={date}
                    />
                    <Input ref={refCategory}
                        label="Catégorie" placeholder="Aucune" onFocus={() => setIsVisible(true)}
                        value={category}
                        containerStyle={styles.containerLogsInput} inputContainerStyle={{ borderBottomWidth: 0 }} style={[styles.containerPadding, styles.logsInput]}
                    />
                </View>
                <TouchableOpacity onPress={pressHandler}
                    style={[styles.logsButton, styles.containerPadding, { backgroundColor: '#00A3D8' }]}>
                    <Text style={styles.logsButtonText}>{buttonTitle}</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const CreationScreen: React.FC<Props> = (props) => {
    const isFocused = useIsFocused()
    return (
        <CreationRealScreen props={props} isFocused={isFocused} />
    )
}

export default CreationScreen