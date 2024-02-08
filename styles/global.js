import { StyleSheet } from "react-native";

export const globalStyles = StyleSheet.create({
    shiftBox: {
        flex:1,
        borderWidth: 0.2,
        borderColor: "#A4B8D3",
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "white",
        paddingHorizontal: 20,
        paddingVertical: 5,
    },
    bookButton: {
        borderRadius: 12,
        // borderWidth: 10,
        // borderColor: "black"
    },
    currentDate: {
        fontSize: 20,
        fontWeight: "bold",
        paddingHorizontal: 20,
        paddingVertical: 10,
        color: "#4F6C92"
    },

    shiftsInfo: {
        fontSize: 18,
        // fontWeight: "bold",
        // paddingHorizontal: 20,
        paddingVertical: 10,
        color: "#b5bcc9"
    },

    availableShiftScreen: {
        // paddingHorizontal: 20
        backgroundColor: "#F1F4F8",
        // paddingVertical: 20
    },
    shiftsList:{
        // paddingHorizontal:20
    },
    citiesFilter: {
        // padding:20,
        backgroundColor: "white",
        paddingTop: 40,
        paddingBottom: 5,
        paddingHorizontal: 20,
        borderBottomWidth: 0.2,
        borderBottomColor: "#A4B8D3"
    },

    citiesFilterBox: {
        // padding:10,
        paddingRight: 10,
        fontWeight: "bold",
        // backgroundColor: "black",
        paddingHorizontal: 10,
        paddingVertical: 20        
    },

    shiftSubBox: {
        flexDirection: "row",
        justifyContent: "space-between",
        // borderWidth: 2,
        // borderColor: "black",
        width: "65%"
    },
    shiftTimings: {
        color: "#4F6C92",
        fontSize: 18,
        fontWeight: "400"
    },
    shiftDateNDetails : {
        flexDirection: "row",
    }
})