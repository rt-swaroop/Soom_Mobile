import React from "react";

import { View, TouchableOpacity, Image } from "react-native";
import Modal from "react-native-modal";
import Icon from "react-native-vector-icons/MaterialIcons";

import { IMAGES } from "../../../assets/images";

interface ImageViewModalProps {
    isVisible: boolean;
    onClose: () => void;
    imageUri: string | undefined;
}

const ImageViewModal = ({ isVisible, onClose, imageUri }: ImageViewModalProps) => {
    return (
        <Modal
            isVisible={isVisible}
            onBackdropPress={onClose}
            backdropOpacity={0.9}
            animationIn="fadeIn"
            animationOut="fadeOut"
            style={{ margin: 0 }}
            useNativeDriver={true}
        >
            <View style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity
                    style={{ position: 'absolute', top: 50, right: 20, zIndex: 10 }}
                    onPress={onClose}
                >
                    <Icon name="close" size={32} color="#FFF" />
                </TouchableOpacity>

                <Image
                    source={imageUri ? { uri: imageUri } : IMAGES.user}
                    style={{ width: '100%', height: '80%', resizeMode: 'contain' }}
                />
            </View>
        </Modal>
    );
};

export default ImageViewModal;
