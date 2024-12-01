import React, { useState, useEffect } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Modal, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { db } from "../../services/firebaseConfig";
import { collection, addDoc, updateDoc, deleteDoc, onSnapshot, doc } from "firebase/firestore";
import { useFonts } from "expo-font"; // Importando useFonts para carregar a fonte

export default function Empregado() {
  const [nome, setNome] = useState("");
  const [idade, setIdade] = useState("");
  const [veiculo, setVeiculo] = useState("Caminhão Grande");
  const [status, setStatus] = useState("disponível");
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
      setSelectedId(null);
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
    setSelectedId(empregado.id);
    setModalVisible(true);
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
            <View style={styles.empregadoInfo}>
              <Text style={[styles.empregadoText, { fontFamily: "JetBrainsMono-Bold" }]}>
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
            <Text style={[styles.label, { fontFamily: "JetBrainsMono-Bold" }]}>Veículo:</Text>
            <Picker
              selectedValue={veiculo}
              onValueChange={(itemValue) => setVeiculo(itemValue)}
              style={[styles.picker, { fontFamily: "JetBrainsMono-Bold" }]}
            >
              <Picker.Item label="Caminhão Grande" value="Caminhão Grande" />
              <Picker.Item label="Caminhão Médio" value="Caminhão Médio" />
              <Picker.Item label="Caminhão Pequeno" value="Caminhão Pequeno" />
            </Picker>
            <Text style={[styles.label, { fontFamily: "JetBrainsMono-Bold" }]}>Status:</Text>
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
              <Text style={[styles.saveButtonText, { fontFamily: "JetBrainsMono-Bold" }]}>
                {selectedId ? "Atualizar Empregado" : "Salvar Empregado"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.cancelButton}
            >
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
