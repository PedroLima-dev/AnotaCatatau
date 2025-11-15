import getRealm from "../realm/realmConfig";
import { isOnline } from "./netStatus";
import { isNewer } from "./timestamp";

const API_URL = "http://SEU_SERVIDOR:3000/api/pedidos/sync"; 
// depois você vai me pedir o módulo backend, e eu gero esta API prontinha.

export async function syncPedidos() {
  const online = await isOnline();
  if (!online) {
    console.log("📡 Offline — sincronização adiada");
    return;
  }

  console.log("🔄 Iniciando sincronização...");

  const realm = getRealm();

  // 1️⃣ Buscar pedidos locais pendentes
  const pendentes = realm
    .objects("Pedido")
    .filtered('status != "sincronizado"');

  const payload = pendentes.map(p => ({
    id: p.id,
    mesa: p.mesa,
    itens: p.itens.map(i => ({
      id: i.id,
      produtoId: i.produtoId,
      quantidade: i.quantidade,
      observacao: i.observacao,
      updatedAt: i.updatedAt,
    })),
    status: p.status,
    updatedAt: p.updatedAt,
  }));

  try {
    // 2️⃣ Enviar pedidos para o servidor
    const resposta = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pedidos: payload }),
    });

    const { atualizadosNoServidor } = await resposta.json();

    // 3️⃣ Aplicar Last Write Wins
    realm.write(() => {
      atualizadosNoServidor.forEach(remoto => {
        const local = realm.objectForPrimaryKey("Pedido", remoto.id);

        if (!local) {
          // novo registro vindo do servidor
          realm.create("Pedido", {
            id: remoto.id,
            mesa: remoto.mesa,
            itens: remoto.itens,
            status: remoto.status,
            createdAt: new Date(remoto.createdAt),
            updatedAt: new Date(remoto.updatedAt),
            lastSync: new Date(),
          });
          return;
        }

        // LWW — compara timestamps
        if (isNewer(remoto.updatedAt, local.updatedAt)) {
          local.mesa = remoto.mesa;
          local.status = remoto.status;
          local.updatedAt = new Date(remoto.updatedAt);

          // atualizar itens
          local.itens = remoto.itens.map(i => ({
            id: i.id,
            produtoId: i.produtoId,
            quantidade: i.quantidade,
            observacao: i.observacao,
            updatedAt: new Date(i.updatedAt),
          }));
        }

        local.lastSync = new Date();
      });

      // marcar todos os locais como sincronizados
      pendentes.forEach(p => {
        p.status = "sincronizado";
        p.lastSync = new Date();
      });
    });

    console.log("✅ Sincronização concluída!");

  } catch (error) {
    console.error("❌ Erro de sincronização:", error);
  }
}
