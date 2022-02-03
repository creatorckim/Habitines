import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AppLoading from 'expo-app-loading';
import { 
    useFonts,
    Aldrich_400Regular 
  } from '@expo-google-fonts/aldrich';

const Habit = (props) => {

let [fontsLoaded] = useFonts({
    Aldrich_400Regular,
  });

    const [habitData, setHabitData] = useState({});
    const [dayPressed, setDayPressed] = useState(false);
    
    useEffect(() => {

        setHabitData(props.obj);

        if (props.obj.dateArray[props.obj.dateArray.length - 1][1] == true) {
            setDayPressed(true);
        } else {
            setDayPressed(false);
        }

 
    })

    if (!fontsLoaded) {
        return <AppLoading />;
      } else {
        return (
            <View style={styles.habitItem}>
                <TouchableOpacity style={styles.habitButton} onLongPress={() => props.toggleModal(props.obj.key)} onPress={() => {props.addDate(habitData.key, habitData.name, new Date().toISOString().slice(0, 10)); setDayPressed(dayPressed => !dayPressed);}}>
                    <Text style={styles.habitName}>
                        {props.obj.name}
                    </Text>
                    <View style={{backgroundColor: dayPressed === true ? '#ffc45d' : '#191B1D', width: 20, height: 20, borderColor: '#ffc45d', borderWidth: 2, borderRadius: 5,}}></View>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    habitItem: {
        backgroundColor: '#25282A',
        padding: 25,
        borderRadius: 5,
        width: '100%',
        marginVertical: 1.5,
        borderLeftWidth: 5,
        borderStyle: 'solid',
        borderColor: '#ffc45d',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontFamily: 'Aldrich_400Regular',

    },
    habitButton: {
        width: '100%',
        height: '100%', 
        flexDirection: 'row', 
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    habitName: {
        color: '#ffc45d',
        fontSize: 20,
        fontFamily: 'Aldrich_400Regular',
    },
    edit: {
        color: '#fff',
        fontSize: 30,

    },
    check: {
        width: 20,
        height: 20,
        borderColor: '#ffc45d',
        borderWidth: 2,
        borderRadius: 5,
    },
});


export default Habit;