import React, { useEffect, useState } from 'react';
import apiClient from '../services/api';
import ArtisanCard from '../components/ArtisanCard';

export default function ArtisansSearch() {
  const [artisans, setArtisans] = useState([]);

  useEffect(() => {
    const run = async () => {
      try {
        const res = await apiClient.get('/artisans/');
        setArtisans(res.data);
      } catch (e) {
        console.error(e);
      }
    };
    run();
  }, []);

  return (
    <div>
      <h2>Artisans disponibles</h2>
      <div className="artisan-list">
        {artisans.map(a => (
          <ArtisanCard
            key={a.id}
            artisan={{
              id: a.id,
              avatar: "🧑‍🔧",
              name: a.user.username,
              specialty: a.metier,
              rating: a.note || 4.5,
              price: `${a.tarif_min} - ${a.tarif_max}`
            }}
          />
        ))}
      </div>
    </div>
  );
}
