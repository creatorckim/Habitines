import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import Habit from './components/Habit';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NewHabitScreen from './components/NewHabitScreen';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import CalendarScreen from './components/CalendarScreen';
import AppLoading from 'expo-app-loading';
import { 
  useFonts,
  Aldrich_400Regular 
} from '@expo-google-fonts/aldrich';
import Modal from "react-native-modal";

function HomeScreen({navigation, route}) {
  let [fontsLoaded] = useFonts({
    Aldrich_400Regular,
  });

  const [habitList, setHabitList] = useState([]);
  const [keyForSheet, setKeyForSheet] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);

  useEffect(() => {

    checkNewDates();


  }, [])

  useEffect(() => {
    if (route.params?.addHabit) {

      let date = new Date();
      let isoDateTime = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().slice(0, 10);
      let tempArray = [[isoDateTime, false]];
      let randomKey = uuid.v1();
      storeData({'key': randomKey, 'name': route.params?.addHabit, 'dateArray': tempArray})

    }

  }, [route.params?.addHabit])

  useEffect(() => {
    if (route.params?.changedArray) {
      const { id, name, changedArray } = route.params;
      updateArray(id, name, changedArray);
    }
  }, [route.params?.changedArray])


  const setFullDate = () => {
    const weekday = ['Sunday', 'Monday', 'Tueday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let day = new Date().getDate();
    let dayNum = new Date().getDay();
    let dayName = weekday[dayNum];

    let fullDate = dayName + ' ' + day;

    return fullDate;
  }

  const toggleModal = (key) => {
    setModalVisible(!isModalVisible);

    setKeyForSheet(key);
  };

  const toggleDeleteModal = (key) => {
    setDeleteModalVisible(!isDeleteModalVisible);

    setKeyForSheet(key);
  }

  const addDate = async (id, name, date) => {
    for (let i = 0; i < habitList.length; i++) {
      if (habitList[i].key == id) {
        for (let j = 0; j < habitList[i].dateArray.length; j++) {
          if (habitList[i].dateArray[j][0] == date) {
            habitList[i].dateArray[j][1] = !habitList[i].dateArray[j][1];
          }
        }
          const tempHabit = {'key': id, 'name': name, 'dateArray': habitList[i].dateArray};
          await AsyncStorage.mergeItem(id, JSON.stringify(tempHabit));
          getAllData();
      }
    }

  }

  const updateArray = async (id, name, array) => {
    const tempHabit = {'key': id, 'name': name, 'dateArray': array};
    await AsyncStorage.mergeItem(id, JSON.stringify(tempHabit));
    getAllData();
  }

  const checkNewDates = async () => {
    try {  
      const keys = await AsyncStorage.getAllKeys();  
      const resultArray = [];
      await AsyncStorage.multiGet(keys).then(key => {
        key.forEach(data => {
          resultArray.push(JSON.parse(data[1]));
        });
      });
      let newArray = [];
      let date = new Date();
      let isoDateTime = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().slice(0, 10);
      resultArray.forEach(async result => {
        if (result.dateArray[result.dateArray.length - 1][0] != isoDateTime) {
          let missedDaysArray = addBetweenDates(result.dateArray[result.dateArray.length - 1][0], isoDateTime);
          let tempArray = [].concat(result.dateArray, missedDaysArray);
          let tempHabit = {'key': result.key, 'name': result.name, 'dateArray': tempArray};
          await AsyncStorage.mergeItem(result.key, JSON.stringify(tempHabit));
        }
      })

      const newkeys = await AsyncStorage.getAllKeys();  
      await AsyncStorage.multiGet(newkeys).then(key => {
        key.forEach(data => {
          newArray.push(JSON.parse(data[1]));
        });
      });

        setHabitList(newArray);
   } catch (e) {
      console.log(e);
   }

  }

  const addBetweenDates = (start, end) => {
    const dateList = [];
    const startDate = start;
    const endDate = end;
    let date = new Date(startDate);
    let tempDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
    tempDate.setDate(tempDate.getDate() + 1);
    let tempStart = startDate;

    while (tempStart < endDate) {
      tempStart = tempDate.toISOString().slice(0, 10);
      dateList.push([tempStart, false]);
      tempDate.setDate(tempDate.getDate() + 1);
      
    };

    return dateList;
  }

  const getAllData = async () => {
    try {  
      const keys = await AsyncStorage.getAllKeys();  
      const resultArray = [];
      await AsyncStorage.multiGet(keys).then(key => {
        key.forEach(data => {
          resultArray.push(JSON.parse(data[1]));
        });
      });

      setHabitList(resultArray);
   } catch (e) {
      console.log(e);
   }
  }

  const storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(value.key, jsonValue)
      getAllData();
    } catch (e) {
      console.log(e);
    }
  }

  const getData = async (key) => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch(e) {
      console.log(e);
    }
  }

  const deleteData = async (key) => {
    try {
      await AsyncStorage.removeItem(key);
      getAllData();
    } catch(e) {
      console.log(e);
    }
    
  }

  const setToCalendarScreen = (habit) => {
    navigation.navigate('Calendar', habit);
  }


  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <Text style={styles.date}>{setFullDate().toUpperCase()}</Text>
        <ScrollView style={styles.habitList} showsVerticalScrollIndicator={false}>
          {habitList.map((habit) => 
            <Habit key={habit.key} id={habit.key} obj={habit} addDate={addDate} toggleModal={toggleModal}/>
          )}
        </ScrollView>
        <View style={styles.actionBarContainer}>
          <TouchableOpacity onPress={() => {navigation.navigate('NewHabits')}}>
            <View style={styles.addButtonContainer}>
              <Text style={styles.addButton}>+</Text>
            </View>
          </TouchableOpacity>
        </View>
        <Modal isVisible={isModalVisible} style={styles.modal}>
            <TouchableOpacity style={styles.modalButton} onPress={() => {
              for (let i = 0; i < habitList.length; i++) {
                if (habitList[i].key == keyForSheet) {
                  let tempHabit = habitList[i];
                  setToCalendarScreen(tempHabit);
                }
                toggleModal();
              }}}><Text style={styles.modalText}>Calendar</Text></TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={() => {toggleDeleteModal(keyForSheet); toggleModal(keyForSheet);}}><Text style={styles.modalText}>Delete</Text></TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={toggleModal}><Text style={styles.modalText}>Cancel</Text></TouchableOpacity>
      </Modal>
      <Modal isVisible={isDeleteModalVisible} style={styles.modal}>
        <Text style={styles.modalText}>Delete Habit?</Text>
        <TouchableOpacity style={styles.modalButton} onPress={() => {deleteData(keyForSheet); toggleDeleteModal(keyForSheet);}}><Text style={styles.modalText}>Delete</Text></TouchableOpacity>
        <TouchableOpacity style={styles.modalButton} onPress={toggleDeleteModal}><Text style={styles.modalText}>Cancel</Text></TouchableOpacity>
      </Modal>
      </View>
    )
  }
}

