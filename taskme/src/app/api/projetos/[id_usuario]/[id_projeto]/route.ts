import { NextResponse } from 'next/server';
import prisma from "../../../../lib/db";

export async function GET(request: Request, { params }: { params: { id_usuario: string, id_projeto: string } }) {
    const id_projeto = parseInt(params.id_projeto, 10);

    if (isNaN(id_projeto) || id_projeto === 0) {
        return new Response(JSON.stringify({ message: 'ID de projeto inválido' }), { status: 400 });
      }

      const projeto = await prisma.projetos.findFirst({
        where: {
          usuarios_has_projetos: {
            some: {
              id_projeto: id_projeto
            }
          }
        },
        include: {
          usuarios_has_projetos: {
            select: {
              id_usuario: true,
              papel: true
            }
          }
        }
      });

    return NextResponse.json({projeto})
}

export async function POST(request: Request, { params }: { params: { id_usuario: string, id_projeto: string } }) {
  const id_usuario = parseInt(params.id_usuario); // Captura o ID do usuário na URL
  const id_projeto = parseInt(params.id_projeto);

  try {
    const { papel } = await request.json();

    if (!papel) {
      return new Response(
        JSON.stringify({ message: 'Campos obrigatórios faltando: papel' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const newUserProject = await prisma.usuarios_has_projetos.create({
      data: {
          id_usuario: id_usuario,
          id_projeto: id_projeto,
          papel: papel
      }
    });

    return NextResponse.json({ projeto: newUserProject }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Erro ao criar projeto', error: 'Erro desconhecido' }, { status: 500 });
}
}

export async function PUT(request: Request, { params }: { params: { id_projeto: string } }) {
  const id_projeto = parseInt(params.id_projeto, 10);

  let projectData;

    try {
        projectData = await request.json();
    } catch (error) {
        return NextResponse.json({ message: 'Dados inválidos' }, { status: 400 });
    }

    try{
        const editProject = await prisma.projetos.update({
            where: {
                id_projeto: id_projeto
            }, data: projectData
        })
        return NextResponse.json({ editProject });
    } catch (error) {

        return NextResponse.json({ message: 'Erro ao atualizar projeto', error: 'Erro desconhecido' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: { id_projeto: string, id_usuario: string} }) {
  const id_projeto = parseInt(params.id_projeto, 10);
  const id_usuario = parseInt(params.id_usuario, 10);

  if (isNaN(id_projeto) || id_projeto === 0) {
    return new Response(JSON.stringify({ message: 'ID de projeto inválido' }), { status: 400 });
  }

  try {
    const userProject = await prisma.usuarios_has_projetos.findFirst({
      where: {
        id_projeto: id_projeto,
        id_usuario: id_usuario,
      },
    });

    if (!userProject) {
      return new Response(
        JSON.stringify({ message: 'Usuário não está associado a este projeto' }),
        { status: 403 }
      );
    }

    // Verifique se o usuário é "Administrador"
    if (userProject.papel === 'Administrador') {
      // Se for administrador, deleta as associações e o projeto
      await prisma.usuarios_has_projetos.deleteMany({
        where: {
          id_projeto: id_projeto,
        },
      });

      const deletedProject = await prisma.projetos.delete({
        where: {
          id_projeto: id_projeto,
        },
      });

      return new Response(
        JSON.stringify({ message: 'Projeto deletado.' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } else {
      await prisma.usuarios_has_projetos.delete({
        where: {
          id_usuario_id_projeto: {
            id_usuario: id_usuario,
            id_projeto: id_projeto,
          },
        }
      });

      return new Response(
        JSON.stringify({ message: 'Usuário desassociado do projeto.' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';

    return NextResponse.json(
      { message: 'Erro ao excluir o projeto', error: errorMessage },
      { status: 500 }
    );
  }
}