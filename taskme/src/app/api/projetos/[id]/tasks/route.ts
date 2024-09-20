import { NextResponse } from 'next/server';
import prisma from "../../../../lib/db";

export async function GET(request: Request, { params }: { params: { id_projeto: string } }) {
    const id_projeto = parseInt(params.id_projeto, 10);

    if (isNaN(id_projeto)) {
        return new Response(JSON.stringify({ message: 'ID de projeto inválido' }), { status: 400 });
      }
    
    try{
        const tarefas = await prisma.tarefas.findMany({
            where: {
              id_projeto: id_projeto
              },
              include: {
                usuarios: {
                  select: {
                    nome: true
                  }
                }
              }
          });

        return(NextResponse.json({tarefas}))
    } catch (error) {
        return NextResponse.json({ message: 'Erro ao buscar tarefas do projeto', error: 'Erro desconhecido' }, { status: 500 });
    }
}

export async function POST(request: Request, { params }: { params: { id_projeto: string } }) {
    const id_projeto = parseInt(params.id_projeto, 10);

    if (isNaN(id_projeto)) {
        return new Response(JSON.stringify({ message: 'ID de projeto inválido' }), { status: 400 });
      }
    
    try {
        const { titulo, descricao, id_usuario } = await request.json();

        if (!titulo || !descricao || !id_usuario) {
            return new Response(
              JSON.stringify({ message: 'Campos obrigatórios faltando' }),
              { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
          }
          const newTask = await prisma.tarefas.create({
            data: {
                titulo: titulo,
                descricao: descricao,
                data_criacao: new Date(),
                status: 0,
                id_projeto: id_projeto,
                id_usuario: id_usuario
            }
          });
      
          return NextResponse.json({ projeto: newTask });
        } catch (error) {
          return NextResponse.json({ message: 'Erro ao criar tarefa', error: 'Erro desconhecido' }, { status: 500 });
      }
}

export async function PUT(request: Request) {
  let taskData;

  try {
    taskData = await request.json();
  } catch (error) {
    return NextResponse.json({ message: 'Dados inválidos' }, { status: 400 });
  }

  try {
    const { id_tarefa } = await request.json()
    
    if (isNaN(id_tarefa)) {
      return new Response(JSON.stringify({ message: 'ID de tarefa inválido' }), { status: 400 });
    }

    const newTask = await prisma.tarefas.update({
      where: {
        id_tarefas: id_tarefa
      },
      data: taskData
    });
  
      return NextResponse.json({ projeto: newTask });
    } catch (error) {
      return NextResponse.json({ message: 'Erro ao criar tarefa', error: 'Erro desconhecido' }, { status: 500 });
  }
}

export async function DELETE(request: Request){
  const { id_tarefa } = await request.json();

  if (isNaN(id_tarefa)) {
    return new Response(JSON.stringify({ message: 'ID de tarefa inválido' }), { status: 400 });
  }

  await prisma.tarefas.delete({
    where: {
      id_tarefas: id_tarefa
    }
  });

  return new Response(
    JSON.stringify({ message: 'Tarefa excluida' }),
  );
}