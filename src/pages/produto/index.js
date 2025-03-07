import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Switch,
  StyleSheet,
  FlatList,
  Alert,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { db } from '../../services/firebaseConfig';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';

export default function Produtos() {
  const [nomeProduto, setNomeProduto] = useState('');
  const [donoProduto, setDonoProduto] = useState('');
  const [urgente, setUrgente] = useState(false);
  const [irNoDia, setIrNoDia] = useState(false);
  const [fragil, setFragil] = useState(false);
  const [produtos, setProdutos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editandoProduto, setEditandoProduto] = useState(null);

  const buscarProdutos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'produtos'));
      const produtosList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProdutos(produtosList);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    }
  };

  const salvarProduto = async () => {
    if (!nomeProduto || !donoProduto) {
      Alert.alert('Erro', 'Preencha todos os campos!');
      return;
    }

    const produto = { nome: nomeProduto, dono: donoProduto, urgente, irNoDia, fragil };

    try {
      if (editandoProduto) {
        // Atualizando produto
        const produtoRef = doc(db, 'produtos', editandoProduto.id);
        await updateDoc(produtoRef, produto);
        Alert.alert('Sucesso', 'Produto atualizado com sucesso!');
      } else {
        // Cadastrando novo produto
        const produtosRef = collection(db, 'produtos');
        await addDoc(produtosRef, produto);
        Alert.alert('Sucesso', 'Produto cadastrado com sucesso!');
      }

      resetarFormulario();
      buscarProdutos();
      setModalVisible(false);
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao salvar o produto!');
    }
  };

  const excluirProduto = async (id) => {
    try {
      await deleteDoc(doc(db, 'produtos', id));
      Alert.alert('Sucesso', 'Produto excluído com sucesso!');
      buscarProdutos();
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao excluir o produto!');
    }
  };

  const abrirModalParaEditar = (produto) => {
    setNomeProduto(produto.nome);
    setDonoProduto(produto.dono);
    setUrgente(produto.urgente);
    setIrNoDia(produto.irNoDia);
    setFragil(produto.fragil);
    setEditandoProduto(produto);
    setModalVisible(true);
  };

  const resetarFormulario = () => {
    setNomeProduto('');
    setDonoProduto('');
    setUrgente(false);
    setIrNoDia(false);
    setFragil(false);
    setEditandoProduto(null);
  };

  useEffect(() => {
    buscarProdutos();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Produtos</Text>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          resetarFormulario();
          setModalVisible(true);
        }}>
        <Text style={styles.addButtonText}>+ Adicionar Produto</Text>
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
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.actionButton, styles.editButton]}
                onPress={() => abrirModalParaEditar(item)}>
                <Text style={styles.actionButtonText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.deleteButton]}
                onPress={() => excluirProduto(item.id)}>
                <Text style={styles.actionButtonText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editandoProduto ? 'Editar Produto' : 'Cadastrar Produto'}
            </Text>
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
            <TouchableOpacity style={styles.saveButton} onPress={salvarProduto}>
              <Text style={styles.saveButtonText}>
                {editandoProduto ? 'Salvar Alterações' : 'Cadastrar'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Utilize o mesmo `styles` do exemplo anterior, ajustando nomes para os novos botões.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  productTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  productText: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 6,
    marginHorizontal: 4,
  },
  editButton: {
    backgroundColor: '#fbbf24',
  },
  deleteButton: {
    backgroundColor: '#ef4444',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 14,
    color: '#4b5563',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  switchLabel: {
    fontSize: 14,
    color: '#1f2937',
  },
  saveButton: {
    backgroundColor: '#10b981',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#6b7280',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
