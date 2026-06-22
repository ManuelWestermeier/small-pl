# small-pl

small-pl ist eine einfache Skriptsprache für 2D-Spiele im Browser.

Die Sprache läuft auf einer eigenen Runtime und bietet Funktionen für:

* Variablen
* Mathematik
* Bedingungen
* Sprünge und Schleifen
* Tastatur- und Maus-Eingaben
* GameObjects
* 2D-Zeichnen auf einem Canvas
* Einfache Plattformer-Physik
* Kamerasteuerung
* Zufällige Levelgenerierung

## Projektstruktur

```text
small-pl/
├── index.html
├── main.js
├── Parser.js
├── Executor.js
├── Runtime.js
├── Commands.js
└── script.mws
```

| Datei       | Beschreibung                                      |
| ----------- | ------------------------------------------------- |
| Parser.js   | Zerlegt den Quellcode in Befehle                  |
| Executor.js | Führt Befehle aus                                 |
| Runtime.js  | Speichert Variablen, Objekte, Eingaben und Canvas |
| Commands.js | Implementiert alle Sprachbefehle                  |
| script.mws  | Beispielprogramm                                  |
| main.js     | Startet Interpreter und Runtime                   |

---

## Hallo Welt

```text
SET message "Hallo Welt"
```

---

## Variablen

Variablen speichern Zahlen oder Texte.

```text
SET score 0
SET playerName "Max"

INC score
INC score

DEC score
```

Kopieren:

```text
COPY score backup
```

Löschen:

```text
DEL backup
```

---

## Mathematik

Addition:

```text
ADD a b result
```

Subtraktion:

```text
SUB a b result
```

Multiplikation:

```text
MUL a b result
```

Division:

```text
DIV a b result
```

Potenz:

```text
POW a b result
```

Modulo:

```text
MOD a b result
```

Zufallszahl:

```text
RAND randomValue 1 100
```

Begrenzen:

```text
CLAMP value 0 100 result
```

---

## Vergleiche

```text
CMP score 100 result
```

Bedingung:

```text
IF score > 100 GOTO win
```

Beispiele:

```text
IF lives <= 0 GOTO gameOver

IF score >= 1000 GOTO nextLevel
```

---

## Labels und Sprünge

Label definieren:

```text
LABEL start
```

Springen:

```text
GOTO start
```

Endlosschleife:

```text
LABEL loop

GOTO loop
```

---

## Canvas

Canvas-Größe festlegen:

```text
CANVAS 1280 720
```

Bildschirm löschen:

```text
CLEAR
```

---

## GameObjects

Objekt erstellen:

```text
CREATE_GAMEOBJECT player
```

Eigenschaften setzen:

```text
SET_GAMEOBJECT player x 100
SET_GAMEOBJECT player y 200
SET_GAMEOBJECT player width 32
SET_GAMEOBJECT player height 32
```

Eigenschaft lesen:

```text
READ_GAMEOBJECT player x playerX
```

Objekt verschieben:

```text
MOVE_GAMEOBJECT player 5 0
```

Größe ändern:

```text
RESIZE_GAMEOBJECT player 64 64
```

Objekt löschen:

```text
DEL_GAMEOBJECT player
```

---

## Zeichnen

Ein einzelnes Objekt:

```text
DRAW player
```

Alle Objekte:

```text
DRAW_ALL
```

---

## Tastatur

Taste gedrückt:

```text
KEY_DOWN KeyA leftPressed
```

Taste neu gedrückt:

```text
KEY_PRESSED Space jumpPressed
```

Taste losgelassen:

```text
KEY_RELEASED Space released
```

---

## Maus

Maustaste halten:

```text
MOUSE_DOWN 0 mousePressed
```

Maustaste neu gedrückt:

```text
MOUSE_PRESSED 0 clicked
```

Position lesen:

```text
MOUSE_POS mouseX mouseY
```

---

## Plattformer-Steuerung

Spieler automatisch steuern:

```text
CONTROL_PLAYER player
```

Physik berechnen:

```text
PHYSICS_STEP
```

Kamera folgen lassen:

```text
FOLLOW_CAMERA player
```

---

## Zufälliges Level erzeugen

```text
RANDOM_LEVEL
```

Die Runtime erzeugt automatisch Plattformen und Spielwelt-Elemente.

---

## Timing

Kurze Pause:

```text
DELAY 16
```

Warten:

```text
WAIT 1000
```

---

## Beispiel-Spiel

```text
CANVAS 1280 720

RANDOM_LEVEL

CREATE_GAMEOBJECT player

SET_GAMEOBJECT player x 100
SET_GAMEOBJECT player y 100
SET_GAMEOBJECT player width 32
SET_GAMEOBJECT player height 32

LABEL gameLoop

CONTROL_PLAYER player

PHYSICS_STEP

FOLLOW_CAMERA player

CLEAR
DRAW_ALL

DELAY 16

GOTO gameLoop
```

Dieses Programm erstellt einen einfachen Plattformer mit Kamera, Physik und 60 FPS Spielschleife.

---

## Status

small-pl befindet sich aktuell in einer frühen Entwicklungsphase. Die Sprache dient als experimentelle Game-DSL für browserbasierte 2D-Spiele.
