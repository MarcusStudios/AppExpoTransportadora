import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Button, Alert, TextInput } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import { getAuth, updateProfile, signOut } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';

const Usuario = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    profileImage: '',
  });
  const [newName, setNewName] = useState('');
  const [newProfileImage, setNewProfileImage] = useState(null);

  const navigation = useNavigation();

  useEffect(() => {
    const currentUser = getAuth().currentUser;
    if (currentUser) {
      setUser({
        name: currentUser.displayName || 'Anonymous',
        email: currentUser.email,
        profileImage: currentUser.photoURL || 'https://via.placeholder.com/150',
      });
      setNewName(currentUser.displayName || 'Anonymous');
    }
  }, []);

  const handleUpdateProfile = () => {
    const currentUser = getAuth().currentUser;
    if (currentUser) {
      updateProfile(currentUser, {
        displayName: newName,
        photoURL: newProfileImage || user.profileImage,
      }).then(() => {
        setUser((prevUser) => ({
          ...prevUser,
          name: newName,
          profileImage: newProfileImage || prevUser.profileImage,
        }));
        Alert.alert('Sucesso', 'Perfil Salvo com Sucesso!');
      }).catch((error) => {
        Alert.alert('Error', 'Erro:', error.message);
      });
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setNewProfileImage(result.assets[0].uri);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Tem certeza de que deseja sair?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: () => {
            signOut(getAuth()).then(() => {
              navigation.replace('Welcome');
            }).catch((error) => {
              Alert.alert('Error', 'Error logging out:', error.message);
            });
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Image source={{ uri: newProfileImage || user.profileImage }} style={styles.profileImage} />
        <TouchableOpacity onPress={pickImage} style={styles.editImageButton}>
          <Ionicons name="camera-outline" size={20} color="#fff" />
        </TouchableOpacity>
        <TextInput
          style={styles.userNameInput}
          value={newName}
          onChangeText={setNewName}
        />
        <Text style={styles.userEmail}>{user.email}</Text>
      </View>

      <TouchableOpacity style={styles.updateButton} onPress={handleUpdateProfile}>
        <Text style={styles.updateButtonText}>Salvar Perfil</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  editImageButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#007bff',
    padding: 5,
    borderRadius: 20,
  },
  userNameInput: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
    borderBottomWidth: 1,
    width: '80%',
  },
  userEmail: {
    fontSize: 16,
    color: '#888',
  },
  updateButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: '#ff4d4d',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Usuario;
