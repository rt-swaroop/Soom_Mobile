import { StyleSheet } from "react-native";
import { COLORS } from "../../../theme/colors";

export const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: COLORS.lightBlue,
    },
    container: {
        flex: 1,
        paddingVertical: 16,
        paddingHorizontal: 12,
        backgroundColor: COLORS.lightBlue,
    },
    dayContainer: {
        alignItems: "center",
        marginHorizontal: 4,
    },
    dayText: {
        color: "#555",
        fontWeight: "500",
    },
    circle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#ccc",
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 4,
    },
    selectedCircle: {
        backgroundColor: COLORS.primaryDark,
        borderColor: COLORS.primary,
    },
    dateText: {
        color: "#333",
    },
    selectedDateText: {
        color: COLORS.white,
        fontWeight: "600",
    },
    hoursText: {
        color: "#999",
        fontSize: 12
    },
    card: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    taskCompany: {
        fontSize: 14,
        color: COLORS.primary,
    },
    taskStatus: {
        fontSize: 14,
        fontWeight: '600',
    },
    statusCompleted: {
        color: COLORS.green1
    },
    statusInProgress: {
        color: '#f39c12',
    },
    divider: {
        height: 1,
        backgroundColor: '#eee',
        marginVertical: 8,
    },
    taskContainer: {
        marginBottom: 10,
    },
    taskDescription: {
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
        marginBottom: 4,
    },
    taskMetaRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    taskTime: {
        fontSize: 14,
        color: '#555',
    },
    loader: {
        flex: 1,
        backgroundColor: COLORS.lightBlue,
    },
    fixedButtonContainer: {
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    submitButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 12,
        width: '90%',
        alignItems: 'center',
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
    },
    submitButtonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '600',
    },
    taskCard: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: 14,
        marginBottom: 14,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 3,
        elevation: 2,
    },
    taskCardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    taskCardTitle: {
        fontSize: 16,
        color: COLORS.primaryDark,
        fontWeight: '700',
    },
    formGroup: {
        marginBottom: 10,
    },
    label: {
        fontSize: 13,
        color: COLORS.primaryDark,
        marginBottom: 6,
        fontWeight: '600',
    },
    input: {
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.gray,
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 10,
        fontSize: 15,
        color: COLORS.primaryDark,
    },
    inlineGroup: {
        flexDirection: 'row',
    },
    addTaskButton: {
        backgroundColor: COLORS.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 10,
        gap: 8,
    },
    addTaskButtonText: {
        color: COLORS.white,
        fontSize: 15,
        fontWeight: '600',
        marginLeft: 8,
    },
    emptyStateContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyStateText: {
        textAlign: 'center',
        marginTop: 16,
        color: COLORS.gray,
        fontSize: 16,
        fontWeight: '500',
    },
    editButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 8,
        marginBottom: 12,
    },
    editButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.primary,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    editButtonText: {
        color: COLORS.white,
        fontWeight: '500',
        marginLeft: 6,
        fontSize: 14,
    }
});