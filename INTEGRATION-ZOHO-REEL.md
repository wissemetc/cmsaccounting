# 🎨 Intégration de VOTRE Calendrier Zoho Réel (Même Design)

## ✅ **OUI, vous pouvez garder exactement le même design !**

Il existe **3 méthodes** pour intégrer votre vrai calendrier Zoho professionnel. Voici comment procéder :

---

## 📅 **MÉTHODE 1 : Zoho Bookings (Recommandée - Facile)**

### **Avantages:**
- ✅ Synchronisation automatique avec votre calendrier Zoho
- ✅ Design personnalisable (couleurs, logo)
- ✅ Notifications automatiques par email
- ✅ Aucun code backend nécessaire
- ✅ Gestion des fuseaux horaires
- ✅ Annulations et rappels automatiques

### **Étapes d'intégration:**

#### **1. Configuration Zoho Bookings**

```bash
# Allez sur:
https://www.zoho.com/bookings/

# Créez un compte ou connectez-vous
# avec votre compte Zoho existant
```

#### **2. Créez votre service**
- **Nom:** "Consultation Comptable"
- **Durée:** 30 minutes
- **Type:** Présentiel / Visio / Téléphone
- **Tarif:** Gratuit (ou votre tarif)

#### **3. Configurez vos disponibilités**
```
Lundi à Vendredi : 8h30 - 17h30
Samedi : 8h30 - 12h30
Dimanche : Fermé
```

#### **4. Personnalisez les couleurs (Pour matcher votre site)**

Dans **Zoho Bookings > Paramètres > Apparence** :
```css
Couleur Primaire     : #1e3a8a  (Bleu marine)
Couleur Secondaire   : #0ea5e9  (Bleu ciel)
Couleur Accent       : #d97706  (Or/Ambre)
Police               : Inter (ou similaire)
```

#### **5. Obtenez votre URL de réservation**

Après configuration, vous obtiendrez une URL comme :
```
https://calendar.zoho.com/book/cmsaccounting
```

#### **6. OPTION A - Intégration avec Iframe (Design intégré)**

Modifiez `js/zoho-integration.js` :

```javascript
// Ligne 7
const ZOHO_CONFIG = {
    bookingsUrl: 'https://calendar.zoho.com/book/cmsaccounting', // VOTRE URL ICI
};
```

Le calendrier Zoho s'affichera **directement dans votre page** avec un iframe !

#### **7. OPTION B - Bouton vers page Zoho**

Si vous préférez que l'utilisateur aille sur la page Zoho Bookings :
- Le bouton est déjà configuré dans `js/zoho-integration.js`
- Modifiez juste l'URL comme ci-dessus
- Les utilisateurs cliqueront sur "Réserver un RDV" et iront sur Zoho

---

## 🎨 **MÉTHODE 2 : Remplacer le Calendrier par Iframe Zoho Bookings**

Pour une intégration **100% visuelle** dans votre design :

### **1. Obtenez le code d'intégration Zoho**

Dans **Zoho Bookings > Intégrations > Embed Code** :

```html
<!-- Vous obtiendrez quelque chose comme : -->
<iframe src="https://calendar.zoho.com/book/cmsaccounting?embed=true"
        width="100%"
        height="700"
        frameborder="0">
</iframe>
```

### **2. Modifiez `index.html`**

Trouvez la section `<!-- Calendrier Avancé -->` (ligne ~751) et remplacez tout le contenu de `<div class="calendar-widget">` par :

```html
<div class="calendar-widget">
    <div class="calendar-header">
        <h3>Réserver votre rendez-vous</h3>
        <p style="font-size: 0.9rem; color: var(--gray-600); margin-top: 0.5rem;">
            Choisissez votre créneau directement dans le calendrier ci-dessous
        </p>
    </div>

    <!-- IFRAME ZOHO BOOKINGS -->
    <iframe
        src="https://calendar.zoho.com/book/VOTRE_PAGE?embed=true&color=1e3a8a"
        width="100%"
        height="700"
        frameborder="0"
        style="border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    </iframe>

    <div class="calendar-info">
        <h4><i class="fas fa-info-circle"></i> Informations pratiques</h4>
        <div class="info-item">
            <i class="fas fa-clock"></i>
            <span><strong>Durée :</strong> Consultation de 30 minutes</span>
        </div>
        <div class="info-item">
            <i class="fas fa-shield-alt"></i>
            <span><strong>Sécurisé :</strong> Vos données sont protégées</span>
        </div>
    </div>
</div>
```

**Résultat :** Le calendrier Zoho apparaîtra directement dans votre design !

---

## ⚙️ **MÉTHODE 3 : API Zoho Calendar (Avancé - Design 100% Custom)**

Pour garder **exactement votre design actuel** et utiliser les données Zoho :

### **Prérequis:**
- Un backend (Node.js, Python, PHP, etc.)
- OAuth 2.0 Zoho configuré

### **Architecture:**

```
Frontend (Site)  →  Backend (Votre serveur)  →  API Zoho Calendar
     ↑                        ↓
     └───── Récupère les créneaux disponibles ─────┘
```

### **1. Créez une application Zoho**

```bash
# Allez sur:
https://api-console.zoho.com/

# Créez une "Server-based Application"
# Notez votre Client ID et Client Secret
```

