import React, { useState, useEffect } from "react";
import { View, Text, TextInput, FlatList, Image, TouchableOpacity, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import { db, storage } from "../../services/firebaseConfig"; // Certifique-se de importar o storage
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  doc,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Adicione imports necessários para o Storage

export default function Empregado() {
  const [nome, setNome] = useState("");
  const [idade, setIdade] = useState("");
  const [veiculo, setVeiculo] = useState("Caminhão Grande");
  const [status, setStatus] = useState("disponível");
  const [foto, setFoto] = useState(null); // Inicializa foto com null, não undefined
  const [empregados, setEmpregados] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const empregadosRef = collection(db, "empregados");

  // Carregar empregados do Firestore
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

  // Função para fazer o upload da imagem para o Firebase Storage
  const uploadImageToFirebase = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const fileName = uri.split('/').pop(); // Extrai o nome do arquivo da URI
    const storageRef = ref(storage, `empregadosFotos/${fileName}`);
    await uploadBytes(storageRef, blob); // Faz o upload da imagem para o Firebase Storage
    const downloadURL = await getDownloadURL(storageRef); // Recupera a URL da imagem no Firebase Storage
    return downloadURL; // Retorna a URL da imagem
  };

  const handleSave = async () => {
    try {
      let fotoUrl = null;
      if (foto) {
        // Faz o upload da imagem para o Firebase Storage se houver uma foto
        fotoUrl = await uploadImageToFirebase(foto);
      }

      // Verifica se o campo "foto" é null ou undefined e remove da estrutura de dados
      const novoEmpregado = {
        nome,
        idade,
        veiculo,
        status,
        ...(fotoUrl && { foto: fotoUrl }), // Só adiciona a foto se ela não for null
      };

      console.log("Salvando novo empregado:", novoEmpregado); // Verifique os dados aqui.

      if (selectedId) {
        const docRef = doc(db, "empregados", selectedId);
        await updateDoc(docRef, novoEmpregado);
        setSelectedId(null);
      } else {
        await addDoc(empregadosRef, novoEmpregado);
      }

      // Limpa os campos
      setNome("");
      setIdade("");
      setVeiculo("Caminhão Grande");
      setStatus("disponível");
      setFoto(null);
    } catch (error) {
      console.error("Erro ao salvar empregado:", error);
      alert("Houve um erro ao salvar o empregado. Tente novamente.");
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
  };

  const handlePickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setFoto(result.uri); // Verifique se o uri está sendo passado corretamente
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
      <Text style={styles.title}>Cadastro de Empregado</Text>
      <TouchableOpacity onPress={handlePickImage} style={styles.imagePicker}>
        {foto ? (
          <Image source={{ uri: foto }} style={styles.imagePreview} />
        ) : (
          <Text style={styles.imagePlaceholder}>Selecionar Foto</Text>
        )}
      </TouchableOpacity>
      <TextInput
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
        style={styles.input}
      />
      <TextInput
        placeholder="Idade"
        value={idade}
        onChangeText={setIdade}
        keyboardType="numeric"
        style={styles.input}
      />
      <Text style={styles.label}>Veículo:</Text>
      <Picker
        selectedValue={veiculo}
        onValueChange={(itemValue) => setVeiculo(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Caminhão Grande" value="Caminhão Grande" />
        <Picker.Item label="Caminhão Médio" value="Caminhão Médio" />
        <Picker.Item label="Caminhão Pequeno" value="Caminhão Pequeno" />
      </Picker>
      <Text style={styles.label}>Status:</Text>
      <Picker
        selectedValue={status}
        onValueChange={(itemValue) => setStatus(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Disponível" value="disponível" />
        <Picker.Item label="Ocupado" value="ocupado" />
        <Picker.Item label="De folga" value="de folga" />
      </Picker>
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>
          {selectedId ? "Atualizar Empregado" : "Adicionar Empregado"}
        </Text>
      </TouchableOpacity>
      <FlatList
        data={empregados}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.empregadoContainer}>
            {item.foto && (
              <Image source={{ uri: item.foto }} style={styles.empregadoImage} />
            )}
            <View style={styles.empregadoInfo}>
              <Text style={styles.empregadoText}>
                {item.nome} - {item.idade} anos
              </Text>
              <Text style={styles.empregadoText}>Veículo: {item.veiculo}</Text>
              <Text
                style={[styles.empregadoText, { color: getStatusColor(item.status) }]}
              >
                Status: {item.status}
              </Text>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: "#007bff" }]}
                onPress={() => handleEdit(item)}
              >
                <Text style={styles.actionButtonText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: "#dc3545" }]}
                onPress={() => handleDelete(item.id)}
              >
                <Text style={styles.actionButtonText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#343a40',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 15,
    marginBottom: 20,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  picker: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  imagePicker: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8f9fa",
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  imagePlaceholder: {
    color: "#6c757d",
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
  },
  empregadoContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  empregadoImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
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
  },
  actionButton: {
    padding: 10,
    marginLeft: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  actionButtonText: {
    color: "#fff",
  },
});
