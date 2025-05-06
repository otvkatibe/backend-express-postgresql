import db from '../models/index.js';

export const getAllUsersService = async () => {
    return await db.users.findAll();
};

export const createUser = async (userData) => {
    return await db.users.create(userData);
};

export const findUserByUsername = async (username) => {
    return await db.users.findOne({ where: { username } });
};