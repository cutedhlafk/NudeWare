# Wynik odzyskiwania cs2.dll

To pakiet odzyskanego pseudokodu i zasobów, nie oryginalny projekt C++ ani gotowy projekt do kompilacji.

## Co udało się odzyskać

- Wykryte przez Ghidrę funkcje wewnętrzne: 3588 (liczba obejmuje również kod bibliotek, funkcje pomocnicze i możliwe błędne rozpoznania).
- Funkcje, dla których dekompilator zwrócił pseudokod: 3587.
- Nieudane dekompilacje: 1; ich rozpoznane instrukcje zapisano w `failed_functions.asm`.
- Linie pseudokodu i komentarzy: 457,624.
- Wiersze zawierające ostrzeżenia dekompilatora: 3081. Zwrócenie pseudokodu nie oznacza, że wiernie odtwarza działanie funkcji.
- Zasoby wyodrębnione bezpośrednio z DLL: 61 (12 .js, 4 .png, 19 .svg, 5 .ttf, 21 .vmat).

## Pliki

- `decompiled.c` — automatycznie odtworzony pseudokod wszystkich funkcji wykrytych w tej analizie; nazwy FUN_... i DAT_... są nazwami nadanymi przez narzędzie.
- `functions.tsv` — indeks adresów, nazw, wyników dekompilacji i numerów wierszy komentarzy rozpoczynających funkcje.
- `cs2_analysis.gzf` — baza analizy do zaimportowania w Ghidrze 12.1.4 lub zgodnej nowszej wersji; zachowuje pamięć programu, odwołania i typy rozpoznane przez analizator.
- `assets/` — osadzone ikony SVG, obrazy PNG, czcionki, skrypty JavaScript i materiały VMAT. Ich robocze nazwy zawierają offset w oryginalnym DLL. Nazwy plików źródłowych nie zostały odzyskane. Plik `index.json` wskazuje offset i długość każdego zasobu. Osadzone teksty mogą być szablonami z parametrami `%s` i nie muszą działać samodzielnie.
- `strings.txt` — odnalezione drukowalne ciągi ASCII i UTF-16LE (od 6 znaków), wraz z offsetami; zawiera również przypadkowe dopasowania w danych binarnych.
- `metadata.json` — sekcje PE, importy, dane debugowania, adres wejścia i suma kontrolna DLL.
- `type_names.txt` — zachowane nazwy typów RTTI, bez odtwarzania nieznanych pól klas.
- `decompilation_status.txt` — podsumowanie automatycznego eksportu.

## Ustalenia i ograniczenia

Plik zawiera natywny kod x64 z zależnościami C++ i nie ma katalogu CLR/.NET. Ghidra dobrała model kompilatora `clangwindows`; zachowany rekord debugowania zawiera oznaczenie LLD PDB. Nie znaleziono eksportowanych funkcji, które mogłyby dostarczyć ich nazw.

Zachowała się ścieżka do pliku symboli:
`C:\Users\lukas\Desktop\cheaty\cs2\velocity-main nowe gui\cs2\velocity-cs2\..\bin\cs2.pdb`
Sam plik PDB nie był dostępny. Ścieżka stanowi jedynie zapis z czasu kompilacji, a nie potwierdzenie, że ten katalog istnieje na obecnym komputerze.

Kod zawiera nazwy `velocity`, odwołania do modułów gry i teksty interfejsu. Nie odzyskano oryginalnego podziału na pliki C++ i nagłówki, ustawień projektu, większości nazw zmiennych ani komentarzy. Automatyczna analiza zgłaszała problemy z niektórymi instrukcjami i odwołaniami do pamięci. Nie ustalono jednoznacznie ich przyczyny. Wygenerowane typy, granice funkcji i przepływ sterowania wymagają ręcznej weryfikacji.

Pełność eksportu dotyczy funkcji wykrytych przez analizator, nie dowodzi odzyskania całej oryginalnej aplikacji. Nie da się wiarygodnie podać procentu odzyskanego źródła. Nie przeprowadzono kompilacji ani testów działania odtworzonego kodu. DLL nie był uruchamiany ani przesyłany do zewnętrznego serwisu.

Odtworzenie działającego projektu wymaga dalszej ręcznej rekonstrukcji struktur i typów, mapowania danych globalnych oraz połączenia kodu z zależnościami i zasobami. Ten pakiet zachowuje wynik dekompilacji, aby można było tę pracę kontynuować.

## Weryfikacja

Sprawdzono zgodność liczby pozycji indeksu z eksportem funkcji, poprawność XML ikon, integralność PNG i możliwość otwarcia czcionek. To weryfikacja plików wynikowych, nie poprawności zachowania pseudokodu.

DLL: 6016512 bajtów.
SHA-256: `a26199cea6ed733326552b8ee483f8f6788ed6482f4136673a04de04588d7e28`.
Narzędzie dekompilacji: [Ghidra 12.1.4](https://github.com/NationalSecurityAgency/ghidra/releases/tag/Ghidra_12.1.4_build).
