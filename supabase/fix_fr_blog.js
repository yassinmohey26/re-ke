const fs=require('fs');
const ar=JSON.parse(fs.readFileSync('ar_translations.json','utf8'));

for(const entry of ar){
  if(entry.t==='blog_posts' && entry.r==='9e076f56-ac05-46a5-8355-2b1aafc9c8a1'){
    entry.t_title = "Safari en quad à Hurghada 2025 – L'aventure ultime dans le désert en Égypte";
    entry.t_excerpt = "Partez pour une aventure en quad dans le désert d'Hurghada : conduite palpitante, village bédouin, thé égyptien, et coucher de soleil magique.";
    entry.t_content = `<h2>Safari en quad à Hurghada 2025 – L'aventure ultime dans le désert</h2><p>Lancez-vous dans une aventure en quad à travers le désert époustouflant d'Hurghada. Une expérience palpitante qui comprend la conduite de quads sur les dunes de sable et la visite d'un village bédouin traditionnel.</p><h3>Programme (3 heures)</h3><ul><li>09:00 – Récupération de l'équipement et briefing sécurité à Hurghada</li><li>09:30 – Départ pour l'aventure en quad à travers les dunes dorées</li><li>10:30 – Visite d'un village bédouin – Thé bédouin traditionnel et échange avec les bédouins</li><li>11:00 – Profiter du coucher de soleil magique dans le désert</li><li>12:00 – Retour à Hurghada</li></ul><h3>Ce qui est inclus</h3><ul><li>Location de quad moderne (3 heures)</li><li>Casque et équipement de sécurité</li><li>Guide safari expert</li><li>Thé bédouin traditionnel</li><li>Transfert depuis et vers l'hôtel</li></ul><h3>Non inclus</h3><ul><li>Dépenses personnelles</li><li>Pourboires</li><li>Photos et vidéos (optionnel)</li><li>Boissons alcoolisées</li></ul><h3>Informations importantes</h3><ul><li>Pas besoin de permis de conduire. Briefing sécurité complet avant le départ.</li><li>Enfants à partir de 16 ans pour conduire, 6 ans comme passager.</li><li>Vêtements confortables, chaussures fermées, lunettes de soleil, crème solaire.</li></ul>`;
    entry.t_read_time = '4 minutes';
    console.log('Updated blog post with French translations');
  }
}
fs.writeFileSync('ar_translations.json', JSON.stringify(ar, null, 2));
console.log('Saved ar_translations.json');