const Stack = createNativeStackNavigator();

export default function App() {

  return (
    <NavigationContainer style={styles.navContainer}>
      <Stack.Navigator initialRouteName='Habits'>
        <Stack.Screen name='Habits' component={HomeScreen} style={styles.nav} options={{ headerShown: false }}/>
        <Stack.Screen name='NewHabits' component={NewHabitScreen} style={styles.nav} options={{ headerShown: false }}/>
        <Stack.Screen name='Calendar' component={CalendarScreen} style={styles.nav} options={{ headerShown: false }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  navContainer: {
    width: '100%',
    height:'100%',
    backgroundColor: '#000',
    color: '#ffc45d',
  },
  nav: {
    backgroundColor: '#000',
    color: '#ffc45d',
  },
  container: {
    backgroundColor: '#000',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    fontFamily: 'Aldrich_400Regular',
  },
  date: {
    color: '#ffc45d',
    fontSize: 20,
    marginTop: 60,
    fontFamily: 'Aldrich_400Regular',
  },
  habitList: {
    width: '90%',
    marginTop: 20,
    marginBottom: 80,
  },
  actionBarContainer: {
    position: 'absolute',
    bottom: 0,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionBarTitle: {
    color: '#fff',
  },
  addButtonContainer: {
    width: 60,
    height: 60,
    backgroundColor: '#ffc45d',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    fontSize: 30,
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalButton: {
    width: '100%',
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffc45d',
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: '#000',
  },
  modalText: {
    fontSize: 20,
    fontFamily: 'Aldrich_400Regular',
    color: '#fff',
    alignItems: 'center',
    textAlign: 'center',


  },
});
