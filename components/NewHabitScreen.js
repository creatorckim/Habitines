import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity, View, TextInput, Animated } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import AppLoading from 'expo-app-loading';
import { 
    useFonts,
    Aldrich_400Regular 
  } from '@expo-google-fonts/aldrich';

function NewHabitScreen({navigation}) {

  let [fontsLoaded] = useFonts({
    Aldrich_400Regular,
  });

    const [habitName, setHabitName] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    const moveText = useRef(new Animated.Value(0)).current;
    const interpolatedColor = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      if (isFocused) {
          moveTextTop();
          changeBorderYellow();
      } else if (!isFocused) {
          moveTextBottom();
          changeBorderBlack();
      }
    }, [isFocused])

    const moveTextTop = () => {
      Animated.timing(moveText, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    };
  
    const moveTextBottom = () => {
      Animated.timing(moveText, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start();
    };

    const moveTextPosition = moveText.interpolate({
      inputRange: [0, 1],
      outputRange: [100, 50],
    });
  
    const textPositionStyle = {
      transform: [
        {
          translateY: moveTextPosition,
        },
      ],
    };

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
      return (
        <View style={styles.container}> 
        <StatusBar style="light" />
        <Text style={styles.defineText}>Define Your Habit</Text>
        <Animated.View style={[styles.animatedView, textPositionStyle]}>
          <Text style={styles.label}>Habit Name</Text>
      </Animated.View>
      <Animated.View style={[styles.borderStyle, {borderColor: borderColor}]}>
        <TextInput style={styles.textInput}  value={habitName} onChangeText={setHabitName} onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)}/>
      </Animated.View>
        {/* <Text style={styles.habitScreenTitle}>“The chains of habit are too weak to be felt until they are too strong to be broken.”
― Samuel Johnson</Text> */}
          <View style={styles.actionBarContainer}>
              <TouchableOpacity style={styles.button} onPress={() => {navigation.goBack()}}>
                  <Text style={styles.buttonText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => {navigation.navigate({name: 'Habits', params: { addHabit: habitName },merge: true,})}}>
                  <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
          </View>
        </View>
      )
    }
  }

  const styles = StyleSheet.create({
    container: {
        backgroundColor: '#000',
        alignItems: 'center',
        width: '100%',
        height: '100%',
    },
    defineText: {
      color: '#ffc45d',
      fontSize: 20,
      marginTop: 150,
      fontFamily: 'Aldrich_400Regular',
      width: '100%',
      textAlign: 'center',
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
    habitScreenTitle: {
      color: '#ffc45d',
      fontSize: 10,
      marginTop: 100,
      fontFamily: 'Aldrich_400Regular',
      width: '90%',
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
    actionBarContainer: {
        flex: 1,
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: 60,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
      },
      button: {
        flex: 1,
        height: '100%',
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',

      },
      buttonText: {
          color: '#ffc45d',
          fontSize: 20,
          fontFamily: 'Aldrich_400Regular',
      }
    
  });

  export default NewHabitScreen;