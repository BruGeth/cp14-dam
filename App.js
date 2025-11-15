import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Permiso para notificaciones denegado!');
      return;
    } 
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log("Token del dispositivo:",token);
  } else {
    alert('Debes de usar un dispositivo físico para las notificaciones');
  }
  return token;
}

async function scheduleNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Notificación",
      body: 'Esta es una prueba de notificación local',
    },
    trigger: { seconds: 5 },
  });
}

export default function App() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setToken(token));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Token de dispositivo:</Text>
      <Text selectable>{token}</Text>
      <Button title='Programar notificación' onPress={scheduleNotification} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {  
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
