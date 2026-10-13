/**
 * Mothership DS — componentes 3D (entrada separada: mothership-ds/3d).
 *
 * Exige three como dependência do app (peer opcional do DS):
 *   npm i three
 * Quem não importa daqui não carrega three.
 */

export { Grafo3D } from "./Grafo3D";
export type { Grafo3DProps, Grafo3DNo, Grafo3DAresta, Grafo3DGrupo, Grafo3DSlot } from "./Grafo3D";
export { layoutForca3D } from "./layout";
export type { NoLayout, ArestaLayout, Posicao, OpcoesLayout } from "./layout";
