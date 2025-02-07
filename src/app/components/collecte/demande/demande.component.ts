import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CollecteService } from '../../../services/collecte.service';
import { DemandeCollecte } from '../../../models/demande-collecte.model';
import { Store } from '@ngrx/store';
import { UserState } from '../../../store/reducers/user.reducer';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-demande',
  standalone: true, 
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './demande.component.html',
  styleUrls: ['./demande.component.css']
})
export class DemandeComponent implements OnInit {
  demandes: DemandeCollecte[] = [];
  currentUser: any;
  demandeForm!: FormGroup;
  poidsTotalEnAttente: number = 0;

  constructor(
    private fb: FormBuilder,
    private collecteService: CollecteService,
    private store: Store<{ users: UserState }>
  ) {}

  ngOnInit() {
    this.store.select((state) => state.users.currentUser).subscribe((user) => {
      this.currentUser = user;
      if (user) {
        this.chargerDemandes();
      }
    });

    this.demandeForm = this.fb.group({
      typeDechets: [[], Validators.required], 
      poids: [1, [Validators.required, Validators.min(1), Validators.max(10)]], 
      adresse: ['', Validators.required],
      ville: ['', Validators.required],
      photo: [null], 
      dateSouhaitee: ['', Validators.required], 
      heureSouhaitee: ['', [Validators.required, this.validateHeure]], 
      notes: [''] 
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0]; 
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.demandeForm.patchValue({
          photo: reader.result
        });
      };
      reader.readAsDataURL(file); 
    }
  }

  chargerDemandes() {
    this.collecteService.getDemandesUtilisateur(this.currentUser.id).subscribe((demandes) => {
      this.demandes = demandes.filter(d => d.statut === 'en_attente');
      this.poidsTotalEnAttente = this.demandes.reduce((total, d) => total + d.poids, 0);
    });
  }

  validateHeure(control: any) {
    const heure = control.value;
    if (!heure) return null;
    const [h, m] = heure.split(':').map(Number);
    if (h < 9 || h >= 18) {
      return { invalidHeure: true };
    }
    return null;
  }

  ajouterDemande() {
    if (this.demandeForm.invalid) return;

    if (this.demandes.length >= 3) {
      alert("Vous avez atteint le maximum de 3 demandes en attente.");
      return;
    }

    const poidsDemande = this.demandeForm.value.poids;
    if (this.poidsTotalEnAttente + poidsDemande > 10) {
      alert("Le total des collectes en attente ne doit pas dépasser 10 kg.");
      return;
    }

    const nouvelleDemande: DemandeCollecte = {
      id: crypto.randomUUID(),
      userId: this.currentUser.id,
      statut: 'en_attente',
      dateDemande: new Date(),
      ...this.demandeForm.value
    };

    this.collecteService.ajouterDemande(nouvelleDemande).subscribe((message) => {
      alert(message);
      this.chargerDemandes();
      this.demandeForm.reset();
    });
  }

  supprimerDemande(id: string) {
    this.collecteService.supprimerDemande(id).subscribe((message) => {
      alert(message);
      this.chargerDemandes();
    });
  }
}
