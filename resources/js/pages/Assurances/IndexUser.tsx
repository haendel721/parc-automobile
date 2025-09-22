import React from 'react';
import { route } from 'ziggy-js';


type assurances = {
    id: number;
    vehicule_id: number;
    NomCompagnie: number;
    NumContrat: string;
    cout: number;
    dateDebut	: string;
    dateFin: number;
};
type AssuranceProps = {
    assurances: assurances[];
};

const assuranceUser: React.FC<AssuranceProps> = ({ vehicules }) => {
    return (
        <>
            user Index
        </>
        )
            
};

export default assuranceUser;
