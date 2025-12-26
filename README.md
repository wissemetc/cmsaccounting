# 🏢 CMS Comptable - Site Web Professionnel

Site web professionnel pour le cabinet d'expertise comptable CMS Comptable en Tunisie.

## 📁 Structure du Projet

```
cmsaccounting/
├── index.html                  # Page principale du site
├── css/
│   └── style.css              # Feuille de style principale
├── js/
│   ├── main.js                # Scripts principaux
│   └── zoho-integration.js    # Intégration Cal.com (réservations)
├── assets/
│   └── images/                # Images et logos
├── CONFIGURATION-ZOHO.md      # Guide de configuration Zoho
└── README.md                  # Ce fichier
```

## 🎨 Caractéristiques du Design

### Palette de Couleurs Professionnelle
- **Bleu Marine Professionnel**: `#1e3a8a` - Couleur principale
- **Bleu Ciel Dynamique**: `#0ea5e9` - Couleur secondaire
- **Or/Ambre Sophistiqué**: `#d97706` - Couleur accent
- **Gris Modernes**: Palette complète pour textes et arrière-plans

### Typographie
- **Police principale**: Inter (Google Fonts)
- **Poids disponibles**: 300, 400, 500, 600, 700, 800, 900

### Ombres et Effets
- Ombres subtiles et modernes
- Transitions fluides
- Animations CSS optimisées

## 🚀 Installation et Déploiement

### Prérequis
- Aucun serveur backend requis (Frontend-only)
- Hébergement web statique (GitHub Pages, Netlify, Vercel, etc.)

### Déploiement Rapide

1. **Cloner le repository**
   ```bash
   git clone https://github.com/votre-username/cmsaccounting.git
   cd cmsaccounting
   ```

2. **Configuration locale**
   - Aucune dépendance à installer
   - Ouvrir `index.html` dans un navigateur pour tester

3. **Déployer sur GitHub Pages**
   ```bash
   git add .
   git commit -m "Deploy website"
   git push origin main
   ```
   - Activez GitHub Pages dans les paramètres du repository

4. **Ou déployer sur Netlify/Vercel**
   - Connectez votre repository
   - Le site sera automatiquement déployé

## 📅 Configuration Cal.com (Système de Réservation)

Pour intégrer vos rendez-vous avec Cal.com, consultez le guide complet:
👉 **[CALCOM_SETUP.md](CALCOM_SETUP.md)**

### Configuration Rapide

1. Créez un compte gratuit sur [Cal.com](https://cal.com)
2. Créez un Event Type (ex: "Consultation 30 min")
3. Connectez votre calendrier Zoho à Cal.com
4. Obtenez votre clé API : Settings → Developer → API Keys
5. Modifiez `js/main.js` (ligne ~199):
   ```javascript
   CALCOM_API_KEY: "cal_live_votre_cle_api",
   CALCOM_USERNAME: "votre-username",
   CALCOM_EVENT_SLUG: "consultation-30min"
   ```

**Avantages Cal.com** :
- ✅ 100% gratuit (pas de limite de réservations)
- ✅ Synchronisation temps réel (aucun risque de double réservation)
- ✅ Emails automatiques au client et au cabinet
- ✅ Design de votre site conservé à 100%

## 📧 Configuration Email (EmailJS)

Le site utilise EmailJS pour le formulaire de contact.

1. Créez un compte sur [EmailJS](https://www.emailjs.com/)
2. Configurez un service email
3. Créez un template d'email
4. Modifiez `js/main.js` avec vos identifiants:
   ```javascript
   emailjs.init("VOTRE_PUBLIC_KEY");
   ```

## 🔧 Personnalisation

### Modifier les Couleurs

Éditez le fichier `css/style.css` et modifiez les variables CSS:

```css
:root {
    --primary: #1e3a8a;      /* Votre couleur principale */
    --secondary: #0ea5e9;    /* Votre couleur secondaire */
    --accent: #d97706;       /* Votre couleur accent */
}
```

### Modifier le Logo

1. Placez votre logo dans `assets/images/`
2. Modifiez le chemin dans `index.html`:
   ```html
   <img src="images/votre-logo.png" alt="CMS Comptable">
   ```

### Modifier les Informations de Contact

Recherchez et remplacez dans `index.html`:
- Numéro de téléphone: `+216 53 810 911`
- Email: `contact@cmscomptable.tn`
- Adresse: `Avenue Farhat Hached, Bouhajla Kairouan`

## 📱 Responsive Design

Le site est entièrement responsive et optimisé pour:
- 📱 Mobile (< 768px)
- 📱 Tablette (768px - 1024px)
- 💻 Desktop (> 1024px)

## ⚡ Performance

- CSS et JS externalisés pour un meilleur caching
- Fonts Google chargés de manière asynchrone
- Images optimisées (à ajouter dans `assets/images/`)
- Animations CSS légères

## 🔍 SEO

Le site inclut:
- Meta tags optimisés
- Open Graph pour réseaux sociaux
- Schema.org pour les moteurs de recherche
- Sitemap XML (à générer)

## 📊 Analytics (Optionnel)

Pour ajouter Google Analytics:

1. Ajoutez avant `</head>` dans `index.html`:
   ```html
   <!-- Google Analytics -->
   <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'GA_MEASUREMENT_ID');
   </script>
   ```

## 🛠️ Maintenance

### Mise à jour du Contenu

1. **Services**: Modifiez la section `#services` dans `index.html`
2. **Actualités**: Modifiez la section `#actualites` dans `index.html`
3. **Tarifs**: Modifiez les prix dans la section correspondante

### Sauvegarde

- L'ancien fichier est sauvegardé dans `index-old-backup.html`
- Faites des commits réguliers sur Git

## 📞 Support

Pour toute question ou assistance:
- **Email**: contact@cmscomptable.tn
- **Téléphone**: +216 53 810 911
- **Adresse**: Avenue Farhat Hached, Bouhajla Kairouan 3180, Tunisie

## 📄 Licence

© 2024 CMS Comptable - Tous droits réservés

---

**Développé avec ❤️ pour CMS Comptable Tunisie**
