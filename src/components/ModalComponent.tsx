import React from 'react';
import { SafeAreaView, Text, View, TouchableOpacity } from 'react-native';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../constants';
import styles from '../styles';
import Modal from 'react-native-modal';
import { useFirestore } from '../contexts/FirestoreContext';
import FilterComponent from './FilterComponent';

type Props = {
    isVisible: boolean,
    handleVisibility: () => void,
    handleFilters: (value: string, type: string) => void,
    filters: string[],
    handleDisplay: () => void
}

const ModalComponent: React.FC<Props> = ({ isVisible, handleVisibility, handleFilters, filters, handleDisplay }) => {

    const store = useFirestore()

    const handleAdd = (value: string) => {
        handleFilters(value, "add")
    }

    const handleDelete = (value: string) => {
        handleFilters(value, "delete")
    }

    return (
        <Modal isVisible={isVisible}
            onBackdropPress={() => handleVisibility()}
            swipeDirection="left"
            animationIn="slideInRight"
            animationOut="slideOutRight"
            onSwipeComplete={() => handleVisibility()}
            backdropColor='#E4B429'
            backdropOpacity={1}
            onModalHide={() => handleDisplay()}
        >
            <SafeAreaView style={[styles.containerPadding, { flex: 1, justifyContent: "space-between" }]}>
                <View>
                    <Text style={styles.headerText}>Filtrer par :</Text>
                    <View style={styles.containerPadding}>
                        <Text style={styles.headerText}>Catégorie</Text>
                        {
                            store.categories.map((category) => {
                                const isIn = filters.includes(category.name)
                                return <FilterComponent key={category.name} categoryName={category.name} handleAdd={() => handleAdd(category.name)} handleDelete={() => handleDelete(category.name)} checked={isIn} />

                            })
                        }
                    </View>
                </View>
                <TouchableOpacity style={[styles.logsButton, styles.containerPadding, { backgroundColor: '#00A3D8' }]} onPress={() => handleVisibility()}>
                    <Text style={styles.logsButtonText} >Valider</Text>
                </TouchableOpacity>
            </SafeAreaView>
        </Modal>
    )
}

export default ModalComponent