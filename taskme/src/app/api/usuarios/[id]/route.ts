import { NextResponse } from 'next/server';
import prisma from "../../../lib/db";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id; // Captura o ID do usuário na URL

  const user = await prisma.usuarios.findUnique({
    where: {
        id_usuario: parseInt(id, 10)
    }
  })

  if (!user) {
    return NextResponse.json({ message: 'Usuário não encontrado' }, { status: 404 });
  }

  return NextResponse.json({ user });
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const id = params.id;
    let userData;

    try {
        userData = await request.json();
    } catch (error) {
        return NextResponse.json({ message: 'Dados inválidos' }, { status: 400 });
    }

    try{
        const editUser = await prisma.usuarios.update({
            where: {
                id_usuario: parseInt(id, 10)
            }, data: userData
        })
        return NextResponse.json({ editUser });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';

        return NextResponse.json({ message: 'Erro ao atualizar usuário', error: errorMessage }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const id = params.id;

    try {
        const deletedUser = await prisma.usuarios.delete({
            where: {
                id_usuario: parseInt(id)
            }
        })
    
        return new Response(
            JSON.stringify({ message: 'Usuário deletado.'}),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
          );
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';

        return NextResponse.json({ message: 'Erro ao deletar usuário', error: errorMessage }, { status: 500 });
    }

}