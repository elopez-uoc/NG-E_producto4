
export type RootStackParamList = {
  Home: undefined;
  Detail: { item: BasketballPlayer };
  Player: { item: BasketballPlayer };
};

export interface BasketballPlayer {
  id: string;
  nombre: string;
  edad: number;
  altura: string;
  posicion: string;
  equipo: string;
  pPP: number; // Puntos por partido
  aPP: number; // Asistencias por partido
  rPP: number; // Rebotes por partido
  porcentajeTiros: number;
  img?: string;
  videoUrl?: string;
}

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}