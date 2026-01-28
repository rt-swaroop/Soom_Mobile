import { StyleSheet } from "react-native";

export const createStyles = (theme: any) => StyleSheet.create({
    sectionCard: {
        marginHorizontal: 20,
        marginTop: 10,
        marginBottom: 20,
        backgroundColor: theme.text === '#FFFFFF' ? '#1F2937' : '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 0.5,
        borderColor: theme.text === '#FFFFFF' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 18,
    },
    sectionTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 17,
        fontWeight: "700",
        color: theme.text === '#FFFFFF' ? '#FFFFFF' : '#374151',
        marginLeft: 10,
    },
});