### **2. Configurez les Scopes OAuth**

```
ZohoCalendar.calendar.READ
ZohoCalendar.event.CREATE
ZohoCalendar.event.UPDATE
ZohoBookings.availability.READ
```

### **3. Créez un Backend (Exemple Node.js)**

```javascript
// backend/server.js
const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

// Endpoint pour récupérer les créneaux disponibles
app.get('/api/available-slots', async (req, res) => {
    const { date } = req.query;

    try {
        // Appel API Zoho Calendar
        const response = await axios.get('https://calendar.zoho.com/api/v1/availableslots', {
            headers: {
                'Authorization': `Bearer ${process.env.ZOHO_ACCESS_TOKEN}`
            },
            params: {
                date: date,
                service_id: process.env.ZOHO_SERVICE_ID
            }
        });

        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Erreur récupération créneaux' });
    }
});

// Endpoint pour créer un rendez-vous
app.post('/api/create-appointment', async (req, res) => {
    const { name, email, phone, date, time, service } = req.body;

    try {
        const response = await axios.post('https://calendar.zoho.com/api/v1/bookings', {
            customer_name: name,
            customer_email: email,
            customer_phone: phone,
            start_time: `${date} ${time}`,
            service_id: process.env.ZOHO_SERVICE_ID
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.ZOHO_ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        res.json({ success: true, booking: response.data });
    } catch (error) {
        res.status(500).json({ error: 'Erreur création rendez-vous' });
    }
});

app.listen(3000, () => console.log('Backend running on port 3000'));
```

### **4. Modifiez `js/main.js`**

```javascript
// Dans la fonction qui gère le calendrier
async function loadAvailableSlots(date) {
    try {
        const response = await fetch(`https://votre-backend.com/api/available-slots?date=${date}`);
        const slots = await response.json();

        // Afficher les créneaux dans votre design actuel
        displayTimeSlots(slots);
    } catch (error) {
        console.error('Erreur chargement créneaux:', error);
    }
}

// Dans le formulaire de rendez-vous
async function submitAppointment(formData) {
    try {
        const response = await fetch('https://votre-backend.com/api/create-appointment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const result = await response.json();
        if (result.success) {
            // Afficher message de succès
            showSuccessMessage();
        }
    } catch (error) {
        console.error('Erreur création RDV:', error);
    }
}
```

---

## 🎯 **Comparaison des Méthodes**

| Critère | Méthode 1 (Iframe) | Méthode 2 (Widget) | Méthode 3 (API) |
|---------|-------------------|-------------------|-----------------|
| **Facilité** | ⭐⭐⭐⭐⭐ Très facile | ⭐⭐⭐⭐ Facile | ⭐⭐ Complexe |
| **Backend requis** | ❌ Non | ❌ Non | ✅ Oui |
| **Design custom** | ⭐⭐⭐ Bon | ⭐⭐⭐⭐ Très bon | ⭐⭐⭐⭐⭐ Total |
| **Temps installation** | 10 min | 20 min | 2-5 heures |
| **Synchronisation** | ✅ Auto | ✅ Auto | ✅ Auto |
| **Coût** | Gratuit | Gratuit | Backend + temps |

---

## 🚀 **Recommandation**

### **Pour VOUS (cmsaccounting.tn) :**

Je recommande **MÉTHODE 1 ou 2** (Zoho Bookings) car :
- ✅ Aucun backend nécessaire (site frontend-only)
- ✅ Synchronisation automatique avec votre calendrier
- ✅ Design personnalisable
- ✅ Installation en 10-20 minutes
- ✅ Gratuit

### **Installation Rapide (10 min) :**

1. Créez un compte Zoho Bookings
2. Configurez votre service et disponibilités
3. Personnalisez les couleurs (bleu #1e3a8a, or #d97706)
4. Copiez votre URL Zoho Bookings
5. Modifiez `js/zoho-integration.js` ligne 7
6. **C'EST TOUT !**

---

## 📧 **Questions Fréquentes**

**Q: Le calendrier Zoho aura-t-il les mêmes couleurs que mon site ?**
R: OUI ! Vous pouvez personnaliser les couleurs dans Zoho Bookings pour matcher parfaitement.

**Q: Les rendez-vous apparaîtront-ils dans mon calendrier Zoho ?**
R: OUI ! Synchronisation automatique bidirectionnelle.

**Q: Puis-je garder mon formulaire actuel ?**
R: OUI ! Le formulaire peut rester, et Zoho s'ajoute comme option supplémentaire.

**Q: C'est vraiment gratuit ?**
R: OUI pour la version de base (3 utilisateurs, 100 rendez-vous/mois).

---

## ✅ **Checklist d'Installation**

- [ ] Créer compte Zoho Bookings
- [ ] Configurer service "Consultation Comptable" (30 min)
- [ ] Définir disponibilités (Lun-Ven 8h30-17h30)
- [ ] Personnaliser couleurs (#1e3a8a, #d97706)
- [ ] Obtenir URL de réservation
- [ ] Modifier `js/zoho-integration.js` avec votre URL
- [ ] Tester une réservation
- [ ] Vérifier synchronisation calendrier

---

**Besoin d'aide ? Consultez la documentation Zoho :**
https://www.zoho.com/bookings/help/

Bonne intégration ! 🎉
