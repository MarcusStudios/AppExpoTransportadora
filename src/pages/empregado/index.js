import React, { useState, useEffect } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Modal, Alert, Image } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { db } from "../../services/firebaseConfig";
import { collection, addDoc, updateDoc, deleteDoc, onSnapshot, doc } from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";
import { useFonts } from "expo-font";


export default function Empregado() {
  const [nome, setNome] = useState("");
  const [idade, setIdade] = useState("");
  const [veiculo, setVeiculo] = useState("Caminhão Grande");
  const [status, setStatus] = useState("disponível");
  const [imageUri, setImageUri] = useState(null);
  const [empregados, setEmpregados] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const empregadosRef = collection(db, "empregados");

   // Carregando a fonte personalizada
   const [fontsLoaded] = useFonts({
    "JetBrainsMono-Bold": require("../../asset/fonts/JetBrainsMono-Bold.ttf"),
  });

  // Esperar a fonte carregar antes de renderizar
  if (!fontsLoaded) {
    return <Text>Carregando fontes...</Text>;
  }


  useEffect(() => {
    const unsubscribe = onSnapshot(empregadosRef, (snapshot) => {
      const empregadosData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEmpregados(empregadosData);
    });
    return () => unsubscribe();
  }, []);

  const handleSave = async () => {
    try {
      const novoEmpregado = {
        nome,
        idade,
        veiculo,
        status,
        imageUri,
      };

      if (selectedId) {
        const docRef = doc(db, "empregados", selectedId);
        await updateDoc(docRef, novoEmpregado);
      } else {
        await addDoc(empregadosRef, novoEmpregado);
      }

      resetForm();
    } catch (error) {
      Alert.alert("Erro", "Houve um erro ao salvar o empregado. Tente novamente.");
    }
  };

  const handleEdit = (empregado) => {
    setNome(empregado.nome);
    setIdade(empregado.idade);
    setVeiculo(empregado.veiculo);
    setStatus(empregado.status);
    setImageUri(empregado.imageUri);
    setSelectedId(empregado.id);
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      const docRef = doc(db, "empregados", id);
      await deleteDoc(docRef);
    } catch (error) {
      Alert.alert("Erro", "Houve um erro ao excluir o empregado. Tente novamente.");
    }
  };

  const resetForm = () => {
    setNome("");
    setIdade("");
    setVeiculo("Caminhão Grande");
    setStatus("disponível");
    setImageUri(null);
    setSelectedId(null);
    setModalVisible(false);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { fontFamily: "JetBrainsMono-Bold" }]}>Empregados</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={[styles.addButtonText, { fontFamily: "JetBrainsMono-Bold" }]}>+ Cadastrar Empregado</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={empregados}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.empregadoContainer}>
            {item.imageUri && <Image source={{ uri: item.imageUri }} style={styles.empregadoImage} />}
            <View style={styles.empregadoInfo}>
              <Text style={[styles.empregadoText, { fontFamily: "JetBrainsMono-Bold" }]}>{item.nome} - {item.idade} anos</Text>
              <Text style={[styles.empregadoText, { fontFamily: "JetBrainsMono-Bold" }]}>Veículo: {item.veiculo}</Text>
              <Text style={[styles.empregadoText, { color: item.status === "disponível" ? "green" : "red" }, { fontFamily: "JetBrainsMono-Bold" }]}>
                Status: {item.status}
              </Text>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(item)}>
                <Text style={[styles.editButtonText, { fontFamily: "JetBrainsMono-Bold" }]}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={() => handleDelete(item.id)}>
                <Text style={[styles.actionButtonText, { fontFamily: "JetBrainsMono-Bold" }]}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { fontFamily: "JetBrainsMono-Bold" }]}>
            <TextInput
              placeholder="Nome"
              value={nome}
              onChangeText={setNome}
              style={[styles.input, { fontFamily: "JetBrainsMono-Bold" }]}
            />
            <TextInput
              placeholder="Idade"
              value={idade}
              onChangeText={setIdade}
              keyboardType="numeric"
              style={[styles.input, { fontFamily: "JetBrainsMono-Bold" }]}
            />
            <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
              <Text style={[styles.imagePickerButtonText, { fontFamily: "JetBrainsMono-Bold" }]}>Selecionar Imagem</Text>
            </TouchableOpacity>
            {imageUri && <Image source={{ uri: imageUri }} style={styles.previewImage} />}
            <Picker selectedValue={veiculo} onValueChange={setVeiculo}>
              <Picker.Item label="Caminhão Grande" value="Caminhão Grande" />
              <Picker.Item label="Caminhão Médio" value="Caminhão Médio" />
              <Picker.Item label="Caminhão Pequeno" value="Caminhão Pequeno" />
            </Picker>
            <Picker selectedValue={status} onValueChange={setStatus}>
              <Picker.Item label="Disponível" value="disponível" />
              <Picker.Item label="Ocupado" value="ocupado" />
              <Picker.Item label="De folga" value="de folga" />
            </Picker>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={[styles.saveButtonText, { fontFamily: "JetBrainsMono-Bold" }]}>Salvar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={resetForm} style={styles.cancelButton}>
              <Text style={[styles.cancelButtonText, { fontFamily: "JetBrainsMono-Bold" }]}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "#343a40",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    color: "#fff",
  },
  addButton: {
    backgroundColor: "#28a745",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginLeft: 5,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  empregadoContainer: {
    flexDirection: "row-reverse", // Move a imagem para o lado direito
    alignItems: "left",        // Alinha os itens verticalmente
    justifyContent: "space-between", // Espaçamento entre imagem e informações
    padding: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    marginLeft: 5,
    marginRight: 5,
    marginTop: 0,
    marginBottom: 15,
  },
  
  empregadoImage: {
    width: 100,
    height: 100,
    marginRight: 15,
    borderRadius: 7.5,
    resizeMode: "cover",
  },  
  empregadoInfo: {
    position: "absolute",
  },
  empregadoText: {
    fontSize: 16,
    marginBottom: 5,
    right: 150,
    top: 15, marginLeft: 5,
    
  },
  buttonContainer: {
    flexDirection: "row", // Alinha os itens em uma linha
    justifyContent: "space-between", // Espaçamento entre os botões
    alignItems: "center", // Centraliza os itens verticalmente
    marginTop: 10, // Margem superior para dar espaço
  },
  
  actionButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginHorizontal: 5, // Espaço entre os botões
    marginTop: 140, // Move o botão para baixo
    backgroundColor: "black",
  },
  editButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginHorizontal: 5, // Espaço entre os botões
    marginTop: 140, // Move o botão para baixo
    backgroundColor: "black",
  },
  editButtonText: {
    color: "#fff",
    fontSize: 14,
  },
  
  actionButtonText: {
    color: "#fff",
    fontSize: 14,
    
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    width: "80%",
    borderRadius: 10,
  },
  imagePicker: {
    alignItems: "center",
    marginBottom: 15,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  picker: {
    marginBottom: 15,
  },
  saveButton: {
    backgroundColor: "black",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  cancelButton: {
    backgroundColor: "black",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
});

