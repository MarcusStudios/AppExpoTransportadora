import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';

const Produtos = () => {
  const [data, setData] = useState([
    { id: '1', name: 'Produto 1', age: 28, photo: null },
    { id: '2', name: 'Produto 2', age: 34, photo: null },
    { id: '3', name: 'Produto 3', age: 45, photo: null },
  ]);

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [photo, setPhoto] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const addItem = () => {
    setData([...data, { id: Date.now().toString(), name, age, photo }]);
    setName('');
    setAge('');
    setPhoto(null);
  };

  const editItem = (id) => {
    const item = data.find(item => item.id === id);
    setName(item.name);
    setAge(item.age.toString());
    setPhoto(item.photo);
    setEditingId(id);
  };

  const saveItem = () => {
    setData(data.map(item => item.id === editingId ? { ...item, name, age, photo } : item));
    setName('');
    setAge('');
    setPhoto(null);
    setEditingId(null);
  };

  const deleteItem = (id) => {
    setData(data.filter(item => item.id !== id));
  };

  const selectPhoto = () => {
    launchImageLibrary({}, response => {
      if (response.assets && response.assets.length > 0) {
        setPhoto(response.assets[0].uri);
      }
    });
  };

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      {item.photo && <Image source={{ uri: item.photo }} style={styles.photo} />}
      <Text style={styles.cell}>{item.name}</Text>
      <Text style={styles.cell}>{item.age}</Text>
      <TouchableOpacity onPress={() => editItem(item.id)}>
        <Text style={styles.editButton}>Edit</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => deleteItem(item.id)}>
        <Text style={styles.deleteButton}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
        <TextInput
          placeholder="Age"
          value={age}
          onChangeText={setAge}
          style={styles.input}
          keyboardType="numeric"
        />
        <Button title="Select Photo" onPress={selectPhoto} />
        <Button
          title={editingId ? "Save" : "Add"}
          onPress={editingId ? saveItem : addItem}
        />
      </View>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.headerCell}>Photo</Text>
          <Text style={styles.headerCell}>Name</Text>
          <Text style={styles.headerCell}>Age</Text>
          <Text style={styles.headerCell}>Actions</Text>
        </View>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 8,
    marginBottom: 8,
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  cell: {
    flex: 1,
  },
  photo: {
    width: 50,
    height: 50,
    marginRight: 8,
  },
  editButton: {
    color: 'blue',
  },
  deleteButton: {
    color: 'red',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginRight: 8,
  },
});

export default Produtos;
