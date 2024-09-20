import prisma from "../../../lib/db";

export async function GET(request: Request) {
    const data = await prisma.projetos.findMany({
        include: {
            usuarios_has_projetos: {
                select: {
                    id_usuario: true,
                    papel: true
                }
            }
        }
    });
    

    return Response.json({data})
}