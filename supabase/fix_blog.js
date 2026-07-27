require('dotenv').config({path:require('path').join(__dirname,'..','.env.local')});
const {createClient}=require('@supabase/supabase-js');
const sb=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);
(async()=>{
  const {error}=await sb.from('content_translations').upsert({
    table_name: 'blog_posts',
    row_id: 'bc3112c6-a2e1-4475-997b-39e2a77e228e',
    locale: 'fr',
    name: "Meilleures excursions à Hurghada 2025 – Les incontournables, conseils d'initiés et expériences inoubliables en Mer Rouge",
    title: "Les meilleures excursions à Hurghada 2025 – Les incontournables, conseils d'initiés et expériences inoubliables en Mer Rouge",
    excerpt: "Votre guide complet pour les meilleures excursions à Hurghada 2025 : visites des pyramides, snorkeling, safari dans le désert, et tout ce qu'il faut pour un voyage parfait sur la Mer Rouge.",
    content: "<h2>Les meilleures excursions à Hurghada 2025</h2><p>Hurghada est l'une des destinations touristiques les plus populaires en Égypte et au Moyen-Orient, offrant un mélange unique d'histoire, de nature et d'aventure. Voici votre guide complet des meilleures excursions disponibles en 2025.</p><h3>1. Excursion aux Pyramides de Gizeh</h3><p>Excursion d'une journée aux Pyramides de Gizeh près du Caire, incluant la visite des trois grandes pyramides, du Sphinx et du Musée égyptien. Idéale pour les amateurs d'histoire et de culture.</p><h3>2. Excursion Snorkeling – Mer Rouge</h3><p>Explorez les récifs coralliens colorés, les poissons tropicaux et les dauphins dans un monde sous-marin inoubliable. L'excursion comprend l'équipement de snorkeling complet et un guide professionnel.</p><h3>3. Safari dans le désert en quad</h3><p>Une aventure palpitante à travers les dunes de sable doré du désert d'Hurghada, incluant la conduite de quad, la visite d'un village bédouin, le thé traditionnel et le coucher de soleil spectaculaire.
</p><h3>4. Excursion à l'île Giftun avec snorkeling</h3><p>Excursion d'une journée à l'île Giftun en Mer Rouge, l'une des destinations de snorkeling les plus célèbres au monde. Récifs coralliens diversifiés, poissons colorés et eaux turquoise cristallines.
</p><h3>Conseils importants</h3><ul><li>Meilleure période pour visiter : d'octobre à avril</li><li>Porter des vêtements confortables et des chaussures fermées</li><li>Apporter crème solaire, lunettes de soleil et caméra étanche</li></ul><p>Réservez votre excursion maintenant et profitez de la meilleure expérience à Hurghada !</p>"
  }, {onConflict: 'table_name,row_id,locale'});
  if(error) console.log('ERROR:', error.message);
  else console.log('UPDATED');
})();