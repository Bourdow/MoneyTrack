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


type Props = DrawerScreenProps<RootStackParamsList, 'Creation'>

const CreationScreen: React.FC<Props> = ({ navigation }) => {

    const [isVisible, setIsVisible] = useState<boolean>(false)
    const [title, setTitle] = useState<string>('')
    const [amount, setAmount] = useState<string>('')
    const [date, setDate] = useState<Date>(new Date())
    // Modal
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const [category, setCategory] = useState<string>('')
    const store = useFirestore()

    const addExpense = () => {
        store.addExpense(title, moment(date).format('DD/MM/YYYY'), Number(amount), category).then(() => {
            store.getExpenses()
            navigation.goBack()
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
        setDatePickerVisibility(false);
    };

    const editDatePicker = (date: Date) => {
        setDate(date)
        setDatePickerVisibility(false);
    };

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
                    <Icon onPress={() => setIsVisible(false)}
                        name="checkmark-circle" type="ionicon" size={WINDOW_WIDTH * 0.1} color="#00A3D8" />
                </>
            </Overlay>
            <HeaderComponent title="Nouv. dépense" handleDrawer={() => navigation.toggleDrawer()} />
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
                    <Input label="Catégorie" placeholder="Aucune" onFocus={() => setIsVisible(true)}
                        value={category}
                        containerStyle={styles.containerLogsInput} inputContainerStyle={{ borderBottomWidth: 0 }} style={[styles.containerPadding, styles.logsInput]}
                    />

                </View>
                <TouchableOpacity onPress={() => addExpense()}
                    style={[styles.logsButton, styles.containerPadding, { backgroundColor: '#00A3D8' }]}>
                    <Text style={styles.logsButtonText}>Ajouter</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default CreationScreen