import { createReducer, on } from '@ngrx/store';
import { DemandeCollecte } from '../../models/demande-collecte.model';
import { addDemande, deleteDemande, updateDemande, changerStatutDemande } from '../actions/collecte.actions';

export interface DemandeState {
  demandes: DemandeCollecte[];
}

const initialState: DemandeState = {
  demandes: JSON.parse(localStorage.getItem('demandes') || '[]')
};

export const demandeReducer = createReducer(
  initialState,
  
  on(addDemande, (state, { demande }) => {
    const nouvellesDemandes = [...state.demandes, demande];
    localStorage.setItem('demandes', JSON.stringify(nouvellesDemandes));
    return { ...state, demandes: nouvellesDemandes };
  }),

  on(deleteDemande, (state, { id }) => {
    const nouvellesDemandes = state.demandes.filter(d => d.id !== id);
    localStorage.setItem('demandes', JSON.stringify(nouvellesDemandes));
    return { ...state, demandes: nouvellesDemandes };
  }),

  on(updateDemande, (state, { demande }) => {
    const nouvellesDemandes = state.demandes.map(d => d.id === demande.id ? demande : d);
    localStorage.setItem('demandes', JSON.stringify(nouvellesDemandes));
    return { ...state, demandes: nouvellesDemandes };
  }),

  on(changerStatutDemande, (state, { id, statut }) => {
    const nouvellesDemandes = state.demandes.map(d => d.id === id ? { ...d, statut } : d);
    localStorage.setItem('demandes', JSON.stringify(nouvellesDemandes));
    return { ...state, demandes: nouvellesDemandes };
  })
);