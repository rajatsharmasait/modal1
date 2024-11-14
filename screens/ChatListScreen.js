import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../firebase';

const ChatListScreen = ({ navigation }) => {
  const [chatList, setChatList] = useState([]);
  const currentUserEmail = auth.currentUser?.email;

  useEffect(() => {
    const q = query(
      collection(db, 'messages'),
      where('participants', 'array-contains', currentUserEmail),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chats = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setChatList(chats);
    });

    return unsubscribe;
  }, []);

  const openChat = (chat) => {
    navigation.navigate('Messages', {
      chatId: chat.id,
      ownerEmail: chat.participants.find((email) => email !== currentUserEmail),
      listingName: chat.listingName,
    });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.chatItem} onPress={() => openChat(item)}>
      <Text style={styles.chatName}>
        {item.participants.find((email) => email !== currentUserEmail)}
      </Text>
      <Text style={styles.chatPreview}>{item.message || 'No messages yet.'}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={chatList}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

export default ChatListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F5E9',
    padding: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
  chatItem: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  chatName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  chatPreview: {
    color: '#666',
    marginTop: 4,
  },
});