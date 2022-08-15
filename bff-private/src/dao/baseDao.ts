import { RowDataPacket } from 'mysql2';
import { pool } from './mysql/pool';

export class BaseDAO<T> {
    instanceName: string;
    instance: T;

    constructor(c: new () => T) {
        this.instanceName = c.name;
        this.instance = new c();
    }

    async queryEntityById(id?: number): Promise<T> {
        const [rows] = await pool.query<RowDataPacket[]>(`select * from ${this.instanceName} ${id ? 'where id=' + id : ''}`);

        for (let key in Object.getOwnPropertyNames(this.instance)) {
            if (rows[0][key]) {
                (this.instance as Record<string, any>)[key] = rows[0][key];
            }
        }

        return this.instance;
    }
}