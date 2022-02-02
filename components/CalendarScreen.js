import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Animated } from 'react-native';
import { Calendar } from 'react-native-calendars';
import AppLoading from 'expo-app-loading';
import { 
    useFonts,
    Aldrich_400Regular 
  } from '@expo-google-fonts/aldrich';


function CalendarScreen({ navigation, route }) {

    let [fontsLoaded] = useFonts({
        Aldrich_400Regular,
      });

    const [dateArray, setDateArray] = useState([]);
    const [ableDays, setAbleDays] = useState({});
    const [habitName, setHabitName] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    const interpolatedColor = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        setDateArray(route.params.dateArray);

        setHabitName(route.params.name);

    }, []);

    useEffect(() => {
        if (isFocused) {
            changeBorderYellow();
        } else if (!isFocused) {
            changeBorderBlack();
        }
      }, [isFocused])

    useEffect(() => {

        markDays();

    }, [dateArray])


    const markDays = () => {
        let customMarkedDates = {};
        let arrayOfDates = dateArray;
        arrayOfDates.map((day) => {
            customMarkedDates[day[0]] = {
                selected: day[1],
                selectedColor: '#ffc45d'
            };
        });

        setAbleDays(customMarkedDates);

    }

    const changeBorderYellow = () => {
        Animated.timing(interpolatedColor, {
            toValue: 1,
            duration: 800,
            useNativeDriver: false,
        }).start();
    }

    const changeBorderBlack = () => {
        Animated.timing(interpolatedColor, {
            toValue: 0,
            duration: 800,
            useNativeDriver: false,
        }).start();
    }

    const borderColor = interpolatedColor.interpolate({
        inputRange: [0, 1],
        outputRange: ['#000', '#ffc45d']
    });



    if (!fontsLoaded) {
        return <AppLoading />;
    } else {
        return(
            <View style={styles.container}>
                <StatusBar style="light" />
                <View style={styles.inputContainer}>
                    <Animated.View style={styles.animatedView}>
                        <Text style={styles.label}>Habit Name</Text>
                    </Animated.View>
                    <Animated.View style={[styles.borderStyle, {borderColor: borderColor}]}>
                        <TextInput style={styles.textInput}  value={habitName} onChangeText={setHabitName} onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)}/>
                    </Animated.View>
                </View>
                <Calendar
                    minDate={route.params.dateArray[0][0]}
                    maxDate={route.params.dateArray[route.params.dateArray.length - 1][0]}
                    onDayPress={day => {
                        let dateArrayCopy = [...dateArray];
                        for (let i = 0; i < dateArrayCopy.length; i++) {
                            if (dateArrayCopy[i][0] == day.dateString) {
                                dateArrayCopy[i][1] = !dateArrayCopy[i][1];
                            }
                        }
                        setDateArray(dateArrayCopy);
                    }}
                    disableAllTouchEventsForDisabledDays={true}
                    enableSwipeMonths={true}
                    markedDates={ableDays}
                    theme={{
                        backgroundColor: '#000',
                        calendarBackground: '#000',
                        arrowColor: '#ffc45d',
                        textSectionTitleColor: '#ffc45d',
                        monthTextColor: '#ffc45d',
                        selectedDayTextColor: '#000',
                        dayTextColor: '#fff',
                        todayTextColor: '#ffc45d',
                        textDisabledColor: '#808080',
                    }}
                    style={{
                        width: '100%',
                        textDayFontFamily: 'Aldrich_400Regular',
                        textMonthFontFamily: 'Aldrich_400Regular',
                        textDayHeaderFontFamily: 'Aldrich_400Regular',
                    }}
                />
                    <View style={styles.actionBarContainer}>
                        <TouchableOpacity style={styles.button} onPress={() => {navigation.goBack()}}>
                            <Text style={styles.buttonText}>Back</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={() => {navigation.navigate({name: 'Habits', params: { changedArray: dateArray, id: route.params.key, name: habitName },merge: true,})}}>
                            <Text style={styles.buttonText}>Save</Text>
                        </TouchableOpacity>
                    </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    inputContainer: {
        width: '100%',
        alignItems: 'center',
    },

    animatedView: {
        alignItems: 'flex-start',
        zIndex: 10000,
    },
    label: {
        color: "#ffc45d",
        fontSize: 15,
    },
    borderStyle: {
        borderWidth: 2,
        borderColor: "#000",
        borderRadius: 5,
        borderBottomWidth: 2,
        borderBottomColor: '#ffc45d',
        backgroundColor: '#131414',
        width: '90%',
        marginTop: 50,
        fontFamily: 'Aldrich_400Regular',
    },

    textInput: {
        backgroundColor: '#131414',
        width: '90%',
        height: 80,
        padding: 20,
        fontSize: 20,
        color: '#ffc45d',
        fontFamily: 'Aldrich_400Regular',
    },
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: '#000',
    },
    actionBarContainer: {
        flex: 1,
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
      },
      button: {
        flex: 1,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
      },
      buttonText: {
          color: '#ffc45d',
          fontSize: 20,
          fontFamily: 'Aldrich_400Regular',
      }
})

export default CalendarScreen;