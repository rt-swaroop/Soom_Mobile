import { StyleSheet } from "react-native";

export const createStyles = (theme: any) => StyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundDecoration: {
        position: 'absolute',
        top: -100,
        right: -100,
        width: 300,
        height: 300,
        borderRadius: 150,
        backgroundColor: theme.decoration,
    },
    backgroundDecorationBottom: {
        position: 'absolute',
        bottom: -50,
        left: -50,
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: theme.decoration,
    },
    safeArea: {
        flex: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        justifyContent: "center",
    },
    headerSection: {
        alignItems: "center",
        marginBottom: 40,
    },
    iconCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    title: {
        fontSize: 32,
        fontWeight: "900",
        color: theme.text,
        textAlign: "center",
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 16,
        color: theme.textSecondary,
        textAlign: "center",
        marginTop: 10,
        lineHeight: 22,
        fontWeight: '500',
    },
    selectionContainer: {
        gap: 20,
    },
    card: {
        backgroundColor: 'transparent',
        borderRadius: 24,
        padding: 20,
        flexDirection: "row",
        alignItems: "center",
        borderColor: theme.glassCardBorder,
        borderWidth: 1,
    },
    adminAccent: {
        borderLeftWidth: 0,
    },
    userAccent: {
        borderLeftWidth: 0,
    },
    iconWrapper: {
        width: 50,
        height: 50,
        borderRadius: 15,
        backgroundColor: 'transparent',
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
    },
    cardContent: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "800",
        color: theme.text,
        marginBottom: 4,
    },
    cardDescription: {
        fontSize: 13,
        color: theme.textSecondary,
        lineHeight: 18,
        fontWeight: '500',
    },
    goIconWrapper: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footer: {
        paddingBottom: 40,
        alignItems: "center",
    },
    logoutBtn: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: theme.glassCardBg,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: theme.glassCardBorder,
    },
    logoutBtnText: {
        color: theme.text,
        fontSize: 15,
        fontWeight: "700",
        marginLeft: 10,
    }
});
