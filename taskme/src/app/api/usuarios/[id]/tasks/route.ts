import { NextResponse } from 'next/server';
import prisma from "../../../../lib/db";

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const id_usuario = parseInt(params.id, 10);

    if (isNaN(id_usuario)) {
        return new Response(JSON.stringify({ message: 'ID de usuario inválido' }), { status: 400 });
      }
    
    try{
        const tarefas = await prisma.tarefas.findMany({
            where: {
              id_usuario: id_usuario
              },
              include: {
                projetos: {
                  select: {
                    nome: true
                  }
                }
              }
          });

        return(NextResponse.json({tarefas}))
    } catch (error) {
        return NextResponse.json({ message: 'Erro ao buscar tarefas do usuário', error: 'Erro desconhecido' }, { status: 500 });
    }
}