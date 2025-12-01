# Weather App - React Native

Μια σύγχρονη εφαρμογή καιρού για Android και iOS, κατασκευασμένη με React Native.

## ✨ Χαρακτηριστικά

- 🌍 **Αναζήτηση πόλεων** - Αναζήτηση ελληνικών και αγγλικών πόλεων
- 🌡️ **Πρόγνωση καιρού** - 5ήμερη πρόγνωση με ωριαία ανάλυση
- 🎨 **Δυναμικό θέμα χρωμάτων** - Αλλαγή χρωμάτων ανάλογα με τη θερμοκρασία:
  - < 10°C: Απαλό κυανό 🥶
  - 10-20°C: Ανοιχτό κίτρινο 😊
  - > 20°C: Ζεστό πορτοκαλί 🔥
  - Σύννεφα/Βροχή: Γκρι αποχρώσεις ☁️
- 🌐 **Πολυγλωσσικότητα** - Υποστήριξη Ελληνικών και Αγγλικών
- 📱 **Responsive Design** - Αρμονικό σχεδιασμό για όλα τα μεγέθη οθόνης

## 🛠 Τεχνολογίες

- **React Native** 0.82.1
- **React Navigation** 7.1.21
- **React Native Vector Icons** 10.3.0
- **Async Storage** 2.2.0
- **OpenWeather API**

## 📋 Προαπαιτούμενα

- Node.js >= 20
- npm ή yarn
- Android Studio (για Android development)
- Xcode (για iOS development)

## 🚀 Εγκατάσταση

```bash
# Clone το repository
git clone https://github.com/yourname/weatherApp.git
cd weatherApp

# Εγκατάσταση dependencies
npm install

# Android
npm run android

# iOS
npm run ios
```

## ⚙️ Ρύθμιση

1. Πάρτε ένα δωρεάν API key από το [OpenWeather](https://openweathermap.org/api)
2. Ανοίξτε την εφαρμογή και πάτε στο Settings ⚙️
3. Εισάγετε το API key σας
4. Επιλέξτε τη γλώσσα σας (English/Ελληνικά)
5. Πατήστε Save

## 📸 Screenshots

### Main Screen

- Εμφάνιση καιρού της επιλεγμένης πόλης
- Τρέχουσα θερμοκρασία και περιγραφή
- 5ήμερη πρόγνωση

### Day Details

- Ωριαία θερμοκρασία ανά ημέρα
- Αίσθηση θερμοκρασίας (Feels Like)
- Υγρασία περιβάλλοντος

### Settings

- Εισαγωγή API Key
- Επιλογή γλώσσας

## 🎯 Κύριες Λειτουργίες

### Αναζήτηση Πόλεων

- Άμεση αναζήτηση καθώς πληκτρολογείτε
- Υποστήριξη ελληνικών ονομάτων πόλεων
- Αποθήκευση της τελευταίας επιλεγμένης πόλης

### Πρόγνωση Καιρού

- Κύρια οθόνη: Εμφάνιση μιας φορά ανά ημέρα
- Κλικ σε ημέρα: Αναλυτικές ωριαίες θερμοκρασίες

### Δυναμικό Θέμα

Το χρώμα της εφαρμογής αλλάζει ανάλογα με:

- Τη θερμοκρασία της ημέρας
- Τις συνθήκες καιρού (σύννεφα, βροχή κ.λπ.)

## 📁 Δομή Project

```
weatherApp/
├── src/
│   ├── context/
│   │   └── LanguageContext.js       # Γλωσσικό context
│   ├── data/
│   │   └── citiesGR.js              # Ελληνικές και αγγλικές πόλεις
│   ├── screens/
│   │   ├── WeatherScreen.js         # Κύρια οθόνη
│   │   ├── SettingsScreen.js        # Ρυθμίσεις
│   │   └── DayDetailsScreen.js      # Λεπτομέρειες ημέρας
│   ├── services/
│   │   ├── apiService.js            # OpenWeather API
│   │   ├── cityService.js           # Αναζήτηση πόλεων
│   │   └── storageService.js        # Αποθήκευση δεδομένων
│   └── styles/
│       └── theme.js                 # Χρώματα και στυλ
├── App.js
├── package.json
└── metro.config.js
```

## 🔑 Environment Variables

Δημιουργήστε ένα `.env` αρχείο:

```
REACT_APP_OPENWEATHER_API_KEY=your_api_key_here
```

## 🐛 Troubleshooting

### Ελληνικά δεν εμφανίζονται στο TextInput

- Ενεργοποιήστε το Greek keyboard στο Android emulator
- Ή χρησιμοποιήστε τις αγγλικές επιλογές

### API errors

- Ελέγξτε ότι το API key είναι σωστό
- Ελέγξτε τη σύνδεσή σας στο internet

## 📝 License

MIT License - Δείτε το [LICENSE](LICENSE) αρχείο για λεπτομέρειες

## 👤 Συντακτικό Όνομα

Δημιουργήθηκε με ❤️

## 🤝 Συνεισφορές

Οι συνεισφορές είναι καλοδεχόμενες! Ανοίξτε ένα PR ή issue.

---

**Σημείωση**: Αυτό είναι ένα educational project. Αν θέλετε να το χρησιμοποιήσετε σε παραγωγό περιβάλλον, θα πρέπει να προσθέσετε error handling και security measures.
