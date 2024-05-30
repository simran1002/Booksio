import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();

export async function createUser(userData: Omit<User, 'id'>): Promise<User> {
  const createdUser = await prisma.user.create({
    data: userData,
  });
  return createdUser;
}

export async function getUserById(id: number): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
    include: {
      books: true,
    },
  });
  return user;
}

export async function getUserByUsername(username: string): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
    include: {
      books: true,
    },
  });
  return user;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
    include: {
      books: true,
    },
  });
  return user;
}

export async function updateUser(id: number, userData: Partial<User>): Promise<User | null> {
  const updatedUser = await prisma.user.update({
    where: {
      id: id,
    },
    data: userData,
  });
  return updatedUser;
}

export async function deleteUser(id: number): Promise<User | null> {
  const deletedUser = await prisma.user.delete({
    where: {
      id: id,
    },
  });
  return deletedUser;
}
