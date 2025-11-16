import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';
import { useEffect } from 'react';
import Realm from 'realm';
import { realmConfig } from '../lib/realmConfig';

// --- CONFIGURAÇÃO DA API (Mudar para seu endereço de servidor real) ---
const API_BASE_URL = 'http://192.168.1.100:3000/api';

// --- 1. LÓGICA DE RESOLUÇÃO DE CONFLITOS (Last Write Wins) ---
const resolverConflito = (localData, remoteData) => {
  if (remoteData.ultimaAtualizacao > localData.ultimaAtualizacao) {
    console.log('Conflito resolvido: Versão Remota mais recente prevalece.');
    return remoteData;
  } else {
    console.log('Conflito resolvido: Versão Local mais recente prevalece.');
    return localData;
  }
};

// --- 2. SERVIÇO DE SINCRONIZAÇÃO ASSÍNCRONA (SEM HOOKS DO PROVIDER) ---
// Abre o realm diretamente para não depender do timing do RealmProvider
export const SyncService = () => {
  useEffect(() => {
    let realmInstance = null;
    let unsubscribeNetInfo = null;

    const abrirRealm = async () => {
      try {
        realmInstance = await Realm.open(realmConfig);
        console.log('SyncService: Realm opened (root services)');

        const sincronizarComandas = async () => {
          if (!realmInstance) return;

          const ComandaSchemaName = 'Comanda';
          const comandas = realmInstance.objects(ComandaSchemaName).filtered("sincronizada == false AND status == 'Aberta'").slice();

          for (const comandaLocal of comandas) {
            try {
              const response = await axios.put(`${API_BASE_URL}/comandas/${comandaLocal._id}`, comandaLocal);
              const comandaRemota = response.data;

              realmInstance.write(() => {
                const comandaAtual = realmInstance.objectForPrimaryKey(ComandaSchemaName, comandaLocal._id);
                if (comandaAtual) {
                  const versaoFinal = resolverConflito(comandaAtual, comandaRemota);
                  Object.assign(comandaAtual, versaoFinal);
                  comandaAtual.sincronizada = true;
                }
              });
            } catch (err) {
              console.error(`Falha ao sincronizar comanda ${comandaLocal._id}:`, err?.message || err);
            }
          }

          console.log(`SyncService: Sincronização concluída. ${comandas.length} comandas processadas.`);
        };

        // Inicial trigger
        sincronizarComandas().catch((e) => console.error('SyncService initial sync error:', e));

        // Escuta mudanças de conectividade
        unsubscribeNetInfo = NetInfo.addEventListener(state => {
          if (state.isConnected && state.isInternetReachable) {
            sincronizarComandas().catch(e => console.error('SyncService sync error on reconnect:', e));
          }
        });
      } catch (err) {
        console.error('SyncService: Failed to open realm:', err);
      }
    };

    abrirRealm();

    return () => {
      try {
        if (unsubscribeNetInfo) unsubscribeNetInfo();
      } catch (e) {
        console.warn('SyncService: error unsubscribing NetInfo', e);
      }
      try {
        if (realmInstance && !realmInstance.isClosed) realmInstance.close();
      } catch (e) {
        console.warn('SyncService: error closing realm instance', e);
      }
    };
  }, []);

  return null; // invisible background service
};

export default SyncService;
