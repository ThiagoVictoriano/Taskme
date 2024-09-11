-- DropForeignKey
ALTER TABLE `tarefas` DROP FOREIGN KEY `fk_Tarefas_Projetos1`;

-- DropForeignKey
ALTER TABLE `tarefas` DROP FOREIGN KEY `fk_Tarefas_Usuarios1`;

-- DropForeignKey
ALTER TABLE `usuarios_has_projetos` DROP FOREIGN KEY `fk_Usuarios_has_Projetos_Projetos1`;

-- DropForeignKey
ALTER TABLE `usuarios_has_projetos` DROP FOREIGN KEY `fk_Usuarios_has_Projetos_Usuarios`;

-- AddForeignKey
ALTER TABLE `tarefas` ADD CONSTRAINT `fk_Tarefas_Projetos1` FOREIGN KEY (`id_projeto`) REFERENCES `projetos`(`id_projeto`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tarefas` ADD CONSTRAINT `fk_Tarefas_Usuarios1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios`(`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usuarios_has_projetos` ADD CONSTRAINT `fk_Usuarios_has_Projetos_Projetos1` FOREIGN KEY (`id_projeto`) REFERENCES `projetos`(`id_projeto`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usuarios_has_projetos` ADD CONSTRAINT `fk_Usuarios_has_Projetos_Usuarios` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios`(`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;
