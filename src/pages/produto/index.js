import { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Switch, StyleSheet, FlatList, Alert, TouchableOpacity } from 'react-native';
import { db } from '../../services/firebaseConfig';
import { collection, addDoc, getDocs } from 'firebase/firestore';

export default function Produtos() {
  const [nomeProduto, setNomeProduto] = useState('');
  const [donoProduto, setDonoProduto] = useState('');
  const [urgente, setUrgente] = useState(false);
  const [irNoDia, setIrNoDia] = useState(false);
  const [fragil, setFragil] = useState(false);
  const [produtos, setProdutos] = useState([]);

  const cadastrarProduto = async () => {
    const novoProduto = {
      nome: nomeProduto,
      dono: donoProduto,
      urgente,
      irNoDia,
      fragil,
    };

    try {
      const produtosRef = collection(db, 'produtos');
      await addDoc(produtosRef, novoProduto);
      Alert.alert('Sucesso', 'Produto cadastrado com sucesso!');
      setNomeProduto('');
      setDonoProduto('');
      setUrgente(false);
      setIrNoDia(false);
      setFragil(false);
      buscarProdutos();
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao cadastrar o produto!');
    }
  };

  const buscarProdutos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'produtos'));
      const produtosList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProdutos(produtosList);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    }
  };

  useEffect(() => {
    buscarProdutos();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro de Produtos</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome do Produto"
        value={nomeProduto}
        onChangeText={setNomeProduto}
      />
      <TextInput
        style={styles.input}
        placeholder="Dono do Produto"
        value={donoProduto}
        onChangeText={setDonoProduto}
      />

      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Urgente</Text>
        <Switch value={urgente} onValueChange={setUrgente} />
      </View>

      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Deve ir no dia</Text>
        <Switch value={irNoDia} onValueChange={setIrNoDia} />
      </View>

      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Frágil</Text>
        <Switch value={fragil} onValueChange={setFragil} />
      </View>

      <TouchableOpacity style={styles.button} onPress={cadastrarProduto}>
        <Text style={styles.buttonText}>Cadastrar Produto</Text>
      </TouchableOpacity>

      <FlatList
        data={produtos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            <Text style={styles.productTitle}>{item.nome}</Text>
            <Text style={styles.productText}>Dono: {item.dono}</Text>
            <Text style={styles.productText}>Urgente: {item.urgente ? 'Sim' : 'Não'}</Text>
            <Text style={styles.productText}>Ir no dia: {item.irNoDia ? 'Sim' : 'Não'}</Text>
            <Text style={styles.productText}>Frágil: {item.fragil ? 'Sim' : 'Não'}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#343a40',
  },
  input: {
    width: '100%',
    padding: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#495057',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  switchLabel: {
    fontSize: 16,
    marginRight: 10,
    color: '#495057',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  productCard: {
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    width: '100%',
  },
  productTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#343a40',
  },
  productText: {
    fontSize: 16,
    color: '#495057',
    marginBottom: 5,
  },
});
