import React, { useState, useEffect } from "react";
import { View, Text, TextInput, FlatList, Image, TouchableOpacity, StyleSheet, Modal, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import { db, storage } from "../../services/firebaseConfig";
import { collection, addDoc, updateDoc, deleteDoc, onSnapshot, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useFonts } from "expo-font"; // Importando useFonts para carregar a fonte

export default function Empregado() {
  const [nome, setNome] = useState("");
  const [idade, setIdade] = useState("");
  const [veiculo, setVeiculo] = useState("Caminhão Grande");
  const [status, setStatus] = useState("disponível");
  const [foto, setFoto] = useState(null);
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
      console.log("Empregados carregados:", empregadosData); // Adicione este log
      setEmpregados(empregadosData);
    });
    return () => unsubscribe();
  }, []);
  

  const uploadImageToFirebase = async (uri) => {
    try {
        const response = await fetch(uri);
        const blob = await response.blob();
        const fileName = uri.split("/").pop();
        const storageRef = ref(storage, `empregadosFotos/${fileName}`);
        await uploadBytes(storageRef, blob);
        const downloadURL = await getDownloadURL(storageRef);
        console.log("URL da Imagem:", downloadURL); // Adicione este log
        return downloadURL;
    } catch (error) {
        console.error("Erro no upload da imagem:", error);
        throw error;
    }
};


const handleSave = async () => {
  try {
      let fotoUrl = null;
      if (foto) {
          fotoUrl = await uploadImageToFirebase(foto);
      }

      const novoEmpregado = {
          nome,
          idade,
          veiculo,
          status,
          ...(fotoUrl && { foto: fotoUrl }), // Certifique-se de que o campo "foto" está sendo adicionado
      };

      if (selectedId) {
          const docRef = doc(db, "empregados", selectedId);
          await updateDoc(docRef, novoEmpregado);
      } else {
          await addDoc(empregadosRef, novoEmpregado);
      }

      setNome("");
      setIdade("");
      setVeiculo("Caminhão Grande");
      setStatus("disponível");
      setFoto(null);
      setModalVisible(false);
  } catch (error) {
      Alert.alert("Erro", "Houve um erro ao salvar o empregado. Tente novamente.");
  }
};

  const handleDelete = async (id) => {
    const docRef = doc(db, "empregados", id);
    await deleteDoc(docRef);
  };

  const handleEdit = (empregado) => {
    setNome(empregado.nome);
    setIdade(empregado.idade);
    setVeiculo(empregado.veiculo);
    setStatus(empregado.status);
    setFoto(empregado.foto);
    setSelectedId(empregado.id);
    setModalVisible(true);
  };

  const handlePickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setFoto(result.uri);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "disponível":
        return "#28a745";
      case "ocupado":
        return "#ffc107";
      case "de folga":
        return "#dc3545";
      default:
        return "#6c757d";
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { fontFamily: "JetBrainsMono-Bold" }]}>Empregados</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={[styles.addButtonText, { fontFamily: "JetBrainsMono-Bold" }]}>+ Cadastrar Empregado</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={empregados}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          
          <View style={styles.empregadoContainer}>
            {item.foto && (
             <Image source={{ uri: item.foto }} style={styles.empregadoImage} />
            )}
            <View style={styles.empregadoInfo}>
              <Text  style={[styles.empregadoText, { fontFamily: "JetBrainsMono-Bold" }]}>
                {item.nome} - {item.idade} anos
              </Text>
              <Text style={[styles.empregadoText, { fontFamily: "JetBrainsMono-Bold" }]}>Veículo: {item.veiculo}</Text>
              <Text
                style={[styles.empregadoText, { fontFamily: "JetBrainsMono-Bold" }, { color: getStatusColor(item.status) }]}
              >
                Status: {item.status}
              </Text>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: "#007bff" }]}
                onPress={() => handleEdit(item)}
              >
                <Text style={[styles.actionButtonText, { fontFamily: "JetBrainsMono-Bold" }]}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: "#dc3545" }]}
                onPress={() => handleDelete(item.id)}
              >
                <Text style={[styles.actionButtonText, { fontFamily: "JetBrainsMono-Bold" }]}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={handlePickImage} style={styles.imagePicker}>
              {foto ? (
                <Image source={{ uri: foto }} style={styles.imagePreview} />
              ) : (
                <Text style={[styles.imagePlaceholder, { fontFamily: "JetBrainsMono-Bold" }]}>Selecionar Foto</Text>
              )}
            </TouchableOpacity>
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
            <Text  style={[styles.label, { fontFamily: "JetBrainsMono-Bold" }]}>Veículo:</Text>
            <Picker
              selectedValue={veiculo}
              onValueChange={(itemValue) => setVeiculo(itemValue)}
              style={[styles.picker, { fontFamily: "JetBrainsMono-Bold" }]}
            >
              <Picker.Item label="Caminhão Grande" value="Caminhão Grande" />
              <Picker.Item label="Caminhão Médio" value="Caminhão Médio" />
              <Picker.Item label="Caminhão Pequeno" value="Caminhão Pequeno" />
            </Picker>
            <Text  style={[styles.label, { fontFamily: "JetBrainsMono-Bold" }]}>Status:</Text>
            <Picker
              selectedValue={status}
              onValueChange={(itemValue) => setStatus(itemValue)}
              style={[styles.picker, { fontFamily: "JetBrainsMono-Bold" }]}
            >
              <Picker.Item label="Disponível" value="disponível" />
              <Picker.Item label="Ocupado" value="ocupado" />
              <Picker.Item label="De folga" value="de folga" />
            </Picker>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text  style={[styles.saveButtonText, { fontFamily: "JetBrainsMono-Bold" }]}>
                {selectedId ? "Atualizar Empregado" : "Salvar Empregado"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.cancelButton}
            >
              <Text  style={[styles.cancelButtonText, { fontFamily: "JetBrainsMono-Bold" }]}>Cancelar</Text>
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
    flexDirection: "row",
    padding: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  empregadoImage: {
    width: 100,
    height: 100,
    borderRadius: 50, // Para exibir uma imagem circular
    resizeMode: "cover",
  },  
  empregadoInfo: {
    flex: 1,
  },
  empregadoText: {
    fontSize: 16,
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    margin: 5,
    top: 45,
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
  imagePreview: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  imagePlaceholder: {
    fontSize: 16,
    color: "#007bff",
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
