-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "avatarUrl" TEXT,
    "walletAddress" TEXT,
    "holyosUserId" TEXT NOT NULL,
    "plan" TEXT NOT NULL DEFAULT 'FREE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "thumbnail" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "storePrice" REAL DEFAULT 0,
    "category" TEXT,
    "techStack" TEXT,
    "deployUrl" TEXT,
    "holyosProjectId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Project_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProjectVersion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "snapshot" TEXT NOT NULL,
    "label" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ProjectVersion_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "StoreEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "screenshots" TEXT,
    "longDescription" TEXT,
    "demoUrl" TEXT,
    "installs" INTEGER NOT NULL DEFAULT 0,
    "avgRating" REAL NOT NULL DEFAULT 0,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "submittedAt" DATETIME,
    "publishedAt" DATETIME,
    CONSTRAINT "StoreEntry_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "storeEntryId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Review_storeEntryId_fkey" FOREIGN KEY ("storeEntryId") REFERENCES "StoreEntry" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_holyosUserId_key" ON "User"("holyosUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Project_slug_key" ON "Project"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Project_holyosProjectId_key" ON "Project"("holyosProjectId");

-- CreateIndex
CREATE UNIQUE INDEX "StoreEntry_projectId_key" ON "StoreEntry"("projectId");
