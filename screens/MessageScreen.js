import { addDoc, collection, onSnapshot, orderBy, query, Timestamp } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { auth, db } from '../firebase';

const MessagesScreen = ({ route }) => {
  const { chatId } = route.params;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const currentUserEmail = auth.currentUser?.email;

  useEffect(() => {
    const q = query(
      collection(db, 'messages', chatId, 'chat'),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return unsubscribe;
  }, []);

  const sendMessage = async () => {
    if (message.trim()) {
      await addDoc(collection(db, 'messages', chatId, 'chat'), {
        sender: currentUserEmail,
        message,
        createdAt: Timestamp.now(),
      });
      setMessage('');
    }
  };

  const renderMessage = ({ item }) => (
    <View style={item.sender === currentUserEmail ? styles.userMessage : styles.ownerMessage}>
      <Text>{item.message}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList data={messages} renderItem={renderMessage} keyExtractor={(item) => item.id} />
      <View style={styles.inputContainer}>
        <TextInput value={message} onChangeText={setMessage} style={styles.input} />
        <Pressable onPress={sendMessage}>
          <Text>Send</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default MessagesScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  userMessage: { alignSelf: 'flex-end', backgroundColor: '#003580', padding: 8, borderRadius: 8 },
  ownerMessage: { alignSelf: 'flex-start', backgroundColor: '#ccc', padding: 8, borderRadius: 8 },
  inputContainer: { flexDirection: 'row', padding: 8 },
  input: { flex: 1, borderColor: '#ccc', borderWidth: 1, borderRadius: 8, padding: 8 },
});