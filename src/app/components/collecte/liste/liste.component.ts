import { Component } from '@angular/core';
import { CollecteService } from '../../../services/collecte.service';
import { PointService } from '../../../services/point.service';  // ✅ Import du service de points
import { Store } from '@ngrx/store';
import { UserState } from '../../../store/reducers/user.reducer';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { DemandeCollecte } from '../../../models/demande-collecte.model';

@Component({
  selector: 'app-liste',
  standalone: true, 
  imports: [CommonModule, FormsModule], 
  templateUrl: './liste.component.html',
  styleUrls: ['./liste.component.css']
})
export class ListeComponent {
  currentUser: any;
  villeCollecteur: string = '';
  demandesEnAttente: DemandeCollecte[] = [];
  statutsDisponibles = ['en_attente', 'occupée', 'en_cours', 'validée', 'rejetée'];

  constructor(
    private collecteService: CollecteService,
    private pointService: PointService,  // ✅ Injection du PointService
    private store: Store<{ users: UserState }>
  ) {}

  ngOnInit() {
    this.store.select((state) => state.users.currentUser).subscribe((user) => {
      this.currentUser = user;
      if (user) {
        this.villeCollecteur = user.address;
        this.chargerDemandesPourCollecteur(); 
      }
    });
  }

  getSelectValue(event: Event): string {
    return (event.target as HTMLSelectElement).value;
  }

  chargerDemandesPourCollecteur() {
    if (this.villeCollecteur) {
      this.collecteService.getDemandesPourCollecteur(this.villeCollecteur).subscribe((demandes) => {
        this.demandesEnAttente = demandes;
      });
    }
  }

  onStatutChange(demande: DemandeCollecte, newStatut: string) {
    const statutValide = newStatut as DemandeCollecte['statut'];
  
    const demandeModifiee = { ...demande, statut: statutValide };
  
    this.collecteService.changerStatutDemande(demande.id, statutValide).subscribe((message) => {
      alert(message);
  
      const index = this.demandesEnAttente.findIndex(d => d.id === demande.id);
      if (index !== -1) {
        this.demandesEnAttente[index] = demandeModifiee;
      }
  
      if (statutValide === 'validée') {
        const points = this.pointService.calculerPoints(demande.typeDechets, demande.poids);
        this.pointService.attribuerPointsClient(demande.userId, points);
      }
  
      localStorage.setItem('demandes', JSON.stringify(this.demandesEnAttente));
      this.chargerDemandesPourCollecteur();  
    });
  }
}
