/*
  Warnings:

  - A unique constraint covering the columns `[make_id,name]` on the table `models` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "models_name_make_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "models_make_id_name_key" ON "models"("make_id", "name");
