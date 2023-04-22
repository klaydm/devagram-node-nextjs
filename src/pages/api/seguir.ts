import type { NextApiRequest, NextApiResponse } from 'next';
import type { RespostaPadraoMsg } from './../../../types/RespostaPadraoMsg';
import { conectarMongoDB } from './../../../middlewares/conectarMongoDB';
import { validarTokenJWT } from './../../../middlewares/validarTokenJWT';
import { UsuarioModel } from './../../../models/UsuarioModel';
import { SeguidorModel } from './../../../models/SeguidorModel';

const endpointSeguir = 
  async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {
  try {
    if(req.method === 'PUT'){
      const { userId, id } = req?.query;

      const usuarioLogado = await UsuarioModel.findById(userId);
      if(!usuarioLogado){
        return res.status(400).json({ erro : 'Usuário logado não encontrado'});
      }

      const usuarioASerSeguido = await UsuarioModel.findById(id);
        console.log(usuarioASerSeguido);
      if(!usuarioASerSeguido){
        console.log(usuarioASerSeguido);
        
        return res.status(400).json({ erro : 'Usuário a ser seguido não encontrado'});
      }

      const jaSigoEsseUsuario = await SeguidorModel.find({usuarioId : usuarioLogado._id, usuarioSeguidoId : usuarioASerSeguido._id});

      if(jaSigoEsseUsuario && jaSigoEsseUsuario.length > 0){
        jaSigoEsseUsuario.forEach(async (e : any) => await SeguidorModel.findByIdAndDelete({_id : e._id}));
        usuarioLogado.seguindo--;
        await UsuarioModel.findByIdAndUpdate({_id : usuarioLogado._id}, usuarioLogado);

        usuarioASerSeguido.seguidores--;
        await UsuarioModel.findByIdAndUpdate({_id : usuarioASerSeguido._id}, usuarioASerSeguido);

        return res.status(200).json({ msg : 'Deixou de seguir o usuário com sucesso'});

      }else {
        const seguidor = {
          usuarioId : usuarioLogado._id,
          usuarioSeguidoId : usuarioASerSeguido._id
        };
        await SeguidorModel.create(seguidor);

        usuarioLogado.seguindo++;
        await UsuarioModel.findByIdAndUpdate({_id : usuarioLogado._id}, usuarioLogado);

        usuarioASerSeguido.seguidores++;
        await UsuarioModel.findByIdAndUpdate({_id : usuarioASerSeguido._id}, usuarioASerSeguido);
        
        return res.status(200).json({ msg : 'Usuário seguido com sucesso'});
        
      }

    }
    return res.status(405).json({ erro : 'Método informado não existe'});
  } catch (e) {
    console.log(e);
    return res.status(500).json({ erro : 'Não foi possível seguir/deseguir o usuário informado'});    
  }
}

export default validarTokenJWT(conectarMongoDB(endpointSeguir));