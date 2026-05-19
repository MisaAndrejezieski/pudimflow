const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testar() {
  try {
    await prisma.$connect();
    console.log('✅ Banco de dados CONECTADO com sucesso!');
    
    // Tenta criar um registro de teste
    const teste = await prisma.producaoDiaria.create({
      data: {
        brascopEstantes: 0,
        brascopKg: 0,
        brascopParadas: 'Teste de conexão',
        brascopPerdas: 0,
        seracEstantes: 0,
        seracKg: 0,
        seracParadas: '',
        seracPerdas: 0,
        totalEstantes: 0,
        totalKg: 0,
        totalPerdas: 0,
        bpfOk: false
      }
    });
    console.log('✅ Teste de escrita funcionou! ID:', teste.id);
    
    // Deleta o registro de teste
    await prisma.producaoDiaria.delete({ where: { id: teste.id } });
    console.log('✅ Teste de deleção funcionou!');
    
  } catch (error) {
    console.error('❌ ERRO de conexão:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testar();