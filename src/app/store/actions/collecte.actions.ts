import { createAction, props } from '@ngrx/store';
import { DemandeCollecte } from '../../models/demande-collecte.model';

export const addDemande = createAction(
  '[Demande] Ajouter',
  props<{ demande: DemandeCollecte }>()
);

export const deleteDemande = createAction(
  '[Demande] Supprimer',
  props<{ id: string }>()
);

export const updateDemande = createAction(
  '[Demande] Modifier',
  props<{ demande: DemandeCollecte }>()
);

export const changerStatutDemande = createAction(
  '[Demande] Changer Statut',
  props<{ id: string; statut: 'en_attente' | 'occupée' | 'en_cours' | 'validée' | 'rejetée' }>()
);
