import { differenceInDays } from 'date-fns';
import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { db } from '../../firebase';
import Styles from './Styles'; // importa os estilos


export default function VisaoGeral() {
  const [produtos, setProdutos] = useState([]);
  const [itensValidadeProxima, setItensValidadeProxima] = useState(0);
  const [itensEstoqueBaixo, setItensEstoqueBaixo] = useState(0);

  useEffect(() => {
    async function carregarDados() {
      const snapshot = await getDocs(collection(db, 'produtos'));
      const lista = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProdutos(lista);

      // Processar dados:
      const hoje = new Date();

      const validadeProxima = lista.filter(produto => {
        if (!produto.validade) return false;
        try {
          const partes = produto.validade.split('/');
          const dataValidade = new Date(partes[2], partes[1] - 1, partes[0]);
          const dias = differenceInDays(dataValidade, hoje);
          return dias >= 0 && dias <= 7;
        } catch {
          return false;
        }
      });
      

      const estoqueBaixo = lista.filter(produto => produto.quantidade !== undefined && produto.quantidade <= 5);

      setItensValidadeProxima(validadeProxima.length);
      setItensEstoqueBaixo(estoqueBaixo.length);
    }

    carregarDados();
  }, []);

  return (
    <View style={Styles.card}>
      <Text style={Styles.cardTitle}>Itens próximos da validade</Text>
      <Text style={Styles.cardText}>{itensValidadeProxima} item(ns)</Text>

      <Text style={Styles.cardTitle}>Alertas de Estoque</Text>
      <Text style={Styles.cardText}>{itensEstoqueBaixo} produto(s) com estoque baixo</Text>
    </View>
  );
}
