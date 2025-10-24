import React, { useState } from "react";

import { View, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

import { styles } from "../Profile.styles";

const CollapsibleSection = ({ title, children }: { title: string; children: React.ReactNode }) => {
    const [open, setOpen] = useState(false);

    return (
        <View style={styles.section}>
            <TouchableOpacity
                style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}
                onPress={() => setOpen(!open)}
            >
                <Text style={styles.sectionTitle}>{title}</Text>
                <Icon name={open ? "keyboard-arrow-up" : "keyboard-arrow-down"} size={28} color="#333" />
            </TouchableOpacity>

            {open && <View style={{ marginTop: 10 }}>{children}</View>}
        </View>
    );
};

export default CollapsibleSection;