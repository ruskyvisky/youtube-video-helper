# 🎬 Video Production Planning App

Modern bir video üretim planlama uygulaması. Next.js, React ve TypeScript ile geliştirildi.

## 🚀 Özellikler

- 📝 **Fikir Havuzu** - Post-it tarzı yapışkan notlarla fikir yönetimi
- 🎣 **Hook Library** - 12 kanıtlanmış kanca framework'ü
- 🎬 **Timeline** - Video yapısı planlama (Hook, Value, CTA)
- ⏱️ **Pacing Analyzer** - Gerçek zamanlı süre tahmini ve uyarılar
- ♻️ **Repurposing Panel** - Multi-platform içerik planlama (Shorts, TikTok, Reel, Twitter)
- 📋 **Shot List** - Çekim listesi ve ilerleme takibi
- 📦 **Asset Pool** - Medya dosyası yönetimi
- 📺 **YouTube A/B Preview** - Gerçekçi YouTube arayüzünde thumbnail/başlık testi
- 🏷️ **Metadata** - Video başlık, etiket ve thumbnail yönetimi
- ✅ **TODO Listesi** - Görev ve alt görev yönetimi

## 🛠️ Teknolojiler

- **Next.js 16** - React framework
- **TypeScript** - Tip güvenliği
- **Tailwind CSS 4** - Styling
- **IndexedDB** - Tarayıcı tabanlı veri saklama
- **@dnd-kit** - Drag & drop işlevselliği

## 📦 Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev

# Production build
npm run build

# Statik export (GitHub Pages için)
npm run export
```

Uygulama [http://localhost:3000](http://localhost:3000) adresinde çalışacaktır.

## 🌐 GitHub Pages'e Deploy

### 1. GitHub Repository Oluştur

```bash
cd my-app
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/KULLANICI_ADIN/REPO_ADI.git
git push -u origin main
```

### 2. GitHub Pages'i Etkinleştir

1. GitHub repo'nuza gidin
2. **Settings** → **Pages** sekmesine gidin
3. **Source** olarak **GitHub Actions** seçin
4. Kaydedin

### 3. Otomatik Deploy

Artık `main` branch'e her push yaptığınızda otomatik olarak deploy olacak!

```bash
git add .
git commit -m "Update"
git push
```

Siteniz şu adreste yayında olacak:
```
https://KULLANICI_ADIN.github.io/my-app/
```

### 4. Özel Repo Adı Kullanıyorsanız

Eğer repo adınız `my-app` değilse, `next.config.ts` dosyasındaki `basePath` ve `assetPrefix` değerlerini güncelleyin:

```typescript
basePath: process.env.NODE_ENV === 'production' ? '/REPO_ADINIZ' : '',
assetPrefix: process.env.NODE_ENV === 'production' ? '/REPO_ADINIZ' : '',
```

## 📝 Veri Saklama

Tüm veriler tarayıcınızın IndexedDB'sinde saklanır. Verileriniz:
- ✅ Tamamen offline çalışır
- ✅ Tarayıcı hafızasında güvenle saklanır
- ✅ JSON olarak export/import edilebilir

## 🎨 Özellik Detayları

### Hook Library
12 kanıtlanmış video kancası stratejisi:
- Yanlış Bilinen Doğru
- Bugün Öğreneceğin Şey
- Görmezden Gelinen Detay
- Eğer X Yapıyorsan
- Zaman Kazandırma
- Ben de Yanıldım
- Basit Ama Etkili
- Şu Anda Oluyor
- Somut Sonuç
- Bu Video Ne Değil
- Karşılaştırma
- Bu Hata Herkesin Başına Geliyor

### Pacing Analyzer
- 150 kelime/dakika hesaplama
- Hook > 30s uyarısı (🔴)
- Video > 10dk optimizasyon önerisi
- Gerçek zamanlı süre tahmini

### Platform Özellikleri
- **YouTube Shorts**: max 60s (9:16)
- **TikTok**: max 180s (9:16)
- **Instagram Reel**: max 90s (9:16)
- **Twitter/X**: max 140s (16:9)

## 📄 Lisans

MIT

## 🤝 Katkıda Bulunma

Pull request'ler memnuniyetle karşılanır!

---

**Made with ❤️ using Next.js**
