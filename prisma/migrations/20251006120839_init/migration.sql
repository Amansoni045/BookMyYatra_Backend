-- CreateTable
CREATE TABLE "public"."Hotel" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "price" INTEGER NOT NULL,
    "tag" TEXT,
    "maxGuests" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "services" TEXT NOT NULL,

    CONSTRAINT "Hotel_pkey" PRIMARY KEY ("id")
);
