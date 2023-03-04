import type {NextApiRequest, NextApiResponse, NextApiHandler} from "next";
import mongoose from "mongoose";
import type {RespostaPadraoMsg} from "../types/RespostaPadraoMsg";

export const conectarMongoDB = (handler : NextApiHandler) => {
  async (req : NextApiRequest,
    res : NextApiResponse<RespostaPadraoMsg>) => {

      //Verificar se o banco está conectado, se estiver, seguir para o endpoint ou próximo middleware
      if(mongoose.connections[0].readyState){
        return handler(req, res);
      }
      //Quando não estiver conectado, conectar obtendo a variável de ambiente preeenchida do env
      const{DB_CONEXAO_STRING} = process.env;
      //Caso a env esteja vazia, abortar o uso do sistema e avisar ao programador
      if(!DB_CONEXAO_STRING){
        return res.status(500).json({ erro : "ENV de configuração do banco não informado"});
      }

      mongoose.connection.on("connected", () => console.log("Banco de dados conectado"));
      mongoose.connection.on("error", error => console.log(`Ocorreu um erro ao conectar o banco de dados ${error}`));
      await mongoose.connect(DB_CONEXAO_STRING);
      //Seguindo para o endpoint, conexão com o banco de dados realizada
      return handler(req, res);
    }
}