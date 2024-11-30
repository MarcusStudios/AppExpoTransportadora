import React, { useEffect, useState } from "react";
import { View, Text, Button, FlatList, TouchableOpacity } from "react-native";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { app } from "../../services/firebaseConfig"; // Importe seu arquivo de configuração do Firebase

// Inicializando o Firestore
const db = getFirestore(app);

export default function Home() {
  const [empregados, setEmpregados] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [selecionadoEmpregado, setSelecionadoEmpregado] = useState(null);
  const [selecionadoProduto, setSelecionadoProduto] = useState(null);

  // Função para carregar dados do Firebase
  const carregarDados = async () => {
    try {
      // Pegando os dados dos empregados
      const empregadosSnapshot = await getDocs(collection(db, "empregados"));
      const empregadosList = empregadosSnapshot.docs.map((doc) => doc.data());
      setEmpregados(empregadosList);

      // Pegando os dados dos produtos
      const produtosSnapshot = await getDocs(collection(db, "produtos"));
      const produtosList = produtosSnapshot.docs.map((doc) => doc.data());
      setProdutos(produtosList);
    } catch (error) {
      console.error("Erro ao carregar os dados", error);
    }
  };

  // Chama a função de carregar dados ao iniciar
  useEffect(() => {
    carregarDados();
  }, []);

  const fazerEncomenda = () => {
    if (selecionadoEmpregado && selecionadoProduto) {
      console.log(`Encomenda feita com ${selecionadoEmpregado.nome} para o produto ${selecionadoProduto.nome}`);
    } else {
      alert("Selecione um empregado e um produto");
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>Selecione um Empregado e um Produto para a Encomenda</Text>

      <Text style={{ marginTop: 20 }}>Empregados Disponíveis:</Text>
      <FlatList
        data={empregados}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              backgroundColor: item.id === selecionadoEmpregado?.id ? "#007bff" : "#f0f0f0",
              padding: 10,
              marginVertical: 5,
              borderRadius: 5,
            }}
            onPress={() => setSelecionadoEmpregado(item)}
          >
            <Text style={{ color: item.id === selecionadoEmpregado?.id ? "#fff" : "#000" }}>
              {item.nome}
            </Text>
          </TouchableOpacity>
        )}
      />

      <Text style={{ marginTop: 20 }}>Produtos Disponíveis:</Text>
      <FlatList
        data={produtos}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              backgroundColor: item.id === selecionadoProduto?.id ? "#007bff" : "#f0f0f0",
              padding: 10,
              marginVertical: 5,
              borderRadius: 5,
            }}
            onPress={() => setSelecionadoProduto(item)}
          >
            <Text style={{ color: item.id === selecionadoProduto?.id ? "#fff" : "#000" }}>
              {item.nome}
            </Text>
          </TouchableOpacity>
        )}
      />

      <Button title="Fazer Encomenda" onPress={fazerEncomenda} />
    </View>
  );
}
