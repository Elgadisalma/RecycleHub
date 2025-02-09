// services/point.service.ts
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { calculerPoints, attribuerPoints } from '../store/actions/collecte.actions';
import { updateUser } from '../store/actions/user.actions';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class PointService {
  constructor(private store: Store) {}

  calculerPoints(typeDechets: string[], poids: number): number {
    let totalPoints = 0;
  
    typeDechets.forEach((dechet) => {
      switch (dechet.toLowerCase()) {
        case 'plastique':
          totalPoints += poids * 2;
          break;
        case 'verre':
          totalPoints += poids * 1;
          break;
        case 'papier':
          totalPoints += poids * 1;
          break;
        case 'métal':
          totalPoints += poids * 5;
          break;
      }
    });
  
    console.log('Points calculés:', totalPoints);
    return totalPoints;
  }

  attribuerPointsClient(clientId: string, points: number) {
    let clients: User[] = JSON.parse(localStorage.getItem('users') || '[]');  
    
    const clientIndex = clients.findIndex((c: User) => c.id === clientId);
  
    if (clientIndex !== -1) {
      const currentPoints = Number(clients[clientIndex].points) || 0;
      clients[clientIndex].points = currentPoints + points;
      
      localStorage.setItem('users', JSON.stringify(clients));  
  
      this.store.dispatch(attribuerPoints({ clientId, points }));
    } else {
      console.log('Client non trouvé dans le localStorage');
    }
  }
  
}
