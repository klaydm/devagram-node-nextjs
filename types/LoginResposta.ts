export type LoginResposta = {
  dados: {
    id: string;
    nome: string;
    email: string;
    seguidores: number;
    seguindo: number;
    publicacoes: number;
    token: string;
  },
}