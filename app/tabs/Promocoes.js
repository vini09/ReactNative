// Define o rótulo do item no menu lateral
export const drawerLabel = 'Promoções';

import { differenceInDays } from 'date-fns';
import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { db } from '../../firebase';
import Styles from '../components/Styles';

export default function Promocoes() {
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    async function carregarProdutos() {
      const snapshot = await getDocs(collection(db, 'produtos'));
      const lista = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProdutos(lista);
    }

    carregarProdutos();
  }, []);

  // Verifica se o produto está próximo da validade (ex: 7 dias)
    function produtosComValidadeProxima() {
        const hoje = new Date();
      
        return produtos.filter(produto => {
          if (!produto.validade) return false;
      
          try {
            // Suporte a validade como string no formato "DD/MM/AAAA"
            const partes = produto.validade.split('/');
            const dataValidade = new Date(partes[2], partes[1] - 1, partes[0]);
      
            const diasRestantes = differenceInDays(dataValidade, hoje);
            return diasRestantes >= 0 && diasRestantes <= 7;
          } catch {
            return false;
          }
        });
  }
      
  const renderItem = ({ item }) => (
    <View style={[Styles.card, { backgroundColor: '#FF851B' }]}>
      <Text style={Styles.cardText}>{item.nome}</Text>
      <Text style={Styles.cardText}>Código: {item.codigo}</Text>
      <Text style={Styles.cardText}>Validade: {item.validade}</Text>
      <Text style={Styles.cardText}>Quantidade: {item.quantidade}</Text>
      <Text style={Styles.cardText}>Valor: R$ {item.valorUnitario?.toFixed(2)}</Text>
    </View>
  );

  return (
    <View style={Styles.container}>
      <Text style={Styles.title}>Produtos em Promoção</Text>

      <FlatList
        data={produtosComValidadeProxima()}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={Styles.cardText}>Nenhum produto próximo da validade.</Text>
        }
      />
    </View>
  );
}