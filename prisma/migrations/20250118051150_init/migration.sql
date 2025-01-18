-- CreateTable
CREATE TABLE "Metaprompt" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "xml" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "MetapromptHistory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "metapromptId" TEXT NOT NULL,
    "xml" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MetapromptHistory_metapromptId_fkey" FOREIGN KEY ("metapromptId") REFERENCES "Metaprompt" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PromptExecution" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "metapromptId" TEXT NOT NULL,
    "input" TEXT NOT NULL,
    "output" TEXT NOT NULL,
    "executionTime" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PromptExecution_metapromptId_fkey" FOREIGN KEY ("metapromptId") REFERENCES "Metaprompt" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "QualityAnalysis" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "metapromptId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "suggestions" TEXT NOT NULL,
    "metrics" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "Metaprompt_userId_idx" ON "Metaprompt"("userId");

-- CreateIndex
CREATE INDEX "MetapromptHistory_metapromptId_idx" ON "MetapromptHistory"("metapromptId");

-- CreateIndex
CREATE INDEX "PromptExecution_metapromptId_idx" ON "PromptExecution"("metapromptId");

-- CreateIndex
CREATE INDEX "QualityAnalysis_metapromptId_idx" ON "QualityAnalysis"("metapromptId");
