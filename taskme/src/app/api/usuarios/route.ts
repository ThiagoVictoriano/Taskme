import prisma from "../../lib/db";

export async function GET(request: Request) {
    const data = await prisma.usuarios.findMany()

    return Response.json({data})
}

export async function DELETE(request: Request) {
    try {
        // Deletar todos os usuários
        const deletedUsers = await prisma.usuarios.deleteMany({});
    
        return new Response(
          JSON.stringify({ message: 'Todos os usuários foram deletados.', count: deletedUsers.count }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      } catch (error) {
        // Tratamento de erro
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        return new Response(
          JSON.stringify({ message: 'Erro ao deletar usuários', error: errorMessage }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }
}

export async function POST(request: Request) {
  try {
    // Pegar o corpo da requisição
    const data = await request.json();

    // Verificar se os campos obrigatórios estão presentes
    const { nome, email, senha } = data;
    if (!nome || !email || !senha) {
      return new Response(
        JSON.stringify({ message: 'Campos obrigatórios faltando: nome, email e senha são necessários.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Criar novo usuário no banco de dados
    const newUser = await prisma.usuarios.create({
      data: {
        nome: nome,
        email: email,
        senha: senha,
      },
    });

    // Retornar resposta de sucesso
    return new Response(JSON.stringify(newUser), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    // Fazer casting do erro para o tipo 'Error'
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';

    // Retornar resposta de erro
    return new Response(
      JSON.stringify({ message: 'Erro ao criar usuário', error: errorMessage }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
