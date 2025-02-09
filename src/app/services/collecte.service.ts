import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { DemandeCollecte } from '../models/demande-collecte.model';
import { Observable, of } from 'rxjs';
import { addDemande, updateDemande, deleteDemande } from '../store/actions/collecte.actions';
import { UserState } from '../store/reducers/user.reducer';

@Injectable({
  providedIn: 'root'
})
export class CollecteService {
  demandes: DemandeCollecte[] = JSON.parse(localStorage.getItem('demandes') || '[]');

  constructor(private store: Store<{ users: UserState }>) {}

  ajouterDemande(demande: DemandeCollecte): Observable<string> {
    const userDemandes = this.demandes.filter(d => d.userId === demande.userId && d.statut === 'en_attente');
    const totalPoids = userDemandes.reduce((acc, d) => acc + d.poids, 0);

    if (userDemandes.length >= 3) {
      return of('Vous avez déjà 3 demandes en attente.');
    }
    if (totalPoids + demande.poids > 10) {
      return of('Le poids total des demandes en attente ne doit pas dépasser 10 kg.');
    }

    this.demandes.push(demande);
    localStorage.setItem('demandes', JSON.stringify(this.demandes));
    this.store.dispatch(addDemande({ demande }));
    return of('Demande ajoutée avec succès.');
  }

  modifierDemande(updatedDemande: DemandeCollecte): Observable<string> {
    const index = this.demandes.findIndex(d => d.id === updatedDemande.id);
    if (index !== -1 && this.demandes[index].statut === 'en_attente') {
      this.demandes[index] = updatedDemande;
      localStorage.setItem('demandes', JSON.stringify(this.demandes));
      this.store.dispatch(updateDemande({ demande: updatedDemande }));
      return of('Demande mise à jour.');
    }
    return of('Modification impossible.');
  }

  supprimerDemande(id: string): Observable<string> {
    const index = this.demandes.findIndex(d => d.id === id);
    if (index !== -1 && this.demandes[index].statut === 'en_attente') {
      this.demandes.splice(index, 1);
      localStorage.setItem('demandes', JSON.stringify(this.demandes));
      this.store.dispatch(deleteDemande({ id }));
      return of('Demande supprimée.');
    }
    return of('Suppression impossible.');
  }

  getDemandesUtilisateur(userId: string): Observable<DemandeCollecte[]> {
    return of(this.demandes.filter(d => d.userId === userId));
  }

  
  getDemandesPourCollecteur(ville: string): Observable<DemandeCollecte[]> {
    const demandesFiltrees = this.demandes.filter(demande => demande.ville === ville);
    return of(demandesFiltrees);
  }

  changerStatutDemande(id: string, statut: 'en_attente' | 'occupée' | 'en_cours' | 'validée' | 'rejetée'): Observable<string> {
    const demandeIndex = this.demandes.findIndex(d => d.id === id);
    
    if (demandeIndex !== -1) {
      this.demandes[demandeIndex].statut = statut;
  
      localStorage.setItem('demandes', JSON.stringify(this.demandes));
  
      this.store.dispatch(updateDemande({ demande: this.demandes[demandeIndex] }));
  
      return of('Statut de la demande mis à jour avec succès.');
    }
    return of('Demande non trouvée.');
  }
  
  
}
