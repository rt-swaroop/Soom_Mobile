import { StyleSheet } from "react-native";
import { COLORS } from "../../../theme/colors";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
        paddingBottom: 60
    },
    weekHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: COLORS.white,
        paddingVertical: 12,
        paddingHorizontal: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 4,
    },
    weekText: {
        fontSize: 18,
        fontWeight: "700",
        color: COLORS.primary,
    },
    navButton: {
        backgroundColor: COLORS.primary,
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center",
    },
    navArrow: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
        lineHeight: 36,
    },
    card: {
        backgroundColor: COLORS.white,
        borderRadius: 15,
        marginBottom: 20,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 6,
        overflow: "hidden",
    },
    cardHeader: {
        paddingVertical: 12,
        paddingHorizontal: 18,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    dateText: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: "700",
    },
    arrivalBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
    },
    arrivalText: {
        color: COLORS.white,
        fontSize: 12,
        fontWeight: "700",
    },
    cardBody: {
        padding: 15,
    },
    timeRow: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 15,
    },
    timeBox: {
        alignItems: "center",
        flex: 1,
    },
    time: {
        fontSize: 18,
        fontWeight: "700",
        color: COLORS.black,
    },
    timeLabel: {
        fontSize: 12,
        color: COLORS.darkGray,
    },
    divider: {
        width: 1,
        height: "80%",
        backgroundColor: COLORS.darkGray,
        marginHorizontal: 15,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    label: {
        fontSize: 14,
        color: COLORS.darkGray,
    },
    value: {
        fontSize: 14,
        fontWeight: "600",
        color: COLORS.black,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        width: "90%",
        height: "70%",
        backgroundColor: "#fff",
        borderRadius: 12,
        overflow: "hidden",
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        padding: 10,
        textAlign: "center",
        color: COLORS.primaryDark,
    },
    map: {
        flex: 1,
        height: 300
    },
    closeButton: {
        padding: 12,
        backgroundColor: COLORS.primary,
        alignItems: "center",
    },
    closeButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});