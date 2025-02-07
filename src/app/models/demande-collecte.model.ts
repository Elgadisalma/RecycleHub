export interface DemandeCollecte {
    id: string;            
    userId: string;        
    collecteurId?: string; 
    statut: 'en_attente' | 'occupée' | 'en_cours' | 'validée' | 'rejetée'; 
    typeDechets: string[];  
    poids: number;        
    photo?: string[]; 
    adresse: string;      
    ville: string;        
    dateDemande: Date;    
    dateSouhaitee: string; 
    heureSouhaitee: string;
    notes?: string;
}
