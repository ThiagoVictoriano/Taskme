import { NextResponse } from 'next/server';
import prisma from "../../../lib/db";

export async function GET(request: Request, { params }: { params: { id_usuario: string } }) {
    const id = parseInt(params.id_usuario); // Captura o ID do usuário na URL

    if (isNaN(id) || id === 0) {
        return new Response(JSON.stringify({ message: 'ID de usuário inválido' }), { status: 400 });
      }
    const projetos = await prisma.projetos.findMany({
        where: {
          usuarios_has_projetos: {
            some: {
              id_usuario: id
            }
          }
        }
      });

    return NextResponse.json({projetos})
}

export async function POST(request: Request, { params }: { params: { id_usuario: string } }) {
    const id = parseInt(params.id_usuario); // Captura o ID do usuário na URL

    if (isNaN(id) || id === 0) {
      return new Response(JSON.stringify({ message: 'ID de usuário inválido' }), { status: 400 });
    }
    
    const { nomeProjeto, descricaoProjeto} = await request.json();
    
    const newProject = await prisma.projetos.create({
      data: {
          nome: nomeProjeto,
          descricao: descricaoProjeto,
          data_criacao: new Date(),
          usuarios_has_projetos: {
              create: {
                  usuarios: {
                      connect: { id_usuario: id }
                  },
                  papel: "Administrador"
              }
          }
      }
  });

  return NextResponse.json({ projeto: newProject }, { status: 201 });
}