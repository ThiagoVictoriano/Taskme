-- CreateTable
CREATE TABLE `comentarios` (
    `id_comentario` INTEGER NOT NULL AUTO_INCREMENT,
    `texto` VARCHAR(500) NOT NULL,
    `id_usuario` INTEGER NOT NULL,
    `id_tarefas` INTEGER NOT NULL,

    INDEX `fk_Comentarios_Tarefas1_idx`(`id_tarefas`),
    INDEX `fk_Comentarios_Usuarios1_idx`(`id_usuario`),
    PRIMARY KEY (`id_comentario`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `convites` (
    `id_convite` INTEGER NOT NULL AUTO_INCREMENT,
    `data_convite` DATE NOT NULL,
    `status` INTEGER NOT NULL DEFAULT 1,
    `data_resposta` DATE NOT NULL,
    `id_usuario_convidado` INTEGER NOT NULL,
    `id_usuario_iniciador` INTEGER NOT NULL,
    `id_projeto` INTEGER NOT NULL,

    INDEX `fk_Convites_Projetos1_idx`(`id_projeto`),
    INDEX `fk_Convites_Usuarios1_idx`(`id_usuario_convidado`),
    INDEX `fk_Convites_Usuarios2_idx`(`id_usuario_iniciador`),
    PRIMARY KEY (`id_convite`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `projetos` (
    `id_projeto` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(45) NOT NULL,
    `descricao` VARCHAR(500) NULL,
    `data_criacao` DATE NOT NULL,

    PRIMARY KEY (`id_projeto`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tarefas` (
    `id_tarefas` INTEGER NOT NULL AUTO_INCREMENT,
    `titulo` VARCHAR(45) NOT NULL,
    `descricao` VARCHAR(500) NOT NULL,
    `data_criacao` DATE NOT NULL,
    `prazo` DATE NULL,
    `status` INTEGER NOT NULL DEFAULT 0,
    `id_projeto` INTEGER NOT NULL,
    `id_usuario` INTEGER NOT NULL,

    INDEX `fk_Tarefas_Projetos1_idx`(`id_projeto`),
    INDEX `fk_Tarefas_Usuarios1_idx`(`id_usuario`),
    PRIMARY KEY (`id_tarefas`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuarios` (
    `id_usuario` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `senha` VARCHAR(64) NOT NULL,

    PRIMARY KEY (`id_usuario`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuarios_has_projetos` (
    `id_usuario` INTEGER NOT NULL,
    `id_projeto` INTEGER NOT NULL,
    `papel` VARCHAR(45) NOT NULL,

    INDEX `fk_Usuarios_has_Projetos_Projetos1_idx`(`id_projeto`),
    INDEX `fk_Usuarios_has_Projetos_Usuarios_idx`(`id_usuario`),
    PRIMARY KEY (`id_usuario`, `id_projeto`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `comentarios` ADD CONSTRAINT `fk_Comentarios_Tarefas1` FOREIGN KEY (`id_tarefas`) REFERENCES `tarefas`(`id_tarefas`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `comentarios` ADD CONSTRAINT `fk_Comentarios_Usuarios1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios`(`id_usuario`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `convites` ADD CONSTRAINT `fk_Convites_Projetos1` FOREIGN KEY (`id_projeto`) REFERENCES `projetos`(`id_projeto`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `convites` ADD CONSTRAINT `fk_Convites_Usuarios1` FOREIGN KEY (`id_usuario_convidado`) REFERENCES `usuarios`(`id_usuario`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `convites` ADD CONSTRAINT `fk_Convites_Usuarios2` FOREIGN KEY (`id_usuario_iniciador`) REFERENCES `usuarios`(`id_usuario`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tarefas` ADD CONSTRAINT `fk_Tarefas_Projetos1` FOREIGN KEY (`id_projeto`) REFERENCES `projetos`(`id_projeto`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tarefas` ADD CONSTRAINT `fk_Tarefas_Usuarios1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios`(`id_usuario`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `usuarios_has_projetos` ADD CONSTRAINT `fk_Usuarios_has_Projetos_Projetos1` FOREIGN KEY (`id_projeto`) REFERENCES `projetos`(`id_projeto`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `usuarios_has_projetos` ADD CONSTRAINT `fk_Usuarios_has_Projetos_Usuarios` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios`(`id_usuario`) ON DELETE NO ACTION ON UPDATE NO ACTION;
