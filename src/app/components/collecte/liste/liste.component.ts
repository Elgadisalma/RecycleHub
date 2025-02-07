import { Component } from '@angular/core';
import { CollecteService } from '../../../services/collecte.service';
import { Store } from '@ngrx/store';
import { UserState } from '../../../store/reducers/user.reducer';
import { CommonModule } from '@angular/common';
import { DemandeCollecte } from '../../../models/demande-collecte.model';

@Component({
  selector: 'app-liste',
  imports: [CommonModule],
  templateUrl: './liste.component.html',
  styleUrls: ['./liste.component.css']
})
export class ListeComponent {
  currentUser: any;
  villeCollecteur: string = '';
  demandesEnAttente: DemandeCollecte[] = [];

  constructor(
    private collecteService: CollecteService,
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

  chargerDemandesPourCollecteur() {
    if (this.villeCollecteur) {
      this.collecteService.getDemandesPourCollecteur(this.villeCollecteur).subscribe((demandes) => {
        this.demandesEnAttente = demandes.filter(d => d.statut === 'en_attente');
      });
    }
  }

}
