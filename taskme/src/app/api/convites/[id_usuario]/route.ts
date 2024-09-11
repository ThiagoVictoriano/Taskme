import { NextResponse } from 'next/server';
import prisma from "../../../lib/db";

export async function GET(request: Request, { params }: { params: { id_usuario: string } }) {
    const id = parseInt(params.id_usuario, 10); // Captura o ID do usuário na URL

    if (isNaN(id)) {
        return NextResponse.json({ message: 'ID de usuário inválido' }, { status: 400 });
    }

    const convites = await prisma.convites.findMany({
        where: { 
            OR: [
                { id_usuario_convidado: id },
                { id_usuario_iniciador: id }
            ]
        }
    });

    if (!convites) {
        return NextResponse.json({ message: 'Nenhum convite encontrado' }, { status: 404 });
    }

    return NextResponse.json({ convites });
}

export async function POST(request: Request, { params }: { params: { id_usuario: string } }) {
    const id_iniciador = parseInt(params.id_usuario, 10); // Captura o ID do usuário na URL

    try {
        const { id_convidado, id_projeto } = await request.json();

        if (!id_convidado || !id_projeto) {
            return NextResponse.json({ message: 'Campos obrigatórios faltando: convidado, projeto' }, { status: 400 });
        }
        
        // Verificar se o usuário iniciador participa do projeto
        const userIsInProject = await prisma.usuarios_has_projetos.findFirst({
            where: {
                id_usuario: id_iniciador,
                id_projeto: parseInt(id_projeto)
            }
        });

        if (!userIsInProject) {
            return NextResponse.json(
                { message: 'Você não participa deste projeto e não pode enviar convites' },
                { status: 403 }
            );
        }
        
        const existingInvite = await prisma.convites.findFirst({
            where: {
                id_usuario_convidado: parseInt(id_convidado),
                id_projeto: parseInt(id_projeto),
                OR: [
                    { status: 1 },
                    { status: 2 }
                ]
            }
        });

        if (existingInvite) {
            return NextResponse.json({ message: 'Já existe um convite ativo para este usuário e projeto' }, { status: 409 });
        }
        
        const newInvite = await prisma.convites.create({
            data: {
                id_usuario_convidado: parseInt(id_convidado),
                id_usuario_iniciador: id_iniciador,
                id_projeto: parseInt(id_projeto),
                data_convite: new Date()
            }
        });

        return NextResponse.json({ newInvite }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: 'Erro ao criar convite', error: 'Erro desconhecido' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const { id_convite, status } = await request.json();

        if (!id_convite || status === undefined) {
            return NextResponse.json({ message: 'ID do convite e status são obrigatórios' }, { status: 400 });
        }

        const updatedConvite = await prisma.convites.update({
            where: { id_convite },
            data: { 
                status: parseInt(status, 10),
                data_resposta: new Date()
            }
        });

        return NextResponse.json({ message: 'Status do convite atualizado com sucesso', updatedConvite }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Erro ao atualizar o convite', error: 'Erro desconhecido' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {

    try {
        const { id_convite} = await request.json();

        await prisma.convites.delete({
            where: { id_convite: parseInt(id_convite) }
        });

        return NextResponse.json({ message: 'Convite deletado.' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Erro ao deletar convite', error: 'Erro desconhecido' }, { status: 500 });
    }
}
