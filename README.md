# GEO203E - Coordinate Systems in Geodesy (3D Simulator)

**GEO203E (Coordinate Systems in Geodesy)** dersi kapsamında, **E. J. Krakiwsky & D. E. Wells (UNB Lecture Notes No. 16, 1971)** ders notlarındaki temel jeodezik koordinat sistemlerini ve aralarındaki geometrik ilişkileri 3 boyutlu olarak görselleştirmek amacıyla geliştirilmiş interaktif web uygulaması.

## İncelenen Koordinat Sistemleri

Uygulama üzerinden 3 temel koordinat sistemi ve bunların karşılaştırmalı görünümleri interaktif olarak incelenebilir:

1. **Terrestrial Geocentric Cartesian Coordinate System (ECEF / A.T.):**
   - Dünya kütle merkezli ($O$) sağ-elli (right-handed) kartezyen sistem ($X, Y, Z$).
   - Greenwich başlangıç meridyeni ($X$), $90^\circ$ Doğu boylamı ($Y$) ve ortalama dönme ekseni ($Z$) gösterimi.
   - Jeodezik koordinatlara ($\phi, \lambda, h$) bağlı anlık $(X, Y, Z)$ konum vektörü hesabı.

2. **Local Astronomic Coordinate System (L.A.S.):**
   - Fiziksel yeryüzü ve yerçekimi alanı (Jeoit) referanslı yerel topocentric sistem.
   - Gözlem noktası ($P$) merkezli, çekül doğrusu (plumb line / $+z_{LA}$) ve yerel ufuk düzlemi ($x_{LA}$ Astronomik Kuzey, $y_{LA}$ Astronomik Doğu) gösterimi.
   - Sol-elli (left-handed) eksen yapısı, astronomik azimut ($A$), düşey açı ($v$) ve çekül sapması ($\theta$) parametreleri.

3. **Local Geodetic Coordinate System (L.G.S.):**
   - Matematiksel referans elipsoidi ve $P$ noktasındaki teğet düzlem (tangent plane) referanslı yerel sistem.
   - Elipsoit normali ($+z_{LG}$), jeodezik kuzey ($x_{LG}$) ve jeodezik doğu ($y_{LG}$) eksenleri.
   - Jeodezik azimut ($\alpha$), yükseklik açısı ($a$) ve referans çekül doğrusu ile elipsoit normali arasındaki çekül sapması ($\theta, \xi, \eta$) bileşenleri.

4. **L.A.S. & L.G.S. Yan Yana Karşılaştırma:**
   - Ortak bir hedef/uydu konumu ve çekül sapması ($\xi, \eta$) değerleri altında fiziksel (L.A.S.) ve matematiksel (L.G.S.) yerel sistemlerin eşzamanlı karşılaştırılması.

## Kurulum ve Çalıştırma

Proje harici bir derleme (build) adımı gerektirmez.

- **Doğrudan Çalıştırma:** `index.html` dosyasını tarayıcıda açabilirsiniz.
- **Yerel Sunucu ile Çalıştırma:** `start_server.bat` dosyası ile veya terminalden `python -m http.server 8000` komutuyla `http://localhost:8000` üzerinden çalıştırabilirsiniz.

## Kullanılan Teknolojiler
- HTML5 / CSS3
- JavaScript (ES6+)
- Three.js (r128) & OrbitControls