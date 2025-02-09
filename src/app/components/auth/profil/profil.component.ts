import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup , ReactiveFormsModule } from '@angular/forms';
import { updateUser, deleteUser } from '../../../store/actions/user.actions';
import { UserState } from '../../../store/reducers/user.reducer';
import { Router } from '@angular/router';
import { CollecteService } from '../../../services/collecte.service'; 
import { PointService } from '../../../services/point.service'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css'],
  imports: [ReactiveFormsModule, CommonModule]
})

export class ProfilComponent implements OnInit {
  profilForm!: FormGroup;
  demandesForms: { [key: string]: FormGroup } = {};
  currentUser: any;
  clientDemandes: any[] = [];
  message: string = '';

  constructor(
    private store: Store<{ users: UserState }>,
    private fb: FormBuilder,
    private router: Router,
    private collecteService: CollecteService,
    private pointService: PointService
  ) {}

  ngOnInit(): void {

    this.store.select(state => state.users.currentUser).subscribe(user => {
      this.currentUser = user;

      if (user) {

        this.profilForm = this.fb.group({
          firstName: [user.firstName],
          lastName: [user.lastName],
          email: [{ value: user.email, disabled: true }],
          address: [user.address],
          phone: [user.phone],
          birthDate: [user.birthDate],
          role: [{ value: user.role, disabled: true }],
          points: [{ value: user.points, disabled: true }]
        });


        this.collecteService.getDemandesUtilisateur(user.id).subscribe(demandes => {
          this.clientDemandes = demandes;
        });this.collecteService.getDemandesUtilisateur(user.id).subscribe(demandes => {
          this.clientDemandes = demandes;
        

          this.clientDemandes.forEach(demande => {
            this.demandesForms[demande.id] = this.fb.group({
              poids: [demande.poids],
              adresse: [demande.adresse],
              ville: [demande.ville]
            });
          });
        });        
      }
    });
  }

  beneficierBon(): void {
    if (!this.currentUser) {
      this.message = 'Utilisateur non trouvé';
      return;
    }
  
    let points = this.currentUser.points;
    let pointsToDeduct = 0;
    let voucherAmount = 0;
  
    if (points >= 500) {
      pointsToDeduct = 500; 
      voucherAmount = 350;
    } else if (points >= 200) {
      pointsToDeduct = 200; 
      voucherAmount = 120;
    } else if (points >= 100) {
      pointsToDeduct = 100; 
      voucherAmount = 50;
    } else {
      this.message = 'Désolé, vous n\'avez pas assez de points pour bénéficier d\'un bon d\'achat.';
      return;
    }
  
    const updatedUser = {
      ...this.currentUser,
      points: this.currentUser.points - pointsToDeduct 
    };
  
    this.store.dispatch(updateUser({ updatedUser }));
    
    this.pointService.attribuerPointsClient(this.currentUser.id, -pointsToDeduct);
  
    this.message = `Félicitations ! Vous avez reçu un bon d\'achat de ${voucherAmount} Dh.`;
  }
  

  onSave(): void {
    if (this.profilForm.valid) {
      const updatedUser = {
        ...this.currentUser,
        ...this.profilForm.getRawValue()
      };
      this.store.dispatch(updateUser({ updatedUser }));
      alert('Profil mis à jour avec succès !');
    }
  }

  onDeleteAccount(): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer votre compte ?')) {
      if (this.currentUser) {
        this.store.dispatch(deleteUser({ userId: this.currentUser.id }));
        this.router.navigate(['/register']);
        alert('Votre compte a été supprimé avec succès.');
      }
    }
  }

  createDemandeForm(demande: any): FormGroup {
    return this.fb.group({
      poids: [demande.poids],
      adresse: [demande.adresse],
      ville: [demande.ville]
    });
  }

  onSaveDemande(demande: any): void {
    const form = this.demandesForms[demande.id];
  
    if (form.valid) {
      const updatedDemande = {
        ...demande,
        ...form.value
      };
      this.collecteService.modifierDemande(updatedDemande).subscribe(message => {
        alert(message);
      });
    }
  }
  

  onDeleteDemande(demandeId: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette demande ?')) {
      this.collecteService.supprimerDemande(demandeId).subscribe(message => {
        this.clientDemandes = this.clientDemandes.filter(d => d.id !== demandeId);
        alert(message);
      });
    }
  }
}