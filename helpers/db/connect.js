import { MongoClient } from 'mongodb';

export class connect {
    static instanceConnect;
    user;
    port;
    cluster;
    #host;
    #pass
    #dbName
    constructor() {
        if (typeof connect.instanceConnect === 'object') {
            return connect.instanceConnect;
        }
        this.setHost = process.env.MONGO_HOST;
        this.user = process.env.MONGO_USER;
        this.setPass = process.env.MONGO_PWD;
        this.port = process.env.MONGO_PORT;
        this.cluster = process.env.MONGO_CLUSTER;
        this.setDbName = process.env.MONGO_DB;
        this.#open()
        connect.instanceConnect = this;
        return this;
    }
    set setHost(host){
        this.#host = host;
    }
    set setPass(pass){
        this.#pass = pass;
    }
    set setDbName(dbName){
        this.#dbName = dbName;
    }
    get getDbName(){
        return this.#dbName;
    }

    destructor() {
        connect.instanceConnect = undefined;
    }

    async #open(){
        let url = `${this.#host}${this.user}:${this.#pass}@${this.cluster}:${this.port}/${process.env.MONGO_DB}`;
        this.conexion = new MongoClient(url);
    }
}