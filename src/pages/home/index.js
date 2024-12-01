import React, { useEffect, useState } from "react";
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { getFirestore, collection, onSnapshot } from "firebase/firestore";
import { app } from "../../services/firebaseConfig"; // Importe seu arquivo de configuração do Firebase

// Inicializando o Firestore
const db = getFirestore(app);

export default function Home() {
  const [empregados, setEmpregados] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [selecionadoEmpregado, setSelecionadoEmpregado] = useState(null);
  const [selecionadoProduto, setSelecionadoProduto] = useState(null);

  // Função para carregar dados do Firebase
  const carregarDados = () => {
    try {
      // Listener para dados de empregados
      const empregadosUnsub = onSnapshot(collection(db, "empregados"), (snapshot) => {
        const empregadosList = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        setEmpregados(empregadosList);
      });

      // Listener para dados de produtos
      const produtosUnsub = onSnapshot(collection(db, "produtos"), (snapshot) => {
        const produtosList = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        setProdutos(produtosList);
      });

      // Retorno dos listeners para que você possa parar de ouvir quando o componente for desmontado
      return () => {
        empregadosUnsub();
        produtosUnsub();
      };
    } catch (error) {
      console.error("Erro ao carregar os dados", error);
    }
  };

  // Chama a função de carregar dados ao iniciar
  useEffect(() => {
    const unsubscribe = carregarDados();
    return () => unsubscribe(); // Limpa os listeners quando o componente for desmontado
  }, []);

  const fazerEncomenda = () => {
    if (selecionadoEmpregado && selecionadoProduto) {
      Alert.alert(
        "Encomenda Confirmada",
        `Encomenda feita com ${selecionadoEmpregado.nome} para o produto ${selecionadoProduto.nome}.`,
        [{ text: "OK" }]
      );
    } else {
      Alert.alert("Erro", "Selecione um empregado e um produto.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Faça uma Encomenda</Text>

      {/* Seção de Empregados */}
      <Text style={styles.subTitle}>Empregados Disponíveis:</Text>
      <FlatList
        data={empregados}
        keyExtractor={(item) => item.id} // Usando o ID do documento como chave única
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.card,
              item.id === selecionadoEmpregado?.id && styles.selectedCard,
            ]}
            onPress={() => setSelecionadoEmpregado(item)}
          >
            <Text style={item.id === selecionadoEmpregado?.id ? styles.selectedText : styles.cardText}>
              {item.nome}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Seção de Produtos */}
      <Text style={styles.subTitle}>Produtos Disponíveis:</Text>
      <FlatList
        data={produtos}
        keyExtractor={(item) => item.id} // Usando o ID do produto como chave única
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.card,
              item.id === selecionadoProduto?.id && styles.selectedCard,
            ]}
            onPress={() => setSelecionadoProduto(item)}
          >
            <Text style={item.id === selecionadoProduto?.id ? styles.selectedText : styles.cardText}>
              {item.nome}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Botão de Encomenda */}
      <Button title="Fazer Encomenda" onPress={fazerEncomenda} color="#007bff" />
    </View>
  );
}

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  subTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333",
  },
  card: {
    backgroundColor: "#f0f0f0",
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  selectedCard: {
    backgroundColor: "#007bff",
    borderColor: "#0056b3",
  },
  cardText: {
    color: "#333",
    fontSize: 16,
  },
  selectedText: {
    color: "#fff",
    fontSize: 16,
  },
});
