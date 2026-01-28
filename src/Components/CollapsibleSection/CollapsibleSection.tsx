import React, { useMemo } from "react";

import { View, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

import { useAppTheme } from "../../theme/useAppTheme";
import { createStyles } from "./CollapsibleSection.styles";
import { COLORS } from "../../theme/colors";

interface CollapsibleSectionProps {
    title: string;
    icon: string;
    children: React.ReactNode;
    expanded: boolean;
    onToggle: () => void;
    contentPaddingBottom?: boolean;
}

const CollapsibleSection = ({
    title,
    icon,
    children,
    expanded,
    onToggle,
    contentPaddingBottom = true
}: CollapsibleSectionProps) => {
    const { theme } = useAppTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);

    return (
        <View style={[styles.sectionCard, !expanded && { paddingBottom: 15 }]}>
            <TouchableOpacity
                style={[styles.sectionHeader, { marginBottom: expanded ? 15 : 0 }]}
                onPress={onToggle}
                activeOpacity={0.7}
            >
                <View style={styles.sectionTitleContainer}>
                    <Icon name={icon} size={22} color={COLORS.primary} />
                    <Text style={styles.sectionTitle}>{title}</Text>
                </View>
                <Icon
                    name={expanded ? "expand-less" : "expand-more"}
                    size={24}
                    color="#9CA3AF"
                />
            </TouchableOpacity>

            {expanded && (
                <View>
                    {children}
                </View>
            )}
        </View>
    );
};

export default CollapsibleSection;